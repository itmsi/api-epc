/**
 * DBLINK Utility
 * Utility untuk setup dan menggunakan dblink ke database external (gate_sso)
 */

const { pgCore } = require('../config/database');

let dblinkSetup = false;

/**
 * Force reset dblink connection (untuk reconnect)
 * @returns {Promise<void>}
 */
const forceResetDblink = async () => {
  try {
    console.log('[DBLINK] Force resetting dblink connection...');
    dblinkSetup = false;
    // Disconnect existing connection if any
    await pgCore.raw(`SELECT dblink_disconnect('gate_sso_conn')`).catch(() => {
      // Ignore error if connection doesn't exist
    });
  } catch (error) {
    console.warn('[DBLINK] Error during force reset:', error.message);
  }
};

/**
 * Setup dblink extension dan connection ke database gate_sso
 * @param {Boolean} forceReconnect - Force reconnect even if connection exists
 * @returns {Promise<Boolean>} True if setup successful
 */
const setupDblink = async (forceReconnect = false) => {
  try {
    // Force reconnect if requested
    if (forceReconnect) {
      await forceResetDblink();
    }
    
    // Only setup once, but verify connection is still alive
    if (dblinkSetup && !forceReconnect) {
      // Test if connection is still alive
      try {
        await pgCore.raw(`
          SELECT * FROM dblink(
            'gate_sso_conn',
            'SELECT 1 as test'
          ) AS t(test INTEGER)
        `);
        console.log('[DBLINK] Connection verified and still alive');
        return true;
      } catch (testError) {
        console.warn('[DBLINK] Connection test failed, reconnecting...', testError.message);
        // Reset flag to reconnect
        await forceResetDblink();
      }
    }

    const dbHost = process.env.DB_GATE_SSO_HOST || 'localhost';
    const dbPort = process.env.DB_GATE_SSO_PORT || '5432';
    const dbName = process.env.DB_GATE_SSO_NAME || 'gate_sso';
    const dbUser = process.env.DB_GATE_SSO_USER || 'postgres';
    const dbPassword = process.env.DB_GATE_SSO_PASSWORD || '';

    console.log('[DBLINK] Setting up connection to:', dbHost, dbPort, dbName, dbUser);

    // Escape single quotes in password
    const escapedPassword = dbPassword.replace(/'/g, "''");

    // Create dblink connection string
    const connectionString = `host=${dbHost} port=${dbPort} dbname=${dbName} user=${dbUser} password=${escapedPassword}`;

    // Check if dblink extension exists, if not create it
    await pgCore.raw('CREATE EXTENSION IF NOT EXISTS dblink').catch((err) => {
      console.warn('[DBLINK] Extension might already exist:', err.message);
    });

    // Disconnect existing connection if any
    await pgCore.raw(`SELECT dblink_disconnect('gate_sso_conn')`).catch(() => {
      // Ignore error if connection doesn't exist
    });

    // Create new dblink connection
    const connectResult = await pgCore.raw(`
      SELECT dblink_connect(
        'gate_sso_conn',
        '${connectionString}'
      )
    `);

    console.log('[DBLINK] Connection result:', connectResult.rows);

    // Verify connection with a test query
    try {
      await pgCore.raw(`
        SELECT * FROM dblink(
          'gate_sso_conn',
          'SELECT 1 as test'
        ) AS t(test INTEGER)
      `);
      console.log('[DBLINK] Connection verified successfully');
    } catch (verifyError) {
      console.error('[DBLINK] Connection verification failed:', verifyError.message);
      dblinkSetup = false;
      return false;
    }

    dblinkSetup = true;
    console.log('[DBLINK] Connection setup successful');
    return true;
  } catch (error) {
    console.error('[DBLINK] Error setting up dblink:', error.message);
    console.error('[DBLINK] Error stack:', error.stack);
    dblinkSetup = false;
    return false;
  }
};

/**
 * Execute dblink query with auto-retry on connection error
 * @param {Function} queryFn - Function that returns a promise with the query
 * @param {Number} maxRetries - Maximum number of retries (default: 1)
 * @returns {Promise<any>} Query result
 */
const executeDblinkQueryWithRetry = async (queryFn, maxRetries = 1) => {
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Ensure dblink is set up (force reconnect on retry)
      const setupSuccess = await setupDblink(attempt > 0);
      if (!setupSuccess) {
        console.error('[DBLINK] Failed to setup dblink connection on attempt', attempt + 1);
        if (attempt === maxRetries) {
          throw new Error('Failed to setup dblink connection after retries');
        }
        continue;
      }

      // Execute query
      const result = await queryFn();
      return result;
    } catch (error) {
      lastError = error;
      const errorMessage = error.message || '';
      
      // Check if error is connection-related
      const isConnectionError = 
        errorMessage.includes('could not establish connection') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('dblink');
      
      if (isConnectionError && attempt < maxRetries) {
        console.warn(`[DBLINK] Connection error on attempt ${attempt + 1}, retrying...`, errorMessage);
        // Force reset connection for next attempt
        await forceResetDblink();
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      // If not connection error or max retries reached, throw
      throw error;
    }
  }
  
  throw lastError || new Error('Query failed after retries');
};

/**
 * Close dblink connection
 * @returns {Promise<void>}
 */
const closeDblink = async () => {
  try {
    await pgCore.raw("SELECT dblink_disconnect('gate_sso_conn')").catch(() => {
      // Ignore error if connection doesn't exist
    });
  } catch (error) {
    console.error('Error closing dblink:', error);
  }
};

module.exports = {
  setupDblink,
  forceResetDblink,
  executeDblinkQueryWithRetry,
  closeDblink
};
