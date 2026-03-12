import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Pool de conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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
  const { httpMethod, path, headers, body, queryStringParameters } = event;
  
  // No Netlify, path já vem como /api/auth/login por exemplo
  const route = path;
  
  // Log para debug
  console.log('📥 Request:', httpMethod, route);
  console.log('📥 Body:', body);

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
      const { email, senha } = parsedBody || JSON.parse(body);
      console.log(`🔐 Login: ${email}`);

      let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user.rows.length === 0) {
        console.log(`👤 Criando usuário: ${email}`);
        const senhaHash = await bcrypt.hash(senha, 10);
        const newUser = await pool.query(
          'INSERT INTO users (nome, email, senha_hash, lider) VALUES ($1, $2, $3, $4) RETURNING *',
          ['Administrador', email, senhaHash, true]
        );
        user = newUser;
      }

      const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);
      if (!valid) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Senha incorreta' }) };
      }

      const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return {
        statusCode: 200,
        headers: headersCors,
        body: JSON.stringify({
          token,
          user: {
            id: user.rows[0].id,
            nome: user.rows[0].nome,
            email: user.rows[0].email,
            lider: user.rows[0].lider
          }
        })
      };
    }

    if (route === '/api/auth/change-password' && httpMethod === 'POST') {
      const userId = await authMiddleware(headers.authorization?.split(' ')[1]);
      if (!userId) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Token inválido' }) };
      }

      const { senhaAtual, novaSenha } = JSON.parse(body);
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

      const valid = await bcrypt.compare(senhaAtual, user.rows[0].senha_hash);
      if (!valid) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Senha atual incorreta' }) };
      }

      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await pool.query('UPDATE users SET senha_hash = $1 WHERE id = $2', [senhaHash, userId]);

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

  } catch (err) {
    console.error('Erro na API:', err);
    return { statusCode: 500, headers: headersCors, body: JSON.stringify({ error: err.message }) };
  }
};
