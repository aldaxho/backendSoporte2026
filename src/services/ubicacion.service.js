const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { search = null, tipo = null, activo = null } = filters;
	const pool = await getPool();
	const request = pool.request();
	request.input('search', sql.VarChar(250), search ? `%${search}%` : null);
	request.input('tipo', sql.VarChar(50), tipo);
	request.input('activo', sql.VarChar(10), activo);

	const result = await request.query(`
		SELECT
			u.id_ubicacion,
			u.nombre,
			u.tipo,
			u.id_padre,
			p.nombre AS nombre_padre,
			u.descripcion,
			u.activo
		FROM ubicacion u
		LEFT JOIN ubicacion p ON u.id_padre = p.id_ubicacion
		WHERE (
			@search IS NULL
			OR UPPER(u.nombre) LIKE UPPER(@search)
			OR UPPER(u.tipo) LIKE UPPER(@search)
			OR UPPER(ISNULL(p.nombre, '')) LIKE UPPER(@search)
		)
		AND (@tipo IS NULL OR UPPER(u.tipo) = UPPER(@tipo))
		AND (@activo IS NULL OR UPPER(ISNULL(u.activo, '')) = UPPER(@activo))
		ORDER BY u.tipo, u.nombre
	`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT
				u.id_ubicacion,
				u.nombre,
				u.tipo,
				u.id_padre,
				p.nombre AS nombre_padre,
				u.descripcion,
				u.activo
			FROM ubicacion u
			LEFT JOIN ubicacion p ON u.id_padre = p.id_ubicacion
			WHERE u.id_ubicacion = @id
		`);

	return result.recordset[0] || null;
}

async function create(data) {
	const {
		nombre,
		tipo,
		id_padre = null,
		descripcion = null,
		activo = 'SI',
	} = data;

	const pool = await getPool();
	const result = await pool.request()
		.input('nombre', sql.VarChar(150), nombre)
		.input('tipo', sql.VarChar(50), tipo)
		.input('id_padre', sql.Int, id_padre)
		.input('descripcion', sql.VarChar(sql.MAX), descripcion)
		.input('activo', sql.VarChar(10), activo)
		.query(`
			INSERT INTO ubicacion (nombre, tipo, id_padre, descripcion, activo)
			OUTPUT INSERTED.*
			VALUES (@nombre, @tipo, @id_padre, @descripcion, @activo)
		`);

	return result.recordset[0];
}

async function update(id, data) {
	const {
		nombre,
		tipo,
		id_padre,
		descripcion = null,
		activo,
	} = data;

	const pool = await getPool();
	let finalIdPadre = id_padre;

	if (finalIdPadre === undefined) {
		const current = await pool.request()
			.input('id', sql.Int, id)
			.query('SELECT id_padre FROM ubicacion WHERE id_ubicacion = @id');

		if (current.recordset.length === 0) {
			throw new Error('Ubicacion no encontrada');
		}

		finalIdPadre = current.recordset[0].id_padre;
	}

	const result = await pool.request()
		.input('id', sql.Int, id)
		.input('nombre', sql.VarChar(150), nombre)
		.input('tipo', sql.VarChar(50), tipo)
		.input('id_padre', sql.Int, finalIdPadre)
		.input('descripcion', sql.VarChar(sql.MAX), descripcion)
		.input('activo', sql.VarChar(10), activo)
		.query(`
			UPDATE ubicacion
			SET nombre = @nombre,
					tipo = @tipo,
					id_padre = @id_padre,
					descripcion = @descripcion,
					activo = @activo
			OUTPUT INSERTED.*
			WHERE id_ubicacion = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Ubicacion no encontrada');
	}

	return result.recordset[0];
}

async function remove(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			DELETE FROM ubicacion
			OUTPUT DELETED.id_ubicacion
			WHERE id_ubicacion = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Ubicacion no encontrada');
	}

	return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
