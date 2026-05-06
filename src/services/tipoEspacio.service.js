const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { search = null } = filters;
	const pool = await getPool();
	const request = pool.request();
	request.input('search', sql.VarChar(100), search ? `%${search}%` : null);

	const result = await request.query(`
		SELECT id_tipo_espacio, nombre
		FROM tipo_espacio
		WHERE (@search IS NULL OR UPPER(nombre) LIKE UPPER(@search))
		ORDER BY nombre ASC
	`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT id_tipo_espacio, nombre
			FROM tipo_espacio
			WHERE id_tipo_espacio = @id
		`);

	return result.recordset[0] || null;
}

async function create(data) {
	const { nombre } = data;
	const pool = await getPool();
	const result = await pool.request()
		.input('nombre', sql.VarChar(50), nombre)
		.query(`
			INSERT INTO tipo_espacio (nombre)
			OUTPUT INSERTED.*
			VALUES (@nombre)
		`);

	return result.recordset[0];
}

async function update(id, data) {
	const { nombre } = data;
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.input('nombre', sql.VarChar(50), nombre)
		.query(`
			UPDATE tipo_espacio
			SET nombre = @nombre
			OUTPUT INSERTED.*
			WHERE id_tipo_espacio = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Tipo de espacio no encontrado');
	}

	return result.recordset[0];
}

async function remove(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			DELETE FROM tipo_espacio
			OUTPUT DELETED.id_tipo_espacio
			WHERE id_tipo_espacio = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Tipo de espacio no encontrado');
	}

	return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
