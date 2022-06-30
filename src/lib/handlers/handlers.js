// manejador de peticiones para los to dos

const Express = require("express");
const { getDBHandler } = require("../db");

const RequestHandler = Express.Router(); //manejador de peticiones por rutas

// obteniendo los to dos
RequestHandler.get("/to-dos", async (request, response, next) => {
    try {
        // obteniendo el dbHandler para interactuar con la BD
        const dbHandler = await getDBHandler();

        // obteniendo todos los to dos
        const todos = await dbHandler.all("SELECT * FROM todos");

        // cerrando conexion con base de datos
        await dbHandler.close();

        // si no existen to dos
        if (!todos || !todos.length) {
            response.status(404).send({ message: "To Dos Not Found" });
        }

        // enviando los to dos encontrados
        response.send({ todos });

    } catch (error) { //se retorna status 500 de error y los mensajes
        response.status(500).send({
            error: `Something went wrong when trying to ge the to dos list`,
            errorInfo: error.message,
        });
    }
});

// creando un to do
RequestHandler.post("/to-dos", async (request, response, next) => {
    try {

        const { title, description, isDone: is_done } = request.body;
        
        /*if(is_done !== 0 || 1 ){
            if(is_done === true) is_done = 1;
            if(is_done === false) is_done = 0;
            return response.status(400).send({ 
                message: `isDone must be 1 (true) or 0 (false), got ${is_done}` 
            });
        }*/

        const dbHandler = await getDBHandler();

        // insertando nuevo to do en la BD
        const newTodo = await dbHandler.run(`
            INSERT INTO todos (title, description, is_done)
            VALUES (
                '${title}',
                '${description}',
                ${is_done}
            )`
        );

        await dbHandler.close();

        response.send({ title, description, isDone: is_done });

    } catch (error) { //se retorna status 500 de error y los mensajes
        response.status(500).send({
            error: `Something went wrong when trying to create a new to do`,
            errorInfo: error.message,
            errorDetails: error,
        });
    }
});


// actualizando el to do
RequestHandler.patch("/to-dos/:id?", async (request, response) => {
    try {
        
        const todoId = request.params.id // obteniendo el id del request
        
        if(!todoId){
            return response.status(400).send({ error: "Missing To Do ID" });
        } 

        const dbHandler = await getDBHandler();
        const { title, description, isDone: is_done } = request.body;

        // obteniendo la informacion del to do enviado por el usuario
        const todoToUpdate = await dbHandler.get(
            `SELECT * FROM todos WHERE id = ?`,
            todoId
        );

        // validando el id del To Do
        if(todoToUpdate === undefined){
            dbHandler.close();
            return response.status(404).send({ message: "To Do Not Found" });
        }

        // validando los campos enviados
        const updatedTodo = await dbHandler.run(
            `UPDATE todos SET title = ?, description = ?, is_done = ? WHERE id = ?`,
            title || todoToUpdate.title,
            description || todoToUpdate.description,
            is_done || todoToUpdate.is_done,
            todoId
        );
        

        dbHandler.close();

        response.send({ updatedTodo });

    } catch (error) { //se retorna status 500 de error y los mensajes
        response.status(500).send({
            error: `Something went wrong when trying to update the to do`,
            errorInfo: error.message,
        });
    }
});


// eliminando to do
RequestHandler.delete("/to-dos/:id?", async (request, response, next) => {
    try {

        const todoId = request.params.id;
        const dbHandler = await getDBHandler();

        if(!todoId){
            return response.status(400).send({ error: "Missing To Do ID" });
        }

        const deletedTodo = await dbHandler.run(`
                DELETE FROM todos WHERE id = ?`,
            todoId
        );

        // si to do no existe
        if (deletedTodo.changes !== 1) {
            await dbHandler.close();
            return response.status(404).send({ message: "To Do Not Found" });
        }

        await dbHandler.close();

        response.send({
            message: "To Do Deleted",
            todoRemoved: { ...deletedTodo }
        });

    } catch (error) { //se retorna status 500 de error y los mensajes
        response.status(500).send({
            error: `Something went wrong when trying to delete the to do`,
            errorInfo: error.message,
        });
    }
});

async function getDate(){
    const hoy = new Date();
    
}

module.exports = RequestHandler;
