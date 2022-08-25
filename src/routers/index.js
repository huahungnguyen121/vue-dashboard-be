import AuthRouter from "./auth/auth-router.js";
import HomeRouter from "./home/home-router.js";
import UserRouter from "./user/user-router.js";

export default [new AuthRouter(), new HomeRouter(), new UserRouter()];
