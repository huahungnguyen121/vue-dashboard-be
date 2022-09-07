export default class AppConstants {
    static get JWT_ACCESS_SECRET_KEY() {
        return process.env.JWT_ACCESS_SECRET_KEY || "";
    }

    static get JWT_REFRESH_SECRET_KEY() {
        return process.env.JWT_REFRESH_SECRET_KEY || "";
    }

    static get CLIENT_URLS() {
        return process.env.CLIENT_URLS.split(",") || "*";
    }

    static get PORT() {
        return process.env.PORT || 5000;
    }

    static get MONGO_DB_URL() {
        return process.env.MONGO_DB_URL || "";
    }

    static get DB_NAME() {
        return "vue-dashboard";
    }
}
