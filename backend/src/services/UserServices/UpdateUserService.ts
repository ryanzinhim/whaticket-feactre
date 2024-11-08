/* eslint-disable prettier/prettier */
import User from "../models/User";
import AppError from "../errors/AppError";
import CheckSettingsHelper from "../helpers/CheckSettings";

interface UserData {
  email: string;
  password: string;
  name: string;
  profile: string;
  queueIds: number[];
  whatsappId: number;
}

// Criar usuário
export const createUser = async (userData: UserData): Promise<User> => {
  const { email, password, name, profile, queueIds, whatsappId } = userData;

  if (await CheckSettingsHelper("userCreation") === "disabled") {
    throw new AppError("ERR_USER_CREATION_DISABLED", 403);
  }

  return await User.create({
    email,
    password,
    name,
    profile,
    queueIds,
    whatsappId
  });
};

// Remover usuário
export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }
  await user.destroy();
};

// Listar usuários
  // Aqui você aplicaria lógica para listar usuários, considerando paginação e filtros.
};
