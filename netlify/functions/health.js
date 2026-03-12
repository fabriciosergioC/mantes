// Health check endpoint
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ok',
      message: 'API Mantes funcionando!',
      timestamp: new Date().toISOString()
    })
  };
};
