import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { CampEventOrganizer, CampEventOrganizerRepository } from "../interfaces/campEventOrganizerInterface";

export class PostgresCampEventOrganizerRepository implements CampEventOrganizerRepository {
  constructor(private pool: Pool) {}

  async create(data: Omit<CampEventOrganizer, "id" | "created_at">): Promise<CampEventOrganizer> {
    const id = uuidv4();
    const { camp_event_id, user_id } = data;
    const created_at = new Date();
    const { rows } = await this.pool.query(
      `INSERT INTO camp_event_organizer (id, camp_event_id, user_id, created_at) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, camp_event_id, user_id, created_at]
    );
    return rows[0];
  }

  async findAll(): Promise<CampEventOrganizer[]> {
    const { rows } = await this.pool.query(
      `SELECT id, camp_event_id, user_id, created_at FROM camp_event_organizer`
    );
    return rows;
  }

  async findById(id: string): Promise<CampEventOrganizer | null> {
    const { rows } = await this.pool.query(
      `SELECT id, camp_event_id, user_id, created_at FROM camp_event_organizer WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }
}