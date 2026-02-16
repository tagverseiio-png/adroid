// Odoo Configuration
const axios = require('axios');

const ODOO_CONFIG = {
  baseURL: process.env.ODOO_URL || 'http://localhost:8069',
  database: process.env.ODOO_DATABASE || 'odoo_db',
  username: process.env.ODOO_USERNAME || 'admin',
  password: process.env.ODOO_PASSWORD || 'admin',
  apiKey: process.env.ODOO_API_KEY || null,
};

// Odoo JSON-RPC Client
class OdooClient {
  constructor(config = ODOO_CONFIG) {
    this.config = config;
    this.apiClient = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
    });
    this.uid = null;
    this.sessionId = null;
  }

  /**
   * Authenticate with Odoo
   */
  async authenticate() {
    try {
      const response = await this.apiClient.post('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'common',
          method: 'authenticate',
          args: [this.config.database, this.config.username, this.config.password, {}],
        },
        id: Math.random(),
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Authentication failed');
      }

      this.uid = response.data.result;
      this.sessionId = response.headers['set-cookie'];
      console.log('✅ Odoo authentication successful. UID:', this.uid);
      return this.uid;
    } catch (error) {
      console.error('❌ Odoo authentication failed:', error.message);
      throw error;
    }
  }

  /**
   * Make a JSON-RPC call to Odoo
   */
  async call(model, method, args = [], kwargs = {}) {
    try {
      if (!this.uid) {
        await this.authenticate();
      }

      const response = await this.apiClient.post('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute',
          args: [this.config.database, this.uid, this.config.password, model, method, ...args],
          kwargs: kwargs,
        },
        id: Math.random(),
      });

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Odoo API error');
      }

      return response.data.result;
    } catch (error) {
      console.error(`❌ Odoo call error (${model}.${method}):`, error.message);
      throw error;
    }
  }

  /**
   * Create a record in Odoo
   */
  async create(model, values) {
    return this.call(model, 'create', [values]);
  }

  /**
   * Search for records in Odoo
   */
  async search(model, domain = [], options = {}) {
    const kwargs = {};
    if (options.offset !== undefined) kwargs.offset = options.offset;
    if (options.limit !== undefined) kwargs.limit = options.limit;
    if (options.order) kwargs.order = options.order;

    return this.call(model, 'search', [domain], kwargs);
  }

  /**
   * Read records from Odoo
   */
  async read(model, ids, fields = []) {
    return this.call(model, 'read', [ids, fields]);
  }

  /**
   * Write/Update a record in Odoo
   */
  async write(model, ids, values) {
    return this.call(model, 'write', [ids, values]);
  }

  /**
   * Delete a record from Odoo
   */
  async delete(model, ids) {
    return this.call(model, 'unlink', [ids]);
  }

  /**
   * Execute a method in Odoo
   */
  async executeMethod(model, method, ids, args = []) {
    return this.call(model, method, [ids, ...args]);
  }
}

// Singleton instance
let odooClient = null;

const getOdooClient = () => {
  if (!odooClient) {
    odooClient = new OdooClient(ODOO_CONFIG);
  }
  return odooClient;
};

module.exports = {
  OdooClient,
  getOdooClient,
  ODOO_CONFIG,
};
