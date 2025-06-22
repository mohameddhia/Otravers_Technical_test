const UserService = require("../services/user.service");
const { ApplicationError } = require("../utils/error");

class UserController {

    
    /**
     * Create User
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async createUser(req,res) {
        try {
            const user =await UserService.create(req.body);
            res.status(201).json({
                message: "User Has been created",
                data: user
            });
        } catch (error) {
            console.log("[UserController][createUser]",error)
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
    
    
    /**
     * Get User By Id
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getUserById(req,res){
        try {
            const user =await UserService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
    /**
     * Get User By Email
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getUserByEmail(req,res){
        try {
            const user = await UserService.getUserByEmail(req.params.email);
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }            
        }
    }

    
    /**
     * Update User
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async updateUser(req,res) {
        try {
            const user =await UserService.updateUser(req.params.id,req.body);
            res.status(200).json({
                message: "User has been updated",
                data: user
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
     * Change User Password
     *
     * @async
     * @static
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            await UserService.changePassword(req.params.id, currentPassword, newPassword);
            
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.log('[UserController][changePassword]',error);
            
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Get User Reviews
     *
     * @async
     * @static
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getUserReviews(req, res) {
        try {
            const reviews = await UserService.getUserReviews(req.params.userId);
            res.json(reviews);
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Delete User By ID
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async deleteUser(req,res) {
        try {
            const deleted = await UserService.deleteUser(req.params.id);
            res.status(200).json({
                message: "success",
                data: deleted
            });
        } catch (error) {
             if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}

module.exports= UserController;