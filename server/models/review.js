class Review {
    /** @type {string} */ #id;
    /** @type {string} */ #userId;
    /** @type {import('../interfaces/IUser').IUser} */ #user;
    /** @type {number} */ #rating;
    /** @type {string} */ #comment;
    /** @type {number} */ #helpfulvotes;
    /** @type {string[]} */ #photoUrls;
    /** @type {string} */ #productId;
    /** @type {import('../interfaces/IProduct').IProduct} */ #product;
    /** @type {Date} */ #createdAt;

    constructor(_data) {
        if (!Review.validateRating(_data.rating))
            throw new Error('Invalid Rating');

        this.#id = _data.id;
        this.#userId = _data.userId;
        this.#user = _data.user;
        this.#rating = _data.rating;
        this.#comment = _data.comment;
        this.#helpfulvotes = _data.helpfulvotes;
        this.#photoUrls = _data.photoUrls;
        this.#productId = _data.productId;
        this.#product = _data.product;
        this.#createdAt = new Date(_data.createdAt);
    }

    // ------------------ Getters ------------------ //
    get id() { return this.#id; }
    get userId() { return this.#userId; }
    get user() { return this.#user; }
    get rating() { return this.#rating; }
    get comment() { return this.#comment; }
    get helpfulvotes() { return this.#helpfulvotes; }
    get photoUrls() { return this.#photoUrls; }
    get productId() { return this.#productId; }
    get product() { return this.#product; }
    get createdAt() { return this.#createdAt; }

    // ------------------ Setters ------------------ //
    set comment(_comment) {
        this.#comment = _comment;
    }

    set helpfulvotes(_votes) {
        if (_votes < 0)
            throw new Error('Votes cannot be negative');
        this.#helpfulvotes = _votes;
    }

    // ----------- Static Methods -----------
    /**
     * Create Empty Review Instance
     * @static
     * @returns {import('../interfaces/IReview').IReview}
     */
    static createEmpty() {
        return {
            id: '',
            userId: '',
            rating: 0,
            comment: '',
            helpfulvotes: 0,
            photoUrls: [],
            productId: '',
            createdAt: new Date()
        };
    }

    /**
     * Validate Rating
     * @static
     * @param {number} _rating
     * @returns {boolean}
     */
    static validateRating(_rating) {
        return Number.isInteger(_rating) && _rating >= 1 && _rating <= 5;
    }

    toJson() {
        return {
            id: this.#id,
            userId: this.#userId,
            user: this.#user,
            rating: this.#rating,
            comment: this.#comment,
            helpfulvotes: this.#helpfulvotes,
            photoUrls: this.#photoUrls,
            productId: this.#productId,
            product: this.#product,
            createdAt: this.#createdAt
        };
    }
}

module.exports = Review;