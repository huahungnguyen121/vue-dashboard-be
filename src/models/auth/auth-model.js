import users from "./fake-users.js";
import bcrypt from "bcrypt";

export default class AuthModel {
    static async find(user) {
        if (!user) {
            return [undefined];
        }

        const foundUser = users.find((item) => item.username === user.username);

        if (foundUser === undefined) {
            return [null];
        }

        return [
            await bcrypt.compare(user.password, foundUser.password),
            foundUser.username,
        ];
    }
}
