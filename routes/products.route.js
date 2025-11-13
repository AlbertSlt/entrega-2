import { Router } from "express";
//import fs from "fs/promises";
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/products.controllers.js";



const router = Router();
//const PRODUCTS = "./data/products.json";

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct)




//helper func
// leer el archivo JSON
/* async function readProductsFile() {
    try {
        const data = await fs.readFile(PRODUCTS, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer el archivo de productos:", error);
        return [];
    }
} */

// escribir el array completo en el archivo
/* async function writeProductsFile(productsArray) {
    const dataString = JSON.stringify(productsArray, null, 2); 
    await fs.writeFile(PRODUCTS, dataString, 'utf8');
} */


//endpoints
// ENDPOINT: GET / (Obtener todos los productos)
/* router.get("/", async (req, res) => {
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
}); */



// ENDPOINT: GET /:pid (Obtener producto por id)
/* router.get("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El id del producto debe ser un numero entero valido."
            });
        }

        const products = await readProductsFile();
        const product = products.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Error 404: Producto ID: ${productId} no encontrado.`
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar la solicitud."
        });
    }
});
 */


// ENDPOINT: POST  - Crear nuevo producto
/* router.post("/", async (req, res) => {
    try {
        const productData = req.body;

        // validacion de campos obligatorios
        if (!productData.title || !productData.description || !productData.code || !productData.price || !productData.stock || !productData.category) {
            return res.status(400).json({
                success: false,
                message: "Error: Faltan campos obligatorios (title, description, code, price, stock o category)"
            });
        }
        
        const price = Number(productData.price);
        const stock = Number(productData.stock);

        // validacion price
        if (isNaN(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El campo price debe ser un numero postivo"
            })
        }

        // validacion stock
        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El campo stock debe ser un numero entero no negativo"
            })
        }

        const products = await readProductsFile();

        // Generar nuevo ID
        let newId;
        if (products.length === 0) {
            newId = 1;
        } else {
            const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
            newId = maxId + 1;
        }

        // Nuevo objeto
        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: price,
            status: productData.status !== undefined ? productData.status : true,
            stock: stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        // Guardar
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
        res.status(500).json({ success: false, message: "error al crear el producto." });
    }
});
 */

// ENDPOINT: PUT /:pid (Modificar producto por ID)
/* router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updateData = req.body;

        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El ID del producto debe ser un numero entero valido."
            });
        }

        const products = await readProductsFile();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Error 404: Producto ID: ${productId} no encontrado para actualizar.`
            });
        }

        const existingProduct = products[productIndex];

        // Validaciones de Price y Stock 
        if (updateData.price !== undefined) {
            const newPrice = Number(updateData.price);
            if (isNaN(newPrice) || newPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Error 400: El campo price debe ser un numero positivo."
                });
            }
            updateData.price = newPrice;
        }

        if (updateData.stock !== undefined) {
            const newStock = Number(updateData.stock);
            if (isNaN(newStock) || newStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Error 400: El campo stock debe ser un numero entero no negativo"
                });
            }
            updateData.stock = newStock;
        }

        // Evitar modificación de ID
        if (updateData.id) {
            delete updateData.id;
        }

        // Sobrescribir campos
        const updatedProduct = {
            ...existingProduct,
            ...updateData
        };

        // Reemplazar y guardar
        products[productIndex] = updatedProduct;
        await writeProductsFile(products);

        res.status(200).json({
            success: true,
            message: `Producto ID: ${productId} actualizado correctamente.`,
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar la solicitud."
        });
    }
});
 */

// ENDPOINT: DELETE /:pid - eliminar producto por ID
/* router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El ID del producto debe ser un numero entero valido."
            });
        }

        const products = await readProductsFile();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Error 404: Producto ID: ${productId} no encontrado para eliminar.`
            });
        }

        // Eliminar el producto
        const deletedProduct = products.splice(productIndex, 1);

        // Guardar array modificado
        await writeProductsFile(products);

        res.status(200).json({
            success: true,
            message: `Producto ID: ${productId} eliminado correctamente.`,
            data: deletedProduct[0]
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar la solicitud de eliminacion."
        });
    }
});
 */

export default router;