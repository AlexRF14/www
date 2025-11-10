const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const { url, intervalSeconds } = config;

const dataFile = path.join(__dirname, 'data', 'registros.json');
fs.mkdirSync(path.dirname(dataFile), { recursive: true });

let registros = [];
if (fs.existsSync(dataFile)) {
  registros = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// --- Scraping ---
async function realizarScraping() {
  try {
    console.log(`🕵️ Descargando HTML de ${url}...`);
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);

    const titulos = [];
    $('span.text').each((i, el) => {
    titulos.push($(el).text());
    });

    const registro = {
      fecha: new Date().toISOString(),
      cantidad: titulos.length,
      titulos: titulos.slice(0, 5)
    };

    registros.push(registro);
    fs.writeFileSync(dataFile, JSON.stringify(registros, null, 2));

    console.log(`✅ Scraping completado. ${titulos.length} elementos encontrados.`);
  } catch (err) {
    console.error('❌ Error en el scraping:', err.message);
  }
}

setInterval(realizarScraping, intervalSeconds * 1000);
realizarScraping();

// --- Servidor ---
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (req.url === '/registros.json') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(registros));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}/`));