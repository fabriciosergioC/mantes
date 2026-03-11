# Queries e Mutations GraphQL para Nhost

## Autenticação

### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
    user {
      id
      email
      displayName
    }
  }
}
```

### Registrar
```graphql
mutation Register($email: String!, $password: String!, $displayName: String!) {
  register(email: $email, password: $password, displayName: $displayName) {
    accessToken
    refreshToken
    user {
      id
      email
      displayName
    }
  }
}
```

### Change Password
```graphql
mutation ChangePassword($newPassword: String!) {
  changePassword(newPassword: $newPassword) {
    accessToken
  }
}
```

## Ordens de Serviço

### Listar todas as OS
```graphql
query GetOrders($where: order_bool_exp, $order_by: [order_order_by!]) {
  order(where: $where, order_by: $order_by) {
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
    user {
      id
      nome
      email
    }
  }
}
```

### Obter uma OS por ID
```graphql
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
    user {
      id
      nome
      email
    }
  }
}
```

### Criar nova OS
```graphql
mutation CreateOrder($object: order_insert_input!) {
  insert_order_one(object: $object) {
    id
    numero
    status
    data_abertura
    user {
      id
      nome
    }
  }
}
```

### Atualizar OS
```graphql
mutation UpdateOrder($id: uuid!, $updates: order_set_input!) {
  update_order_by_pk(pk_columns: { id: $id }, _set: $updates) {
    id
    status
    observacoes
    data_fechamento
    updated_at
  }
}
```

### Deletar OS
```graphql
mutation DeleteOrder($id: uuid!) {
  delete_order_by_pk(id: $id) {
    id
    numero
  }
}
```

### Estatísticas
```graphql
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
```

### Próximo número de OS
```graphql
query GetNextOrderNumber {
  order(limit: 1, order_by: { numero: desc }) {
    numero
  }
}
```
