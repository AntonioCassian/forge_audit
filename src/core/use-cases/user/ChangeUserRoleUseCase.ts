import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";
import type { UserRole } from "../../entitties/usuarios.js";

interface IRequest {
  id: string;
  role: UserRole;
}

export class ChangeUserRoleUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute({ id, role }: IRequest) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.role = role;

    return this.userRepository.save(user);
  }
}