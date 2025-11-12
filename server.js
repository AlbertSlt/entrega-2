import express from "express" 

import products from "./routes/products.js"; 
import carts from "./routes/carts.js";


//creo mi servidor
const servidor = express()

const PORT = 8080

//Middleware
servidor.use (express.json());
servidor.use("/api/products", products);
servidor.use("/api/carts", carts),

servidor.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})