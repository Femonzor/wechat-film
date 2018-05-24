import mongoose from "mongoose";
import CommentSchema from "../schemas/comment";

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
