// src/server.js
// Punto de entrada del servidor: conecta a la BD y levanta Express

require('dotenv').config();
const app = require('./app');
const { getPool } = require('./config/db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Primero establece la conexión al pool de SQL Server
    await getPool();

    // Luego levanta el servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
