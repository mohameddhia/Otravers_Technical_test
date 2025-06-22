const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const AuthService = require("../services/auth.service");
const { ApplicationError } = require("../utils/error");
const redisService = require('../services/redis.service');

class AuthController {
    /**
     * Login User
     *
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            
            // Set cookies
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({
                message: "Login successful",
                data: result
            });
        } catch (error) {
            console.log('[AuthController][login]',error);
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    /**
     * Refresh Access Token
     *
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    static async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new ApplicationError('Refresh token not found', 401);
            }

            const result = await AuthService.refreshToken(refreshToken);
            
            // Set new access token cookie
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.status(200).json({
                message: "Token refreshed successfully",
                data: result
            });
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Get User Profile
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getProfile(req, res) {
        try {
            // Get user ID from the JWT token in cookie
            const accessToken = req.cookies.accessToken;
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
            
            const profile = await AuthService.profile(decoded.id);
            
            res.status(200).json({
                message: "Profile retrieved successfully",
                data: profile
            });
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Invalid token' });
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Token expired' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    /**
     * Logout User
     *
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    static async logout(req, res) {
        try {
            const accessToken = req.cookies.accessToken;

            if(!accessToken) 
                res.status(401).json({
                    message: 'Accesstoken is invalid',
            });
            const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN);

            if(decoded?.sessionId)
                await redisService.invalidateSession(decoded.sessionId);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            
            res.status(200).json({
                message: "Logout successful"
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = AuthController;