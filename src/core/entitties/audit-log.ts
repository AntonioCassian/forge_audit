import type { UserRole } from "./usuarios.js";

export type AuditEntity = "ordem_producao" | "equipamento";

export interface AuditLogProps {
  id?: string;
  userId: string;
  userName: string;
  role: UserRole;
  sourceIp: string;
  dateTime: Date;
  action: string;
  affectedEntity: AuditEntity;
  affectedRecordId: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

export class AuditLog {
  public readonly id?: string | undefined;
  public readonly userId: string;
  public readonly userName: string;
  public readonly role: UserRole;
  public readonly sourceIp: string;
  public readonly dateTime: Date;
  public readonly action: string;
  public readonly affectedEntity: AuditEntity;
  public readonly affectedRecordId: string;
  public readonly previousData: Record<string, unknown> | undefined;
  public readonly newData: Record<string, unknown> | undefined;

  constructor(props: AuditLogProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.userName = props.userName;
    this.role = props.role;
    this.sourceIp = props.sourceIp;
    this.dateTime = props.dateTime;
    this.action = props.action;
    this.affectedEntity = props.affectedEntity;
    this.affectedRecordId = props.affectedRecordId;
    this.previousData = props.previousData;
    this.newData = props.newData;
  }
}