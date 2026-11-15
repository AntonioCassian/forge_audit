
import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    sourceIp: {
      type: String,
      required: true,
    },

    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    action: {
      type: String,
      required: true,
    },

    affectedEntity: {
      type: String,
      enum: ["ordem_producao", "equipamento"],
      required: true,
    },

    affectedRecordId: {
      type: String,
      required: true,
    },

    previousData: {
      type: Schema.Types.Mixed,
      default: undefined,
    },

    newData: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes for faster queries
auditLogSchema.index({ userId: 1, dateTime: -1 });

auditLogSchema.index({
  affectedEntity: 1,
  affectedRecordId: 1,
});

export const AuditLogModel = mongoose.model(
  "AuditLog",
  auditLogSchema,
  "audit_logs"
);
