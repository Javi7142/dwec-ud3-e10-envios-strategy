// E10 · Fábrica de estrategias de envío (patrón Factory)
// TODO: exporta TIPOS_ENVIO y crearEstrategiaEnvio(tipo) según el contrato del enunciado.

/** @type {string[]} */
export const TIPOS_ENVIO = [];

/**
 * @param {string} tipo
 * @returns {object}
 */
export function crearEstrategiaEnvio(tipo) {
  throw new Error(`Sin programar: ${tipo}`);
}
