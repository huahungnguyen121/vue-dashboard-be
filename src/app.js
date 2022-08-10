import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import loggingMiddleware from "./middlewares/global/logging-middleware.js";
import routers from "./routers/index.js";
import AppConstants from "./constants/app-constants.js";

export default class App {
    _app;
    _port;
    _corsOption;

    initMiddlewares() {
        loggingMiddleware(this._app);

        this._app.use(json());
        this._app.use(urlencoded({ extended: true }));
        this._app.use(cookieParser());
        this._app.use(cors(this._corsOption));
    }

    initRouters() {
        routers.forEach((router) =>
            this._app.use(router._basePath, router._router)
        );
    }

    constructor() {
        this._app = express();
        this._port = 5000;
        this._corsOption = {
            origin: AppConstants.CLIENT_URLS,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: [
                "Origin",
                "X-Requested-With",
                "Content-Type",
                "Accept",
                "Authorization",
            ],
            credentials: true,
        };

        this._app.disable("x-powered-by");

        this.initMiddlewares();

        this.initRouters();
    }

    launchApp() {
        this._app.listen(this._port, () =>
            console.log(`Express app is listening on port ${this._port}`)
        );
    }
}
