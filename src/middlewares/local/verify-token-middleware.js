import ResponseBuilder from "../../common/response.js";
import ResponseMSG from "../../constants/response-msg.js";
import {
    generatePairOfTokenFromRefreshToken,
    verifyAccessToken,
} from "../../utils/jwt.js";

export async function verifyToken(req, res, next) {
    const token = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];

    if (token == null || token === "") {
        return new ResponseBuilder()
            .clearCookie(["access-token"])
            .setStatusCode(400)
            .setMessage(ResponseMSG.INVALID_TOKEN)
            .getResponse()
            .send(res);
    }

    try {
        const data = await verifyAccessToken(token);
        res.locals.user = data;
        res.body = req.body;
    } catch (err) {
        console.error("Verify token middleware err: " + err);

        if (refreshToken == null || refreshToken === "") {
            return new ResponseBuilder()
                .clearCookie(["access-token", "refresh-token"])
                .setStatusCode(401)
                .setMessage(
                    err.name === "TokenExpiredError"
                        ? ResponseMSG.EXPIRED_TOKEN
                        : ResponseMSG.INVALID_TOKEN
                )
                .getResponse()
                .send(res);
        }
        try {
            const [newAccessToken, newRefreshToken] =
                await generatePairOfTokenFromRefreshToken(refreshToken);

            new ResponseBuilder()
                .setHttpCookies([
                    {
                        name: "access-token",
                        value: newAccessToken,
                    },
                    {
                        name: "refresh-token",
                        value: newRefreshToken,
                    },
                ])
                .getResponse()
                .applyCookies(res);
        } catch (genNewTokenErr) {
            console.error(
                "Verify token middleware - Gen token err: " + genNewTokenErr
            );
            return new ResponseBuilder()
                .clearCookie(["access-token", "refresh-token"])
                .setStatusCode(401)
                .setMessage(
                    genNewTokenErr.name === "TokenExpiredError"
                        ? ResponseMSG.EXPIRED_TOKEN
                        : ResponseMSG.INVALID_TOKEN
                )
                .getResponse()
                .send(res);
        }
    }

    next();
}
