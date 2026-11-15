
import bcrypt from "bcryptjs";
import { User, type UserRole } from "../../entitties/usuarios.js";
import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute({
    name,
    email,
    password,
    role
  }: CreateUserRequest): Promise<User> {

    const userAlreadyExists =
      await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash,
      role
    });

    return await this.userRepository.create(user);
  }
}