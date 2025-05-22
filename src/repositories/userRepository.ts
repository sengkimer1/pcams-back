import { Pool } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword, UserRole } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, username, email, role, created_at FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, username, email, role, created_at FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  async create(user: Omit<IUser, "id">): Promise<IUserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const id = uuidv4();
    const { username, email, role, created_at = new Date() } = user;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
        id, username, email, password, role, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING id, username, email, role, created_at`,
      [id, username, email, hashedPassword, role, created_at]
    );
    return rows[0];
  }

  async update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null> {
    const { username, email, role, created_at } = user;
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE users 
       SET username = $1, email = $2, role = $3, created_at = $4
       WHERE id = $5 
       RETURNING id, username, email, role, created_at`,
      [username, email, role, created_at, id]
    );
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await queryWithLogging(
      this.pool,
      `DELETE FROM users WHERE id = $1`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  async getOneUserByRole(roleName: UserRole): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, username, email, role, created_at FROM users WHERE role = $1 LIMIT 1`,
      [roleName]
    );
    return rows[0] || null;
  }
}