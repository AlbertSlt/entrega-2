import { Router } from "express";
import {
    getHomeView,
    getRealTimeProductsView
} from "../controllers/root.controllers.js";

const router = Router();
router.get("/", getHomeView);
//para WS renderiza realtimeproducts.handlebars
router.get("/realtimeproducts", getRealTimeProductsView);

export default router;