const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {User} = require('../Model/user');


router.get("/", (req, res) => {
    console.log("working");
    res.send("lol");
})


router.post('/signup', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(
        () => {
            return user.generateAuthToken();
        }
    ).then(
        (token) => {
            res.header("x-auth", token).status(200).send(user);
        }
    ).
    catch(
        (err) => {
            res.status(400).send(err);
            console.log(err);
        }
    );

});

router.post("/signin", (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);
    User.findByCredentials(body.email, body.password)
        .then(
            (user) => {

                return user.generateAuthToken();
            }
        )
        .then(
            (token) => {
                res.header("x-auth", token).status(200).json({
                    msg: "Successfully login"
                });
            }
        )
        .catch(
            (e) => {
                res.status(401).send(e);
                console.log(e);
            }
        );

});

module.exports = router;