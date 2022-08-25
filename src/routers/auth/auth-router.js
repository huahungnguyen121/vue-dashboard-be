import ResponseBuilder from "../../common/response.js";
import ResponseMSG from "../../constants/response-msg.js";
import { verifyAccessToken } from "../../middlewares/local/verify-token-middleware.js";
import UserModel from "../../models/user/user-model.js";
import { generateAccessToken } from "../../utils/jwt.js";
import BaseRouter from "../base/base-router.js";

export default class AuthRouter extends BaseRouter {
    constructor() {
        super("/auth");

        this.initRouter();
    }

    initRouter() {
        this._router.post("/login", this.handleLogin);
        this._router.post("/register", this.handleRegister);
        this._router.delete("/logout", this.handleLogout);
    }

    async handleLogin(req, res) {
        const { username, password } = req.body;

        const responseBuilder = new ResponseBuilder();

        if (username === undefined || password === undefined) {
            return responseBuilder
                .setStatusCode(400)
                .setMessage(ResponseMSG.BAD_REQUEST)
                .getResponse()
                .send(res);
        }

        try {
            const [found, info] = await UserModel.findUser({
                username,
                password,
            });

            if (found === null) {
                return responseBuilder
                    .setStatusCode(400)
                    .setMessage(ResponseMSG.INVALID_USERNAME)
                    .getResponse()
                    .send(res);
            }

            const accessToken = generateAccessToken({ username: info });

            const result = found
                ? { status: 200, data: { message: ResponseMSG.OK } }
                : {
                      status: 400,
                      data: { message: ResponseMSG.WRONG_PASSWORD },
                  };

            return responseBuilder
                .setStatusCode(result.status)
                .setMessage(result.data.message)
                .setHttpCookie(accessToken)
                .getResponse()
                .send(res);
        } catch (err) {
            console.error(err);
            return responseBuilder
                .setStatusCode(500)
                .setMessage(ResponseMSG.SERVER_ERROR)
                .getResponse()
                .send(res);
        }
    }

    handleLogout(req, res) {
        const responseBuilder = new ResponseBuilder();
        return responseBuilder
            .clearCookie("access-token")
            .setStatusCode(200)
            .setMessage(ResponseMSG.LOGOUT_SUCCESS)
            .getResponse()
            .send(res);
    }

    async handleRegister(req, res) {
        const { username, password } = req.body;

        const responseBuilder = new ResponseBuilder();

        if (username === undefined || password === undefined) {
            return responseBuilder
                .setStatusCode(400)
                .setMessage(ResponseMSG.BAD_REQUEST)
                .getResponse()
                .send(res);
        }

        try {
            const createdUser = await UserModel.createUser({
                username,
                password,
            });

            if (createdUser === null) {
                return responseBuilder
                    .setStatusCode(400)
                    .setMessage(ResponseMSG.USERNAME_EXISTED)
                    .getResponse()
                    .send(res);
            }

            return responseBuilder
                .setStatusCode(201)
                .setMessage(ResponseMSG.REGISTER_SUCCESS)
                .getResponse()
                .send(res);
        } catch (err) {
            console.error(err);
            return responseBuilder
                .setStatusCode(500)
                .setMessage(ResponseMSG.SERVER_ERROR)
                .getResponse()
                .send(res);
        }
    }
}
