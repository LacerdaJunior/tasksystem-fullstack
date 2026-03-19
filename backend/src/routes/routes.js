import express from "express";
import { UserController } from "../controllers/userController.js";
import { TaskController } from "../controllers/taskController.js";
import { CategoryController } from "../controllers/categoryController.js";

const routes = express.Router();
const userController = new UserController();
const taskController = new TaskController();
const categoryController = new CategoryController();

routes.post("/register", userController.register);
routes.post("/login", userController.login);

routes.patch("/dashboard/profile", userController.updateAvatar);
routes.patch("/dashboard/profile/updatepass", userController.updatePassword);
routes.delete("/dashboard/profile/deleteacc", userController.deleteUser);
routes.patch("/dashboard/profile/name", userController.updateUsername);

//============
// CRUD CATEGORY
//=============

routes.get("/dashboard/categories", categoryController.index);
routes.post("/dashboard/categories", categoryController.create);
routes.delete("/dashboard/categories/:id", categoryController.delete);

//================
// CRUD TASKS
//==============

routes.get("/dashboard/tasks", taskController.index);

routes.post("/dashboard/tasks", taskController.create);

routes.patch("/dashboard/tasks/:id", taskController.update);

routes.delete("/dashboard/tasks/:id", taskController.delete);
export default routes;
