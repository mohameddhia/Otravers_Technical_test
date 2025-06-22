/**
 * @typedef {Object} IVariant
 * @property {string} id
 * @property {string} name
 * @property {number} [price]
 * @property {number} [stock]
 * @property {string} productId
 * @property {import('./IProduct').IProduct} [product]
 */

/**
 * @interface IVariantClass
 */

/**
 * @static
 * @function
 * @name IVariantClass.createEmpty
 * @returns {IVariant}
 */

/**
 * @static
 * @function
 * @name IVariantClass.validateVariantPrice
 * @param {number} _price
 * @returns {boolean}
 */