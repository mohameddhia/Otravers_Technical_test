const jwt = require('jsonwebtoken');
const {v4: uuidv4} =require('uuid');
const dotenv = require('dotenv').config();
const User = require("../models/user");
const prisma = require("../prisma/client");
const { ApplicationError } = require("../utils/error");
const redisService = require('./redis.service');
const  UserService = require('./user.service')
class AuthService {
    

    
    /**
     * Login User
     *
     * @static
     * @async
     * @param {string} _email 
     * @param {string} _password 
     * @returns {Promise<{accessToken: string, refreshToken: string,user:import('../models/interfaces/IUser').IUser}>} 
     */
    static async login(_email,_password){
        try {
            const userExist = await prisma.User.findUnique({
                where: {
                    email: _email
                }
            });
            if(!userExist) throw new ApplicationError('User Not Found',404);
            
            const user = new User(userExist);
            const isValidPassword = await User.comparePassword(_password,userExist.password);
            if(!isValidPassword) throw new ApplicationError("Wrong Password",401);

            const sessionId = uuidv4();
            const accessToken = this.#generateAccessToken(userExist,sessionId);
            const refreshToken = this.#generateRefreshToken(userExist,sessionId);

            const redisreslt = await redisService.saveToken(user.id,sessionId,refreshToken);
            if(!redisreslt)
                throw new ApplicationError('Failed to create Session',400);
            return {
                accessToken,
                refreshToken,
                user:{
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            };
        } catch (error) {
            console.log('[AuthService][login]',error);
            throw new ApplicationError('Failed to login user',500);
        }
    }

    
    /**
     * Refresh Access Token
     *
     * @static
     * @async
     * @param {string} _refreshToken 
     * @returns {Promise<string>} 
     */
    static async refreshToken(_refreshToken){
        try {
            const decoded = jwt.verify(_refreshToken,process.env.JWT_REFRESH_SECRET);
            const session = await redisService.validateSession(decoded.sessionId);

            if(!session) throw new ApplicationError('Session not found',404);

            const user = await UserService.getUserById(decoded.id);

            if(!user)
                throw new ApplicationError('User Not Found',404);
            const accessToken = this.#generateAccessToken(user,decoded.sessionId);

            return {accessToken}
        } catch (error) {
            throw new ApplicationError('Refresh Token Failed',500);
        }
    }
    
    
    /**
     * Get User Profile
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<import('../models/interfaces/IUser').IUser>} 
     */
    static async profile(_id){
        try {
            const user = await UserService.getUserById(_id);
            return user;
        } catch (error) {
            console.log('[AuthService][profile]',error);
            throw new ApplicationError('failed to fetch user',500);
        }
    }
    /**
     * Generate Access Token
     *
     * @static
     * @param {import('../models/interfaces/IUser').IUser} user 
     * @param {string} _sessionId 
     * @returns {string} 
     */
    static #generateAccessToken(user,_sessionId){
        return jwt.sign({
            id: user.id,
            sessionId: _sessionId,
            email: user.email,
            firstName : user.firstName,
            lastName: user.lastName
            },
            process.env.JWT_ACCESS_TOKEN,
            {expiresIn: '15m'}
        );
    }

    
    /**
     * Generate Refresh Token
     *
     * @static
     * @param {import('../models/interfaces/IUser').IUser} _user 
     * @param {string} _sessionId 
     * @returns {string} 
     */
    static #generateRefreshToken(_user,_sessionId){
        return jwt.sign({
            id: _user.id,
            sessionId: _sessionId,
            email: _user.email,
        },
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: '1d'}
        );

    }

}

module.exports = AuthService;