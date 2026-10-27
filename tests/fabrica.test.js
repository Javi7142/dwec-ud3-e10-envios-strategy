// Tests de la fábrica. Los de crearEstrategiaEnvio y TIPOS_ENVIO son UNITARIOS.
import { describe, it, expect } from 'vitest';
import { crearEstrategiaEnvio, TIPOS_ENVIO } from '../src/fabrica.js';
import { EnvioEstandar, EnvioUrgente, RecogidaEnTienda } from '../src/estrategias.js';

describe('crearEstrategiaEnvio', () => {
  it.each([
    ['estandar', EnvioEstandar],
    ['urgente', EnvioUrgente],
    ['recogida', RecogidaEnTienda],
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
    expect(TIPOS_ENVIO).toEqual(['estandar', 'urgente', 'recogida']);
  });

  it('todos los tipos listados se pueden crear', () => {
    TIPOS_ENVIO.forEach((tipo) => {
      expect(() => crearEstrategiaEnvio(tipo)).not.toThrow();
    });
  });
});
