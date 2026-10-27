// Tests de la fábrica. Los de crearEstrategiaEnvio y TIPOS_ENVIO son UNITARIOS; los del último
// describe son de INTEGRACIÓN: usan el contexto, la fábrica y las estrategias reales a la vez.
import { describe, it, expect } from 'vitest';
import { crearEstrategiaEnvio, TIPOS_ENVIO } from '../src/fabrica.js';
import {
  EnvioEstandar,
  EnvioUrgente,
  RecogidaEnTienda,
  EntregaEnPunto,
} from '../src/estrategias.js';
import { calcularGastosEnvio, calcularTotal } from '../src/envios.js';

describe('crearEstrategiaEnvio', () => {
  it.each([
    ['estandar', EnvioEstandar],
    ['urgente', EnvioUrgente],
    ['recogida', RecogidaEnTienda],
    ['punto', EntregaEnPunto],
  ])('crea una instancia de la clase que corresponde al tipo «%s»', (tipo, Clase) => {
    expect(crearEstrategiaEnvio(tipo)).toBeInstanceOf(Clase);
  });

  it('devuelve una instancia nueva en cada llamada', () => {
    expect(crearEstrategiaEnvio('estandar')).not.toBe(crearEstrategiaEnvio('estandar'));
  });

  it('lanza un error con un tipo desconocido', () => {
    expect(() => crearEstrategiaEnvio('dron')).toThrow('Tipo de envío desconocido: dron');
  });

  it.each(['constructor', 'toString', '', undefined])(
    'lanza un error con el tipo %s, que no está en el registro',
    (tipo) => {
      expect(() => crearEstrategiaEnvio(tipo)).toThrow('Tipo de envío desconocido');
    },
  );
});

describe('TIPOS_ENVIO', () => {
  it('lista los tipos disponibles en el orden del registro', () => {
    expect(TIPOS_ENVIO).toEqual(['estandar', 'urgente', 'recogida', 'punto']);
  });

  it('todos los tipos listados se pueden crear', () => {
    TIPOS_ENVIO.forEach((tipo) => {
      expect(() => crearEstrategiaEnvio(tipo)).not.toThrow();
    });
  });
});

describe('integración: calcularGastosEnvio con estrategias de la fábrica', () => {
  const pedido = (datos) => ({
    tipoEnvio: 'punto',
    zona: 'peninsula',
    peso: 2,
    importe: 25,
    ...datos,
  });

  it('calcula el tipo nuevo «punto» sin que envios.js lo conozca', () => {
    expect(calcularGastosEnvio(pedido())).toBe(2.95);
    expect(calcularGastosEnvio(pedido({ zona: 'baleares' }))).toBe(5.95);
    expect(calcularGastosEnvio(pedido({ zona: 'canarias' }))).toBe(5.95);
  });

  it('el envío en punto es gratis justo desde 30 €', () => {
    expect(calcularGastosEnvio(pedido({ importe: 30 }))).toBe(0);
    expect(calcularGastosEnvio(pedido({ importe: 29.99 }))).toBe(2.95);
  });

  it('usa la estrategia que se le pasa en lugar de la del tipo del pedido', () => {
    const urgente = crearEstrategiaEnvio('urgente');
    expect(calcularGastosEnvio(pedido({ tipoEnvio: 'recogida', peso: 2 }), urgente)).toBe(12.35);
  });

  it('calcula el total con el tipo nuevo', () => {
    expect(calcularTotal(pedido({ importe: 25 }))).toBe(27.95);
  });

  it('valida la zona antes de usar la estrategia', () => {
    expect(() => calcularGastosEnvio(pedido({ zona: 'luna' }))).toThrow('Zona desconocida: luna');
  });

  it('lanza el error de la fábrica con un tipo desconocido', () => {
    expect(() => calcularGastosEnvio(pedido({ tipoEnvio: 'dron' }))).toThrow(
      'Tipo de envío desconocido: dron',
    );
  });
});
