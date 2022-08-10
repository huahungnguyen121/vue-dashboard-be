import jwt from "jsonwebtoken";
import AppConstants from "../constants/app-constants.js";

const TOKEN_DURATION = "30m";

export function generateAccessToken(data) {
    return jwt.sign(data, AppConstants.JWT_ACCESS_SECRET_KEY, {
        expiresIn: TOKEN_DURATION,
    });
}

export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, AppConstants.JWT_ACCESS_SECRET_KEY, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}
