import express from "express";

export default class BaseRouter {
    _router;

    constructor(basePath) {
        this._basePath = basePath || "/";
        this._router = express.Router(this._basePath);
    }
}
