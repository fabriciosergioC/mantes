import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

console.log('🔥 [API] Carregado em', new Date().toISOString());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const headersCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event) => {
  const { httpMethod, path, headers, body, queryStringParameters } = event;
  
  // Detectar rota
  let route = '/api';
  if (queryStringParameters?.splat) {
    route = '/api/' + queryStringParameters.splat;
  } else if (path && path.startsWith('/api/')) {
    route = path;
  }
  
  console.log(`📥 ${httpMethod} ${route}`);

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: headersCors, body: '' };
  }

  // Parse do body
  let parsedBody = null;
  if (body && headers?.['content-type']?.includes('application/json')) {
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.error('Erro ao parsear JSON:', e.message);
    }
  }

  try {
    // Health check
    if (route === '/api/health') {
      return { statusCode: 200, headers: headersCors, body: JSON.stringify({ status: 'ok', route }) };
    }

    // Login
    if (route === '/api/auth/login' && httpMethod === 'POST') {
      const { email, senha } = parsedBody || {};
      if (!email || !senha) {
        return { statusCode: 400, headers: headersCors, body: JSON.stringify({ error: 'Email e senha obrigatórios' }) };
      }

      let result = await pool.query('SELECT * FROM login_credentials WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        const hash = await bcrypt.hash(senha, 10);
        result = await pool.query('INSERT INTO login_credentials (email, senha_hash, ativo) VALUES ($1, $2, $3) RETURNING *', [email, hash, true]);
      }

      const cred = result.rows[0];
      const valid = await bcrypt.compare(senha, cred.senha_hash);
      
      if (!valid) {
        return { statusCode: 401, headers: headersCors, body: JSON.stringify({ error: 'Senha incorreta' }) };
      }

      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const token = jwt.sign({ id: cred.id, email: cred.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return {
        statusCode: 200,
        headers: headersCors,
        body: JSON.stringify({
          token,
          user: { id: cred.id, nome: user.rows[0]?.nome || email.split('@')[0], email, lider: true }
        })
      };
    }

    // OS - Listar
    if (route === '/api/os' && httpMethod === 'GET') {
      const result = await pool.query('SELECT * FROM orders ORDER BY data_abertura DESC');
      return { statusCode: 200, headers: headersCors, body: JSON.stringify(result.rows) };
    }

    // OS - Próximo número
    if (route === '/api/os/next-number' && httpMethod === 'GET') {
      const last = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
      let next = 1001;
      if (last.rows.length > 0) {
        next = parseInt(last.rows[0].numero.replace('OS-', '')) + 1;
      }
      return { statusCode: 200, headers: headersCors, body: JSON.stringify({ numero: 'OS-' + String(next).padStart(5, '0') }) };
    }

    // OS - Criar
    if (route === '/api/os' && httpMethod === 'POST') {
      const data = parsedBody || {};

      // Gerar próximo número da OS
      const lastNum = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
      let nextNum = 1001;
      if (lastNum.rows.length > 0) {
        nextNum = parseInt(lastNum.rows[0].numero.replace('OS-', '')) + 1;
      }
      const numero = 'OS-' + String(nextNum).padStart(5, '0');

      // Gerar cliente_id automático (CLT + número sequencial)
      const lastCliente = await pool.query('SELECT cliente_id FROM orders WHERE cliente_id IS NOT NULL ORDER BY cliente_id DESC LIMIT 1');
      let nextCliente = 1;
      if (lastCliente.rows.length > 0 && lastCliente.rows[0].cliente_id) {
        const lastId = parseInt(lastCliente.rows[0].cliente_id.replace('CLT-', ''));
        nextCliente = lastId + 1;
      }
      const clienteId = 'CLT-' + String(nextCliente).padStart(5, '0');

      const result = await pool.query(
        `INSERT INTO orders (numero, cliente_id, cnpj, nome_cliente, telefone, nome_tecnico, lider, email_lider, tipo_solicitacao, descricao, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending') RETURNING *`,
        [numero, clienteId, data.cnpj, data.nomeCliente, data.telefone, data.nomeTecnico, data.lider, data.emailLider, data.tipoSolicitacao, data.descricao]
      );

      return { statusCode: 201, headers: headersCors, body: JSON.stringify(result.rows[0]) };
    }

    // OS - Stats
    if (route === '/api/os/stats' && httpMethod === 'GET') {
      const total = await pool.query('SELECT COUNT(*) FROM orders');
      return {
        statusCode: 200,
        headers: headersCors,
        body: JSON.stringify({
          total: parseInt(total.rows[0].count),
          pending: 0, accepted: 0, resolved: 0, rejected: 0
        })
      };
    }

    // Rota não encontrada
    return { statusCode: 404, headers: headersCors, body: JSON.stringify({ error: 'Rota não encontrada', route, method: httpMethod }) };

  } catch (err) {
    console.error('❌ Erro:', err.message);
    return { statusCode: 500, headers: headersCors, body: JSON.stringify({ error: err.message }) };
  }
};
