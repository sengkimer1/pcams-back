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
  
}