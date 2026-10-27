/**
 * Cálculo de los gastos de envío de la tienda.
 *
 * Funciona, pero cada tipo de envío nuevo obliga a modificar calcularGastosEnvio.
 * Hay que refactorizarlo (ver ENUNCIADO.md).
 */

/** Zonas a las que se envía. */
export const ZONAS = ['peninsula', 'baleares', 'canarias'];

/**
 * Pedido de la tienda.
 * @typedef {object} Pedido
 * @property {string} tipoEnvio `'estandar'`, `'urgente'` o `'recogida'`.
 * @property {string} zona Una de ZONAS.
 * @property {number} peso Peso en kg.
 * @property {number} importe Importe de los productos, en euros.
 */

/**
 * Gastos de envío de un pedido.
 *
 * @param {Pedido} pedido
 * @returns {number} Gastos en euros, redondeados a céntimos.
 * @throws {Error} Si la zona o el tipo de envío no existen.
 */
export function calcularGastosEnvio(pedido) {
  if (!ZONAS.includes(pedido.zona)) {
    throw new Error(`Zona desconocida: ${pedido.zona}`);
  }
  switch (pedido.tipoEnvio) {
    case 'estandar':
      if (pedido.importe >= 50) return 0;
      if (pedido.zona === 'peninsula') return 4.95;
      if (pedido.zona === 'baleares') return 9.95;
      return 14.95;
    case 'urgente': {
      let coste = 9.95 + pedido.peso * 1.2;
      if (pedido.zona !== 'peninsula') {
        coste = coste * 2;
      }
      return Math.round(coste * 100) / 100;
    }
    case 'recogida':
      return 0;
    default:
      throw new Error(`Tipo de envío desconocido: ${pedido.tipoEnvio}`);
  }
}

/**
 * Importe total de un pedido: productos más gastos de envío.
 *
 * @param {Pedido} pedido
 * @returns {number} Total en euros, redondeado a céntimos.
 * @throws {Error} Si la zona o el tipo de envío no existen.
 */
export function calcularTotal(pedido) {
  return Math.round((pedido.importe + calcularGastosEnvio(pedido)) * 100) / 100;
}
