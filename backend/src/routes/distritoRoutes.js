const express = require('express');
const router = express.Router();
const DistritoController = require('../controllers/distritoController');

router.get('/', DistritoController.index);
router.get('/:id', DistritoController.show);
router.post('/', DistritoController.store);
router.put('/:id', DistritoController.update);
router.delete('/:id', DistritoController.destroy);

module.exports = router;