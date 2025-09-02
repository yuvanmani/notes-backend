require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = {
    MONGODB_URI,
    EMAIL_USER,
    EMAIL_PASS
}