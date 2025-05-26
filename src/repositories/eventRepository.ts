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

  async findById(id: string): Promise<IEvent | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, event_name, from_date, end_date, created_at FROM event WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async update(id: string, data: Partial<IEvent>): Promise<IEvent> {
    const fields = [];
    const values = [];
    let index = 2; // Start at 2 because $1 is the id

    if (data.event_name) {
      fields.push(`event_name = $${index}`);
      values.push(data.event_name);
      index++;
    }
    if (data.from_date) {
      fields.push(`from_date = $${index}`);
      values.push(data.from_date);
      index++;
    }
    if (data.end_date) {
      fields.push(`end_date = $${index}`);
      values.push(data.end_date);
      index++;
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `UPDATE event SET ${fields.join(", ")} WHERE id = $1 RETURNING *`;
    const { rows } = await queryWithLogging(this.pool, query, [id, ...values]);

    if (!rows[0]) {
      throw new Error("Event not found");
    }
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    const { rowCount } = await queryWithLogging(
      this.pool,
      `DELETE FROM event WHERE id = $1`,
      [id]
    );
    if (rowCount === 0) {
      throw new Error("Event not found");
    }
  }
}