import { Pool } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) { }

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position, camp_id FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position, camp_id FROM users WHERE id = $1`,
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
    if (!user.camp_id) {
      console.warn("camp_id is missing, defaulting to null");
    }
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const id = uuidv4();
    const {
      role_id,
      khmer_name,
      english_name,
      date_of_birth,
      nationality,
      position,
      email,
      camp_id = null, // Default to null if not provided (for safety)
    } = user;
    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
        id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, password, camp_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, camp_id`,
      [id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, hashedPassword, camp_id]
    );
    return rows[0];
  }

  async update(id: string, user: Partial<Omit<IUser, "id" | "password"> & { password?: string }>): Promise<IUserWithoutPassword | null> {
    const { khmer_name, english_name, date_of_birth, nationality, position, email, role_id, camp_id } = user;
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE users 
       SET khmer_name = $1, english_name = $2, date_of_birth = $3, nationality = $4, position = $5, email = $6, role_id = $7, camp_id = $8
       WHERE id = $9 
       RETURNING id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, camp_id`,
      [khmer_name, english_name, date_of_birth, nationality, position, email, role_id, camp_id, id]
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

  async getOneUserByRole(roleName: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT u.* FROM users u JOIN role r ON u.role_id = r.id WHERE r.name = $1 LIMIT 1`,
      [roleName]
    );
    return rows[0] || null;
  }
}