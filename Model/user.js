const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            isAsync: false,
            validator: validator.isEmail,
            message: '{Value} is not valid'
        }
    },
    password: {
        type: String,
        required: true
    },
    Token: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        id: user._id.toHexString()
    }, "secret123");

    user.Token.push({
        access,
        token
    });
    return user.save().then(
        () => {
            return token;
        }
    );
};

UserSchema.methods.toJSON = function () { //this function detemines what exactly gets send back when a mongoose model get converted into JSON
    let user = this;
    let userObject = user.toObject(); //this function is reponsible for taking our mongoose variable 'user' and converts into regular object
    return _.pick(userObject, ["email"]);
}

UserSchema.statics.findByCredentials = function (email, password) {
    const user = this;
    return user.findOne({
            email
        })
        .then(
            (user) => {
                if (!user) {
                    return Promise.reject();
                }
                return new Promise((resolve, reject) => {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (res) {
                            resolve(user);
                        } else {
                            reject();
                        }
                    });
                });
            }
        );
}

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});
const User = mongoose.model('Users', UserSchema);
module.exports = {
    User
};