import { Pool } from "pg";
import { ICampEvan, ICampEventRepository } from "../interfaces/campEventsInterface";
import { queryWithLogging } from "./utils"; // Make sure this is implemented
import { v4 as uuidv4 } from "uuid";

export class PostgresCampEventRepository implements ICampEventRepository {
  constructor(private pool: Pool) {}

  async findAll(): Promise<ICampEvan[]> {
    try {
      const { rows } = await queryWithLogging(
        this.pool,
        `SELECT id, camp_event_name FROM camp_event`
      );
      return rows;
    } catch (error) {
      console.error("Error fetching all camp events:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<ICampEvan | null> {
    try {
      const { rows } = await queryWithLogging(
        this.pool,
        `SELECT id, camp_event_name FROM camp_event WHERE id = $1`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching camp event by ID:", error);
      throw error;
    }
  }

  async create(data: ICampEvan): Promise<ICampEvan> {
    try {
      const { camp_event_name } = data;
      const campeventId = uuidv4();

      const { rows } = await queryWithLogging(
        this.pool,
        `INSERT INTO camp_event (id, camp_event_name) VALUES ($1, $2) RETURNING id, camp_event_name`,
        [campeventId, camp_event_name]
      );

      return rows[0];
    } catch (error) {
      console.error("Error creating camp event:", error);
      throw error;
    }
  }
  async update(id: string, data: ICampEvan): Promise<ICampEvan | null> {
    const { camp_event_name } = data;
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE camp_event SET camp_event_name = $1 WHERE id = $2 RETURNING id, camp_event_name`,
      [camp_event_name, id]
    );
    return rows[0] || null;
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await queryWithLogging(
      this.pool,
      `DELETE FROM camp_event WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
  
}
