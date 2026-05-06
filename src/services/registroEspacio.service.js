const { getPool, sql } = require('../config/db');

async function getAll(filters = {}) {
	const { id_espacio = null, id_usuario = null, accion = null, search = null } = filters;
	const pool = await getPool();
	const result = await pool.request()
		.input('id_espacio', sql.Int, id_espacio)
		.input('id_usuario', sql.Int, id_usuario)
		.input('accion', sql.VarChar(20), accion)
		.input('search', sql.VarChar(250), search ? `%${search}%` : null)
		.query(`
			SELECT
				re.id_registro,
				re.id_espacio,
				e.codigo AS codigo_espacio,
				e.nombre AS espacio,
				re.id_usuario,
				u.nombre_completo AS usuario,
				re.fecha,
				re.accion,
				re.detalle
			FROM registro_espacio re
			INNER JOIN espacio e ON re.id_espacio = e.id_espacio
			INNER JOIN usuario u ON re.id_usuario = u.id_usuario
			WHERE (@id_espacio IS NULL OR re.id_espacio = @id_espacio)
				AND (@id_usuario IS NULL OR re.id_usuario = @id_usuario)
				AND (@accion IS NULL OR UPPER(ISNULL(re.accion, '')) = UPPER(@accion))
				AND (
					@search IS NULL
					OR UPPER(e.codigo) LIKE UPPER(@search)
					OR UPPER(ISNULL(e.nombre, '')) LIKE UPPER(@search)
					OR UPPER(u.nombre_completo) LIKE UPPER(@search)
					OR UPPER(CONVERT(varchar(max), ISNULL(re.detalle, ''))) LIKE UPPER(@search)
				)
			ORDER BY re.id_registro DESC
		`);

	return result.recordset;
}

async function getById(id) {
	const pool = await getPool();
	const result = await pool.request()
		.input('id', sql.Int, id)
		.query(`
			SELECT
				re.id_registro,
				re.id_espacio,
				e.codigo AS codigo_espacio,
				e.nombre AS espacio,
				re.id_usuario,
				u.nombre_completo AS usuario,
				re.fecha,
				re.accion,
				re.detalle
			FROM registro_espacio re
			INNER JOIN espacio e ON re.id_espacio = e.id_espacio
			INNER JOIN usuario u ON re.id_usuario = u.id_usuario
			WHERE re.id_registro = @id
		`);

	return result.recordset[0] || null;
}

module.exports = { getAll, getById };
