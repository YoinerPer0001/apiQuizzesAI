import express from 'express'
import categoriesController from '../controllers/categoriesController.js'
import { createValidator, getAllCats, updateValidator } from '../middlewares/validators/categoriesValidator.js';
import { idValidator } from '../middlewares/validators/idValidator.js';
import { authenticateFirebase } from '../middlewares/authFirebase.js';



const CategoriesRoutes = express.Router()

CategoriesRoutes.get('/categories/all', getAllCats, authenticateFirebase, categoriesController.getAll);

CategoriesRoutes.post("/categories/create", authenticateFirebase, createValidator, categoriesController.create)

CategoriesRoutes.put("/categories/update/:id", authenticateFirebase, idValidator, updateValidator, categoriesController.update)

export default CategoriesRoutes;