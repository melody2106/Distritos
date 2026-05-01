const express = require('express');
const cors = require('cors');
const distritoRoutes = require('./src/routes/distritoRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/distritos', distritoRoutes);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});