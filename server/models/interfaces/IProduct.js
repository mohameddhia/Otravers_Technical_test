/**
 * @typedef {Object} IProductMedia
 * @property {string[]} Image
 * @property {string} [model3d]
 */

/**
 * @typedef {Object} IProduct
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} category
 * @property {string} subcategory
 * @property {number} price
 * @property {number} [discount]
 * @property {number} stock
 * @property {IProductMedia} media
 * @property {import('./IVariant').IVariant[]} [variants]
 * @property {string[]} tags
 * @property {number} rating
 * @property {import('./IReview').IReview[]} [reviews]
 * @property {string} businessId
 * @property {boolean} promoted
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @interface IProductClass
 */

/**
 * @static
 * @function
 * @name IProductClass.createEmpty
 * @returns {IProduct}
 */

/**
 * @static
 * @function
 * @name IProductClass.validateSlug
 * @param {string} _slug
 * @returns {boolean}
 */

/**
 * @static
 * @function
 * @name IProductClass.validatePrice
 * @param {number} _price
 * @returns {boolean}
 */