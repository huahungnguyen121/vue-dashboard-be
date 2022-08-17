import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: new Date(),
    },
});

export default mongoose.model("user", userSchema);
