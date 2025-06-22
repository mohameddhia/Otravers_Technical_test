const {Genre} = require('../../constants/enums');
/**
 * @typedef {Object} IUser
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {keyof typeof Genre} genre - 'MAN' | 'WOMAN'
 * @property {Date} birthDate
 * @property {IReview[]} [review]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @interface IUserClass
 */

/**
 * @static
 * @function
 * @name IUserClass.createEmpty
 * @returns {IUser}
 */

/**
 * @static
 * @function
 * @name IUserClass.validateEmail
 * @param {string} _email
 * @returns {boolean}
 */

/**
 * @static
 * @function
 * @name IUserClass.validateGenre
 * @param {string} _genre
 * @returns {boolean}
 */

/**
 * @static
 * @async
 * @function
 * @name IUserClass.encryptPassword
 * @param {string} _newPassword
 * @returns {Promise<string>}
 */

/**
 * @static
 * @async
 * @function
 * @name IUserClass.comparePassword
 * @param {string} _password
 * @param {string} _hash 
 * @returns {Promise<boolean>}
 */

