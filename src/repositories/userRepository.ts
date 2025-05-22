import { Pool } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  private async validatePosition(roleName: string): Promise<void> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id FROM role WHERE name = $1`,
      [roleName]
    );
    if (!rows[0]) {
      throw Object.assign(new Error(`Invalid position: '${roleName}' not found in role table`), { status: 400 });
    }
  }

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, khmer_name, english_name, date_of_birth, nationality, position, camp_id FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, khmer_name, english_name, date_of_birth, nationality, position, camp_id FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, password, khmer_name, english_name, date_of_birth, nationality, position, camp_id FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  async create(user: Omit<IUser, "id">): Promise<IUserWithoutPassword> {
    if (!user.camp_id) {
      throw Object.assign(new Error("Camp ID is required"), { status: 400 });
    }
    if (!user.email || !user.password || !user.position || !user.khmer_name || !user.english_name || !user.date_of_birth || !user.nationality) {
      throw Object.assign(new Error("All required fields must be provided"), { status: 400 });
    }

    await this.validatePosition(user.position);

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const id = uuidv4();
    const {
      position,
      khmer_name,
      english_name,
      date_of_birth,
      nationality,
      email,
      camp_id,
    } = user;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
        id, khmer_name, english_name, date_of_birth, nationality, position, email, password, camp_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      RETURNING id, khmer_name, english_name, date_of_birth, nationality, position, email, camp_id`,
      [id, khmer_name, english_name, date_of_birth, nationality, position, email, hashedPassword, camp_id]
    );
    return rows[0];
  }

  async update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (user.khmer_name !== undefined) {
      fields.push(`khmer_name = $${index++}`);
      values.push(user.khmer_name);
    }
    if (user.english_name !== undefined) {
      fields.push(`english_name = $${index++}`);
      values.push(user.english_name);
    }
    if (user.date_of_birth !== undefined) {
      fields.push(`date_of_birth = $${index++}`);
      values.push(user.date_of_birth);
    }
    if (user.nationality !== undefined) {
      fields.push(`nationality = $${index++}`);
      values.push(user.nationality);
    }
    if (user.position !== undefined) {
      await this.validatePosition(user.position);
      fields.push(`position = $${index++}`);
      values.push(user.position);
    }
    if (user.email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(user.email);
    }
    if (user.camp_id !== undefined) {
      fields.push(`camp_id = $${index++}`);
      values.push(user.camp_id);
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} 
                   RETURNING id, khmer_name, english_name, date_of_birth, nationality, position, email, camp_id`;
    
    const { rows } = await queryWithLogging(this.pool, query, values);
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

  async getOneUserByRole(roleName: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, khmer_name, english_name, date_of_birth, nationality, position, camp_id 
       FROM users WHERE position = $1 LIMIT 1`,
      [roleName]
    );
    return rows[0] || null;
  }
}