"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresEventRepository = void 0;
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
class PostgresEventRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(event) {
        const id = (0, uuid_1.v4)();
        const { event_name, from_date, end_date, created_at = new Date() } = event;
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `INSERT INTO event (
        id, event_name, from_date, end_date, created_at
      ) VALUES (
        $1, $2, $3, $4, $5
      )
      RETURNING id, event_name, from_date, end_date, created_at`, [id, event_name, from_date, end_date, created_at]);
        return rows[0];
    }
    async findAll() {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, event_name, from_date, end_date, created_at FROM event`);
        return rows;
    }
}
exports.PostgresEventRepository = PostgresEventRepository;
