import mongoose from "mongoose";
import CategorySchema from "../schemas/category";

const Category = mongoose.model("Category", CategorySchema);

export default Category;
