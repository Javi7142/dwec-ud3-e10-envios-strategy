// Tests UNITARIOS de las estrategias de envío: cada clase se prueba por separado, sin la fábrica
// ni el contexto (calcularGastosEnvio).
import { describe, it, expect } from 'vitest';
import {
  EstrategiaEnvio,
  EnvioEstandar,
  EnvioUrgente,
  RecogidaEnTienda,
  EntregaEnPunto,
} from '../src/estrategias.js';

const pedido = (datos) => ({ tipoEnvio: 'x', zona: 'peninsula', peso: 1, importe: 20, ...datos });

describe('EstrategiaEnvio', () => {
  it('lanza un error si una subclase no sobrescribe el getter nombre', () => {
    class SinNombre extends EstrategiaEnvio {}
    expect(() => new SinNombre().nombre).toThrow('SinNombre debe sobrescribir el getter nombre');
  });

  it('lanza un error si una subclase no sobrescribe calcular', () => {
    class SinCalcular extends EstrategiaEnvio {}
    expect(() => new SinCalcular().calcular(pedido())).toThrow(
      'SinCalcular debe sobrescribir calcular(pedido)',
    );
  });
});

describe('EnvioEstandar', () => {
  it('se llama «Estándar»', () => {
    expect(new EnvioEstandar().nombre).toBe('Estándar');
  });

  it.each([
    ['peninsula', 4.95],
    ['baleares', 9.95],
    ['canarias', 14.95],
  ])('a %s por debajo del importe gratuito cuesta %d €', (zona, esperado) => {
    expect(new EnvioEstandar().calcular(pedido({ zona }))).toBe(esperado);
  });

  it('es gratis justo en el importe mínimo (50 €) y cuesta 1 céntimo por debajo', () => {
    const estrategia = new EnvioEstandar();
    expect(estrategia.calcular(pedido({ importe: EnvioEstandar.GRATIS_DESDE }))).toBe(0);
    expect(estrategia.calcular(pedido({ importe: 49.99 }))).toBe(4.95);
  });

  it('es gratis aunque el importe supere el mínimo y la zona sea cara', () => {
    expect(new EnvioEstandar().calcular(pedido({ importe: 500, zona: 'canarias' }))).toBe(0);
  });

  it('lanza un error con una zona desconocida', () => {
    expect(() => new EnvioEstandar().calcular(pedido({ zona: 'luna' }))).toThrow(
      'Zona desconocida: luna',
    );
  });
});

describe('EnvioUrgente', () => {
  it('se llama «Urgente»', () => {
    expect(new EnvioUrgente().nombre).toBe('Urgente');
  });

  it('con peso 0 cuesta solo el fijo', () => {
    expect(new EnvioUrgente().calcular(pedido({ peso: 0 }))).toBe(9.95);
  });

  it('suma el precio por kilo al fijo en la península', () => {
    expect(new EnvioUrgente().calcular(pedido({ peso: 2 }))).toBe(12.35);
  });

  it.each([
    ['baleares', 24.7],
    ['canarias', 24.7],
  ])('en %s cuesta el doble: %d €', (zona, esperado) => {
    expect(new EnvioUrgente().calcular(pedido({ zona, peso: 2 }))).toBe(esperado);
  });

  it('no depende del importe del pedido (nunca es gratis)', () => {
    expect(new EnvioUrgente().calcular(pedido({ importe: 1000, peso: 0 }))).toBe(9.95);
  });

  it('redondea a céntimos', () => {
    // 9.95 + 3.5 * 1.2 = 14.15 en coma flotante: 14.149999999999999
    expect(new EnvioUrgente().calcular(pedido({ peso: 3.5 }))).toBe(14.15);
  });
});

describe('RecogidaEnTienda', () => {
  it('se llama «Recogida en tienda»', () => {
    expect(new RecogidaEnTienda().nombre).toBe('Recogida en tienda');
  });

  it.each(['peninsula', 'baleares', 'canarias'])('es gratis en %s', (zona) => {
    expect(new RecogidaEnTienda().calcular(pedido({ zona }))).toBe(0);
  });

  it('es gratis aunque el pedido pese mucho y el importe sea pequeño', () => {
    expect(new RecogidaEnTienda().calcular(pedido({ peso: 500, importe: 0.01 }))).toBe(0);
  });
});

describe('EntregaEnPunto', () => {
  it('se llama «Punto de recogida»', () => {
    expect(new EntregaEnPunto().nombre).toBe('Punto de recogida');
  });

  it.each([
    ['peninsula', 2.95],
    ['baleares', 5.95],
    ['canarias', 5.95],
  ])('a %s por debajo del importe gratuito cuesta %d €', (zona, esperado) => {
    expect(new EntregaEnPunto().calcular(pedido({ zona }))).toBe(esperado);
  });

  it('es gratis justo en el importe mínimo (30 €) y cuesta 1 céntimo por debajo', () => {
    const estrategia = new EntregaEnPunto();
    expect(estrategia.calcular(pedido({ importe: EntregaEnPunto.GRATIS_DESDE }))).toBe(0);
    expect(estrategia.calcular(pedido({ importe: 29.99 }))).toBe(2.95);
  });

  it('no depende del peso del pedido', () => {
    expect(new EntregaEnPunto().calcular(pedido({ peso: 0 }))).toBe(2.95);
    expect(new EntregaEnPunto().calcular(pedido({ peso: 500 }))).toBe(2.95);
  });

  it('lanza un error con una zona desconocida', () => {
    expect(() => new EntregaEnPunto().calcular(pedido({ zona: 'luna' }))).toThrow(
      'Zona desconocida: luna',
    );
  });
});

describe('interfaz común de todas las estrategias', () => {
  const clases = [EnvioEstandar, EnvioUrgente, RecogidaEnTienda, EntregaEnPunto];

  it.each(clases.map((Clase) => [Clase.name, Clase]))(
    '%s hereda de EstrategiaEnvio y tiene nombre y calcular',
    (_nombreClase, Clase) => {
      const estrategia = new Clase();
      expect(estrategia).toBeInstanceOf(EstrategiaEnvio);
      expect(typeof estrategia.nombre).toBe('string');
      expect(estrategia.nombre).not.toBe('');
      expect(typeof estrategia.calcular).toBe('function');
    },
  );

  it.each(clases.map((Clase) => [Clase.name, Clase]))(
    '%s devuelve un número redondeado a céntimos',
    (_nombreClase, Clase) => {
      const gastos = new Clase().calcular(pedido({ peso: 3.7, importe: 10 }));
      expect(typeof gastos).toBe('number');
      expect(Math.round(gastos * 100) / 100).toBe(gastos);
    },
  );

  it('cada estrategia tiene un nombre distinto', () => {
    const nombres = clases.map((Clase) => new Clase().nombre);
    expect(new Set(nombres).size).toBe(clases.length);
  });
});
