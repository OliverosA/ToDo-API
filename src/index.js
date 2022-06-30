const Express = require("express");
const CorsMiddleware = require("cors"); 
const { initializeDB } = require("./lib/db/");
const RequestHandler = require("./lib/handlers/handlers");

const Api = Express(); //objeto de tipo Express

// utilizando middleware
// Express.json retorna (request, response, next) => {}
Api.use(Express.json());

// Express.urlencoded retorna (request, response, next) => {}
Api.use(Express.urlencoded({ extended: false }));

// para motivos de seguridad utilizamos cors
Api.use(CorsMiddleware());

// ruta para interactuar con la API /api/v1
Api.use("/api/v1", RequestHandler); //utilizando el manejador de to dos

Api.listen(3000, () => {
    console.log("API IS RUNNING"); //se ejecuta cuando la API se este ejecutando

    //iniciando la base de datos
    initializeDB().then(() => {
        console.log("DATABASE READY");
    });
})

