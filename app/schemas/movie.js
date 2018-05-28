import mongoose from "mongoose";

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const MovieSchema = new Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    pv: {
        type: Number,
        default: 0
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

MovieSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort("meta.updateAt").exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({ _id: id }).exec(callback);
    }
};

export default MovieSchema;
