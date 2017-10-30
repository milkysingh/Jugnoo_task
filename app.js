const express = require("express");
const {
    mongoose
} = require('./db/mongoose');

const app = express();

const port = process.env.PORT || 4000;

const Auth = require('./routes/auth');

const body_parser = require("body-parser");

app.use(body_parser.json());

app.use("/user", Auth);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});