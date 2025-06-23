const path = require("path");
const ProductService = require("./product.service");
const imagekit = require("../config/imageKit.config");
const prisma = require("../prisma/client");
const { ApplicationError } = require("../utils/error");



/**
 * Media Service
 *
 * @class MediaService
 * @typedef {MediaService}
 */
class MediaService{

    
    /**
     * Upload Images 
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {import("multer").Multer.File[]} files 
     * @returns {Promise<string[]>} 
     */
    static async uploadImages(_id,files){
        try {
            const product = await ProductService.getById(_id);
            const uploadPromises = files.map(file => {
                const fileName = `${Date.now()}-${path.basename(file.originalname)}`;
                return imagekit.upload({
                    file: file.buffer.toString('base64'),
                    fileName: fileName,
                    folder: `/products/${_id}/gallery`,
                    tags: ['product','gallery']
                });
            });

            const uploadFiles = await Promise.all(uploadPromises);
            const uploadUrls = uploadFiles.map(file => file.url);

            const currentMedia = await product.media || {Image: []};
            const updatedMedia = {
                ...currentMedia,
                Image: [...currentMedia.Image , ...uploadUrls]
            };

            await prisma.Product.update({
                where: {id: _id},
                data: {media: updatedMedia}
            });

            return uploadUrls
        } catch (error) {
            throw new ApplicationError(
                'Failed to upload images: ' + error.message,
                error.statusCode || 500
            );
        }
    }

    
    /**
     * Delete Image from Product
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {string} _imageId 
     * @returns {Promise<boolean>} 
     */
    static async deleteImage(_id,_imageId){
        try {
            const product = await ProductService.getById(_id);

            // Delete Img from imgKit
            await imagekit.deleteFile(_imageId);
            // Find and Remove url from product media
            const updatedMedia = {
                ...product.media,
                Image: product.media.Image.filter(url => !url.includes(_imageId))
            };

            await prisma.Product.update({
                where: {id: _id},
                data: {media: updatedMedia}
            });

            return true;
        } catch (error) {
            throw new ApplicationError(
                'Failed to delete image: ' + error.message,
                error.statusCode || 500
            );
        }
    }

    
    /**
     * Get Product Images
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<Array<{url: string,fields: string}>>} 
     */
    static async getImages(_id){
        try {
            await ProductService.getById(_id);

            const files = await imagekit.listFiles({
                path: `/products/${_id}/gallery`
            });

            return files.map(file =>({
                url: file.url,
                fileId: file.fileId,
                thumbnailUrl: file.thumbnail,
                name: file.name,
                size: file.size,
                height: file.height,
                width: file.width
            }));
        } catch (error) {
            throw new ApplicationError(
                'Failed to get images: ' + error.message,
                error.statusCode || 500
            );
        }
    }


    
    /**
     * Upload 3d Model
     *
     * @static
     * @async
     * @param {string} _id 
     * @param {import("multer").Multer.File[]} file 
     * @returns {Promise<string>} 
     */
    static async upload3DModel(_id,file){
        try {
            const product = await ProductService.getById(_id);

            // Upload ImgageKit
            const uploadFile = await imagekit.upload({
                file: file.buffer.toString('base64'),
                fileName: `${Date.now()}-${path.basename(file.originalname)}`,
                folder: `/products/${_id}/3dmodel`,
                tags: ['product','3dmodel']
            });

            const updatedMedia = {
                ...product.media,
                model3d: uploadFile.url
            };

            await prisma.Product.update({
                where: {id: _id},
                data: {media: updatedMedia}
            });

            return uploadFile.url
        } catch (error) {
            throw new ApplicationError(
                'Failed to upload 3D model: ' + error.message,
                error.statusCode || 500
            );
        }
    }

    
    /**
     * Get 3d Model
     *
     * @static
     * @async
     * @param {string} _id 
     * @returns {Promise<{url: string, fileId: string}|null>}
     */
    static async get3DModel(_id){
        try {
            const product = await ProductService.getById(_id);

            if(!product.media.model3d) return null;

            const files = await imagekit.listFiles({
                path: `/products/${_id}/3dmodel`
            });

            if(!files.length) return null

            const file = files[0];

            return {
                url: file.url,
                fileId: file.fileId,
                name: file.name,
                size: file.size
            };
        } catch (error) {
            throw new ApplicationError(
                'Failed to get 3D model: ' + error.message,
                error.statusCode || 500
            );
        }
    }

    
    /**
     * Generate Optimized URLs
     *
     * @static
     * @param {string} _url 
     * @param {Object} [options={}] 
     * @returns {string} 
     */
    static generatOptimizedUrl(_url,options = {}){
        try {
            const {
            width,
            height,
            quality = 80,
            format = 'auto'
        } = options;

        return imagekit.url({
            src: _url,
            transformation : [
                {
                    width: width || undefined,
                    height:height || undefined,
                    quality,
                    format
                }
            ]
        });
        } catch (error) {
            throw error.message;
        }
    }
}

module.exports = MediaService;