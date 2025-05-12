import { Pool } from "pg";
import bcrypt from "bcrypt";
import { IUser, IUserRepository, IUserWithoutPassword } from "../interfaces/userinterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position FROM users WHERE id = $1`,
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
    } = user;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO users (
        id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, password
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      RETURNING id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email`,
      [id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, hashedPassword]
    );

    return rows[0];
  }
}
