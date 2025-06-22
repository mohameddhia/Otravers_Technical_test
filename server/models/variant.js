class Variant {
    /** @type {string} */ #id;
    /** @type {string} */ #name;
    /** @type {number} */ #price;
    /** @type {number} */ #stock;
    /** @type {string} */ #productId;
    /** @type {import('../interfaces/IProduct').IProduct} */ #product;

    constructor(_data) {
        if (_data.price && !Variant.validateVariantPrice(_data.price))
            throw new Error('Invalid Variant Price');

        this.#id = _data.id;
        this.#name = _data.name;
        this.#price = _data.price;
        this.#stock = _data.stock;
        this.#productId = _data.productId;
        this.#product = _data.product;
    }

    // ------------------ Getters ------------------ //
    get id() { return this.#id; }
    get name() { return this.#name; }
    get price() { return this.#price; }
    get stock() { return this.#stock; }
    get productId() { return this.#productId; }
    get product() { return this.#product; }

    // ------------------ Setters ------------------ //
    set name(_name) {
        this.#name = _name;
    }

    set price(_price) {
        if (_price && !Variant.validateVariantPrice(_price))
            throw new Error('Invalid Variant Price');
        this.#price = _price;
    }

    set stock(_stock) {
        if (_stock && _stock < 0)
            throw new Error('Stock cannot be negative');
        this.#stock = _stock;
    }

    // ----------- Static Methods -----------
    /**
     * Create Empty Variant Instance
     * @static
     * @returns {import('../interfaces/IVariant').IVariant}
     */
    static createEmpty() {
        return {
            id: '',
            name: '',
            price: null,
            stock: null,
            productId: '',
            product: null
        };
    }

    /**
     * Validate Variant Price
     * @static
     * @param {number} _price
     * @returns {boolean}
     */
    static validateVariantPrice(_price) {
        return _price >= 0 && Number.isFinite(_price);
    }

    toJson() {
        return {
            id: this.#id,
            name: this.#name,
            price: this.#price,
            stock: this.#stock,
            productId: this.#productId,
            product: this.#product
        };
    }
}

module.exports = Variant;