import fs from "fs/promises";


const CARTS_FILE = "./data/carts.json";

async function getCarts() {
    try {
        const data = await fs.readFile(CARTS_FILE, "utf-8");
        const cartsArray = JSON.parse(data);
        return cartsArray;
    } catch (error) {
        console.log("Error al leer el carrito", error)
        return [];
    }
}

async function writeCarts(cartsArray) {
    //null = sin filtrado // 2 = espaciado para ser legible
    const dataString = JSON.stringify(cartsArray, null, 2);
    await fs.writeFile(CARTS_FILE, dataString, "utf-8");
}

export const createCart = async (req, res) => {
     try {
        const carts = await getCarts();

        //id automatico
        let newId;
        if (carts.length === 0) {
            newId = 1;
        } else {
            // id mas alto +1
            const maxId = carts.reduce((max, cart) => Math.max(max, cart.id), 0);
            newId = maxId + 1;
        }

        //crear objeto de nuevo carrito
        const newCart = {
            id: newId,
            products: []
        };

        //agregar el carrito al array y guardar

        carts.push(newCart);
        await writeCarts(carts)

        res.status(201).json({
            success: true,
            message: "carrito creado!",
            cart: newCart
        });

    } catch (error) {
        console.error("error al crear el carrito", error)
        res.status(500).json({
            success: false,
            message: "error al crear el carrito"
        });
    }
}


export const getCartById = async (req, res) => {
      try {
        const cartId = parseInt(req.params.cid);

        if (isNaN(cartId)) {
            return res.status(400).json({
                success: false,
                message: "Error 400: El ID del carrito debe ser un número entero valido."
            });
        }

        // leer todos los carritas
        const carts = await getCarts();

        // buscar por id
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: `Error 404: Carrito con ID ${cartId} no encontrado.`
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        console.error("Error al buscar carrito por ID:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar la solicitud."
        });
    }
}


export const addProductToCart = async (req, res) => {
     try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        // destruct del body para sacar el campo quantity, sino se asigna el valor 1
        const { quantity = 1 } = req.body; 

        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: "Error 400: ID invalido (carrito o producto)."
            });
        }
        
        // encontrar el carrito
        const carts = await getCarts();

        //devuelve -1 si no se encuentra el index
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Error 404: Carrito ID ${cartId} no encontrado.`
            });
        }

        const cart = carts[cartIndex];
        const productInCartIndex = cart.products.findIndex(p => p.product === productId);

        // agregar producto
        if (productInCartIndex !== -1) {
            // si el prod existe en el carrito, sumo la cantidad
            cart.products[productInCartIndex].quantity += quantity;
        } else {
            // producto nuevo, se agrega al carrito
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        carts[cartIndex] = cart;
        await writeCarts(carts);

        res.status(200).json({
            success: true,
            message: `Producto ID ${productId} agregado al carrito ID ${cartId}.`,
            data: cart
        });

    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({
            success: false,
            message: "Error interno."
        });
    }
}