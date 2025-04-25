import express from "express";
//import config from "./config.js";
import cors from "cors";
import morgan from "morgan";


const app = express();

// use it before all route definitions
app.use(cors({origin: '*'}));


 // Configurar cabeceras y cors
 app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

app.use(express.json()) //para que reciba los datos en formato json
app.use(express.urlencoded({extended: false})); //datos que vienen desde el formulario
//app.use(articulosRoutes);

app.use(morgan('dev'));

export default app; 

 
//settings 
//app.set('port', config.port)

app.use(cors()); // permisos a todo el mundo




