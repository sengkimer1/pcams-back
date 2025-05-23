"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresCampEventOrganizerRepository = void 0;
const uuid_1 = require("uuid");
class PostgresCampEventOrganizerRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const id = (0, uuid_1.v4)();
        const { camp_event_id, user_id } = data;
        const created_at = new Date();
        const { rows } = await this.pool.query(`INSERT INTO camp_event_organizer (id, camp_event_id, user_id, created_at) 
       VALUES ($1, $2, $3, $4) RETURNING *`, [id, camp_event_id, user_id, created_at]);
        return rows[0];
    }
    async findAll() {
        const { rows } = await this.pool.query(`SELECT id, camp_event_id, user_id, created_at FROM camp_event_organizer`);
        return rows;
    }
    async findById(id) {
        const { rows } = await this.pool.query(`SELECT id, camp_event_id, user_id, created_at FROM camp_event_organizer WHERE id = $1`, [id]);
        return rows[0] || null;
    }
}
exports.PostgresCampEventOrganizerRepository = PostgresCampEventOrganizerRepository;
