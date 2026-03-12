import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Pool de conexão PostgreSQL
console.log('🔧 [INIT] DATABASE_URL:', process.env.DATABASE_URL ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('🔧 [INIT] JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('🔧 [INIT] NODE_ENV:', process.env.NODE_ENV || 'development');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão com o banco
pool.on('error', (err) => {
  console.error('❌ [DB ERROR] Unexpected error on idle client', err);
});

// Middleware de autenticação
const authMiddleware = async (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

// Handler principal
export const handler = async (event, context) => {
  const { httpMethod, path, headers, body, queryStringParameters, rawUrl } = event;
  
  // Forma 1: Usar o splat do redirect (query string)
  // Quando usamos /api/* -> /api, o * vem em queryStringParameters.splat
  let route = '/api';
  if (queryStringParameters?.splat) {
    route = '/api/' + queryStringParameters.splat;
  }
  
  // Forma 2: Usar rawUrl se disponível
  if (rawUrl) {
    try {
      const url = new URL(rawUrl);
      route = url.pathname;
    } catch (e) {
      // Mantém o route anterior
    }
  }
  
  // Log para debug
  console.log('📥 Request:', httpMethod, route);
  console.log('📥 Path:', path);
  console.log('📥 Query params:', JSON.stringify(queryStringParameters));
  console.log('📥 Body:', body);
  console.log('📥 ParsedBody:', parsedBody);

  const headersCors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersCors, body: '' };
  }

  try {
    // Parse do body se for JSON
    let parsedBody = null;
    if (body && headers['content-type']?.includes('application/json')) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        console.error('Erro ao parsear body:', e);
      }
    }

    // ── ROTAS DE AUTENTICAÇÃO ─────────────────────────────────────
    if (route === '/api/auth/login' && httpMethod === 'POST') {
      console.log('🔐 [DEBUG] parsedBody:', parsedBody);
      console.log('🔐 [DEBUG] body:', body);
      
      if (!parsedBody || !parsedBody.email || !parsedBody.senha) {
        console.error('❌ Body inválido:', { parsedBody, body });
        return { statusCode: 400, headers: headersCors, body: JSON.stringify({ error: 'Email e senha são obrigatórios' }) };
      }
      
      const { email, senha } = parsedBody;
      console.log(`🔐 Login: ${email}`);

      try {
        // Buscar credenciais na tabela separada
        console.log('🔍 Buscando credenciais para:', email);
        let credenciais = await pool.query('SELECT * FROM login_credentials WHERE email = $1', [email]);
        console.log('📊 Resultado:', credenciais.rows.length, 'registro(s)');

        if (credenciais.rows.length === 0) {
          console.log(`👤 Criando credenciais: ${email}`);
          const senhaHash = await bcrypt.hash(senha, 10);
          const newCred = await pool.query(
            'INSERT INTO login_credentials (email, senha_hash, ativo) VALUES ($1, $2, $3) RETURNING *',
            [email, senhaHash, true]
          );
          credenciais = newCred;
        }

        // Verificar se está bloqueado
        const cred = credenciais.rows[0];
        if (cred.bloqueado_ate && new Date(cred.bloqueado_ate) > new Date()) {
          return { statusCode: 403, headers: headersCors, body: JSON.stringify({ error: 'Conta temporariamente bloqueada. Tente novamente mais tarde.' }) };
        }

        const valid = await bcrypt.compare(senha, cred.senha_hash);
        if (!valid) {
          // Incrementar tentativas falhas
          const novasTentativas = (cred.tentativas_falhas || 0) + 1;
          const bloqueadoAte = novasTentativas >= 5
            ? new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
            : null;

          await pool.query(
            'UPDATE login_credentials SET tentativas_falhas = $1, bloqueado_ate = $2 WHERE email = $3',
            [novasTentativas, bloqueadoAte, email]
          );

          return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Senha incorreta' }) };
        }

        // Login bem-sucedido - resetar tentativas
        await pool.query(
          'UPDATE login_credentials SET tentativas_falhas = 0, bloqueado_ate = NULL WHERE email = $1',
          [email]
        );

        // Buscar dados do usuário na tabela users (se existir)
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        const token = jwt.sign({ id: cred.id, email: cred.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return {
          statusCode: 200,
          headers: headersCors,
          body: JSON.stringify({
            token,
            user: {
              id: cred.id,
              nome: user.rows[0]?.nome || email.split('@')[0],
              email: cred.email,
              lider: true
            }
          })
        };
      } catch (loginErr) {
        console.error('❌ Erro no login:', loginErr);
        throw loginErr; // Propaga para o catch principal
      }

    if (route === '/api/auth/change-password' && httpMethod === 'POST') {
      const userId = await authMiddleware(headers.authorization?.split(' ')[1]);
      if (!userId) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Token inválido' }) };
      }

      const { senhaAtual, novaSenha } = JSON.parse(body);
      const cred = await pool.query('SELECT * FROM login_credentials WHERE id = $1', [userId]);

      if (cred.rows.length === 0) {
        return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'Credenciais não encontradas' }) };
      }

      const valid = await bcrypt.compare(senhaAtual, cred.rows[0].senha_hash);
      if (!valid) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Senha atual incorreta' }) };
      }

      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await pool.query(
        'UPDATE login_credentials SET senha_hash = $1, ultima_troca_senha = NOW() WHERE id = $2',
        [senhaHash, userId]
      );

      return { statusCode: 200, headers: headersCors, body: JSON.stringify({ message: 'Senha alterada com sucesso' }) };
    }

    // ── ROTAS DE ORDENS DE SERVIÇO ────────────────────────────────
    if (route === '/api/os' && httpMethod === 'GET') {
      const { status, tipo, cnpj } = event.queryStringParameters || {};
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
      if (tipo) {
        query += ` AND tipo_solicitacao = $${paramIndex}`;
        params.push(tipo);
        paramIndex++;
      }
      if (cnpj) {
        query += ` AND cnpj LIKE $${paramIndex}`;
        params.push(`%${cnpj.replace(/\D/g, '')}%`);
        paramIndex++;
      }

      query += ' ORDER BY data_abertura DESC';
      const result = await pool.query(query, params);
      return { statusCode: 200, headers: headersCors, body: JSON.stringify(result.rows) };
    }

    if (route === '/api/os/stats' && httpMethod === 'GET') {
      const total = await pool.query('SELECT COUNT(*) FROM orders');
      const pending = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
      const accepted = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'accepted'");
      const resolved = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'resolved'");
      const rejected = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'rejected'");

      return {
        statusCode: 200,
        headers: headersCors,
        body: JSON.stringify({
          total: parseInt(total.rows[0].count),
          pending: parseInt(pending.rows[0].count),
          accepted: parseInt(accepted.rows[0].count),
          resolved: parseInt(resolved.rows[0].count),
          rejected: parseInt(rejected.rows[0].count)
        })
      };
    }

    if (route === '/api/os/next-number' && httpMethod === 'GET') {
      const lastOS = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
      let nextNum = 1001;
      if (lastOS.rows.length > 0) {
        const lastNum = parseInt(lastOS.rows[0].numero.replace('OS-', ''));
        nextNum = lastNum + 1;
      }
      return { statusCode: 200, headers: headersCors, body: JSON.stringify({ numero: 'OS-' + String(nextNum).padStart(5, '0') }) };
    }

    if (route === '/api/os/:id' && httpMethod === 'GET') {
      const id = route.split('/').pop();
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'OS não encontrada' }) };
      }
      return { statusCode: 200, headers: headersCors, body: JSON.stringify(result.rows[0]) };
    }

    if (route === '/api/os' && httpMethod === 'POST') {
      // Netlify Forms suporta multipart/form-data
      const formData = event.isBase64Encoded 
        ? Buffer.from(event.body, 'base64') 
        : event.body;

      // Parse manual do FormData (simplificado para campos de texto)
      const fields = {};
      const arquivos = [];

      if (event.headers['content-type']?.includes('multipart/form-data')) {
        // Para uploads, usar abordagem simplificada
        // Os campos vêm em event.body como string
        const bodyStr = formData.toString();
        
        // Extrair campos do form (implementação básica)
        const boundary = event.headers['content-type']?.split('boundary=')[1];
        if (boundary) {
          const parts = bodyStr.split(`--${boundary}`);
          for (const part of parts) {
            if (part.includes('name="')) {
              const nameMatch = part.match(/name="([^"]+)"/);
              if (nameMatch) {
                const name = nameMatch[1];
                const value = part.split('\r\n\r\n')[1]?.split('\r\n')[0]?.trim();
                if (name !== 'arquivos' && value) {
                  fields[name] = value;
                }
              }
            }
          }
        }
      } else {
        Object.assign(fields, JSON.parse(body || '{}'));
      }

      const {
        clienteId, cnpj, nomeCliente, telefone,
        nomeTecnico, lider, emailLider, tipoSolicitacao, descricao
      } = fields;

      // Gerar número
      const lastOS = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
      let nextNum = 1001;
      if (lastOS.rows.length > 0) {
        const lastNum = parseInt(lastOS.rows[0].numero.replace('OS-', ''));
        nextNum = lastNum + 1;
      }
      const numero = 'OS-' + String(nextNum).padStart(5, '0');

      const result = await pool.query(
        `INSERT INTO orders (
          numero, cliente_id, cnpj, nome_cliente, telefone,
          nome_tecnico, lider, email_lider, tipo_solicitacao, descricao,
          arquivos, status, observacoes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          numero, clienteId, cnpj, nomeCliente, telefone,
          nomeTecnico, lider, emailLider, tipoSolicitacao, descricao,
          JSON.stringify(arquivos), 'pending', JSON.stringify([])
        ]
      );

      return { statusCode: 201, headers: headersCors, body: JSON.stringify(result.rows[0]) };
    }

    if (route === '/api/os/:id' && httpMethod === 'PUT') {
      const id = route.split('/').pop();
      const { status, observacao } = JSON.parse(body);

      const os = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (os.rows.length === 0) {
        return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'OS não encontrada' }) };
      }

      const updates = [];
      const params = [];
      let paramIndex = 1;

      if (status) {
        updates.push(`status = $${paramIndex}`);
        params.push(status);
        paramIndex++;

        if (status === 'resolved') {
          updates.push(`data_fechamento = NOW()`);
        }
      }

      if (observacao) {
        const obsArray = os.rows[0].observacoes || [];
        obsArray.push({ texto: observacao, data: new Date().toISOString() });
        updates.push(`observacoes = $${paramIndex}`);
        params.push(JSON.stringify(obsArray));
        paramIndex++;
      }

      if (updates.length === 0) {
        return { statusCode: 200, headers: headersCors, body: JSON.stringify(os.rows[0]) };
      }

      updates.push(`updated_at = NOW()`);
      params.push(id);

      const result = await pool.query(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
      );

      return { statusCode: 200, headers: headersCors, body: JSON.stringify(result.rows[0]) };
    }

    if (route === '/api/os/:id' && httpMethod === 'DELETE') {
      const id = route.split('/').pop();
      const os = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (os.rows.length === 0) {
        return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'OS não encontrada' }) };
      }

      await pool.query('DELETE FROM orders WHERE id = $1', [id]);
      return { statusCode: 200, headers: headersCors, body: JSON.stringify({ message: 'OS removida com sucesso' }) };
    }

    // Rota não encontrada
    return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'Rota não encontrada' }) };

  }
  } catch (err) {
    console.error('❌ Erro na API:', err);
    console.error('❌ Stack:', err.stack);
    console.error('❌ Route:', route);
    console.error('❌ Body:', body);
    return { statusCode: 500, headers: headersCors, body: JSON.stringify({ error: err.message, stack: err.stack }) };
  }
};
