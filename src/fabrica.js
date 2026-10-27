// E10 · Fábrica de estrategias de envío (patrón Factory)

/**
 * Punto único de creación de las estrategias de envío.
 * @module fabrica
 */

import { EnvioEstandar, EnvioUrgente, RecogidaEnTienda, EntregaEnPunto } from './estrategias.js';

/**
 * Registro de tipos de envío: tipo → clase de la estrategia. Es la única lista que hay que
 * ampliar para ofrecer un tipo nuevo; `TIPOS_ENVIO` y `crearEstrategiaEnvio` salen de aquí.
 * Es un `Map` y no un objeto para que tipos como `'constructor'` no se confundan con claves heredadas.
 *
 * @type {Map<string, new () => import('./estrategias.js').EstrategiaEnvio>}
 */
const REGISTRO = new Map([
  ['estandar', EnvioEstandar],
  ['urgente', EnvioUrgente],
  ['recogida', RecogidaEnTienda],
  ['punto', EntregaEnPunto],
]);

/**
 * Tipos de envío disponibles, calculados a partir del registro.
 *
 * @type {string[]}
 */
export const TIPOS_ENVIO = [...REGISTRO.keys()];

/**
 * Crea una estrategia nueva del tipo indicado.
 *
 * @param {string} tipo Tipo de envío, uno de `TIPOS_ENVIO`.
 * @returns {import('./estrategias.js').EstrategiaEnvio} Una instancia nueva de la estrategia.
 * @throws {Error} Si el tipo no existe.
 * @example
 * crearEstrategiaEnvio('urgente').nombre; // 'Urgente'
 */
export function crearEstrategiaEnvio(tipo) {
  const Estrategia = REGISTRO.get(tipo);
  if (Estrategia === undefined) {
    throw new Error(`Tipo de envío desconocido: ${tipo}`);
  }
  return new Estrategia();
}
