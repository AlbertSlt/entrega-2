import { Router } from "express";
import fs from "fs/promises";

const router = Router(); 
const PRODUCTS = "./data/products.json";

// leer el archivo JSON
async function readProductsFile() {
    try {
        const data = await fs.readFile(PRODUCTS, 'utf8');
        return JSON.parse(data); 
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error);
        // devuelve un array vacío si hay un error
        return []; 
    }
}

//ENDPOINT: GET 
router.get("/", async (req, res) => {
   
    try {
        const products = await readProductsFile();
        res.status(200).json({
            success: true,
            data: products
        })
    } catch (error) {
        console.log("error al leer archivo de productos", error);

        res.status(500).json({
            success: false,
            message: "Error al leer archivo de productos",
        })
    }
});


 
// escribir el array completo en el archivo
async function writeProductsFile(productsArray) {
    const dataString = JSON.stringify(productsArray, null, 2); //null = sin filtros // 2 espacio para diferenciar
    await fs.writeFile(PRODUCTS, dataString, 'utf8');
}


// ENDPOINT: POST
router.post("/", async (req, res) => {
    try {
        //lista existente
        const products = await readProductsFile();
        
        // id auto
        let newId;
        if (products.length === 0) {
            newId = 1;
        } else {
            const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
            newId = maxId + 1;
        }

        //nuevo objeto 
        const newProduct = {
            id: newId,
            title: req.body.title || 'Producto 1', 
            description: req.body.description || '',
            code: req.body.code || '',
            price: req.body.price || 0, // valor por defecto si no se especifica
            status: req.body.status !== undefined ? req.body.status : true, // Booleano por defecto: true
            stock: req.body.stock || 0,
            category: req.body.category || 'General',
            thumbnails: req.body.thumbnails || [] // Array de Strings
        };

     // agregar el producto y guardar
        products.push(newProduct);
        await writeProductsFile(products);

        res.status(201).json({
            success: true,
            message: "Producto creado.",
            data: newProduct
        });
console.log(`Producto creado y guardado`);
    } catch (error) {
        console.error("error al crear el producto:", error);
        res.status(500).json({ success: false, message: "error alcrear el producto." });
    }
});


export default router;