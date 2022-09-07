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

    setMetadata(metadata) {
        this._response._metadata = metadata;
        return this;
    }

    setHttpCookies(cookies) {
        if (Array.isArray(cookies)) {
            this._response._httpCookies = cookies;
        }
        return this;
    }

    clearCookie(cookieNames) {
        if (Array.isArray(cookieNames)) {
            this._response._clearCookies = cookieNames;
        }
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
    _metadata;
    _httpCookies;
    _clearCookies;
    _cookieOptions = {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    applyCookies(res) {
        // clear cookies
        if (this._clearCookies !== undefined) {
            this._clearCookies.forEach((cookieName) => {
                res.clearCookie(cookieName, this._cookieOptions);
            });
        }

        // set http cookies
        if (this._httpCookies !== undefined) {
            this._httpCookies.forEach((cookie) => {
                res.cookie(cookie.name, cookie.value, this._cookieOptions);
            });
        }
    }

    send(res) {
        this.applyCookies(res);
        res.status(this._statusCode).send({
            message: this._message,
            data: this._data ?? undefined,
            metadata: this._metadata ?? undefined,
        });
    }
}
