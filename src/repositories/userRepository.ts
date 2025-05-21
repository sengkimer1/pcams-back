import { Pool, Client, PoolClient } from "pg";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  IUser,
  IUserRepository,
  IUserWithoutPassword,
} from "../interfaces/userinterfaces";
import { CampUser } from "../interfaces/campUserInterface";
import { queryWithLogging } from "./utils";

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async createCampUser(campUser: { user_id: string; camp_id: string }): Promise<CampUser> {
    const { user_id, camp_id } = campUser;
    const id = uuidv4();
    const { rows } = await queryWithLogging(
      this.pool,
      `INSERT INTO camp_user (id, user_id, camp_id, is_active) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_id, camp_id, is_active`,
      [id, user_id, camp_id, true]
    );
    return {
      id,
      user_id,
      camp_id,
      is_active: true,
    };
  }

  async findAll(): Promise<IUserWithoutPassword[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  async create(user: Omit<IUser, "id">, client?: Client | PoolClient): Promise<IUserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    const id = uuidv4();
    const { role_id, khmer_name, english_name, date_of_birth, nationality, position, email } = user;
    const queryText = `
      INSERT INTO users (
        id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email, password
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
      RETURNING id, role_id, khmer_name, english_name, date_of_birth, nationality, position, email
    `;
    const { rows } = client
      ? await client.query(queryText, [
          id,
          role_id,
          khmer_name,
          english_name,
          date_of_birth,
          nationality,
          position,
          email,
          hashedPassword,
        ])
      : await queryWithLogging(this.pool, queryText, [
          id,
          role_id,
          khmer_name,
          english_name,
          date_of_birth,
          nationality,
          position,
          email,
          hashedPassword,
        ]);
    return rows[0];
  }

  async update(
    id: string,
    user: Partial<IUser>
  ): Promise<IUserWithoutPassword | null> {
    const { khmer_name, english_name, date_of_birth, nationality, position, email, role_id } = user;
    const { rows } = await queryWithLogging(
      this.pool,
      `UPDATE users 
       SET khmer_name = $1, english_name = $2, date_of_birth = $3, nationality = $4, 
           position = $5, email = $6, role_id = $7
       WHERE id = $8 
       RETURNING id, email, role_id, khmer_name, english_name, date_of_birth, nationality, position`,
      [khmer_name, english_name, date_of_birth, nationality, position, email, role_id, id]
    );
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await queryWithLogging(this.pool, `DELETE FROM users WHERE id = $1`, [id]);
    return (rowCount ?? 0) > 0;
  }

  async getOneUserByRole(roleName: string): Promise<IUserWithoutPassword | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT u.id, u.email, u.role_id, u.khmer_name, u.english_name, u.date_of_birth, u.nationality, u.position
       FROM users u
       JOIN role r ON u.role_id = r.id
       WHERE r.name = $1
       LIMIT 1`,
      [roleName]
    );
    return rows[0] || null;
  }

  async createUserCamp(
    user: Omit<IUser, "id"> & { camp_id: string },
    client?: Client
  ): Promise<{ user: IUserWithoutPassword; campUser: CampUser }> {
    const dbClient = client || (await this.pool.connect());
    try {
      if (!client) await dbClient.query("BEGIN");

      const newUser = await this.create(user, dbClient);

      const campUserData: CampUser = {
        id: uuidv4(),
        camp_id: user.camp_id,
        user_id: newUser.id!,
        is_active: true,
      };
      const { rows: campRows } = await dbClient.query(
        `INSERT INTO camp_user (id, camp_id, user_id, is_active) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [campUserData.id, campUserData.camp_id, campUserData.user_id, campUserData.is_active]
      );

      if (!client) await dbClient.query("COMMIT");
      return { user: newUser, campUser: campRows[0] };
    } catch (error) {
      if (!client) await dbClient.query("ROLLBACK");
      throw error;
    } finally {
      if (!client && "release" in dbClient) dbClient.release();
    }
  }

  async findAllUserCamps(): Promise<(IUserWithoutPassword & { camp_id: string })[]> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT u.id, u.email, u.role_id, u.khmer_name, u.english_name, u.date_of_birth, 
              u.nationality, u.position, cu.camp_id
       FROM users u
       JOIN camp_user cu ON u.id = cu.user_id`
    );
    return rows;
  }

  async findUserCampById(id: string): Promise<(IUserWithoutPassword & { camp_id: string }) | null> {
    const { rows } = await queryWithLogging(
      this.pool,
      `SELECT u.id, u.email, u.role_id, u.khmer_name, u.english_name, u.date_of_birth, 
              u.nationality, u.position, cu.camp_id
       FROM users u
       JOIN camp_user cu ON u.id = cu.user_id
       WHERE u.id = $1
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }
}