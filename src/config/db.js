const dotenv = require('dotenv');

dotenv.config({ override: true });

const useTrustedConnection = process.env.DB_TRUSTED_CONNECTION === 'true';
const sql = useTrustedConnection ? require('mssql/msnodesqlv8') : require('mssql');

function buildConfig() {
  const common = {
    database: process.env.DB_DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    },
  };

  if (useTrustedConnection) {
    const server = process.env.DB_INSTANCE
      ? `${process.env.DB_SERVER}\\${process.env.DB_INSTANCE}`
      : process.env.DB_SERVER;

    return {
      ...common,
      connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${server};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    };
  }

  return {
    ...common,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
  };
}

const dbConfig = buildConfig();
let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log('Conexion a SQL Server establecida');
  }
  return pool;
}

module.exports = { getPool, sql };
