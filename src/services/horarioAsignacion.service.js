const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { search = null, id_espacio = null, id_grupo_materia = null, dia_semana = null, activo = null } = filters;
	const pool = await getPool();
	const request = pool.request();
	request.input('search', sql.VarChar(250), search ? `%${search}%` : null);
	request.input('id_espacio', sql.Int, id_espacio);
	request.input('id_grupo_materia', sql.Int, id_grupo_materia);
	request.input('dia_semana', sql.VarChar(15), dia_semana);
	request.input('activo', sql.VarChar(10), activo);

	const result = await request.query(`
		SELECT
			h.id_horario,
			h.id_espacio,
			e.codigo AS codigo_espacio,
			e.nombre AS espacio,
			h.id_grupo_materia,
			gm.grupo,
			m.sigla AS sigla_materia,
			m.nombre AS materia,
			h.dia_semana,
			h.hora_inicio,
			h.hora_fin,
			h.modalidad,
			h.observaciones,
			h.activo
		FROM horario_asignacion h
		INNER JOIN espacio e ON h.id_espacio = e.id_espacio
		INNER JOIN grupo_materia gm ON h.id_grupo_materia = gm.id_grupo_materia
		INNER JOIN materia m ON gm.id_materia = m.id_materia
		WHERE (
			@search IS NULL
			OR UPPER(e.codigo) LIKE UPPER(@search)
			OR UPPER(ISNULL(e.nombre, '')) LIKE UPPER(@search)
			OR UPPER(gm.grupo) LIKE UPPER(@search)
			OR UPPER(m.sigla) LIKE UPPER(@search)
			OR UPPER(m.nombre) LIKE UPPER(@search)
		)
		AND (@id_espacio IS NULL OR h.id_espacio = @id_espacio)
		AND (@id_grupo_materia IS NULL OR h.id_grupo_materia = @id_grupo_materia)
		AND (@dia_semana IS NULL OR UPPER(h.dia_semana) = UPPER(@dia_semana))
		AND (@activo IS NULL OR UPPER(ISNULL(h.activo, '')) = UPPER(@activo))
		ORDER BY h.dia_semana, h.hora_inicio
	`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT
				h.id_horario,
				h.id_espacio,
				e.codigo AS codigo_espacio,
				e.nombre AS espacio,
				h.id_grupo_materia,
				gm.grupo,
				m.sigla AS sigla_materia,
				m.nombre AS materia,
				h.dia_semana,
				h.hora_inicio,
				h.hora_fin,
				h.modalidad,
				h.observaciones,
				h.activo
			FROM horario_asignacion h
			INNER JOIN espacio e ON h.id_espacio = e.id_espacio
			INNER JOIN grupo_materia gm ON h.id_grupo_materia = gm.id_grupo_materia
			INNER JOIN materia m ON gm.id_materia = m.id_materia
			WHERE h.id_horario = @id
		`);

	return result.recordset[0] || null;
}

async function create(data) {
	const {
		id_espacio,
		id_grupo_materia,
		dia_semana,
		hora_inicio,
		hora_fin,
		modalidad = null,
		observaciones = null,
		activo = 'SI',
	} = data;

	const pool = await getPool();
	const result = await pool.request()
		.input('id_espacio', sql.Int, id_espacio)
		.input('id_grupo_materia', sql.Int, id_grupo_materia)
		.input('dia_semana', sql.VarChar(15), dia_semana)
		.input('hora_inicio', sql.Time, hora_inicio)
		.input('hora_fin', sql.Time, hora_fin)
		.input('modalidad', sql.VarChar(30), modalidad)
		.input('observaciones', sql.VarChar(sql.MAX), observaciones)
		.input('activo', sql.VarChar(10), activo)
		.query(`
			INSERT INTO horario_asignacion (
				id_espacio,
				id_grupo_materia,
				dia_semana,
				hora_inicio,
				hora_fin,
				modalidad,
				observaciones,
				activo
			)
			OUTPUT INSERTED.*
			VALUES (
				@id_espacio,
				@id_grupo_materia,
				@dia_semana,
				@hora_inicio,
				@hora_fin,
				@modalidad,
				@observaciones,
				@activo
			)
		`);

	return result.recordset[0];
}

async function update(id, data) {
	const {
		id_espacio,
		id_grupo_materia,
		dia_semana,
		hora_inicio,
		hora_fin,
		modalidad = null,
		observaciones = null,
		activo,
		id_usuario,
	} = data;

	const pool = await getPool();
	const tx = new sql.Transaction(pool);

	await tx.begin();

	try {
		const previousResult = await new sql.Request(tx)
			.input('id', sql.Int, id)
			.query('SELECT * FROM horario_asignacion WHERE id_horario = @id');

		const previous = previousResult.recordset[0];
		if (!previous) {
			throw new Error('Horario de asignacion no encontrado');
		}

		const updatedResult = await new sql.Request(tx)
			.input('id', sql.Int, id)
			.input('id_espacio', sql.Int, id_espacio)
			.input('id_grupo_materia', sql.Int, id_grupo_materia)
			.input('dia_semana', sql.VarChar(15), dia_semana)
			.input('hora_inicio', sql.Time, hora_inicio)
			.input('hora_fin', sql.Time, hora_fin)
			.input('modalidad', sql.VarChar(30), modalidad)
			.input('observaciones', sql.VarChar(sql.MAX), observaciones)
			.input('activo', sql.VarChar(10), activo)
			.query(`
				UPDATE horario_asignacion
				SET id_espacio = @id_espacio,
						id_grupo_materia = @id_grupo_materia,
						dia_semana = @dia_semana,
						hora_inicio = @hora_inicio,
						hora_fin = @hora_fin,
						modalidad = @modalidad,
						observaciones = @observaciones,
						activo = @activo
				OUTPUT INSERTED.*
				WHERE id_horario = @id
			`);

		const updated = updatedResult.recordset[0];
		if (!updated) {
			throw new Error('Horario de asignacion no encontrado');
		}

		const detalle = `ACTUALIZACION HORARIO ${updated.id_horario}. Antes: ${previous.dia_semana} ${previous.hora_inicio}-${previous.hora_fin}. Despues: ${updated.dia_semana} ${updated.hora_inicio}-${updated.hora_fin}.`;

		await new sql.Request(tx)
			.input('id_horario', sql.Int, id)
			.input('id_usuario', sql.Int, id_usuario)
			.input('accion', sql.VarChar(20), 'UPDATE')
			.input('detalle', sql.VarChar(sql.MAX), detalle)
			.query(`
				INSERT INTO registro_asignacion (id_horario, id_usuario, accion, detalle)
				VALUES (@id_horario, @id_usuario, @accion, @detalle)
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
			DELETE FROM horario_asignacion
			OUTPUT DELETED.id_horario
			WHERE id_horario = @id
		`);

	if (result.recordset.length === 0) {
		throw new Error('Horario de asignacion no encontrado');
	}

	return result.recordset[0];
}

module.exports = { getAll, getById, create, update, remove };
