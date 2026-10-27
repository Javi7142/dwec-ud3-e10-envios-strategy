# E10 · Gastos de envío con Strategy y Factory

**Tipo:** corrección por IA

Refactoriza la calculadora de gastos de envío de una tienda con los patrones **Strategy** y **Factory**, sin cambiar su comportamiento, añade un tipo de envío nuevo sin tocar el código que calcula los gastos y justifica el diseño.

**CE:** RA4 f, i, j, k

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. Como los ejercicios de la UD2 con dependencias de npm, **construye su imagen** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (UD2, tema 9, apartado 9.3.2). Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda algo más, porque descarga la imagen y la construye. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

Ejecuta los programas en la terminal de VS Code, que ya es la del contenedor.

## Punto de partida

```text
├── package.json           ← scripts start, test, lint, format y format:check
├── eslint.config.js       ← configuración del curso (no se modifica)
├── .prettierrc
├── src/
│   ├── envios.js          ← calcularGastosEnvio con un switch por tipo de envío: funciona, pero hay que refactorizarlo
│   ├── estrategias.js     ← vacío
│   ├── fabrica.js         ← vacío (con el esqueleto de sus dos exportaciones)
│   └── main.js            ← informe que usa la versión refactorizada (no se modifica)
├── tests/
│   └── envios.test.js     ← tests del comportamiento actual (no se modifican)
└── README.md              ← plantilla de entrega
```

Ejecuta `npm test` (el contenedor ya ha instalado las dependencias): los 9 tests de `envios.test.js` pasan. Son tu **red de seguridad**: después de cada paso de la refactorización tienen que seguir pasando. Ahora son tests unitarios de una sola función; al refactorizar pasan a ser **de integración** (tema 10, apartado 10.5.8), porque `calcularGastosEnvio` delegará en la fábrica y en las estrategias, y los tests las usarán todas juntas sin saberlo. `npm start` no funcionará hasta que exista la fábrica.

## El problema

Cada vez que la tienda quiere un tipo de envío nuevo, alguien tiene que abrir `calcularGastosEnvio`, añadir un `case` y volver a probar **todos** los tipos, porque el `switch` mezcla las reglas de todos. Ahora la tienda quiere añadir la **entrega en un punto de recogida**.

## Requisitos

**Strategy** (`src/estrategias.js`):

1. Una superclase `EstrategiaEnvio` con un _getter_ `nombre` y un método `calcular(pedido)` que **lanzan un error** si una subclase no los sobrescribe (JavaScript no tiene interfaces ni clases abstractas).
2. Una subclase por tipo de envío que sobrescribe `nombre` y `calcular(pedido)`, con las reglas del código original: `EnvioEstandar` (`'Estándar'`), `EnvioUrgente` (`'Urgente'`) y `RecogidaEnTienda` (`'Recogida en tienda'`).
3. Las cifras de cada regla (precios por zona, fijo, precio por kilo, importe para envío gratis) son **campos estáticos** de su clase, no números sueltos en el código.

**Factory** (`src/fabrica.js`):

4. `crearEstrategiaEnvio(tipo)` devuelve una instancia nueva de la estrategia del tipo (`'estandar'`, `'urgente'`, `'recogida'`…) y lanza `Error('Tipo de envío desconocido: <tipo>')` si no existe.
5. `TIPOS_ENVIO` es el array de tipos disponibles, **calculado** a partir del mismo registro que usa la fábrica (no una lista escrita aparte).

**Contexto** (`src/envios.js`):

6. `calcularGastosEnvio(pedido, estrategia)` valida la zona (como ahora) y **delega** en la estrategia: la que recibe como segundo parámetro o, si no recibe ninguna, la que crea la fábrica a partir de `pedido.tipoEnvio`. **Sin `switch` ni `if` por tipo de envío.**
7. `calcularTotal(pedido)` no cambia.

**Tipo nuevo**:

8. Cuando lo anterior funcione y los tests sigan pasando, añade la clase `EntregaEnPunto` (`'Punto de recogida'`, tipo `'punto'`): 2,95 € en la península y 5,95 € en Baleares y Canarias; gratis desde 30 €. **No modifiques `envios.js`** para añadirla.

**Pruebas y documentación**:

9. No modifiques `tests/envios.test.js`. Añade `tests/estrategias.test.js` y `tests/fabrica.test.js` con: los casos límite de cada estrategia (importe justo para el envío gratis, peso 0, cada zona), la fábrica (`toBeInstanceOf` de cada tipo y `toThrow` del desconocido), y un test que compruebe que **todas** las estrategias tienen la interfaz común. Los de las estrategias y la fábrica son **unitarios**. Añade al menos un test **de integración** que pruebe `calcularGastosEnvio` con una estrategia creada por la fábrica (por ejemplo, el tipo nuevo `'punto'` sin cambiar `envios.js`).
10. JSDoc en todas las clases y funciones exportadas.
11. Completa el `README.md` siguiendo los comentarios de la plantilla, con un **diagrama de clases** en Mermaid.
12. Haz la refactorización en **pasos pequeños**, con un commit por paso (por ejemplo: estrategias, fábrica, contexto, tipo nuevo, tests) y comprobando los tests en cada uno.

## Salida esperada

Al terminar, `npm start` muestra exactamente:

