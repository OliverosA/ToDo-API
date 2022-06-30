const { open } = require("sqlite"); // traer unicamente la funcion open
const sqlite3 = require("sqlite3"); // traer todo el modulo (el default)

// obteniendo la base de datos
async function getDBHandler(){
    try { // obteniendo el archivo, si este no existe se crea
        const dbHandler = await open({ // el AWAIT es para verificar si se encuentra el archivo
            filename: "database.sqlite",
            driver: sqlite3.Database, // especificando el driver
        });
        
        // si resulta un error se muestra el error obtenido
        if(!dbHandler) throw new TypeError(`DB Handler expected, got ${dbHandler}`);

        return dbHandler;
    } catch (error) { // se muestra un error no esperado
        console.error("There was an error trying to get the DB Handler: ", 
        error.message);
    }
}

async function initializeDB(){
    try {
        const dbHandler = await getDBHandler();

        // ejecutando el script de la consulta
        await dbHandler.exec(`
            CREATE TABLE IF NOT EXISTS todos(
                id INTEGER PRIMARY KEY,
                title TEXT,
                description TEXT,
                is_done INTEGER DEFAULT 0
            ) 
        `);

        await dbHandler.close(); // cerrando la conexion
    } catch (error) {
        console.error("There was an error trying to initialize the DB: ", 
        error.message);
    }
}

// exporting the module functions
module.exports = { initializeDB, getDBHandler };