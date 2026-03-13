import express from "express";
import { UserController } from "../controllers/userController.js";

const routes = express.Router();
const userController = new UserController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.patch("/dashboard", userController.updateAvatar);
routes.patch("/dashboard/perfil/settings", userController.updatePassword);
routes.delete("/dashboard/perfil/settings", userController.deleteUser);
export default routes;
