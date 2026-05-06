const service = require('../services/usuario.service');

async function getAll(req, res) {
	try {
		const data = await service.getAll();
		res.json(data);
	} catch (error) {
		console.error('[usuario.getAll]', error.message);
		res.status(500).json({ error: 'Error al obtener usuarios' });
	}
}

async function getById(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const data = await service.getById(id);
		if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });

		res.json(data);
	} catch (error) {
		console.error('[usuario.getById]', error.message);
		res.status(500).json({ error: 'Error al obtener usuario' });
	}
}

async function create(req, res) {
	try {
		const { id_grupo, nombre_completo, correo, telefono, rol, activo } = req.body;

		if (!nombre_completo || !nombre_completo.trim()) {
			return res.status(400).json({ error: 'El campo "nombre_completo" es obligatorio' });
		}

		const data = await service.create({
			id_grupo: id_grupo ? parseInt(id_grupo, 10) : null,
			nombre_completo: nombre_completo.trim().toUpperCase(),
			correo: correo ? correo.trim().toLowerCase() : null,
			telefono: telefono ? telefono.trim() : null,
			rol: rol ? rol.trim().toUpperCase() : 'OPERADOR',
			activo: activo ? activo.trim().toUpperCase() : 'SI',
		});

		res.status(201).json(data);
	} catch (error) {
		console.error('[usuario.create]', error.message);
		res.status(500).json({ error: 'Error al crear usuario' });
	}
}

async function update(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		const { id_grupo, nombre_completo, correo, telefono, rol, activo } = req.body;

		if (!nombre_completo || !nombre_completo.trim()) {
			return res.status(400).json({ error: 'El campo "nombre_completo" es obligatorio' });
		}
		if (!rol || !rol.trim()) {
			return res.status(400).json({ error: 'El campo "rol" es obligatorio' });
		}
		if (!activo || !activo.trim()) {
			return res.status(400).json({ error: 'El campo "activo" es obligatorio' });
		}

		const data = await service.update(id, {
			id_grupo: id_grupo ? parseInt(id_grupo, 10) : null,
			nombre_completo: nombre_completo.trim().toUpperCase(),
			correo: correo ? correo.trim().toLowerCase() : null,
			telefono: telefono ? telefono.trim() : null,
			rol: rol.trim().toUpperCase(),
			activo: activo.trim().toUpperCase(),
		});

		res.json(data);
	} catch (error) {
		console.error('[usuario.update]', error.message);
		if (error.message === 'Usuario no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al actualizar usuario' });
	}
}

async function remove(req, res) {
	try {
		const id = parseInt(req.params.id, 10);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalido' });

		await service.remove(id);
		res.json({ message: 'Usuario eliminado correctamente' });
	} catch (error) {
		console.error('[usuario.remove]', error.message);
		if (error.message === 'Usuario no encontrado') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Error al eliminar usuario' });
	}
}

module.exports = { getAll, getById, create, update, remove };
