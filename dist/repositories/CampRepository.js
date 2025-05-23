"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresCampRepository = void 0;
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
class PostgresCampRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(camp) {
        const id = (0, uuid_1.v4)();
        const { camp_name, camp_location, created_at = new Date() } = camp;
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `INSERT INTO camp (
        id, camp_name, camp_location, created_at
      ) VALUES (
        $1, $2, $3, $4
      )
      RETURNING id, camp_name, camp_location, created_at`, [id, camp_name, camp_location, created_at]);
        return rows[0];
    }
    async findAll() {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, camp_name, camp_location, created_at FROM camp`);
        return rows;
    }
    async findById(id) {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, camp_name, camp_location, created_at FROM camp WHERE id = $1`, [id]);
        return rows[0] || null;
    }
}
exports.PostgresCampRepository = PostgresCampRepository;
