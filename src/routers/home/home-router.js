import { verifyAccessToken } from "../../middlewares/local/verify-token-middleware.js";
import BaseRouter from "../base/base-router.js";

export default class HomeRouter extends BaseRouter {
    constructor() {
        super("/");

        this.initRouter();
    }

    initRouter() {
        this._router.get("/", verifyAccessToken, this.handleGetHome);
    }

    handleGetHome(req, res) {
        res.sendStatus(200);
    }
}
