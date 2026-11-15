import type { IHashProvider } from "../../../infra/repositories/IHashProvider.js";
import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

interface IRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class ChangePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(data: IRequest): Promise<void> {
    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatches = await this.hashProvider.compare(
      data.currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new Error("Current password is incorrect");
    }

    const newPasswordHash = await this.hashProvider.hash(
      data.newPassword
    );

    user.passwordHash = newPasswordHash;

    await this.userRepository.save(user);
  }
}