import mongoose from "mongoose";
import UserSchema from "../schemas/user";

const User = mongoose.model("User", UserSchema);

export default User;
