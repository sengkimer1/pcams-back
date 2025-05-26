import { Pool } from "pg";
import { ICampEvent, ICampEventRepository } from "../interfaces/campEventInterface";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresCampEventRepository implements ICampEventRepository {
  constructor(private pool: Pool) {}

  async create(campEvent: Omit<ICampEvent, "id">): Promise<ICampEvent> {
    const id = uuidv4();
    const { camp_id, event_id, created_at = new Date() } = campEvent;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO camp_event (
        id, camp_id, event_id, created_at
      ) VALUES (
        $1, $2, $3, $4
      )
      RETURNING id, camp_id, event_id, created_at`,
      [id, camp_id, event_id, created_at]
    );
    return rows[0];
  }

  async findAll(): Promise<ICampEvent[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT 
         ce.id, 
         ce.camp_id, 
         c.camp_name, 
         ce.event_id, 
         ce.created_at 
       FROM camp_event ce
       JOIN camp c ON ce.camp_id = c.id`
    );
    return rows;
  }

  async findById(id: string): Promise<ICampEvent | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, camp_id, event_id, created_at FROM camp_event WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async update(id: string, campEvent: Partial<Omit<ICampEvent, "id">>): Promise<ICampEvent> {
    const { camp_id, event_id, created_at } = campEvent;
    const updates = [];
    const values = [];
    let index = 1;

    if (camp_id !== undefined) {
      updates.push(`camp_id = $${index++}`);
      values.push(camp_id);
    }
    if (event_id !== undefined) {
      updates.push(`event_id = $${index++}`);
      values.push(event_id);
    }
    if (created_at !== undefined) {
      updates.push(`created_at = $${index++}`);
      values.push(created_at);
    }

    if (updates.length === 0) {
      throw new Error("No updates provided");
    }

    values.push(id);
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE camp_event SET ${updates.join(", ")} WHERE id = $${index} RETURNING id, camp_id, event_id, created_at`,
      values
    );
    if (!rows[0]) {
      throw new Error("Camp-event not found");
    }
    return rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await queryWithLogging(
      this.pool,
      `DELETE FROM camp_event WHERE id = $1`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  }
}