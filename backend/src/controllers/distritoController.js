const DistritoModel = require('../models/distritoModel');

const DistritoController = {

  async index(req, res) {
    try {
      const page  = parseInt(req.query.page)   || 1;
      const limit = parseInt(req.query.limit)  || 8;
      const search = req.query.search          || '';

      const data = await DistritoModel.getAll({ page, limit, search });

      res.json({
        success: true,
        data: data.rows,
        total: data.total,
        totalPages: data.totalPages,
        currentPage: page
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async show(req, res) {
    try {
      const distrito = await DistritoModel.getById(req.params.id);
      if (!distrito) return res.status(404).json({ success: false, message: 'No encontrado' });
      res.json({ success: true, data: distrito });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async store(req, res) {
    try {
      const { nom_dis, cod_postal, supervisor, poblacion } = req.body;
      if (!nom_dis || !cod_postal || !supervisor || !poblacion)
        return res.status(400).json({ success: false, message: 'Campos requeridos' });

      const id = await DistritoModel.create({ nom_dis, cod_postal, supervisor, poblacion });
      res.status(201).json({ success: true, id });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { nom_dis, cod_postal, supervisor, poblacion } = req.body;
      const affected = await DistritoModel.update(req.params.id, { nom_dis, cod_postal, supervisor, poblacion });
      if (!affected) return res.status(404).json({ success: false, message: 'No encontrado' });
      res.json({ success: true, message: 'Actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const affected = await DistritoModel.remove(req.params.id);
      if (!affected) return res.status(404).json({ success: false, message: 'No encontrado' });
      res.json({ success: true, message: 'Eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

};

module.exports = DistritoController;