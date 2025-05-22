import { Pool } from "pg";
import { IEvent, IEventRepository } from "../interfaces/eventInterface";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresEventRepository implements IEventRepository {
  constructor(private pool: Pool) {}

  async create(event: Omit<IEvent, "id">): Promise<IEvent> {
    const id = uuidv4();
    const { event_name, from_date, end_date, created_at = new Date() } = event;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO event (
        id, event_name, from_date, end_date, created_at
      ) VALUES (
        $1, $2, $3, $4, $5
      )
      RETURNING id, event_name, from_date, end_date, created_at`,
      [id, event_name, from_date, end_date, created_at]
    );
    return rows[0];
  }

  async findAll(): Promise<IEvent[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, event_name, from_date, end_date, created_at FROM event`
    );
    return rows;
  }
}