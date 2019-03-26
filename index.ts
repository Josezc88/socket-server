import Server from "./classes/server";
import router from "./routes/router";
import bodyParser = require("body-parser");
import cors = require("cors");


const server = new Server();

// BosyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// CORS
server.app.use(cors({ origin: true, credentials: true }));

// Rutas de servicios
server.app.use('/', router);

server.start( () => {
    console.log(`El servidor esta inicializado en el puerto ${ server.port }`);
});
