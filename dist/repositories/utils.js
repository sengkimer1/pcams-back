"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryWithLogging = queryWithLogging;
const loggerService_1 = require("../services/loggerService");
async function queryWithLogging(pool, sql, params = [], requestId) {
    const startTime = Date.now();
    try {
        const result = await pool.query(sql, params);
        const duration = Date.now() - startTime;
        loggerService_1.logger.info("Database query executed", {
            requestId,
            sql,
            params,
            rowCount: result.rowCount,
            duration: `${duration}ms`,
        });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            const duration = Date.now() - startTime;
            loggerService_1.logger.error("Database query failed", {
                requestId,
                sql,
                params,
                error: error.message,
                duration: `${duration}ms`,
            });
        }
        throw error;
    }
}
