const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { search = null, id_ubicacion = null, id_tipo_espacio = null, estado = null } = filters;
	const pool = await getPool();
	const request = pool.request();
	request.input('search', sql.VarChar(250), search ? `%${search}%` : null);
	request.input('id_ubicacion', sql.Int, id_ubicacion);
	request.input('id_tipo_espacio', sql.Int, id_tipo_espacio);
	request.input('estado', sql.VarChar(30), estado);

	const result = await request.query(`
		SELECT
			e.id_espacio,
			e.id_ubicacion,
			u.nombre AS ubicacion,
			e.id_tipo_espacio,
			te.nombre AS tipo_espacio,
			e.codigo,
			e.nombre,
			e.capacidad,
			e.piso,
			e.uso_para_clases,
			e.latitud,
			e.longitud,
			e.estado,
			e.observaciones,
			e.fecha_creacion,
			e.fecha_actualizacion
		FROM espacio e
		INNER JOIN ubicacion u ON e.id_ubicacion = u.id_ubicacion
		INNER JOIN tipo_espacio te ON e.id_tipo_espacio = te.id_tipo_espacio
		WHERE (
			@search IS NULL
			OR UPPER(e.codigo) LIKE UPPER(@search)
			OR UPPER(ISNULL(e.nombre, '')) LIKE UPPER(@search)
			OR UPPER(u.nombre) LIKE UPPER(@search)
			OR UPPER(te.nombre) LIKE UPPER(@search)
		)
		AND (@id_ubicacion IS NULL OR e.id_ubicacion = @id_ubicacion)
		AND (@id_tipo_espacio IS NULL OR e.id_tipo_espacio = @id_tipo_espacio)
		AND (@estado IS NULL OR UPPER(ISNULL(e.estado, '')) = UPPER(@estado))
		ORDER BY e.codigo ASC
	`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT
				e.id_espacio,
				e.id_ubicacion,
				u.nombre AS ubicacion,
				e.id_tipo_espacio,
				te.nombre AS tipo_espacio,
				e.codigo,
				e.nombre,
				e.capacidad,
				e.piso,
				e.uso_para_clases,
				e.latitud,
				e.longitud,
				e.estado,
				e.observaciones,
				e.fecha_creacion,
				e.fecha_actualizacion
			FROM espacio e
			INNER JOIN ubicacion u ON e.id_ubicacion = u.id_ubicacion
			INNER JOIN tipo_espacio te ON e.id_tipo_espacio = te.id_tipo_espacio
			WHERE e.id_espacio = @id
		`);

	return result.recordset[0] || null;
}

async function create(data) {
	const {
		id_ubicacion,
		id_tipo_espacio,
		codigo,
		nombre = null,
		capacidad = null,
		piso = null,
		uso_para_clases = null,
		latitud = null,
		longitud = null,
		estado = null,
		observaciones = null,
	} = data;

	const pool = await getPool();
	const result = await pool.request()
		.input('id_ubicacion', sql.Int, id_ubicacion)
		.input('id_tipo_espacio', sql.Int, id_tipo_espacio)
		.input('codigo', sql.VarChar(50), codigo)
		.input('nombre', sql.VarChar(100), nombre)
		.input('capacidad', sql.Int, capacidad)
		.input('piso', sql.VarChar(20), piso)
		.input('uso_para_clases', sql.VarChar(10), uso_para_clases)
		.input('latitud', sql.Decimal(10, 6), latitud)
		.input('longitud', sql.Decimal(10, 6), longitud)
		.input('estado', sql.VarChar(30), estado)
		.input('observaciones', sql.VarChar(sql.MAX), observaciones)
		.query(`
			INSERT INTO espacio (
				id_ubicacion,
				id_tipo_espacio,
				codigo,
				nombre,
				capacidad,
				piso,
				uso_para_clases,
				latitud,
				longitud,
				estado,
				observaciones
			)
			OUTPUT INSERTED.*
			VALUES (
				@id_ubicacion,
				@id_tipo_espacio,
				@codigo,
				@nombre,
				@capacidad,
				@piso,
				@uso_para_clases,
				@latitud,
				@longitud,
				@estado,
				@observaciones
			)
		`);

	return result.recordset[0];
}

async function update(id, data) {
	const {
		id_ubicacion,
		id_tipo_espacio,
		codigo,
		nombre = null,
		capacidad = null,
		piso = null,
		uso_para_clases = null,
		latitud = null,
		longitud = null,
		estado = null,
		observaciones = null,
		id_usuario,
	} = data;

	const pool = await getPool();
	const tx = new sql.Transaction(pool);

	await tx.begin();

	try {
		const previousResult = await new sql.Request(tx)
			.input('id', sql.Int, id)
			.query('SELECT * FROM espacio WHERE id_espacio = @id');

		const previous = previousResult.recordset[0];
		if (!previous) {
			throw new Error('Espacio no encontrado');
		}

		const updatedResult = await new sql.Request(tx)
			.input('id', sql.Int, id)
			.input('id_ubicacion', sql.Int, id_ubicacion)
			.input('id_tipo_espacio', sql.Int, id_tipo_espacio)
			.input('codigo', sql.VarChar(50), codigo)
			.input('nombre', sql.VarChar(100), nombre)
			.input('capacidad', sql.Int, capacidad)
			.input('piso', sql.VarChar(20), piso)
			.input('uso_para_clases', sql.VarChar(10), uso_para_clases)
			.input('latitud', sql.Decimal(10, 6), latitud)
			.input('longitud', sql.Decimal(10, 6), longitud)
			.input('estado', sql.VarChar(30), estado)
			.input('observaciones', sql.VarChar(sql.MAX), observaciones)
			.query(`
				UPDATE espacio
				SET id_ubicacion = @id_ubicacion,
						id_tipo_espacio = @id_tipo_espacio,
						codigo = @codigo,
						nombre = @nombre,
						capacidad = @capacidad,
						piso = @piso,
						uso_para_clases = @uso_para_clases,
						latitud = @latitud,
						longitud = @longitud,
						estado = @estado,
						observaciones = @observaciones,
						fecha_actualizacion = SYSDATETIME()
				OUTPUT INSERTED.*
				WHERE id_espacio = @id
			`);

		const updated = updatedResult.recordset[0];
		if (!updated) {
			throw new Error('Espacio no encontrado');
		}

		const detalle = `ACTUALIZACION ESPACIO ${updated.codigo}. Antes: estado=${previous.estado ?? 'NULL'}, capacidad=${previous.capacidad ?? 'NULL'}, lat=${previous.latitud ?? 'NULL'}, lon=${previous.longitud ?? 'NULL'}. Despues: estado=${updated.estado ?? 'NULL'}, capacidad=${updated.capacidad ?? 'NULL'}, lat=${updated.latitud ?? 'NULL'}, lon=${updated.longitud ?? 'NULL'}.`;

		await new sql.Request(tx)
			.input('id_espacio', sql.Int, id)
			.input('id_usuario', sql.Int, id_usuario)
			.input('accion', sql.VarChar(20), 'UPDATE')
			.input('detalle', sql.VarChar(sql.MAX), detalle)
			.query(`
				INSERT INTO registro_espacio (id_espacio, id_usuario, accion, detalle)
				VALUES (@id_espacio, @id_usuario, @accion, @detalle)
			`);

		await tx.commit();
		return updated;
	} catch (error) {
		await tx.rollback();
		throw error;
	}
}

async function remove(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			DELETE FROM espacio
			OUTPUT DELETED.id_espacio
			WHERE id_espacio = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Espacio no encontrado');
	}

	return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
