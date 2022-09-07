import jwt from "jsonwebtoken";
import AppConstants from "../constants/app-constants.js";

const TOKEN_DURATION = {
    NORMAL: "30m",
    LONG: "90 days",
};

export function generateAccessToken(data) {
    return jwt.sign(data, AppConstants.JWT_ACCESS_SECRET_KEY, {
        expiresIn: TOKEN_DURATION.NORMAL,
    });
}

export function generatePairOfTokenFromRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            AppConstants.JWT_REFRESH_SECRET_KEY,
            (err, data) => {
                if (err) {
                    return reject(err);
                }

                delete data.iat;
                delete data.exp;

                resolve([
                    generateAccessToken(data),
                    generateRefreshToken(data),
                ]);
            }
        );
    });
}

export function generateRefreshToken(data) {
    return jwt.sign(data, AppConstants.JWT_REFRESH_SECRET_KEY, {
        expiresIn: TOKEN_DURATION.LONG,
    });
}

export function verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, AppConstants.JWT_ACCESS_SECRET_KEY, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}
