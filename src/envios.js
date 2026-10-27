/**
 * Cálculo de los gastos de envío de la tienda.
 *
 * Es el contexto del patrón Strategy: valida el pedido y delega el cálculo en una estrategia de
 * envío. No sabe qué tipos de envío existen; eso lo decide la fábrica.
 * @module envios
 */

import { crearEstrategiaEnvio } from './fabrica.js';

/** Zonas a las que se envía. */
export const ZONAS = ['peninsula', 'baleares', 'canarias'];

/**
 * Pedido de la tienda.
 * @typedef {object} Pedido
 * @property {string} tipoEnvio Uno de `TIPOS_ENVIO` (por ejemplo, `'estandar'`, `'urgente'`, `'recogida'` o `'punto'`).
 * @property {string} zona Una de ZONAS.
 * @property {number} peso Peso en kg.
 * @property {number} importe Importe de los productos, en euros.
 */

/**
 * Gastos de envío de un pedido.
 *
 * @param {Pedido} pedido
 * @param {import('./estrategias.js').EstrategiaEnvio} [estrategia] Estrategia con la que calcular; si no se
 *   indica, la que crea la fábrica a partir de `pedido.tipoEnvio`.
 * @returns {number} Gastos en euros, redondeados a céntimos.
 * @throws {Error} Si la zona o el tipo de envío no existen.
 */
export function calcularGastosEnvio(pedido, estrategia) {
  if (!ZONAS.includes(pedido.zona)) {
    throw new Error(`Zona desconocida: ${pedido.zona}`);
  }
  return (estrategia ?? crearEstrategiaEnvio(pedido.tipoEnvio)).calcular(pedido);
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
