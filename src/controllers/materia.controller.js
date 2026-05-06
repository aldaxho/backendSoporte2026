const service = require('../services/materia.service');

async function getAll(req, res) {
  try {
    const idCarrera = req.query.id_carrera ? parseInt(req.query.id_carrera, 10) : null;
    if (req.query.id_carrera && Number.isNaN(idCarrera)) {
      return res.status(400).json({ error: 'El filtro "id_carrera" debe ser numerico' });
    }

    const data = await service.getAll({
      search: req.query.search ? req.query.search.trim() : null,
      id_carrera: idCarrera,
    });
    res.json(data);
  } catch (error) {
    console.error('[materia.getAll]', error.message);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const data = await service.getById(id);
    if (!data) return res.status(404).json({ error: 'Materia no encontrada' });

    res.json(data);
  } catch (error) {
    console.error('[materia.getById]', error.message);
    res.status(500).json({ error: 'Error al obtener materia' });
  }
}

async function create(req, res) {
  try {
    const { id_carrera, sigla, nombre } = req.body;

    if (id_carrera !== undefined && id_carrera !== null && Number.isNaN(parseInt(id_carrera, 10))) {
      return res.status(400).json({ error: 'El campo "id_carrera" debe ser numerico' });
    }
    if (!sigla || !sigla.trim()) return res.status(400).json({ error: 'El campo "sigla" es obligatorio' });
    if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });

    const data = await service.create({
      id_carrera: id_carrera ? parseInt(id_carrera, 10) : null,
      sigla: sigla.trim().toUpperCase(),
      nombre: nombre.trim().toUpperCase(),
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('[materia.create]', error.message);
    res.status(500).json({ error: 'Error al crear materia' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { id_carrera, sigla, nombre } = req.body;

    if (id_carrera !== undefined && id_carrera !== null && Number.isNaN(parseInt(id_carrera, 10))) {
      return res.status(400).json({ error: 'El campo "id_carrera" debe ser numerico' });
    }
    if (!sigla || !sigla.trim()) return res.status(400).json({ error: 'El campo "sigla" es obligatorio' });
    if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });

    const data = await service.update(id, {
      id_carrera: id_carrera ? parseInt(id_carrera, 10) : null,
      sigla: sigla.trim().toUpperCase(),
      nombre: nombre.trim().toUpperCase(),
    });

    res.json(data);
  } catch (error) {
    console.error('[materia.update]', error.message);
    if (error.message === 'Materia no encontrada') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    await service.remove(id);
    res.json({ message: 'Materia eliminada correctamente' });
  } catch (error) {
    console.error('[materia.remove]', error.message);
    if (error.message === 'Materia no encontrada') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
}

module.exports = { getAll, getById, create, update, remove };
