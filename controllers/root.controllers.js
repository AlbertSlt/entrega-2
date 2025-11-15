import { readProductsFile } from "./products.controllers.js"

export const getHomeView = async (req, res) => {
    try {
        //leer lista de prod
        const products = await readProductsFile();
        //renderizar home.handlebars y parasr array de prod
        res.render("home", {
            title: "Mi tiendita 🫰 - Lista estatica",
            products: products,
            //para usar en home
            hasProducts: products.length > 0
        });
    } catch (error) {
        console.error("Error al renderizar home view", error);
        res.status(500).render("error", { message: "Error al cargar la lista de producos" })
    }
};

export const getRealTimeProductsView = (req, res) => {
    //func para la vista con ws
    res.render("realTimeProducts", {
        title: "Mi tiendita 🫰 - Lista en tiempo real"
    })
}