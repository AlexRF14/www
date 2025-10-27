const os = require('os');
const fs = require('fs');

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