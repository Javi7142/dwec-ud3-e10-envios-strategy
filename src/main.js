// E10 · Programa principal. No modifiques este fichero.
// No funcionará hasta que existan la fábrica y las estrategias (ver ENUNCIADO.md).
import { calcularGastosEnvio, calcularTotal } from './envios.js';
import { crearEstrategiaEnvio, TIPOS_ENVIO } from './fabrica.js';

const pedidos = [
  { id: 1, tipoEnvio: 'estandar', zona: 'peninsula', peso: 2, importe: 35 },
  { id: 2, tipoEnvio: 'estandar', zona: 'canarias', peso: 1, importe: 60 },
  { id: 3, tipoEnvio: 'urgente', zona: 'peninsula', peso: 3.5, importe: 80 },
  { id: 4, tipoEnvio: 'urgente', zona: 'baleares', peso: 1, importe: 20 },
  { id: 5, tipoEnvio: 'recogida', zona: 'canarias', peso: 10, importe: 15 },
  { id: 6, tipoEnvio: 'punto', zona: 'peninsula', peso: 2, importe: 25 },
  { id: 7, tipoEnvio: 'punto', zona: 'baleares', peso: 2, importe: 30 },
  { id: 8, tipoEnvio: 'dron', zona: 'peninsula', peso: 1, importe: 10 },
];

console.log(`🚚 Tipos de envío: ${TIPOS_ENVIO.join(', ')}`);
for (const pedido of pedidos) {
  try {
    const { nombre } = crearEstrategiaEnvio(pedido.tipoEnvio);
    const envio = calcularGastosEnvio(pedido).toFixed(2).padStart(6);
    const total = calcularTotal(pedido).toFixed(2).padStart(7);
    console.log(
      `#${pedido.id} ${nombre.padEnd(18)} ${pedido.zona.padEnd(9)} envío ${envio} € · total ${total} €`,
    );
  } catch (error) {
    console.log(`#${pedido.id} ❌ ${error.message}`);
  }
}

const mismoPedido = { tipoEnvio: 'estandar', zona: 'baleares', peso: 4, importe: 40 };
console.log('⚖️ El mismo pedido con cada tipo de envío:');
for (const tipo of TIPOS_ENVIO) {
  const estrategia = crearEstrategiaEnvio(tipo);
  console.log(
    `   ${estrategia.nombre.padEnd(18)} ${calcularGastosEnvio(mismoPedido, estrategia).toFixed(2)} €`,
  );
}
