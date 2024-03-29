export default class ResponseMSG {
    static get BAD_REQUEST() {
        return "Bad request";
    }

    static get INVALID_USERNAME() {
        return "Invalid username";
    }

    static get WRONG_PASSWORD() {
        return "Wrong password";
    }

    static get OK() {
        return "OK";
    }

    static get EXPIRED_TOKEN() {
        return "Token expired";
    }

    static get INVALID_TOKEN() {
        return "Invalid token";
    }

    static get LOGOUT_SUCCESS() {
        return "Logout successfully";
    }

    static get REGISTER_SUCCESS() {
        return "Register successfully";
    }

    static get USERNAME_EXISTED() {
        return "Username existed";
    }

    static get SERVER_ERROR() {
        return "Server error";
    }

    static get USER_NOT_EXIST() {
        return "User does not exist";
    }
}
