import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

export class DeleteUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);
  }
}