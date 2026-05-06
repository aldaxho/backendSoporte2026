const service = require('../services/espacio.service');

async function getAll(req, res) {
	try {
		const idUbicacion = req.query.id_ubicacion ? parseInt(req.query.id_ubicacion, 10) : null;
		const idTipoEspacio = req.query.id_tipo_espacio ? parseInt(req.query.id_tipo_espacio, 10) : null;
		if (req.query.id_ubicacion && Number.isNaN(idUbicacion)) {
			return res.status(400).json({ error: 'El filtro "id_ubicacion" debe ser numerico' });
		}
		if (req.query.id_tipo_espacio && Number.isNaN(idTipoEspacio)) {
			return res.status(400).json({ error: 'El filtro "id_tipo_espacio" debe ser numerico' });
		}

		const data = await service.getAll({
			search: req.query.search ? req.query.search.trim() : null,
			id_ubicacion: idUbicacion,
			id_tipo_espacio: idTipoEspacio,
			estado: req.query.estado ? req.query.estado.trim() : null,
		});
		res.json(data);
	} catch (error) {
		console.error('[espacio.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener espacios' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Espacio no encontrado' });

		res.json(data);
	} catch (error) {
		console.error('[espacio.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener espacio' });
	}
}

async function create(req, res) {
	try {
		const {
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
			observaciones,
		} = req.body;

		if (!id_ubicacion || Number.isNaN(parseInt(id_ubicacion, 10))) {
			return res.status(400).json({ error: 'El campo "id_ubicacion" es obligatorio y numerico' });
		}
		if (!id_tipo_espacio || Number.isNaN(parseInt(id_tipo_espacio, 10))) {
			return res.status(400).json({ error: 'El campo "id_tipo_espacio" es obligatorio y numerico' });
		}
		if (!codigo || !codigo.trim()) {
			return res.status(400).json({ error: 'El campo "codigo" es obligatorio' });
		}

		const data = await service.create({
			id_ubicacion: parseInt(id_ubicacion, 10),
			id_tipo_espacio: parseInt(id_tipo_espacio, 10),
			codigo: codigo.trim().toUpperCase(),
			nombre: nombre ? nombre.trim().toUpperCase() : null,
			capacidad: capacidad !== undefined && capacidad !== null ? parseInt(capacidad, 10) : null,
			piso: piso ? piso.trim().toUpperCase() : null,
			uso_para_clases: uso_para_clases ? uso_para_clases.trim().toUpperCase() : null,
			latitud: latitud !== undefined && latitud !== null ? Number(latitud) : null,
			longitud: longitud !== undefined && longitud !== null ? Number(longitud) : null,
			estado: estado ? estado.trim().toUpperCase() : null,
			observaciones: observaciones ? observaciones.trim() : null,
		});

		res.status(201).json(data);
	} catch (error) {
		console.error('[espacio.create]', error.message);
		res.status(500).json({ error: 'Error al crear espacio' });
	}
}

async function update(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const {
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
			observaciones,
			id_usuario,
		} = req.body;

		if (!id_ubicacion || Number.isNaN(parseInt(id_ubicacion, 10))) {
			return res.status(400).json({ error: 'El campo "id_ubicacion" es obligatorio y numerico' });
		}
		if (!id_tipo_espacio || Number.isNaN(parseInt(id_tipo_espacio, 10))) {
			return res.status(400).json({ error: 'El campo "id_tipo_espacio" es obligatorio y numerico' });
		}
		if (!codigo || !codigo.trim()) {
			return res.status(400).json({ error: 'El campo "codigo" es obligatorio' });
		}
		if (!id_usuario || Number.isNaN(parseInt(id_usuario, 10))) {
			return res.status(400).json({ error: 'El campo "id_usuario" es obligatorio para auditoria' });
		}

		const data = await service.update(id, {
			id_ubicacion: parseInt(id_ubicacion, 10),
			id_tipo_espacio: parseInt(id_tipo_espacio, 10),
			codigo: codigo.trim().toUpperCase(),
			nombre: nombre ? nombre.trim().toUpperCase() : null,
			capacidad: capacidad !== undefined && capacidad !== null ? parseInt(capacidad, 10) : null,
			piso: piso ? piso.trim().toUpperCase() : null,
			uso_para_clases: uso_para_clases ? uso_para_clases.trim().toUpperCase() : null,
			latitud: latitud !== undefined && latitud !== null ? Number(latitud) : null,
			longitud: longitud !== undefined && longitud !== null ? Number(longitud) : null,
			estado: estado ? estado.trim().toUpperCase() : null,
			observaciones: observaciones ? observaciones.trim() : null,
			id_usuario: parseInt(id_usuario, 10),
		});

		res.json(data);
	} catch (error) {
		console.error('[espacio.update]', error.message);
		if (error.message === 'Espacio no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al actualizar espacio' });
	}
}

async function remove(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		await service.remove(id);
		res.json({ message: 'Espacio eliminado correctamente' });
	} catch (error) {
		console.error('[espacio.remove]', error.message);
		if (error.message === 'Espacio no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al eliminar espacio' });
	}
}

module.exports = { getAll, getById, create, update, remove };
