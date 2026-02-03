// index.js — servidor Express

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const cors = require('cors')

app.use(cors())




// Fala pro express usar json nas rotas
app.use(express.json())

// Serve arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'frontend/public')))


// // Importa as rotas do arquivo teste.js
const routes = require('./backend/routes/routergeral.js');
const bd = require('./backend/config/db.js');

// Usa as rotas importadas
app.use(routes);




// sobe o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
