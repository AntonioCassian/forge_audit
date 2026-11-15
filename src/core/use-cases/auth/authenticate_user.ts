import type { IHashProvider } from "../../../infra/repositories/IHashProvider.js";
import type { ITokenProvider } from "../../../infra/repositories/ITokenProvider.js";
import type { IUserRepository } from "../../../infra/repositories/IUserRepository.js";

interface IRequest {
  email: string;
  password: string;
}

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider
  ) {}

  async execute({ email, password }: IRequest) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }

    if (!user.id) {
      throw new Error("Usuário inválido.");
    }

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatched) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const token = this.tokenProvider.generate({
      sub: user.id,
      name: user.name,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}