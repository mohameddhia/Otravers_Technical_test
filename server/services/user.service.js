const Review = require("../models/review");
const User = require("../models/user");
const prisma = require("../prisma/client");
const { ApplicationError } = require("../utils/error")


/**
 * USer Service Class
 *
 * @class UserService
 * @typedef {UserService}
 */
class UserService {

    
    /**
     * Create New User
     *
     * @static
     * @async
     * @param {import("../models/interfaces/IUser").IUser} _userData 
     * @returns {Promise<{Omit<IUser,'password'>}>} 
     * @throws {ApplicationError}
     */
    static async create(_userData) {
        try {
            if (!_userData.email) throw new ApplicationError('Email is Required',400);
            if (!_userData.genre || !User.validateGenre(_userData.genre)) throw new ApplicationError('Enter Valid Genre',400);
            if(!_userData.password) throw new ApplicationError('Password is required',400);

            const userInstance = new User({
                ..._userData
            });

            await userInstance.setPassword(_userData.password);
            const createdUser = await prisma.User.create({
                data: userInstance.toJson()
            });
            const {password ,...userWithoutPasswd} = createdUser;
            return userWithoutPasswd;
        } catch (error) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0];
                throw new ApplicationError(`${field} already exist`,409);
            }
            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Gett User By Id
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<import("../models/interfaces/IUser").IUser>} 
     * @throws {ApplicationError}
     */
    static async #getUser(_id){
        try {
            if(!_id) throw new ApplicationError('Id is required',400);
            const user = await prisma.User.findUnique({
                where:{id: _id}
            });

            if(!user) return null;
            
            return user
        } catch (error) {
            throw new ApplicationError(error.message,500);
        }
    }

    /**
     * Gett User By Id
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<import("../models/interfaces/IUser").IUser>} 
     * @throws {ApplicationError}
     */
    static async getUserById(_id){
        try {
            if(!_id) throw new ApplicationError('Id is required',400);
            const user = await prisma.User.findUnique({
                where:{id: _id}
            });

            if(!user) throw new ApplicationError('User Not Found',404);
            
            return user
        } catch (error) {
            throw new ApplicationError(error.message,500);
        }
    }
    
    /**
     * Get User By email
     *
     * @static
     * @async
     * @param {string} _email 
     * @returns {Promis<import("../models/interfaces/IUser").IUser>} 
     * @throws {ApplicationError}
     */
    static async getUserByEmail(_email){
        try {
            if(!_email || !User.validateEmail(_email)) throw new ApplicationError('Valid email is required',400);
            const user = await prisma.User.findUnique({
                where: {
                    email: _email
                }
            });
            if(!user) throw new ApplicationError('User Not Found',404);

            const {password, ...result} = user;
            return result;
        } catch (error) {
            throw new ApplicationError(error.message,500);
        }
    }

    
    /**
     * Update User
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {import("../models/interfaces/IUser").IUser} _updatedDate 
     * @returns {Promise<import("../models/interfaces/IUser").IUser>} 
     */
    static async updateUser(_id,_updatedDate) {
        try {
            const user = await this.#getUser(_id)
            if(!user) throw new ApplicationError("user not found",404);
            
            const updateData = new User({
                ...user,
                ..._updatedDate
            });

            const updateUser = await prisma.User.update({
                where: {id: _id},
                data:updateData
            });

            const {password,...result} = updateUser;

            return result;
        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);1
        }
    }

    
    /**
     * Update PAssword
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {string} _currentPassword 
     * @param {string} _newPassword 
     * @returns {Promise<boolean>} 
     */
    static async changePassword(_id,_currentPassword,_newPassword){
        try {
            const user = await this.#getUser(_id);

            if(!user) throw new ApplicationError("user Not Found",404);

            const isValidPassword = await User.comparePassword(_currentPassword,user.password);
            if(!isValidPassword) throw new ApplicationError("Current password is incorrect",400);

            let userInstance = new User(user);
            await userInstance.setPassword(_newPassword);
            userInstance = userInstance.toJson();
            await prisma.User.update({
                where: {id: _id},
                data:{
                    password: userInstance.password
                }
            });

            return true;
        } catch (error) {
            console.log('[UserService][changePassword]',error);
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Get User Reveiws
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<IReview[]>} 
     */
    static async getUserReviews(_id){
        try {
            const reviews=await prisma.review.findMany({
                where:{userId: _id},
                include:{
                    product: {
                        select:{
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return await reviews.map((rev) => new Review(rev).toJson);
        } catch (error) {
            console.log('[UserService][getUserReviews]',error);
            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Delete User By Id
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<boolean>} 
     */
    static async deleteUser(_id){
        try {
            if(!_id) throw new ApplicationError('Id is required',400);
            const userExist = await this.#getUser(_id);

            if(!userExist) throw new ApplicationError('User Not Found',404);

            const deleted = await prisma.User.delete({
                where:{id: _id}
            });

            return true
        } catch (error) {
            throw new ApplicationError(error.message, 500);
        }
    }
}

module.exports = UserService;