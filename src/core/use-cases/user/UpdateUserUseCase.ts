import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

interface IRequest {
  id: string;
  name?: string;
  email?: string;
}

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: IRequest) {
    const user = await this.userRepository.findById(data.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);

      if (emailExists) {
        throw new Error("Email already registered");
      }

      user.email = data.email;
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    return this.userRepository.save(user);
  }
}