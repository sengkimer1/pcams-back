import { Pool } from "pg";
import { IUser, IUserRepository, IUserWithoutPassword } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";

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

  async create(user: IUser): Promise<IUserWithoutPassword> {
    const {
      email,
      password,
      role_id,
      khmer_name,
      english_name,
      age,
      national,
      position
    } = user;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (email, password, role_id, khmer_name, english_name, age, national, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, role_id, khmer_name, english_name, age, national, position`,
      [email, password, role_id, khmer_name, english_name, age, national, position]
    );

    return rows[0];
  }
}
