# 🎮 Coning: ¡Empareja, Aprende Inglés y Compite por tu ICO! 🧠

[![Licencia](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Plataforma](https://img.shields.io/badge/Platform-Ionic%20%7C%20Angular-blue)](https://ionicframework.com/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/en/)
[![Tipo](https://img.shields.io/badge/Type-Juego%20Educativo-green)](https://en.wikipedia.org/wiki/Educational_game)
![Captura de Pantalla del Juego (Opcional)](./screenshots/screenshot_principal.png)
![GIF del Juego en Acción (Opcional)](./screenshots/coning_demo.gif)

## 💡 ¿Qué es Coning?

Coning es un divertido y desafiante juego de memoria y asociación visual desarrollado con el framework Ionic y Angular en el frontend, 
y una potente lógica de juego implementada en un backend con **Node.js**. El objetivo principal es formar parejas correctas entre palabras en inglés 
y las imágenes que representan su significado.

La lógica principal del juego, incluyendo la gestión de partidas, el cálculo del ICO, la gestión de usuarios y el ranking, 
está implementada en un backend con Node.js. Esto permite una experiencia de juego más robusta y escalable.

Pero Coning va más allá de la simple memoria:

* **Aprende Inglés Jugando:** Refuerza tu vocabulario en inglés de una manera intuitiva y entretenida a través de la asociación visual.
* **Desafío para un Jugador:** Enfréntate a una Inteligencia Artificial (IA) astuta y pon a prueba tus habilidades cognitivas.
* **Competencia Multijugador:** Desafía a tus amigos o a otros jugadores en emocionantes partidas cara a cara para demostrar quién tiene la mejor memoria y conocimiento del inglés.
* **Personalización con Avatares:** Elige entre una variedad de avatares únicos para representar tu estilo en cada partida.
* **Índice de Competitividad (ICO):** Acumula puntos de ICO con cada partida completada, reflejando tu progreso y habilidad. ¡Compite en un ranking global o local para alcanzar la cima!
* **Modo Espectador:** ¿Quieres aprender de los mejores? Observa partidas en curso y analiza las estrategias de otros jugadores.

## 🕹️ ¿Cómo Jugar?

1.  Al iniciar una partida, se mostrará un conjunto de cartas boca abajo. Algunas ocultan palabras en inglés y otras, 
imágenes relacionadas con esas palabras.
2.  En tu turno, selecciona dos cartas para voltearlas.
3.  Si la palabra y la imagen coinciden, ¡has encontrado una pareja! Las cartas se eliminarán del juego.
4.  Si no coinciden, las cartas se voltearán nuevamente boca abajo.
5.  El objetivo es encontrar todas las parejas en el menor número de intentos posible.
6.  En el modo multijugador, los jugadores se turnan para encontrar las parejas, interactuando con el backend a través de la API.
7.  Tu puntuación y tu ICO se gestionan en el backend y se actualizan en el frontend al completar partidas.

## ✨ Características Principales

* Frontend desarrollado con Ionic y Angular para una interfaz de usuario atractiva y multiplataforma.
* Backend robusto con Node.js para la lógica del juego, gestión de usuarios y datos.
* Modo para un jugador contra la IA con diferentes niveles de dificultad (¡próximamente!).
* Modo multijugador en tiempo real para desafiar a otros jugadores a través del backend.
* Selección de avatares personalizables para los jugadores.
* Sistema de Índice de Competitividad (ICO) gestionado por el backend para el seguimiento del progreso y la clasificación.
* Modo espectador para observar partidas en curso (implementado a través del backend).
* Comunicación eficiente entre el frontend y el backend a través de una API REST (o WebSockets, si aplica).
* Soporte para diferentes conjuntos de palabras e imágenes (¡planes futuros!).

## 🛠️ Tecnologías Utilizadas

### Frontend

* [Ionic Framework](https://ionicframework.com/) - Un framework de código abierto para construir aplicaciones híbridas con tecnologías web.
* [Angular](https://angular.io/) - Una plataforma de desarrollo de aplicaciones web de Google.
* [TypeScript](https://www.typescriptlang.org/) - Un superconjunto de JavaScript que añade tipado estático.
* [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Backend

* [Node.js](https://nodejs.org/en/) - Un entorno de ejecución de JavaScript del lado del servidor.
* [Express.js](https://expressjs.com/) (Si lo estás utilizando) - Un framework de aplicaciones web Node.js minimalista y flexible.
* (Menciona cualquier otra tecnología del backend como bases de datos - MongoDB, PostgreSQL, etc. - o librerías específicas que uses, por ejemplo: [Mongoose](https://mongoosejs.com/), [Socket.IO](https://socket.io/), etc.)

## 🚀 ¿Cómo Contribuir?

¡Las contribuciones son bienvenidas y apreciadas tanto para el frontend como para el backend! Si te interesa colaborar en Coning, aquí tienes algunas formas en las que puedes ayudar:

* **Reportar Bugs:** Si encuentras algún error o comportamiento inesperado en el frontend o el backend, por favor, crea un nuevo "Issue" 
detallando el problema y los pasos para reproducirlo.
* **Sugerir Nuevas Funcionalidades:** ¿Tienes ideas para mejorar el juego en cualquiera de las capas? ¡Abre un "Issue" con tu propuesta!
* **Contribuir con Código (Frontend):** Si quieres involucrarte en el desarrollo de la interfaz de usuario, revisa los "Issues" abiertos (especialmente aquellos etiquetados como "good first issue"). Haz un "fork" del repositorio, crea una rama con tus cambios y envía un "Pull Request".
* **Contribuir con Código (Backend):** Si tienes experiencia con
