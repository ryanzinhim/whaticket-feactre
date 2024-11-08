/* eslint-disable prettier/prettier */
import * as Yup from "yup";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getIO } from "../libs/socket";
import AppError from "../errors/AppError";
import User from "../models/User";

// Atualizar imagem de perfil
export const updateProfileImage = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;


  if (!req.file) {
    throw new AppError("Nenhum arquivo foi enviado", 400);
  }

  const userRecord = await User.findByPk(userId);
  if (!userRecord) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (userRecord.profileImage) {
    const oldImagePath = path.join(__dirname, "..", "..", "public", "profile", userRecord.profileImage);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  userRecord.profileImage = `/public/profile/${req.file.filename}`;
  await userRecord.save();

  const io = getIO();
  io.emit("user", { action: "update", user: userRecord });

  return res.json({ message: "Imagem de perfil atualizada" });
};

// Excluir imagem de perfil
export const deleteProfileImage = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

  const userRecord = await User.findByPk(userId);
  if (!userRecord) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (userRecord.profileImage) {
    const imagePath = path.join(__dirname, "..", "..", "public", "profile", userRecord.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    userRecord.profileImage = null;
    await userRecord.save();
  }

  const io = getIO();
  io.emit("user", { action: "update", user: userRecord });

  return res.json({ message: "Imagem de perfil excluída" });
};

// Atualizar informações do usuário
export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, email, password, profile, queueIds, whatsappId } = req.body;

  const userData = {
    name,
    email,
    password,
    profile,
    queueIds: JSON.parse(queueIds),
    whatsappId
  };

  if (req.file) {
    userData.profileImage = `${process.env.BACKEND_URL}/public/profile/${req.file.filename}`;
  }

  const schema = Yup.object().shape({
    name: Yup.string().min(2).required(),
    email: Yup.string().email().required(),
    profile: Yup.string().required(),
    queueIds: Yup.array().of(Yup.number()).required(),
  });

  try {
    await schema.validate(userData);
  } catch (err) {
    throw new AppError(err.message);
  }

  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  await user.update(userData);

  return res.status(200).json(user);
};
