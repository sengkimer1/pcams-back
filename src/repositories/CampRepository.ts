import { Pool } from "pg";
import { ICamp, ICampRepository } from "../interfaces/campInterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresCampRepository implements ICampRepository {
  constructor(private pool: Pool) {}

  async create(camp: Omit<ICamp, "id">): Promise<ICamp> {
    const id = uuidv4();
    const { camp_name, camp_location, created_at = new Date() } = camp;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO camp (
        id, camp_name, camp_location, created_at
      ) VALUES (
        $1, $2, $3, $4
      )
      RETURNING id, camp_name, camp_location, created_at`,
      [id, camp_name, camp_location, created_at]
    );
    return rows[0];
  }

  async findAll(): Promise<ICamp[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_name, camp_location, created_at FROM camp`
    );
    return rows;
  }

  async findById(id: string): Promise<ICamp | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_name, camp_location, created_at FROM camp WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }
}