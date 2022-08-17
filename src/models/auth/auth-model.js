import bcrypt from "bcrypt";
import userModel from "../../schemas/user/user-model.js";

export default class AuthModel {
    static async find(user) {
        if (!user) {
            return [undefined];
        }

        try {
            const foundUser = await userModel
                .findOne({
                    username: user.username,
                })
                .exec();

            if (foundUser !== null) {
                return [
                    await bcrypt.compare(user.password, foundUser.password),
                    foundUser.username,
                ];
            }

            return [null]; // username does not exist
        } catch (err) {
            console.error(err);
        }
    }

    static async create(user) {
        if (!user) {
            return undefined;
        }

        try {
            const foundUser = await userModel
                .findOne({
                    username: user.username,
                })
                .exec();

            if (foundUser === null) {
                let { username, password } = user;
                password = await bcrypt.hash(password, 10);
                const createdUser = await userModel.create({
                    username,
                    password,
                });
                return createdUser;
            }

            return null; // user existed
        } catch (err) {
            console.error(err);
        }
    }
}
