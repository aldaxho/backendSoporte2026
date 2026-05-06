const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
  const { search = null } = filters;
  const pool = await getPool();
  const request = pool.request();
  request.input('search', sql.VarChar(200), search ? `%${search}%` : null);

  const result = await request.query(`
    SELECT
      id_carrera,
      nombre,
      sigla
    FROM carrera
    WHERE (
      @search IS NULL
      OR UPPER(nombre) LIKE UPPER(@search)
      OR UPPER(ISNULL(sigla, '')) LIKE UPPER(@search)
    )
    ORDER BY nombre ASC
  `);
  return result.recordset;
}

async function getById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT
        id_carrera,
        nombre,
        sigla
      FROM carrera
      WHERE id_carrera = @id
    `);
  return result.recordset[0] || null;
}

async function create(data) {
  const { nombre, sigla = null } = data;
  const pool = await getPool();
  const result = await pool.request()
    .input('nombre', sql.VarChar(150), nombre)
    .input('sigla', sql.VarChar(20), sigla)
    .query(`
      INSERT INTO carrera (nombre, sigla)
      OUTPUT INSERTED.*
      VALUES (@nombre, @sigla)
    `);
  return result.recordset[0];
}

async function update(id, data) {
  const { nombre, sigla = null } = data;
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar(150), nombre)
    .input('sigla', sql.VarChar(20), sigla)
    .query(`
      UPDATE carrera
      SET nombre = @nombre,
          sigla = @sigla
      OUTPUT INSERTED.*
      WHERE id_carrera = @id
    `);
  if (result.recordset.length === 0) {
    throw new Error('Carrera no encontrada');
  }
  return result.recordset[0];
}

async function remove(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM carrera
      OUTPUT DELETED.id_carrera
      WHERE id_carrera = @id
    `);
  if (result.recordset.length === 0) {
    throw new Error('Carrera no encontrada');
  }
  return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
