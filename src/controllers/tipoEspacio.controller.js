const service = require('../services/tipoEspacio.service');

async function getAll(req, res) {
	try {
		const data = await service.getAll({
			search: req.query.search ? req.query.search.trim() : null,
		});
		res.json(data);
	} catch (error) {
		console.error('[tipoEspacio.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener tipos de espacio' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Tipo de espacio no encontrado' });

		res.json(data);
	} catch (error) {
		console.error('[tipoEspacio.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener tipo de espacio' });
	}
}

async function create(req, res) {
	try {
		const { nombre } = req.body;

		if (!nombre || !nombre.trim()) {
			return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
		}

		const data = await service.create({
			nombre: nombre.trim().toUpperCase(),
		});

		res.status(201).json(data);
	} catch (error) {
		console.error('[tipoEspacio.create]', error.message);
		res.status(500).json({ error: 'Error al crear tipo de espacio' });
	}
}

async function update(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const { nombre } = req.body;
		if (!nombre || !nombre.trim()) {
			return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
		}

		const data = await service.update(id, {
			nombre: nombre.trim().toUpperCase(),
		});

		res.json(data);
	} catch (error) {
		console.error('[tipoEspacio.update]', error.message);
		if (error.message === 'Tipo de espacio no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al actualizar tipo de espacio' });
	}
}

async function remove(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		await service.remove(id);
		res.json({ message: 'Tipo de espacio eliminado correctamente' });
	} catch (error) {
		console.error('[tipoEspacio.remove]', error.message);
		if (error.message === 'Tipo de espacio no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al eliminar tipo de espacio' });
	}
}

module.exports = { getAll, getById, create, update, remove };
