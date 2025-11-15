import http from "http";
import { Server } from "socket.io";
import express from "express";
import handlebars from "express-handlebars";

//rutas
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import rootRouter from "./routes/root.route.js";
import { readProductsFile } from "./controllers/products.controllers.js";

//configuracion
const PORT = 8080

//express p/logica
//deja de ser el servidor real y abrir el puerto con la implementacion de websocket
const app = express()

//Este es el servidor http que responde solicitudes que vengan de http://localhost:5000, lo hace con la constante de app (arriba)
const servidor = http.createServer(app);


//Creo un nuevo servidor websocket
//Este es el servidor de WebSocket que responde solicitudes que vengan de : ws://localhost:5000
const servidorWS = new Server(servidor)

servidorWS.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    try {
        const initialProducts = await readProductsFile();
        // socket.emit() envia la lista solo a ESTE cliente
        socket.emit('productsUpdate', initialProducts);
        console.log("Productos iniciales enviados al nuevo cliente.");
    } catch (error) {
        console.error("ERROR AL ENVIAR PRODUCTOS INICIALES:", error);
    }
});

// Motor de vista handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');


//Middleware
app.use(express.json());
//para poder leer formularios
app.use(express.urlencoded({ extended: true }));
//WS
app.use((req, res, next) => {
    //asignar el serv ws a una propiedad en req // los controladores acceden como req.io
    req.io = servidorWS;
    next();
})

//esto significa que si me hacen un pedido con metodo GET y la ruta es /index.css (p/ej) busco el archivo en la carpeta public, si existe se devuelve, sino sera 404
//adonde queres que express busque el archivo css, tipografia, etc que necesite el front
app.use(express.static("public"));


//rutas
app.use("/", rootRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

// manejo de errores global
app.use((err, req, res, next) => {
    console.log(err); 
    res.status(500).send("Error interno del servidor");
});


servidor.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})