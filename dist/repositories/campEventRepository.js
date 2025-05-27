"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresCampEventRepository = void 0;
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
class PostgresCampEventRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(campEvent) {
        const id = (0, uuid_1.v4)();
        const { camp_id, event_id, created_at = new Date() } = campEvent;
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `INSERT INTO camp_event (
        id, camp_id, event_id, created_at
      ) VALUES (
        $1, $2, $3, $4
      )
      RETURNING id, camp_id, event_id, created_at`, [id, camp_id, event_id, created_at]);
        return rows[0];
    }
    async findAll() {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT 
         ce.id, 
         ce.camp_id, 
         c.camp_name, 
         ce.event_id, 
         ce.created_at 
       FROM camp_event ce
       JOIN camp c ON ce.camp_id = c.id`);
        return rows;
    }
    async findById(id) {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, camp_id, event_id, created_at FROM camp_event WHERE id = $1`, [id]);
        return rows[0] || null;
    }
    async update(id, campEvent) {
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
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `UPDATE camp_event SET ${updates.join(", ")} WHERE id = $${index} RETURNING id, camp_id, event_id, created_at`, values);
        if (!rows[0]) {
            throw new Error("Camp-event not found");
        }
        return rows[0];
    }
    async delete(id) {
        const { rowCount } = await (0, utils_1.queryWithLogging)(this.pool, `DELETE FROM camp_event WHERE id = $1`, [id]);
        return (rowCount ?? 0) > 0;
    }
}
exports.PostgresCampEventRepository = PostgresCampEventRepository;
