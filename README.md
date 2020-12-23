# Prueba
Este proyecto esta hecho en react

## Instalacion
1. Clonar el repo
2. Correr el comando `yarn`
3. Correr el comando `yarn start`

*El proyecto corre por default en el puerto 3000 pero pedira otro puerto
en caso de que este este ocupado*

## Como esta construido
En el proyecto hay 2 componentes para manejar las vistas una para la 
autenticacion y otra para la pagina de inicio.

### Autenticacion

En la autenticacion guardo el token en `localStorage` y verifico si el usuario
esta autenticado o no dependiendo si el valor `token` esta en `localStorage` o 
no.

### Inicio
En la pagina de inicio pido los jobs y los guardo en el cache del browser 
para que la proxima vez que cargue no tenga que pedirlos.

En el momento en que voy al home si el usuario no esta autenticado lo 
redirecciono a la pagina de login.

Si la sesion expira cuando cargo la pagina de inicio tambien lo redirecciono al
login. Adicional le pido al usuario su `geolocation` usando el api de navigator
del browser. Si el dispositivo no lo soporta lo omito y si el usuario rechaza
dar permiso tambien omito la localizacion del usuario.

Si lo permite, yo incluye los valores de donde esta localizado ademas de un
boton para que marque en el mapa el lugar donde esta.

En el listado de trabajos se encuentra una barra de busqueda para poder filtrar
los `jobs`.

Se que los `jobs` funcionan con pagination, sin embargo como pagination produce
un mal ux, [Avoid the Pains of Pagination](https://uxmovement.com/navigation/avoid-the-pains-of-pagination/), decidi pedir todos los `jobs` pidiendo todas
las paginas en paralelo y luego concatenandolas juntas usando el `Promise.all`
y luego los guardo en el cache para que las visitas subsecuentes el usuario 
no tenga que esperar.

### Services

#### Api.js
Todo lo que sea integracion con algun agente remoto me gusta trabajarlo con
un archivo llamado `Api.js` y se que en ese archivo encuentro todo lo necesario
para hacer llamadas remota.

#### AppContext.js
Uso context para compartir objetos que probablemente van a ser requerido entre
varios componentes y asi evito el `prop-drilling`.

## Observaciones

### Bloatware
Si observan el `package.json` notaran, que las unicas librerias que estan ahi
son `react` y `leaflet`, sin ninguna otra libreria. Eso fue una decision 
intencional para mantener el codigo lo mas liviano posible y solo utilizar 
librerias cuando son realmente necesarias.

Desde que salio `flexbox`, `css-grid` y `media query` ya no hay necesidad de 
depender de librerias de `css` como `foundation` o `bootstrap`, que lo que hacen 
mas que todo es agregar mas peso a las paginas haciendo que carguen mas lento. 

Actualmente es mas comun hacer un `design language` custom que usar un framework,
en 2020 es mas comun el uso de `utility library` como `Tailwind CSS`,

### CSS Modules
Para hacer styling uso `css-modules` y con eso obtengo `isolation` entre las 
vistas y componentes sin tener que preocuparme por metodologias como `BEM`, 
`ACSS` o `SMACSS`.

## Insomnia
Me gusta siempre tener un `Workspace` de `Insomnia` por proyecto para manterner
documentadas mis `api` y poder reutilizarlas o poder compartirlas.

[Insomnia](https://insomnia.rest/) es un `rest client` como `Postman`. 

Dentro de la carpeta `docs`, hay un archivo llamado `Insomnia.json`

En caso que deseen ver como esta la documentacion de los endpoints de la 
prueba, pueden importar ese archivo en Insomnia y ver como corri los endpoints.

## Git 
La metodologia que uso para git es [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/)
