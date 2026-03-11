// Nhost Client Configuration
// SDK oficial do Nhost para JavaScript

import { NhostClient } from '@nhost/nhost-js';

const nhost = new NhostClient({
  subdomain: process.env.NHOST_SUBDOMAIN || 'seu-projeto',
  region: process.env.NHOST_REGION || 'us-east-1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500'
});

export default nhost;
