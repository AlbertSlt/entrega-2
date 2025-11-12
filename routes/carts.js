import { Router } from "express";
import fs from "fs/promises";

const router = Router();
const CARTS_FILE = "./data/carts.json";

//leer carrito
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

//escribir carrito

async function writeCarts(cartsArray) {
    //null = sin filtrado // 2 = espaciado para ser legible
    const dataString = JSON.stringify(cartsArray, null, 2);
    await fs.writeFile(CARTS_FILE, dataString, "utf-8");
}

router.post("/", async (req, res) => {
    try {
        //buscamos carritos existentes con la funcion anterior
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
})

export default router;