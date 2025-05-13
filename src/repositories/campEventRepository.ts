import { Pool } from "pg";
import { ICampEvan, ICampEventRepository } from "../interfaces/campEvenInterfaces";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from 'uuid';

export class PostgresCampEventRepository implements ICampEventRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<ICampEvan[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_event_name FROM camp_event`
    );
    return rows;
  }

  async findById(id: string): Promise<ICampEvan | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_event_name FROM camp_event WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async create(data: ICampEvan): Promise<ICampEvan> {
    const { camp_event_name } = data;
    const campeventId = uuidv4();
    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO camp_event (id,camp_event_name) VALUES ($1,$2) RETURNING id, camp_event_name`,
      [campeventId,camp_event_name]
    );
    return rows[0];
  }
}
