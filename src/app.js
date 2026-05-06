// src/app.js
// Configuración principal de Express: middlewares y rutas

const express = require('express');
const cors = require('cors');

const app = express();

// ─── Middlewares globales ────────────────────────────────────────────────────

// Habilitar CORS para que el frontend pueda consumir la API
app.use(cors());

// Parsear el body de las peticiones como JSON
app.use(express.json());

// ─── Rutas ───────────────────────────────────────────────────────────────────

app.use('/api/ubicaciones',         require('./routes/ubicacion.routes'));
app.use('/api/tipos-espacio',       require('./routes/tipoEspacio.routes'));
app.use('/api/espacios',            require('./routes/espacio.routes'));
app.use('/api/carreras',            require('./routes/carrera.routes'));
app.use('/api/materias',            require('./routes/materia.routes'));
app.use('/api/grupos-materia',      require('./routes/grupoMateria.routes'));
app.use('/api/horarios-asignacion', require('./routes/horarioAsignacion.routes'));
app.use('/api/usuarios',            require('./routes/usuario.routes'));
app.use('/api/registros-espacio',   require('./routes/registroEspacio.routes'));
app.use('/api/registros-asignacion',require('./routes/registroAsignacion.routes'));

// ─── Ruta raíz de verificación ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🏫 API UAGRM Espacios funcionando correctamente' });
});

// ─── Manejo de rutas no encontradas ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
