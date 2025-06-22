const redis = require("ioredis");
const dotenv = require('dotenv');

dotenv.config();

// const redis = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT),
//     username: process.env.REDIS_USER,
//     password : process.env.REDIS_PASSWORD,
//     lazyConnect: true
// });

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USER,
    password : process.env.REDIS_PASSWORD,
    lazyConnect: true

})

module.exports = redisClient;