
import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function runSeed() {
  try {
    console.log("🌱 Iniciando o seed do banco de dados...");

    const adminEmail = "admin@forgeaudit.com";

    // Verifica se o administrador já existe
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail]
    );

    if (checkUser.rowCount && checkUser.rowCount > 0) {
      console.log("⚠️ O administrador já existe.");
      return;
    }

    const id = crypto.randomUUID();
    const name = "Administrador Mestre";
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    const role = "SUPERVISOR";

    await pool.query(
      `INSERT INTO users
       (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, name, adminEmail, passwordHash, role]
    );

    console.log("✅ Administrador criado com sucesso!");
    console.log("📧 E-mail: admin@forgeaudit.com");
    console.log("🔑 Senha inicial: Admin@123");

  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSeed();
