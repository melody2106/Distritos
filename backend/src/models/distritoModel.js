const db = require('../config/db');

const DistritoModel = {
  async getAll({ page, limit, search }) {
    const offset = (page - 1) * limit;
    
    const [results] = await db.query('CALL sp_get_distritos(?, ?, ?, ?)', [search || '', limit, offset]);

    const rows = results[0]; 
    
    const total = results[1][0].total; 
    
    const totalPages = Math.ceil(total / limit);

    return { rows, total, totalPages };
  },

  async getById(id) {
    const [rows] = await db.query('CALL sp_get_distrito_by_id(?)', [id]);
    return rows[0][0];
  },

  async create({ nom_dis, cod_postal, supervisor, poblacion }) {
    const [result] = await db.query(
      'CALL sp_insert_distrito(?, ?, ?, ?)',
      [nom_dis, cod_postal, supervisor, poblacion]
    );
    return result; 
  },

  async update(id, { nom_dis, cod_postal, supervisor, poblacion }) {
    const [result] = await db.query(
      'CALL sp_update_distrito(?, ?, ?, ?)',
      [id, nom_dis, cod_postal, supervisor, poblacion]
    );
    return result.affectedRows;
  },

  async remove(id) {
    const [result] = await db.query('CALL sp_delete_distrito(?)', [id]);
    return result.affectedRows;
  }

};

module.exports = DistritoModel;