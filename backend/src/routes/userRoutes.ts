/* eslint-disable prettier/prettier */
import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import * as UserController from "../controllers/UserController";

const userRoutes = Router();
const upload = multer();

// Rotas de imagem de perfil
userRoutes.post(
  "/users/:userId/profile-image",
  isAuth,
  upload.single("profileImage"),
  UserController.updateProfileImage
);

userRoutes.delete(
  "/users/:userId/profile-image",
  isAuth,
  UserController.deleteProfileImage
);

// Rota para atualizar informações do usuário, incluindo a imagem de perfil
userRoutes.put(
  "/users/:id", 
  isAuth,
  upload.single("profile"),  
  UserController.updateProfile
);

export default userRoutes;
