import { Pool } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword, UserRole } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) { }

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, username, email, role, nationality, created_at FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, username, email, role, nationality, created_at FROM users WHERE id = $1`,
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
    const { username, email, role, nationality, created_at = new Date() } = user;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
        id, username, email, password, role, nationality, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING id, username, email, role, nationality, created_at`,
      [id, username, email, hashedPassword, role, nationality, created_at]
    );
    return rows[0];
  }

  async update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null> {
    const { username, email, role, nationality, created_at } = user;
    const updates = [];
    const values = [];
    let index = 1;

    if (username !== undefined) {
      updates.push(`username = $${index++}`);
      values.push(username);
    }
    if (email !== undefined) {
      updates.push(`email = $${index++}`);
      values.push(email);
    }
    if (role !== undefined) {
      updates.push(`role = $${index++}`);
      values.push(role);
    }
    if (nationality !== undefined) {
      updates.push(`nationality = $${index++}`);
      values.push(nationality);
    }
    if (created_at !== undefined) {
      updates.push(`created_at = $${index++}`);
      values.push(created_at);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE users 
       SET ${updates.join(", ")}
       WHERE id = $${index}
       RETURNING id, username, email, role, nationality, created_at`,
      values
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
      `SELECT id, username, email, role, nationality, created_at FROM users WHERE role = $1 LIMIT 1`,
      [roleName]
    );
    return rows[0] || null;
  }
  async getUserbycamp(camp_event_id: string): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT b.* 
       FROM public.camp_event_organizer a
       JOIN public.users b ON a.user_id = b.id
       WHERE a.camp_event_id = $1`,
      [camp_event_id]
    );
    return rows;
  }
  
  
}