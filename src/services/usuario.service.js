const { getPool, sql } = require('../config/db');

async function getAll() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT
      id_usuario,
      id_grupo,
      nombre_completo,
      correo,
      telefono,
      rol,
      activo
    FROM usuario
    ORDER BY nombre_completo ASC
  `);
  return result.recordset;
}

async function getById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT
        id_usuario,
        id_grupo,
        nombre_completo,
        correo,
        telefono,
        rol,
        activo
      FROM usuario
      WHERE id_usuario = @id
    `);
  return result.recordset[0] || null;
}

async function create(data) {
  const {
    id_grupo = null,
    nombre_completo,
    correo = null,
    telefono = null,
    rol = 'OPERADOR',
    activo = 'SI',
  } = data;

  const pool = await getPool();
  const result = await pool.request()
    .input('id_grupo', sql.Int, id_grupo)
    .input('nombre_completo', sql.VarChar(150), nombre_completo)
    .input('correo', sql.VarChar(150), correo)
    .input('telefono', sql.VarChar(30), telefono)
    .input('rol', sql.VarChar(30), rol)
    .input('activo', sql.VarChar(10), activo)
    .query(`
      INSERT INTO usuario (id_grupo, nombre_completo, correo, telefono, rol, activo)
      OUTPUT INSERTED.*
      VALUES (@id_grupo, @nombre_completo, @correo, @telefono, @rol, @activo)
    `);
  return result.recordset[0];
}

async function update(id, data) {
  const {
    id_grupo = null,
    nombre_completo,
    correo = null,
    telefono = null,
    rol,
    activo,
  } = data;

  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('id_grupo', sql.Int, id_grupo)
    .input('nombre_completo', sql.VarChar(150), nombre_completo)
    .input('correo', sql.VarChar(150), correo)
    .input('telefono', sql.VarChar(30), telefono)
    .input('rol', sql.VarChar(30), rol)
    .input('activo', sql.VarChar(10), activo)
    .query(`
      UPDATE usuario
      SET id_grupo = @id_grupo,
          nombre_completo = @nombre_completo,
          correo = @correo,
          telefono = @telefono,
          rol      = @rol,
          activo   = @activo
      OUTPUT INSERTED.*
      WHERE id_usuario = @id
    `);
  if (result.recordset.length === 0) throw new Error('Usuario no encontrado');
  return result.recordset[0];
}

/**
 * Elimina un usuario por ID
 * @param {number} id - id_usuario
 */
async function remove(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM usuario
      OUTPUT DELETED.id_usuario
      WHERE id_usuario = @id
    `);
  if (result.recordset.length === 0) throw new Error('Usuario no encontrado');
  return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
