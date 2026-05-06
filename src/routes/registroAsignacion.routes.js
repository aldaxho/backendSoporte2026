// src/routes/registroAsignacion.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/registroAsignacion.controller');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

module.exports = router;
