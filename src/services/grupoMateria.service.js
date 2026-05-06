const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
  const { search = null, id_materia = null, activo = null } = filters;
  const pool = await getPool();
  const request = pool.request();
  request.input('search', sql.VarChar(250), search ? `%${search}%` : null);
  request.input('id_materia', sql.Int, id_materia);
  request.input('activo', sql.VarChar(10), activo);

  const result = await request.query(`
    SELECT
      gm.id_grupo_materia,
      gm.id_materia,
      m.nombre  AS materia,
      m.sigla AS sigla_materia,
      c.nombre  AS carrera,
      gm.grupo,
      gm.docente,
      gm.gestion,
      gm.periodo,
      gm.cantidad_estudiantes,
      gm.activo
    FROM grupo_materia gm
    INNER JOIN materia m  ON gm.id_materia  = m.id_materia
    LEFT JOIN carrera c  ON m.id_carrera   = c.id_carrera
    WHERE (
      @search IS NULL
      OR UPPER(gm.grupo) LIKE UPPER(@search)
      OR UPPER(ISNULL(gm.docente, '')) LIKE UPPER(@search)
      OR UPPER(ISNULL(m.nombre, '')) LIKE UPPER(@search)
      OR UPPER(ISNULL(m.sigla, '')) LIKE UPPER(@search)
      OR UPPER(ISNULL(c.nombre, '')) LIKE UPPER(@search)
    )
    AND (@id_materia IS NULL OR gm.id_materia = @id_materia)
    AND (@activo IS NULL OR UPPER(gm.activo) = UPPER(@activo))
    ORDER BY c.nombre ASC, m.nombre ASC, gm.grupo ASC
  `);
  return result.recordset;
}

async function getById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT
        gm.id_grupo_materia,
        gm.id_materia,
        m.nombre  AS materia,
        m.sigla AS sigla_materia,
        c.nombre  AS carrera,
        gm.grupo,
        gm.docente,
        gm.gestion,
        gm.periodo,
        gm.cantidad_estudiantes,
        gm.activo
      FROM grupo_materia gm
      INNER JOIN materia m ON gm.id_materia = m.id_materia
      LEFT JOIN carrera c ON m.id_carrera  = c.id_carrera
      WHERE gm.id_grupo_materia = @id
    `);
  return result.recordset[0] || null;
}

async function create(data) {
  const {
    id_materia,
    grupo,
    docente = null,
    gestion = null,
    periodo = null,
    cantidad_estudiantes = null,
    activo = 'SI',
  } = data;

  const pool = await getPool();
  const result = await pool.request()
    .input('id_materia', sql.Int, id_materia)
    .input('grupo', sql.VarChar(10), grupo)
    .input('docente', sql.VarChar(150), docente)
    .input('gestion', sql.VarChar(20), gestion)
    .input('periodo', sql.VarChar(20), periodo)
    .input('cantidad_estudiantes', sql.Int, cantidad_estudiantes)
    .input('activo', sql.VarChar(10), activo)
    .query(`
      INSERT INTO grupo_materia (id_materia, grupo, docente, gestion, periodo, cantidad_estudiantes, activo)
      OUTPUT INSERTED.*
      VALUES (@id_materia, @grupo, @docente, @gestion, @periodo, @cantidad_estudiantes, @activo)
    `);
  return result.recordset[0];
}

async function update(id, data) {
  const {
    id_materia,
    grupo,
    docente = null,
    gestion = null,
    periodo = null,
    cantidad_estudiantes = null,
    activo,
  } = data;

  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('id_materia', sql.Int, id_materia)
    .input('grupo', sql.VarChar(10), grupo)
    .input('docente', sql.VarChar(150), docente)
    .input('gestion', sql.VarChar(20), gestion)
    .input('periodo', sql.VarChar(20), periodo)
    .input('cantidad_estudiantes', sql.Int, cantidad_estudiantes)
    .input('activo', sql.VarChar(10), activo)
    .query(`
      UPDATE grupo_materia
      SET id_materia   = @id_materia,
          grupo = @grupo,
          docente      = @docente,
          gestion = @gestion,
          periodo = @periodo,
          cantidad_estudiantes = @cantidad_estudiantes,
          activo = @activo
      OUTPUT INSERTED.*
      WHERE id_grupo_materia = @id
    `);
  if (result.recordset.length === 0) throw new Error('Grupo de materia no encontrado');
  return result.recordset[0];
}

async function remove(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM grupo_materia
      OUTPUT DELETED.id_grupo_materia
      WHERE id_grupo_materia = @id
    `);
  if (result.recordset.length === 0) throw new Error('Grupo de materia no encontrado');
  return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
