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
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, camp_id, event_id, created_at FROM camp_event`);
        return rows;
    }
}
exports.PostgresCampEventRepository = PostgresCampEventRepository;
