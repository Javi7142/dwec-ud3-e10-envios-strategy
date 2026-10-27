// E10 · Estrategias de envío (patrón Strategy)

/**
 * Estrategias de cálculo de los gastos de envío: una clase por tipo de envío, todas con la misma
 * interfaz (el getter `nombre` y el método `calcular(pedido)`).
 * @module estrategias
 */

/** @import { Pedido } from './envios.js' */

/**
 * Redondea un importe a céntimos.
 *
 * @param {number} importe
 * @returns {number}
 */
const aCentimos = (importe) => Math.round(importe * 100) / 100;

/**
 * Busca el precio de una zona en una tabla de precios.
 *
 * @param {Record<string, number>} precios Tabla zona → precio.
 * @param {string} zona
 * @returns {number}
 * @throws {Error} Si la zona no está en la tabla.
 */
function precioDeZona(precios, zona) {
  if (!Object.hasOwn(precios, zona)) {
    throw new Error(`Zona desconocida: ${zona}`);
  }
  return precios[zona];
}

/**
 * Superclase de las estrategias de envío. JavaScript no tiene interfaces ni clases abstractas:
 * esta clase define el contrato y lanza un error si una subclase no lo cumple.
 *
 * @abstract
 */
export class EstrategiaEnvio {
  /**
   * Nombre legible del tipo de envío.
   *
   * @type {string}
   * @throws {Error} Si la subclase no lo sobrescribe.
   */
  get nombre() {
    throw new Error(`${this.constructor.name} debe sobrescribir el getter nombre`);
  }

  /**
   * Calcula los gastos de envío de un pedido.
   *
   * @param {Pedido} pedido
   * @returns {number} Gastos en euros, redondeados a céntimos.
   * @throws {Error} Si la subclase no lo sobrescribe.
   */
  // eslint-disable-next-line no-unused-vars -- el parámetro documenta el contrato
  calcular(pedido) {
    throw new Error(`${this.constructor.name} debe sobrescribir calcular(pedido)`);
  }
}

/**
 * Envío estándar: precio fijo por zona y gratis a partir de un importe.
 *
 * @example
 * new EnvioEstandar().calcular({ zona: 'peninsula', importe: 20, peso: 1 }); // 4.95
 */
export class EnvioEstandar extends EstrategiaEnvio {
  /**
   * Importe de los productos desde el que el envío es gratis, en euros.
   * @type {number}
   */
  static GRATIS_DESDE = 50;

  /**
   * Precio del envío por zona, en euros.
   * @type {Record<string, number>}
   */
  static PRECIOS = { peninsula: 4.95, baleares: 9.95, canarias: 14.95 };

  /** @type {string} */
  get nombre() {
    return 'Estándar';
  }

  /**
   * @param {Pedido} pedido
   * @returns {number} 0 si el importe llega al mínimo; en otro caso, el precio de la zona.
   * @throws {Error} Si la zona no existe.
   */
  calcular(pedido) {
    if (pedido.importe >= EnvioEstandar.GRATIS_DESDE) {
      return 0;
    }
    return precioDeZona(EnvioEstandar.PRECIOS, pedido.zona);
  }
}

/**
 * Envío urgente: un fijo más un precio por kilo, y el doble fuera de la península.
 *
 * @example
 * new EnvioUrgente().calcular({ zona: 'peninsula', importe: 20, peso: 2 }); // 12.35
 */
export class EnvioUrgente extends EstrategiaEnvio {
  /**
   * Importe fijo, en euros.
   * @type {number}
   */
  static FIJO = 9.95;

  /**
   * Precio por kilo, en euros.
   * @type {number}
   */
  static PRECIO_KILO = 1.2;

  /**
   * Zona de la que no se aplica recargo.
   * @type {string}
   */
  static ZONA_BASE = 'peninsula';

  /**
   * Multiplicador del coste fuera de la zona base.
   * @type {number}
   */
  static FACTOR_FUERA_ZONA_BASE = 2;

  /** @type {string} */
  get nombre() {
    return 'Urgente';
  }

  /**
   * @param {Pedido} pedido
   * @returns {number} Fijo más precio por kilo, multiplicado por el factor fuera de la península.
   */
  calcular(pedido) {
    let coste = EnvioUrgente.FIJO + pedido.peso * EnvioUrgente.PRECIO_KILO;
    if (pedido.zona !== EnvioUrgente.ZONA_BASE) {
      coste = coste * EnvioUrgente.FACTOR_FUERA_ZONA_BASE;
    }
    return aCentimos(coste);
  }
}

/**
 * Recogida en tienda: siempre gratis.
 *
 * @example
 * new RecogidaEnTienda().calcular({ zona: 'canarias', importe: 5, peso: 10 }); // 0
 */
export class RecogidaEnTienda extends EstrategiaEnvio {
  /**
   * Gastos de la recogida en tienda, en euros.
   * @type {number}
   */
  static COSTE = 0;

  /** @type {string} */
  get nombre() {
    return 'Recogida en tienda';
  }

  /**
   * @param {Pedido} pedido
   * @returns {number} Siempre 0.
   */
  // eslint-disable-next-line no-unused-vars -- el parámetro forma parte de la interfaz común
  calcular(pedido) {
    return RecogidaEnTienda.COSTE;
  }
}

/**
 * Entrega en un punto de recogida: precio fijo por zona y gratis a partir de un importe.
 *
 * @example
 * new EntregaEnPunto().calcular({ zona: 'peninsula', importe: 25, peso: 2 }); // 2.95
 */
export class EntregaEnPunto extends EstrategiaEnvio {
  /**
   * Importe de los productos desde el que la entrega es gratis, en euros.
   * @type {number}
   */
  static GRATIS_DESDE = 30;

  /**
   * Precio de la entrega por zona, en euros.
   * @type {Record<string, number>}
   */
  static PRECIOS = { peninsula: 2.95, baleares: 5.95, canarias: 5.95 };

  /** @type {string} */
  get nombre() {
    return 'Punto de recogida';
  }

  /**
   * @param {Pedido} pedido
   * @returns {number} 0 si el importe llega al mínimo; en otro caso, el precio de la zona.
   * @throws {Error} Si la zona no existe.
   */
  calcular(pedido) {
    if (pedido.importe >= EntregaEnPunto.GRATIS_DESDE) {
      return 0;
    }
    return precioDeZona(EntregaEnPunto.PRECIOS, pedido.zona);
  }
}
