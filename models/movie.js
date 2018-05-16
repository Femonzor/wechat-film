import mongoose from "mongoose";
import MovieSchema from "../schemas/movie";

const Movie = mongoose.model("Movie", MovieSchema);

export default Movie;
