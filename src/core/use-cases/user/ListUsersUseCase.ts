import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

export class ListUsersUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute() {
    return this.userRepository.findAll();
  }
}