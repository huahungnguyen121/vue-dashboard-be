export default class ResponseBuilder {
    _response;

    constructor() {
        this._response = new Response();
        return this;
    }

    reset() {
        this._response = new Response();
        return this;
    }

    setStatusCode(code) {
        this._response._statusCode = code;
        return this;
    }

    setMessage(message) {
        this._response._message = message;
        return this;
    }

    setData(data) {
        this._response._data = data;
        return this;
    }

    setHttpCookie(cookie) {
        this._response._httpCookie = cookie;
        return this;
    }

    clearCookie(cookieName) {
        this._response._clearCookie = cookieName;
        return this;
    }

    getResponse() {
        return this._response;
    }
}

class Response {
    _statusCode = 200;
    _message = "";
    _data;
    _httpCookie;
    _clearCookie;

    send(res) {
        if (this._httpCookie !== undefined) {
            res.cookie("access-token", this._httpCookie, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
        }
        if (this._clearCookie) {
            res.clearCookie(this._clearCookie)
        }
        res.status(this._statusCode).send({
            message: this._message,
            data: this._data ?? undefined,
        });
    }
}