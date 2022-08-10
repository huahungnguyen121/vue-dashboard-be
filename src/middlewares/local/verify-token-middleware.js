import ResponseBuilder from "../../common/response.js";
import ResponseMSG from "../../constants/response-msg.js";
import { verifyToken } from "../../utils/jwt.js";

export async function verifyAccessToken(req, res, next) {
    const token = req.cookies["access-token"];

    if (token == null) {
        return new ResponseBuilder()
            .clearCookie("access-token")
            .setStatusCode(400)
            .setMessage(ResponseMSG.INVALID_ACCESS_TOKEN)
            .getResponse()
            .send(res);
    }

    try {
        const data = await verifyToken(token);
        res.locals.user = data;
        res.body = req.body;
    } catch (err) {
        return new ResponseBuilder()
            .clearCookie("access-token")
            .setStatusCode(401)
            .setMessage(
                err.name === "TokenExpiredError"
                    ? ResponseMSG.EXPIRED_ACCESS_TOKEN
                    : ResponseMSG.INVALID_ACCESS_TOKEN
            )
            .getResponse()
            .send(res);
    }

    next();
}
