const service = require('../services/horarioAsignacion.service');

async function getAll(req, res) {
	try {
		const idEspacio = req.query.id_espacio ? parseInt(req.query.id_espacio, 10) : null;
		const idGrupoMateria = req.query.id_grupo_materia ? parseInt(req.query.id_grupo_materia, 10) : null;
		if (req.query.id_espacio && Number.isNaN(idEspacio)) {
			return res.status(400).json({ error: 'El filtro "id_espacio" debe ser numerico' });
		}
		if (req.query.id_grupo_materia && Number.isNaN(idGrupoMateria)) {
			return res.status(400).json({ error: 'El filtro "id_grupo_materia" debe ser numerico' });
		}

		const data = await service.getAll({
			search: req.query.search ? req.query.search.trim() : null,
			id_espacio: idEspacio,
			id_grupo_materia: idGrupoMateria,
			dia_semana: req.query.dia_semana ? req.query.dia_semana.trim() : null,
			activo: req.query.activo ? req.query.activo.trim() : null,
		});
		res.json(data);
	} catch (error) {
		console.error('[horarioAsignacion.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener horarios' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Horario no encontrado' });

		res.json(data);
	} catch (error) {
		console.error('[horarioAsignacion.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener horario' });
	}
}

async function create(req, res) {
	try {
		const {
			id_espacio,
			id_grupo_materia,
			dia_semana,
			hora_inicio,
			hora_fin,
			modalidad,
			observaciones,
			activo,
		} = req.body;

		if (!id_espacio || Number.isNaN(parseInt(id_espacio, 10))) {
			return res.status(400).json({ error: 'El campo "id_espacio" es obligatorio y numerico' });
		}
		if (!id_grupo_materia || Number.isNaN(parseInt(id_grupo_materia, 10))) {
			return res.status(400).json({ error: 'El campo "id_grupo_materia" es obligatorio y numerico' });
		}
		if (!dia_semana || !dia_semana.trim()) {
			return res.status(400).json({ error: 'El campo "dia_semana" es obligatorio' });
		}
		if (!hora_inicio || !hora_fin) {
			return res.status(400).json({ error: 'Los campos "hora_inicio" y "hora_fin" son obligatorios' });
		}

		const data = await service.create({
			id_espacio: parseInt(id_espacio, 10),
			id_grupo_materia: parseInt(id_grupo_materia, 10),
			dia_semana: dia_semana.trim().toUpperCase(),
			hora_inicio,
			hora_fin,
			modalidad: modalidad ? modalidad.trim().toUpperCase() : null,
			observaciones: observaciones ? observaciones.trim() : null,
			activo: activo ? activo.trim().toUpperCase() : 'SI',
		});

		res.status(201).json(data);
	} catch (error) {
		console.error('[horarioAsignacion.create]', error.message);
		res.status(500).json({ error: 'Error al crear horario' });
	}
}

async function update(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const {
			id_espacio,
			id_grupo_materia,
			dia_semana,
			hora_inicio,
			hora_fin,
			modalidad,
			observaciones,
			activo,
			id_usuario,
		} = req.body;

		if (!id_espacio || Number.isNaN(parseInt(id_espacio, 10))) {
			return res.status(400).json({ error: 'El campo "id_espacio" es obligatorio y numerico' });
		}
		if (!id_grupo_materia || Number.isNaN(parseInt(id_grupo_materia, 10))) {
			return res.status(400).json({ error: 'El campo "id_grupo_materia" es obligatorio y numerico' });
		}
		if (!dia_semana || !dia_semana.trim()) {
			return res.status(400).json({ error: 'El campo "dia_semana" es obligatorio' });
		}
		if (!hora_inicio || !hora_fin) {
			return res.status(400).json({ error: 'Los campos "hora_inicio" y "hora_fin" son obligatorios' });
		}
		if (!activo || !activo.trim()) {
			return res.status(400).json({ error: 'El campo "activo" es obligatorio' });
		}
		if (!id_usuario || Number.isNaN(parseInt(id_usuario, 10))) {
			return res.status(400).json({ error: 'El campo "id_usuario" es obligatorio para auditoria' });
		}

		const data = await service.update(id, {
			id_espacio: parseInt(id_espacio, 10),
			id_grupo_materia: parseInt(id_grupo_materia, 10),
			dia_semana: dia_semana.trim().toUpperCase(),
			hora_inicio,
			hora_fin,
			modalidad: modalidad ? modalidad.trim().toUpperCase() : null,
			observaciones: observaciones ? observaciones.trim() : null,
			activo: activo.trim().toUpperCase(),
			id_usuario: parseInt(id_usuario, 10),
		});

		res.json(data);
	} catch (error) {
		console.error('[horarioAsignacion.update]', error.message);
		if (error.message === 'Horario de asignacion no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al actualizar horario' });
	}
}

async function remove(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		await service.remove(id);
		res.json({ message: 'Horario eliminado correctamente' });
	} catch (error) {
		console.error('[horarioAsignacion.remove]', error.message);
		if (error.message === 'Horario de asignacion no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al eliminar horario' });
	}
}

module.exports = { getAll, getById, create, update, remove };
