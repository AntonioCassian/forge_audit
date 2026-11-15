export interface ITokenProvider {
  generate(payload: {
    sub: string;
    name: string;
    role: string;
  }): string;
}
