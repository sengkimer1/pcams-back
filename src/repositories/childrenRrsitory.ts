import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { IChild, IChildRepository } from "../interfaces/childrenInterfaces";
import { queryWithLogging } from "./utils";

export class PostgresChildRepository implements IChildRepository {
  constructor(private pool: Pool) {}

  async create(child: Omit<IChild, "id">): Promise<IChild> {
    const id = uuidv4();
    const {
      english_name,
      khmer_name,
      family_id,
      age,
      gender,
      image_url,
      registered_date,
      description,
      camp_id,
    } = child;

    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO children (
        id, english_name, khmer_name, family_id, age, gender,
        image_url, registered_date, description, camp_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10
      )
      RETURNING *`,
      [
        id,
        english_name,
        khmer_name,
        family_id ?? null,
        age ?? null,
        gender ?? null,
        image_url ?? null,
        registered_date ?? null,
        description ?? null,
        camp_id,
      ]
    );

    return rows[0];
  }

  async findAll(): Promise<IChild[]> {
    const { rows } = await queryWithLogging(this.pool, `SELECT * FROM children`);
    return rows;
  }

  async findById(id: string): Promise<IChild | null> {
    const { rows } = await queryWithLogging(this.pool, `SELECT * FROM children WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async findByCampId(campId: string): Promise<IChild[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT * FROM children WHERE camp_id = $1`,
      [campId]
    );
    return rows;
  }
}
