const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { id_horario = null, id_usuario = null, accion = null, search = null } = filters;
	const pool = await getPool();
	const result = await pool.request()
		.input('id_horario', sql.Int, id_horario)
		.input('id_usuario', sql.Int, id_usuario)
		.input('accion', sql.VarChar(20), accion)
		.input('search', sql.VarChar(250), search ? `%${search}%` : null)
		.query(`
			SELECT
				ra.id_registro,
				ra.id_horario,
				h.dia_semana,
				h.hora_inicio,
				h.hora_fin,
				ra.id_usuario,
				u.nombre_completo AS usuario,
				ra.fecha,
				ra.accion,
				ra.detalle
			FROM registro_asignacion ra
			INNER JOIN horario_asignacion h ON ra.id_horario = h.id_horario
			INNER JOIN usuario u ON ra.id_usuario = u.id_usuario
			WHERE (@id_horario IS NULL OR ra.id_horario = @id_horario)
				AND (@id_usuario IS NULL OR ra.id_usuario = @id_usuario)
				AND (@accion IS NULL OR UPPER(ISNULL(ra.accion, '')) = UPPER(@accion))
				AND (
					@search IS NULL
					OR UPPER(h.dia_semana) LIKE UPPER(@search)
					OR UPPER(CONVERT(varchar(20), h.hora_inicio, 108)) LIKE UPPER(@search)
					OR UPPER(CONVERT(varchar(20), h.hora_fin, 108)) LIKE UPPER(@search)
					OR UPPER(u.nombre_completo) LIKE UPPER(@search)
					OR UPPER(CONVERT(varchar(max), ISNULL(ra.detalle, ''))) LIKE UPPER(@search)
				)
			ORDER BY ra.id_registro DESC
		`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT
				ra.id_registro,
				ra.id_horario,
				h.dia_semana,
				h.hora_inicio,
				h.hora_fin,
				ra.id_usuario,
				u.nombre_completo AS usuario,
				ra.fecha,
				ra.accion,
				ra.detalle
			FROM registro_asignacion ra
			INNER JOIN horario_asignacion h ON ra.id_horario = h.id_horario
			INNER JOIN usuario u ON ra.id_usuario = u.id_usuario
			WHERE ra.id_registro = @id
		`);

	return result.recordset[0] || null;
}

module.exports = { getAll, getById };
