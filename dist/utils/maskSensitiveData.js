"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskSensitiveData = maskSensitiveData;
function maskSensitiveData(body) {
    const masked = { ...body };
    const sensitiveFields = ["password", "email", "phone_number", "profile_picture", "address"];
    for (const field of sensitiveFields) {
        if (masked[field])
            masked[field] = "***";
    }
    return masked;
}
