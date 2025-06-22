/**
 * @typedef {Object} IReview
 * @property {string} id 
 * @property {string} userId
 * @property {import('./IUser').IUser} [user]
 * @property {number} rating
 * @property {string} [comment]
 * @property {number} helpfulvotes
 * @property {string[]} photoUrls
 * @property {string} productId
 * @property {import('./IProduct').IProduct} [product]
 * @property {Date} createdAt
 */

/**
 * @interface IReviewClass
 */

/**
 * @static
 * @function
 * @name IReviewClass.createEmpty
 * @returns {IReview}
 */

/**
 * @static
 * @function
 * @name IReviewClass.validateRating
 * @param {number} _rating
 * @returns {boolean}
 */