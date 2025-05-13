import { Pool } from "pg";
import { ICamp, ICampRepository } from "../interfaces/campsInterface";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresCampRepository implements ICampRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<ICamp[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_event_id, camp_name, location FROM camp`
    );
    return rows;
  }

  async findById(id: string): Promise<ICamp | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_event_id, camp_name, location FROM camp WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async create(data: ICamp): Promise<ICamp> {
    const id = uuidv4();
    const { camp_event_id, camp_name, location } = data;
    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO camp (id, camp_event_id, camp_name, location) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, camp_event_id, camp_name, location]
    );
    return rows[0];
  }

  async update(id: string, data: ICamp): Promise<ICamp | null> {
    const { camp_event_id, camp_name, location } = data;
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE camp SET camp_event_id = $1, camp_name = $2, location = $3 WHERE id = $4 RETURNING *`,
      [camp_event_id, camp_name, location, id]
    );
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await queryWithLogging(
      this.pool,
      `DELETE FROM camp WHERE id = $1`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  }
}
