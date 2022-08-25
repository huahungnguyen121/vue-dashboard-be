import bcrypt from "bcrypt";
import userModel from "../../schemas/user/user-model.js";

export default class UserModel {
    static async getUserList(limit, page) {
        try {
            const totalDocuments = await userModel.countDocuments();
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalDocuments / limit);
            if (skip < totalDocuments) {
                const q = await userModel
                    .find({}, null, { limit: limit, skip: skip })
                    .select(["_id", "username", "createdDate"])
                    .exec();
                if (q !== null) {
                    return {
                        totalPages,
                        totalRecords: totalDocuments,
                        users: q,
                    };
                }
            }

            return { totalPages, totalRecords: totalDocuments, users: [] };
        } catch (err) {
            throw err;
        }
    }

    static async findUser(user) {
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

    static async createUser(user) {
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

    static async deleteUser(id) {
        try {
            return await userModel.findByIdAndDelete(id);
        } catch (err) {
            throw err;
        }
    }

    static async updateUser(id, newData) {
        try {
            let { username, createdDate } = newData;
            username = username && username.trim();
            if (username === undefined || username === "") {
                return undefined;
            }

            return await userModel
                .findByIdAndUpdate(id, {
                    username: username,
                    createdDate: createdDate,
                })
                .exec();
        } catch (err) {
            throw err;
        }
    }
}
