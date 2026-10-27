// Tests del comportamiento ACTUAL de los gastos de envío.
// Son la red de seguridad de la refactorización: deben pasar antes, durante y después.
// No los modifiques: añade los tuyos en otros ficheros.
import { describe, it, expect } from 'vitest';
import { calcularGastosEnvio, calcularTotal } from '../src/envios.js';

const pedido = (datos) => ({
  tipoEnvio: 'estandar',
  zona: 'peninsula',
  peso: 1,
  importe: 20,
  ...datos,
});

describe('calcularGastosEnvio', () => {
  it.each([
    ['peninsula', 4.95],
    ['baleares', 9.95],
    ['canarias', 14.95],
  ])('envío estándar a %s por debajo de 50 €: %d €', (zona, esperado) => {
    expect(calcularGastosEnvio(pedido({ zona }))).toBe(esperado);
  });

  it('envío estándar gratis desde 50 €', () => {
    expect(calcularGastosEnvio(pedido({ importe: 50 }))).toBe(0);
    expect(calcularGastosEnvio(pedido({ importe: 49.99 }))).toBe(4.95);
  });

  it('envío urgente: fijo más un precio por kilo', () => {
    expect(calcularGastosEnvio(pedido({ tipoEnvio: 'urgente', peso: 2 }))).toBe(12.35);
    expect(calcularGastosEnvio(pedido({ tipoEnvio: 'urgente', peso: 0 }))).toBe(9.95);
  });

  it('envío urgente fuera de la península: el doble', () => {
    expect(calcularGastosEnvio(pedido({ tipoEnvio: 'urgente', zona: 'canarias', peso: 2 }))).toBe(
      24.7,
    );
  });

  it('recogida en tienda: gratis', () => {
    expect(
      calcularGastosEnvio(pedido({ tipoEnvio: 'recogida', zona: 'canarias', importe: 5 })),
    ).toBe(0);
  });

  it('lanza un error con un tipo de envío o una zona desconocidos', () => {
    expect(() => calcularGastosEnvio(pedido({ tipoEnvio: 'dron' }))).toThrow(
      'Tipo de envío desconocido: dron',
    );
    expect(() => calcularGastosEnvio(pedido({ zona: 'luna' }))).toThrow('Zona desconocida: luna');
  });
});

describe('calcularTotal', () => {
  it('suma los productos y el envío', () => {
    expect(calcularTotal(pedido({ importe: 35 }))).toBe(39.95);
  });
});
