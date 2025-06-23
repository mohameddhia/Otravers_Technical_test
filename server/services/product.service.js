const { skip } = require("node:test");
const Product = require("../models/product");
const prisma = require("../prisma/client");
const { ApplicationError } = require("../utils/error");
const UserService = require("./user.service");



/**
 * Product Service Class
 *
 * @class ProductService
 * @typedef {ProductService}
 */
class ProductService {

    
    /**
     * Create New Product
     *
     * @static
     * @async
     * @param {import("../models/interfaces/IProduct").IProduct} _productData 
     * @returns {Promise<import("../models/interfaces/IProduct").IProduct>}
     */
    static async create(_productData){
        try {
            if(!_productData.name || _productData.name === '') throw new ApplicationError('Product Name is required',400);
            if(!_productData.businessId) throw new ApplicationError("business Id is required",400);
            if(!Product.validatePrice(_productData.price)) throw new ApplicationError('Price is invalid',400);
            if(!Product.validateSlug(_productData.slug)) throw new ApplicationError('Invalid Slug',400);

           await UserService.getUserById(_productData.businessId);

            const createdProduct = await prisma.Product.create({
                data:{
                    ..._productData,
                    variants:{
                        create: _productData.variants || []
                    }
                },
                include:{
                    variants: true,
                    reviews: true
                }
            });

            return new Product(createdProduct).toJson();
        } catch (error) {
            console.log('[ProductService][create]',error);
            if (error instanceof ApplicationError) throw error;
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0];
                throw new ApplicationError(`${field} already exists`, 409);
            }

            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Get Product By ID
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<import("../models/interfaces/IProduct").IProduct>}
     */
    static async getById(_id){
        try {
            if(!_id) throw new ApplicationError('Id is required',400);
            const product = await prisma.Product.findUnique({
                where: {id: _id},
                include :{
                    variants: true,
                    reviews : {
                        include :{
                            user: {
                                select : {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });
            if(!product) throw new ApplicationError('Product Not Found',404)
            console.log('[ProductService][getById]',product);

            return new Product(product).toJson();
        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);

        }
    }


    
    /**
     * Get Product By slug
     *
     * @static
     * @async
     * @param {string} _slug 
     * @returns {Promise<import("../models/interfaces/IProduct").IProduct>}
     */
    static async getBySlug(_slug){
        try {
            if(!Product.validateSlug(_slug)) 
                throw new ApplicationError('Invalid slug format',400);

            const product = await prisma.Product.findUnique({
                where: {
                    slug: _slug
                },
                include:{
                    variants: true,
                    reviews: {
                        include: {
                            user: {
                                select : {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });

            if(!product) throw new ApplicationError('Product Not found',404);

            return product;
        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Update Product By Id
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {IProduct} _updatedData 
     * @returns {Promise<import("../models/interfaces/IProduct").IProduct>}
     */
    static async update(_id , _updatedData){
        try {
            const existingProduct = await this.getById(_id);

            const productInstance = new Product({
                ...existingProduct,
                ..._updatedData
            });
            const productData = productInstance.toJson();

            const updateData = {
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                category: productData.category,
                subcategory: productData.subcategory,
                price: productData.price,
                discount: productData.discount,
                stock: productData.stock,
                media: productData.media,
                tags: productData.tags,
                rating: productData.rating,
                promoted: productData.promoted
            };

            // Handle Variants , separately
            if (_updatedData.variants) {
                updateData.variants = {
                    deleteMany: {},
                    create: _updatedData.variants.map(variant => ({
                        name: variant.name,
                        price: variant.price,
                        stock: variant.stock
                    }))
                };
            }
            const updateProduct = await prisma.Product.update({
                where: { id: _id },
                data: updateData,
                include: {
                    variants: true,
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            });

            return updateProduct;
        } catch (error) {
            console.log('[ProductService][update]',error);
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }


    
    /**
     * Delete Product by Id
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<boolean>} 
     */
    static async delete(_id){
        try {
            await this.getById(_id);

            await prisma.Product.delete({
                where: {id: _id}
            });

            return true
        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }

    
        /**
     * Search products
     * @static
     * @async
     * @param {Object} _filters
     * @param {string} [_filters.category]
     * @param {string} [_filters.subcategory]
     * @param {string[]} [_filters.tags]
     * @param {number} [_filters.minPrice]
     * @param {number} [_filters.maxPrice]
     * @param {boolean} [_filters.inStock]
     * @param {string} [_filters.search]
     * @param {number} [_filters.page=1]
     * @param {number} [_filters.limit=10]
     * @returns {Promise<{ products: import("../models/interfaces/IProduct").IProduct[], total: number, page: number, totalPages: number }>}
     */

    static async search(_filters) {
        try {
            const {
                category,
                subcategory,
                tags,
                minPrice,
                maxPrice,
                inStock,
                search,
                page,
                limit
            } = _filters;

            const where = {
                AND : [
                    category ? {category} : {},
                    subcategory? {subcategory} : {},
                    tags? {tags: {hasEvery: tags}} : {},
                    minPrice || maxPrice ? {
                        price: {
                            gte: minPrice || 0,
                            lte: maxPrice || Number.MAX_SAFE_INTEGER
                        }
                    }: {},
                    inStock ? {stock: {gte: 0}} : {},
                    search ? {
                        OR: [
                            {name: {contains: search , mode: 'insensitive'}},
                            {description: {contains: search , mode: 'insensitive'}}
                        ]
                    } : {}
                ]
            };

            const [products , total ] = await Promise.allSettled([
                await prisma.Product.findMany({
                    where,
                    include: {
                        variants: true,
                        reviews: {
                            select: {
                                rating: true
                            }
                        }
                    },
                    skip: (page - 1) * limit,
                    take: Number(limit)
                }),
                await prisma.product.count({where})
            ]);

            return {
                products,
                total,
                totalPages: Math.ceil(total / limit) || 1
            };
        } catch (error) {
            console.log('[ProductService][search]',error);
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }

    
    /**
     * Update PRoduct Stock
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {number} _quantity 
     * @returns {Promise<import("../models/interfaces/IProduct").IProduct>}
     */
    static async updateStock(_id,_quantity){
        try {
            const product = await this.getById(_id);

            if(product.stock + _quantity < 0) 
                throw new ApplicationError('Insuficient stock',400);

            const updatedStock = await prisma.Product.update({
                where: {id: _id},
                data: {
                    stock: {
                        increment: _quantity
                    }
                },
                include:{
                    variants: true,
                    reviews: true
                }
            });

            return updatedStock;
        } catch (error) {
            if (error instanceof ApplicationError) throw error;
            throw new ApplicationError(error.message, 500);
        }
    }
}

module.exports = ProductService;