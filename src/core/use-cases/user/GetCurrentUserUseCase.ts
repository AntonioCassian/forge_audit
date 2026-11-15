import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

export class GetCurrentUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}