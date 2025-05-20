import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { CampUser, CampUserRepository } from "../interfaces/campUserInterface";

export class PostgresCampUserRepository implements CampUserRepository {
  constructor(private pool: Pool) {}

  async create(data: CampUser): Promise<CampUser> {
    const id = uuidv4();
    const { camp_id, user_id, is_active } = data;
    const { rows } = await this.pool.query(
      `INSERT INTO camp_user (id, camp_id, user_id, is_active) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, camp_id, user_id, is_active]
    );
    return rows[0];
  }

  async findAll(): Promise<CampUser[]> {
    const { rows } = await this.pool.query(
      `SELECT id, camp_id, user_id, is_active FROM camp_user`
    );
    return rows;
  }

  async findById(id: string): Promise<CampUser | null> {
    const { rows } = await this.pool.query(
      `SELECT id, camp_id, user_id, is_active FROM camp_user WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }
}