const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
  const { search = null, id_carrera = null } = filters;
  const pool = await getPool();
  const request = pool.request();
  request.input('search', sql.VarChar(250), search ? `%${search}%` : null);
  request.input('id_carrera', sql.Int, id_carrera);

  const result = await request.query(`
    SELECT
      m.id_materia,
      m.id_carrera,
      c.nombre AS carrera,
      c.sigla AS sigla_carrera,
      m.sigla,
      m.nombre,
      c.id_carrera
    FROM materia m
    LEFT JOIN carrera c ON m.id_carrera = c.id_carrera
    WHERE (
      @search IS NULL
      OR UPPER(m.nombre) LIKE UPPER(@search)
      OR UPPER(m.sigla) LIKE UPPER(@search)
      OR UPPER(ISNULL(c.nombre, '')) LIKE UPPER(@search)
    )
    AND (@id_carrera IS NULL OR m.id_carrera = @id_carrera)
    ORDER BY c.nombre ASC, m.nombre ASC
  `);
  return result.recordset;
}

async function getById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT
        m.id_materia,
        m.id_carrera,
        c.nombre AS carrera,
        c.sigla AS sigla_carrera,
        m.sigla,
        m.nombre,
        c.id_carrera
      FROM materia m
      LEFT JOIN carrera c ON m.id_carrera = c.id_carrera
      WHERE m.id_materia = @id
    `);
  return result.recordset[0] || null;
}

async function create(data) {
  const { id_carrera = null, sigla, nombre } = data;
  const pool = await getPool();
  const result = await pool.request()
    .input('id_carrera', sql.Int, id_carrera)
    .input('sigla', sql.VarChar(30), sigla)
    .input('nombre', sql.VarChar(150), nombre)
    .query(`
      INSERT INTO materia (id_carrera, sigla, nombre)
      OUTPUT INSERTED.*
      VALUES (@id_carrera, @sigla, @nombre)
    `);
  return result.recordset[0];
}

async function update(id, data) {
  const { id_carrera = null, sigla, nombre } = data;
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('id_carrera', sql.Int, id_carrera)
    .input('sigla', sql.VarChar(30), sigla)
    .input('nombre', sql.VarChar(150), nombre)
    .query(`
      UPDATE materia
      SET id_carrera = @id_carrera,
          sigla = @sigla,
          nombre = @nombre
      OUTPUT INSERTED.*
      WHERE id_materia = @id
    `);
  if (result.recordset.length === 0) throw new Error('Materia no encontrada');
  return result.recordset[0];
}

async function remove(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM materia
      OUTPUT DELETED.id_materia
      WHERE id_materia = @id
    `);
  if (result.recordset.length === 0) throw new Error('Materia no encontrada');
  return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
