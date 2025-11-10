const http = require('http');
const os = require('os');
const fs = require('fs');
const url = require('url');
const path = require('path');;

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const interval = config.intervalSeconds * 1000;

console.log('=== Servidor Node.js iniciado ===');
console.log(`Versión de Node.js: ${process.version}`);
console.log(`Sistema operativo: ${os.type()} ${os.release()} (${os.platform()})`);
console.log(`CPU: ${os.cpus()[0].model}`);
console.log(`Número de núcleos: ${os.cpus().length}`);
console.log(`Memoria total: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
console.log('---------------------------------');

const startTime = Date.now();

// Función para mostrar información periódica
function mostrarInfo() {
  const usoCPU = os.loadavg(); // carga promedio de CPU en 1, 5 y 15 minutos
  const memoriaLibre = os.freemem();
  const memoriaTotal = os.totalmem();
  const usoMemoria = ((1 - memoriaLibre / memoriaTotal) * 100).toFixed(2);
  const tiempoActivo = os.uptime();
  const tiempoNode = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n--- Información del sistema ---');
  console.log(`Uso de CPU (promedio): ${usoCPU.map(n => n.toFixed(2)).join(', ')}`);
  console.log(`Uso de memoria: ${usoMemoria}%`);
  console.log(`Sistema activo desde: ${tiempoActivo.toFixed(2)} s`);
  console.log(`Node.js activo desde: ${tiempoNode} s`);
  console.log('-------------------------------');
}

setInterval(mostrarInfo, interval);

function loadDictionary() {
  const dictPath = path.join(__dirname, 'dictionary.txt');
  if (fs.existsSync(dictPath)) {
    const content = fs.readFileSync(dictPath, 'utf8');
    const words = content.split(/\r?\n/).map(w => w.trim()).filter(Boolean);
    if (words.length > 0) return words;
  }
  return [
    'gato','perro','sol','luna','casa','árbol','río','montaña','puerta','ventana',
    'coche','libro','pluma','silla','mesa','camino','mar','cielo','nube','fuego'
  ];
}
const DICTIONARY = loadDictionary();

function generatePasswordFromWords(x) {
  const words = DICTIONARY;
  const n = Math.max(1, Math.min(20, x)); // límite: 1 ~ 20
  const parts = [];
  for (let i = 0; i < n; i++) {
    const w = words[Math.floor(Math.random() * words.length)];
    parts.push(w);
  }
  const separator = '-';
  return parts.join(separator);
}

// --- Servidor HTTP ---
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    const rawX = parsed.query.x;
    const parsedX = parseInt(rawX, 10);
    const x = (!isNaN(parsedX) && parsedX > 0) ? parsedX : 4;

    const password = generatePasswordFromWords(x);
    const htmlPath = path.join(__dirname, 'index.html');

    fs.readFile(htmlPath, 'utf-8', (err, htmlTemplate) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Error interno al cargar index.html');
      }

      const html = htmlTemplate
        .replace('{{password}}', password)
        .replace('{{x}}', x);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor web escuchando en http://localhost:${PORT}/ (usa /?x=5 para probar)`);
});