import ResponseBuilder from "../../common/response.js";
import BaseRouter from "../base/base-router.js";

export default class HomeRouter extends BaseRouter {
    constructor() {
        super("/");

        this.initRouter();
    }

    initRouter() {
        this._router.get("/", this.handleGetHome);
    }

    handleGetHome(req, res) {
        return new ResponseBuilder()
            .setStatusCode(200)
            .setMessage("Backend for vue dashboard - v1.0")
            .getResponse()
            .send(res);
    }
}
