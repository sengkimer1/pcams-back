import { Pool,QueryResult } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from 'uuid';


export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role, full_name, phone_number, profile_picture, address FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role, full_name, phone_number, profile_picture, address FROM users WHERE id = $1`,
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

}
