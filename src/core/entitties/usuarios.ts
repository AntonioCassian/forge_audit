export type UserRole = "OPERATOR" | "SUPERVISOR" | "AUDITOR";

interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export class User {
  public readonly id?: string | undefined;
  public name: string;
  public email: string;
  public passwordHash: string;
  public role: UserRole;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
  }
}