import ResponseBuilder from "../../common/response.js";
import ResponseMSG from "../../constants/response-msg.js";
import { verifyAccessToken } from "../../middlewares/local/verify-token-middleware.js";
import UserModel from "../../models/user/user-model.js";
import BaseRouter from "../base/base-router.js";

export default class UserRouter extends BaseRouter {
    constructor() {
        super("/users");

        this.initRouter();
    }

    initRouter() {
        this._router.get("/", verifyAccessToken, this.handleGetUsers);
        this._router.patch("/", verifyAccessToken, this.handleUpdate);
        this._router.delete("/", verifyAccessToken, this.handleDelete);
    }

    async handleGetUsers(req, res) {
        let { limit, page } = req.query;

        // check query variables
        limit = parseInt(limit);
        page = parseInt(page);

        limit = isNaN(limit) ? 5 : limit;
        page = isNaN(page) ? 1 : page;

        limit = limit < 0 ? 0 : limit;
        page = page < 1 ? 1 : page;

        const responseBuilder = new ResponseBuilder();

        try {
            const { totalPages, totalRecords, users } =
                await UserModel.getUserList(limit, page);

            return responseBuilder
                .setStatusCode(200)
                .setMessage(ResponseMSG.OK)
                .setData({ users })
                .setMetadata({ totalPages, totalRecords })
                .getResponse()
                .send(res);
        } catch (err) {
            console.error(`User router: ${err}`);
            return responseBuilder
                .setStatusCode(500)
                .setMessage(ResponseMSG.SERVER_ERROR)
                .getResponse()
                .send(res);
        }
    }

    async handleUpdate(req, res) {
        const { id, username, createdDate } = req.body;

        const responseBuilder = new ResponseBuilder();

        try {
            const update = await UserModel.updateUser(id, {
                username,
                createdDate: new Date(createdDate),
            });

            if (update === undefined) {
                return responseBuilder
                    .setStatusCode(400)
                    .setMessage(ResponseMSG.BAD_REQUEST)
                    .getResponse()
                    .send(res);
            }

            if (update === null) {
                return responseBuilder
                    .setStatusCode(400)
                    .setMessage(ResponseMSG.USER_NOT_EXIST)
                    .getResponse()
                    .send(res);
            }

            return responseBuilder
                .setStatusCode(200)
                .setMessage(ResponseMSG.OK)
                .getResponse()
                .send(res);
        } catch (err) {
            console.error(`User router: ${err}`);
            return responseBuilder
                .setStatusCode(500)
                .setMessage(ResponseMSG.SERVER_ERROR)
                .getResponse()
                .send(res);
        }
    }

    async handleDelete(req, res) {
        const { id } = req.body;

        const responseBuilder = new ResponseBuilder();

        if (id === undefined) {
            return responseBuilder
                .setStatusCode(400)
                .setMessage(ResponseMSG.BAD_REQUEST)
                .getResponse()
                .send(res);
        }

        try {
            const del = UserModel.deleteUser(id);

            return responseBuilder
                .setStatusCode(204)
                .setMessage(ResponseMSG.OK)
                .getResponse()
                .send(res);
        } catch (err) {
            console.error(`User router: ${err}`);
            return responseBuilder
                .setStatusCode(500)
                .setMessage(ResponseMSG.SERVER_ERROR)
                .getResponse()
                .send(res);
        }
    }
}
