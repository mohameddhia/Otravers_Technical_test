const ProductService = require("../services/product.service");



/**
 * Product Controller Class
 *
 * @class ProductController
 * @typedef {ProductController}
 */
class ProductController{


    
    /**
     * Create New Product
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async createProduct(req,res) {
        try {
            const product = await ProductService.create(req.body);

            res.status(201).json({
                message: 'Product created Successfully',
                data: product
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
     * Get Product By Id
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getById(req,res) {
        try {
            const product = ProductService.getById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Get Product By Slug
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getBySlug(req,res){
        try {
            const product = await ProductService.getBySlug(req.params.slug);
            res.status(200).json(product);
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Update Product
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async update(req,res){
        try {
            const product = await ProductService.update(req.params.id,req.body);
            res.status(200).json({
                message:  'Product updated Successfullu',
                data: product
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
     * Delete Product By Id
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async delete(req,res){
        try {
            const result = await ProductService.delete(req.params.id);
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Sear Products
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async search(req,res){
        try {
            const result = await ProductService.search(req.query);
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Update Product's stock
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async updateStock(req,res){
        try {
            const product = await ProductService.updateStock(
                req.query.id,
                req.query.quantity
            );

            res.status(200).json({
                message: 'Stock updated Successfully',
                data: product
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

module.exports = ProductController;