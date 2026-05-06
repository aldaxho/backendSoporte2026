const service = require('../services/registroEspacio.service');

async function getAll(req, res) {
	try {
		const filters = {
			id_espacio: req.query.id_espacio ? parseInt(req.query.id_espacio, 10) : null,
			id_usuario: req.query.id_usuario ? parseInt(req.query.id_usuario, 10) : null,
			accion: req.query.accion ? req.query.accion.trim() : null,
			search: req.query.search ? req.query.search.trim() : null,
		};

		const data = await service.getAll(filters);
		res.json(data);
	} catch (error) {
		console.error('[registroEspacio.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener registros de espacio' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Registro no encontrado' });

		res.json(data);
	} catch (error) {
		console.error('[registroEspacio.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener registro de espacio' });
	}
}

module.exports = { getAll, getById };
