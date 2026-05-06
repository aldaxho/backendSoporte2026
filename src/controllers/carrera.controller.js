const service = require('../services/carrera.service');

async function getAll(req, res) {
  try {
    const data = await service.getAll({
      search: req.query.search ? req.query.search.trim() : null,
    });
    res.json(data);
  } catch (error) {
    console.error('[carrera.getAll]', error.message);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const data = await service.getById(id);
    if (!data) return res.status(404).json({ error: 'Carrera no encontrada' });

    res.json(data);
  } catch (error) {
    console.error('[carrera.getById]', error.message);
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
}

async function create(req, res) {
  try {
    const { nombre, sigla } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }

    const data = await service.create({
      nombre: nombre.trim().toUpperCase(),
      sigla: sigla && sigla.trim() ? sigla.trim().toUpperCase() : null,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('[carrera.create]', error.message);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { nombre, sigla } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }

    const data = await service.update(id, {
      nombre: nombre.trim().toUpperCase(),
      sigla: sigla && sigla.trim() ? sigla.trim().toUpperCase() : null,
    });

    res.json(data);
  } catch (error) {
    console.error('[carrera.update]', error.message);
    if (error.message === 'Carrera no encontrada') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al actualizar carrera' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    await service.remove(id);
    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (error) {
    console.error('[carrera.remove]', error.message);
    if (error.message === 'Carrera no encontrada') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
}

module.exports = { getAll, getById, create, update, remove };
