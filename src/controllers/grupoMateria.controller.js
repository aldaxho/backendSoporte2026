const service = require('../services/grupoMateria.service');

async function getAll(req, res) {
  try {
    const idMateria = req.query.id_materia ? parseInt(req.query.id_materia, 10) : null;
    if (req.query.id_materia && Number.isNaN(idMateria)) {
      return res.status(400).json({ error: 'El filtro "id_materia" debe ser numerico' });
    }

    const data = await service.getAll({
      search: req.query.search ? req.query.search.trim() : null,
      id_materia: idMateria,
      activo: req.query.activo ? req.query.activo.trim() : null,
    });
    res.json(data);
  } catch (error) {
    console.error('[grupoMateria.getAll]', error.message);
    res.status(500).json({ error: 'Error al obtener grupos de materia' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const data = await service.getById(id);
    if (!data) return res.status(404).json({ error: 'Grupo de materia no encontrado' });

    res.json(data);
  } catch (error) {
    console.error('[grupoMateria.getById]', error.message);
    res.status(500).json({ error: 'Error al obtener grupo de materia' });
  }
}

async function create(req, res) {
  try {
    const { id_materia, grupo, docente, gestion, periodo, cantidad_estudiantes, activo } = req.body;

    if (!id_materia || Number.isNaN(parseInt(id_materia, 10))) {
      return res.status(400).json({ error: 'El campo "id_materia" es obligatorio y numerico' });
    }
    if (!grupo || !grupo.trim()) return res.status(400).json({ error: 'El campo "grupo" es obligatorio' });

    const data = await service.create({
      id_materia: parseInt(id_materia, 10),
      grupo: grupo.trim().toUpperCase(),
      docente:      docente ? docente.trim().toUpperCase() : null,
      gestion: gestion ? gestion.trim().toUpperCase() : null,
      periodo: periodo ? periodo.trim().toUpperCase() : null,
      cantidad_estudiantes: cantidad_estudiantes !== undefined && cantidad_estudiantes !== null
        ? parseInt(cantidad_estudiantes, 10)
        : null,
      activo: activo ? activo.trim().toUpperCase() : 'SI',
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('[grupoMateria.create]', error.message);
    res.status(500).json({ error: 'Error al crear grupo de materia' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { id_materia, grupo, docente, gestion, periodo, cantidad_estudiantes, activo } = req.body;

    if (!id_materia || Number.isNaN(parseInt(id_materia, 10))) {
      return res.status(400).json({ error: 'El campo "id_materia" es obligatorio y numerico' });
    }
    if (!grupo || !grupo.trim()) return res.status(400).json({ error: 'El campo "grupo" es obligatorio' });
    if (!activo || !activo.trim()) return res.status(400).json({ error: 'El campo "activo" es obligatorio' });

    const data = await service.update(id, {
      id_materia: parseInt(id_materia, 10),
      grupo: grupo.trim().toUpperCase(),
      docente:      docente ? docente.trim().toUpperCase() : null,
      gestion: gestion ? gestion.trim().toUpperCase() : null,
      periodo: periodo ? periodo.trim().toUpperCase() : null,
      cantidad_estudiantes: cantidad_estudiantes !== undefined && cantidad_estudiantes !== null
        ? parseInt(cantidad_estudiantes, 10)
        : null,
      activo: activo.trim().toUpperCase(),
    });

    res.json(data);
  } catch (error) {
    console.error('[grupoMateria.update]', error.message);
    if (error.message === 'Grupo de materia no encontrado') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error al actualizar grupo de materia' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    await service.remove(id);
    res.json({ message: 'Grupo de materia eliminado correctamente' });
  } catch (error) {
    console.error('[grupoMateria.remove]', error.message);
    if (error.message === 'Grupo de materia no encontrado') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error al eliminar grupo de materia' });
  }
}

module.exports = { getAll, getById, create, update, remove };
