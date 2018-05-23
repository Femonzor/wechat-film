import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    role: {
        type: Number,
        default: 0
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

UserSchema.methods = {
    comparePassword: function (password, callback) {
        bcrypt.compare(password, this.password, (error, isMatch) => {
            if (error) return callback(error);
            callback(null, isMatch);
        });
    }
};

UserSchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) return next(error);
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return next(error);
            this.password = hash;
            next();
        });
    });
});

UserSchema.statics = {
    fetch: function (callback) {
        return this.find({}).sort("meta.updateAt").exec(callback);
    },
    findById: function (id, callback) {
        return this.findOne({ _id: id }).exec(callback);
    }
};

export default UserSchema;
