const { PrismaClient } = require('../utils/prisma');

class Product {
    /** @type {string} */ #id;
    /** @type {string} */ #name;
    /** @type {string} */ #slug;
    /** @type {string} */ #description;
    /** @type {string} */ #category;
    /** @type {string} */ #subcategory;
    /** @type {number} */ #price;
    /** @type {number} */ #discount;
    /** @type {number} */ #stock;
    /** @type {import('../interfaces/IProduct').IProductMedia} */ #media;
    /** @type {import('../interfaces/IVariant').IVariant[]} */ #variants;
    /** @type {string[]} */ #tags;
    /** @type {number} */ #rating;
    /** @type {import('../interfaces/IReview').IReview[]} */ #reviews;
    /** @type {string} */ #businessId;
    /** @type {boolean} */ #promoted;
    /** @type {Date} */ #createdAt;
    /** @type {Date} */ #updatedAt;

    constructor(_data) {
        if (!Product.validatePrice(_data.price))
            throw new Error('Invalid Price');
        if (!Product.validateSlug(_data.slug))
            throw new Error('Invalid Slug Format');

        this.#id = _data.id;
        this.#name = _data.name;
        this.#slug = _data.slug;
        this.#description = _data.description;
        this.#category = _data.category;
        this.#subcategory = _data.subcategory;
        this.#price = _data.price;
        this.#discount = _data.discount;
        this.#stock = _data.stock;
        this.#media = _data.media;
        this.#variants = _data.variants || [];
        this.#tags = _data.tags;
        this.#rating = _data.rating;
        this.#reviews = _data.reviews || [];
        this.#businessId = _data.businessId;
        this.#promoted = _data.promoted;
        this.#createdAt = new Date(_data.createdAt);
        this.#updatedAt = new Date(_data.updatedAt);
    }

    // ------------------ Getters ------------------ //
    get id() { return this.#id; }
    get name() { return this.#name; }
    get slug() { return this.#slug; }
    get description() { return this.#description; }
    get category() { return this.#category; }
    get subcategory() { return this.#subcategory; }
    get price() { return this.#price; }
    get discount() { return this.#discount; }
    get stock() { return this.#stock; }
    get media() { return this.#media; }
    get variants() { return this.#variants; }
    get tags() { return this.#tags; }
    get rating() { return this.#rating; }
    get reviews() { return this.#reviews; }
    get businessId() { return this.#businessId; }
    get promoted() { return this.#promoted; }
    get createdAt() { return this.#createdAt; }
    get updatedAt() { return this.#updatedAt; }

    // ------------------ Setters ------------------ //
    set name(_name) {
        this.#name = _name;
    }

    set description(_description) {
        this.#description = _description;
    }

    set price(_price) {
        if (!Product.validatePrice(_price))
            throw new Error('Invalid Price');
        this.#price = _price;
    }

    set stock(_stock) {
        if (_stock < 0)
            throw new Error('Stock cannot be negative');
        this.#stock = _stock;
    }

    // ----------- Static Methods -----------
    /**
     * Create Empty Product Instance
     * @static
     * @returns {import('../interfaces/IProduct').IProduct}
     */
    static createEmpty() {
        return {
            id: '',
            name: '',
            slug: '',
            description: '',
            category: '',
            subcategory: '',
            price: 0,
            stock: 0,
            media: { Image: [] },
            variants: [],
            tags: [],
            rating: 0,
            reviews: [],
            businessId: '',
            promoted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    /**
     * Validate Slug
     * @static
     * @param {string} _slug
     * @returns {boolean}
     */
    static validateSlug(_slug) {
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return slugRegex.test(_slug);
    }

    /**
     * Validate Price
     * @static
     * @param {number} _price
     * @returns {boolean}
     */
    static validatePrice(_price) {
        return _price >= 0 && Number.isFinite(_price);
    }

    toJson() {
        return {
            id: this.#id,
            name: this.#name,
            slug: this.#slug,
            description: this.#description,
            category: this.#category,
            subcategory: this.#subcategory,
            price: this.#price,
            discount: this.#discount,
            stock: this.#stock,
            media: this.#media,
            variants: this.#variants,
            tags: this.#tags,
            rating: this.#rating,
            reviews: this.#reviews,
            businessId: this.#businessId,
            promoted: this.#promoted,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt
        };
    }
}

module.exports = Product;