```text
🚚 Tipos de envío: estandar, urgente, recogida, punto
#1 Estándar           peninsula envío   4.95 € · total   39.95 €
#2 Estándar           canarias  envío   0.00 € · total   60.00 €
#3 Urgente            peninsula envío  14.15 € · total   94.15 €
#4 Urgente            baleares  envío  22.30 € · total   42.30 €
#5 Recogida en tienda canarias  envío   0.00 € · total   15.00 €
#6 Punto de recogida  peninsula envío   2.95 € · total   27.95 €
#7 Punto de recogida  baleares  envío   0.00 € · total   30.00 €
#8 ❌ Tipo de envío desconocido: dron
⚖️ El mismo pedido con cada tipo de envío:
   Estándar           9.95 €
   Urgente            29.50 €
   Recogida en tienda 0.00 €
   Punto de recogida  0.00 €
```

## Contrato de entrega

| Elemento | Debe ser |
|----------|----------|
| Ficheros | `src/estrategias.js`, `src/fabrica.js`, `src/envios.js`, `src/main.js` (sin cambios), `tests/envios.test.js` (sin cambios), `tests/estrategias.test.js`, `tests/fabrica.test.js`, `README.md` |
| Exportaciones de `src/estrategias.js` | `EstrategiaEnvio`, `EnvioEstandar`, `EnvioUrgente`, `RecogidaEnTienda`, `EntregaEnPunto` |
| Interfaz de cada estrategia | _Getter_ `nombre` (texto) y método `calcular(pedido)` que devuelve los gastos en euros redondeados a céntimos |
| Exportaciones de `src/fabrica.js` | `crearEstrategiaEnvio(tipo)` y `TIPOS_ENVIO` (`['estandar', 'urgente', 'recogida', 'punto']`) |
| Exportaciones de `src/envios.js` | `ZONAS`, `calcularGastosEnvio(pedido, estrategia)` y `calcularTotal(pedido)` |
| Tests | `npm test` ejecuta los tres ficheros |
| Secciones del README | `## El problema del código original`, `## Patrones aplicados`, `## Diagrama de clases`, `## Añadir un tipo de envío`, `## Pruebas`, `## Herramientas` |
| Integración continua | **Opcional**: `.github/workflows/ci.yml`, `package-lock.json` y la sección `## Integración continua (opcional)` del README. No se corrige |

## Criterios de evaluación

- ✅ Strategy bien aplicado: una clase por tipo con la misma interfaz y un contexto sin decisiones por tipo
- ✅ Factory bien aplicado: un único punto de creación y un registro del que salen los tipos
- ✅ Se reconocen y aprovechan las características de la orientación a objetos: herencia, polimorfismo, estáticos
- ✅ El contexto y el programa usan las estrategias solo a través de su interfaz
- ✅ El tipo nuevo se añade sin tocar el contexto, y se explica qué ficheros cambian
- ✅ El comportamiento no cambia: los tests originales pasan y la salida es la esperada
- ✅ Tests nuevos con casos límite, fábrica e interfaz común
- ✅ JSDoc, README con el diagrama de clases, ESLint y Prettier sin errores
- ✅ Historial de commits que muestra la refactorización paso a paso

## Integración continua (opcional)

> 📝 Este apartado es **opcional** y no cuenta para la corrección. Hazlo si en clase habéis visto GitHub Actions; si no, sáltatelo.

Tu repositorio de la tarea ya está en GitHub. Escribe un *workflow* de GitHub Actions que pase **todas las comprobaciones del proyecto** cada vez que subas cambios. Es como el de la UD2, con una mejora: las dependencias se instalan con **`npm ci`** a partir de `package-lock.json`, el fichero que anota la versión exacta de cada paquete instalado. Así la integración continua usa las mismas versiones que tu contenedor, y con la caché de npm la instalación es más rápida. Escríbelo tú, en `.github/workflows/ci.yml`, con estas orientaciones:

- Se ejecuta con cada `push` y cada *pull request* a la rama `main`.
- Tiene un único trabajo (*job*) que se ejecuta en `ubuntu-latest`.
- Sus pasos, en este orden, cada uno con un nombre (`name`) en español que diga qué hace:
  1. Descargar el código, con la acción `actions/checkout@v7`.
  2. Instalar Node.js 24 con la caché de npm, con la acción `actions/setup-node@v7`, `node-version: 24` y `cache: npm`.
  3. Instalar las dependencias con `npm ci`.
  4. Revisar el código con ESLint: `npm run lint`.
  5. Comprobar el formato con Prettier: `npm run format:check`.
  6. Ejecutar los tests: `npm test`.
- Sube también `package-lock.json`: lo creó `npm install` al abrir el contenedor. Sin él, `npm ci` falla. Si añades o actualizas una dependencia, vuelve a subirlo.
- Prettier también revisa el formato de `ci.yml`: ejecuta `npm run format` antes de subirlo.

Compruébalo:

1. Sube los cambios y abre la pestaña **Actions** del repositorio: la ejecución debe salir en verde, con los seis pasos.
2. Rompe algo a propósito (por ejemplo, cambia el precio de una zona en un test de las estrategias), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

Deja constancia en la sección «Integración continua (opcional)» del `README.md`: el enlace a la ejecución en verde y dos capturas en `img/`, una de la ejecución en verde con sus pasos y otra de la ejecución en rojo con el paso que falla.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen que ha construido el `Dockerfile` tampoco se borra (se llama `vsc-` seguido del nombre de la carpeta), así que la próxima vez no hace falta construirla de nuevo. Si necesitas espacio, bórrala desde la pestaña **Images** de Docker Desktop o con `docker image rm <nombre>`.
