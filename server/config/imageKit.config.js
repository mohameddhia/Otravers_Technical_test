const imgkit = require("imagekit");
const dotenv = require('dotenv').config();

const imagekit = new imgkit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.URL_ENPOINT
});

module.exports = imagekit;
