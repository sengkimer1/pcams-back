"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresUserRepository = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
class PostgresUserRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, username, email, role, nationality, created_at FROM users`);
        return rows;
    }
    async findById(id) {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, username, email, role, nationality, created_at FROM users WHERE id = $1`, [id]);
        return rows[0] || null;
    }
    async findByEmail(email) {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT * FROM users WHERE email = $1`, [email]);
        return rows[0] || null;
    }
    async create(user) {
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        const id = (0, uuid_1.v4)();
        const { username, email, role, nationality, created_at = new Date() } = user;
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `INSERT INTO users (
        id, username, email, password, role, nationality, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING id, username, email, role, nationality, created_at`, [id, username, email, hashedPassword, role, nationality, created_at]);
        return rows[0];
    }
    async update(id, user) {
        const { username, email, role, nationality, created_at } = user;
        const updates = [];
        const values = [];
        let index = 1;
        if (username !== undefined) {
            updates.push(`username = $${index++}`);
            values.push(username);
        }
        if (email !== undefined) {
            updates.push(`email = $${index++}`);
            values.push(email);
        }
        if (role !== undefined) {
            updates.push(`role = $${index++}`);
            values.push(role);
        }
        if (nationality !== undefined) {
            updates.push(`nationality = $${index++}`);
            values.push(nationality);
        }
        if (created_at !== undefined) {
            updates.push(`created_at = $${index++}`);
            values.push(created_at);
        }
        if (updates.length === 0)
            return null;
        values.push(id);
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `UPDATE users 
       SET ${updates.join(", ")}
       WHERE id = $${index}
       RETURNING id, username, email, role, nationality, created_at`, values);
        return rows[0] || null;
    }
    async delete(id) {
        const { rowCount } = await (0, utils_1.queryWithLogging)(this.pool, `DELETE FROM users WHERE id = $1`, [id]);
        return (rowCount ?? 0) > 0;
    }
    async getOneUserByRole(roleName) {
        const { rows } = await (0, utils_1.queryWithLogging)(this.pool, `SELECT id, username, email, role, nationality, created_at FROM users WHERE role = $1 LIMIT 1`, [roleName]);
        return rows[0] || null;
    }
}
exports.PostgresUserRepository = PostgresUserRepository;
