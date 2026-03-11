// Serviços de Ordens de Serviço (OS) - Nhost GraphQL

import nhost from '../lib/nhost.js';

const GRAPHQL_ENDPOINT = process.env.NHOST_GRAPHQL_ENDPOINT;
const ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET;

/**
 * Executar query GraphQL
 */
async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem('@mantes:token');
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-hasura-admin-secret': ADMIN_SECRET
    },
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

export const osService = {
  /**
   * Listar todas as OS com filtros opcionais
   */
  async listar({ status, tipo, cnpj } = {}) {
    const where = {};
    
    if (status) where.status = { _eq: status };
    if (tipo) where.tipo_solicitacao = { _eq: tipo };
    if (cnpj) where.cnpj = { _regex: cnpj.replace(/\D/g, '') };

    const query = `
      query GetOrders($where: order_bool_exp) {
        order(where: $where, order_by: { data_abertura: desc }) {
          id
          numero
          cliente_id
          cnpj
          nome_cliente
          telefone
          nome_tecnico
          lider
          email_lider
          tipo_solicitacao
          descricao
          status
          observacoes
          data_abertura
          data_fechamento
          arquivos
          created_at
          updated_at
        }
      }
    `;

    const data = await graphqlRequest(query, { where });
    return data.order;
  },

  /**
   * Obter estatísticas das OS
   */
  async stats() {
    const query = `
      query GetOrderStats {
        pending: order_aggregate(where: { status: { _eq: "pending" } }) {
          aggregate { count }
        }
        accepted: order_aggregate(where: { status: { _eq: "accepted" } }) {
          aggregate { count }
        }
        resolved: order_aggregate(where: { status: { _eq: "resolved" } }) {
          aggregate { count }
        }
        rejected: order_aggregate(where: { status: { _eq: "rejected" } }) {
          aggregate { count }
        }
        total: order_aggregate {
          aggregate { count }
        }
      }
    `;

    const data = await graphqlRequest(query);
    
    return {
      total: data.total.aggregate.count,
      pending: data.pending.aggregate.count,
      accepted: data.accepted.aggregate.count,
      resolved: data.resolved.aggregate.count,
      rejected: data.rejected.aggregate.count
    };
  },

  /**
   * Obter próximo número de OS
   */
  async proximoNumero() {
    const query = `
      query GetNextOrderNumber {
        order(limit: 1, order_by: { numero: desc }) {
          numero
        }
      }
    `;

    const data = await graphqlRequest(query);
    
    if (data.order.length === 0) {
      return 'OS-01001';
    }

    const lastNumero = data.order[0].numero;
    const lastNum = parseInt(lastNumero.replace('OS-', ''));
    const nextNum = lastNum + 1;
    
    return 'OS-' + String(nextNum).padStart(5, '0');
  },

  /**
   * Obter uma OS por ID
   */
  async obterPorId(id) {
    const query = `
      query GetOrderById($id: uuid!) {
        order_by_pk(id: $id) {
          id
          numero
          cliente_id
          cnpj
          nome_cliente
          telefone
          nome_tecnico
          lider
          email_lider
          tipo_solicitacao
          descricao
          status
          observacoes
          data_abertura
          data_fechamento
          arquivos
        }
      }
    `;

    const data = await graphqlRequest(query, { id });
    return data.order_by_pk;
  },

  /**
   * Criar nova OS
   */
  async criar(osData) {
    const numero = await this.proximoNumero();
    
    const mutation = `
      mutation CreateOrder($object: order_insert_input!) {
        insert_order_one(object: $object) {
          id
          numero
          status
          data_abertura
        }
      }
    `;

    const variables = {
      object: {
        numero,
        cliente_id: osData.clienteId,
        cnpj: osData.cnpj,
        nome_cliente: osData.nomeCliente,
        telefone: osData.telefone,
        nome_tecnico: osData.nomeTecnico,
        lider: osData.lider,
        email_lider: osData.emailLider,
        tipo_solicitacao: osData.tipoSolicitacao,
        descricao: osData.descricao,
        status: 'pending',
        arquivos: osData.arquivos || [],
        observacoes: []
      }
    };

    const data = await graphqlRequest(mutation, variables);
    return data.insert_order_one;
  },

  /**
   * Atualizar OS
   */
  async atualizar(id, updates) {
    const mutation = `
      mutation UpdateOrder($id: uuid!, $updates: order_set_input!) {
        update_order_by_pk(pk_columns: { id: $id }, _set: $updates) {
          id
          status
          observacoes
          data_fechamento
          updated_at
        }
      }
    `;

    const variables = {
      id,
      updates: {}
    };

    if (updates.status) {
      variables.updates.status = updates.status;
    }

    if (updates.observacao) {
      // Adicionar observação ao array
      const novaObs = {
        texto: updates.observacao,
        data: new Date().toISOString()
      };
      variables.updates.observacoes = { 
        _concat: [novaObs] 
      };
    }

    if (updates.status === 'resolved') {
      variables.updates.data_fechamento = new Date().toISOString();
    }

    const data = await graphqlRequest(mutation, variables);
    return data.update_order_by_pk;
  },

  /**
   * Deletar OS
   */
  async deletar(id) {
    const mutation = `
      mutation DeleteOrder($id: uuid!) {
        delete_order_by_pk(id: $id) {
          id
          numero
        }
      }
    `;

    const data = await graphqlRequest(mutation, { id });
    return data.delete_order_by_pk;
  }
};
