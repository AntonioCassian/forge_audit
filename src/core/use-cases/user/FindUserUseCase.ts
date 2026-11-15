import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

export class FindUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}