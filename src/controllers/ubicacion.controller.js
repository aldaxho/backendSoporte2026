const service = require('../services/ubicacion.service');

async function getAll(req, res) {
	try {
		const data = await service.getAll({
			search: req.query.search ? req.query.search.trim() : null,
			tipo: req.query.tipo ? req.query.tipo.trim() : null,
			activo: req.query.activo ? req.query.activo.trim() : null,
		});
		res.json(data);
	} catch (error) {
		console.error('[ubicacion.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener ubicaciones' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Ubicacion no encontrada' });

		res.json(data);
	} catch (error) {
		console.error('[ubicacion.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener ubicacion' });
	}
}

async function create(req, res) {
	try {
		const { id_ubicacion, nombre, tipo, descripcion, activo } = req.body;
		const hasIdPadre = Object.prototype.hasOwnProperty.call(req.body, 'id_padre');
		const id_padre = hasIdPadre ? req.body.id_padre : undefined;

		if (id_ubicacion !== undefined && id_ubicacion !== null && !Number.isNaN(parseInt(id_ubicacion, 10))) {
			const data = await service.update(parseInt(id_ubicacion, 10), {
				nombre: nombre.trim().toUpperCase(),
				tipo: tipo.trim().toUpperCase(),
				id_padre: id_padre !== undefined ? (id_padre ? parseInt(id_padre, 10) : null) : undefined,
				descripcion: descripcion ? descripcion.trim() : null,
				activo: activo ? activo.trim().toUpperCase() : 'SI',
			});

			return res.json(data);
		}

		if (!nombre || !nombre.trim()) {
			return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
		}
		if (!tipo || !tipo.trim()) {
			return res.status(400).json({ error: 'El campo "tipo" es obligatorio' });
		}

		const data = await service.create({
			nombre: nombre.trim().toUpperCase(),
			tipo: tipo.trim().toUpperCase(),
			id_padre: id_padre !== undefined ? (id_padre ? parseInt(id_padre, 10) : null) : null,
			descripcion: descripcion ? descripcion.trim() : null,
			activo: activo ? activo.trim().toUpperCase() : 'SI',
		});

		res.status(201).json(data);
	} catch (error) {
		console.error('[ubicacion.create]', error.message);
		res.status(500).json({ error: 'Error al crear ubicacion' });
	}
}

async function update(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const { nombre, tipo, descripcion, activo } = req.body;
		const hasIdPadre = Object.prototype.hasOwnProperty.call(req.body, 'id_padre');
		const id_padre = hasIdPadre ? req.body.id_padre : undefined;

		if (!nombre || !nombre.trim()) {
			return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
		}
		if (!tipo || !tipo.trim()) {
			return res.status(400).json({ error: 'El campo "tipo" es obligatorio' });
		}
		if (!activo || !activo.trim()) {
			return res.status(400).json({ error: 'El campo "activo" es obligatorio' });
		}

		const data = await service.update(id, {
			nombre: nombre.trim().toUpperCase(),
			tipo: tipo.trim().toUpperCase(),
			id_padre: id_padre !== undefined ? (id_padre ? parseInt(id_padre, 10) : null) : undefined,
			descripcion: descripcion ? descripcion.trim() : null,
			activo: activo.trim().toUpperCase(),
		});

		res.json(data);
	} catch (error) {
		console.error('[ubicacion.update]', error.message);
		if (error.message === 'Ubicacion no encontrada') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al actualizar ubicacion' });
	}
}

async function remove(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		await service.remove(id);
		res.json({ message: 'Ubicacion eliminada correctamente' });
	} catch (error) {
		console.error('[ubicacion.remove]', error.message);
		if (error.message === 'Ubicacion no encontrada') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al eliminar ubicacion' });
	}
}

module.exports = { getAll, getById, create, update, remove };
