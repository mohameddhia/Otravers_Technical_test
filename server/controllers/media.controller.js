const multer = require("multer");
const MediaService = require("../services/media.service");
const { ApplicationError } = require("../utils/error");


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 // 5MB Limit
    }
});


/**
 * Media Management Controller
 *
 * @class MediaController
 * @typedef {MediaController}
 */
class MediaController{

    
    /**
     * Upload Images
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async uploadImages(req, res) {
        try {
            if (!req.files?.length) {
                throw new ApplicationError('No files uploaded', 400);
            }
            console.log('[MediaController][uploadImages][params]',req.params);
            const urls = await MediaService.uploadImages(req.params.id, req.files);
            
            res.status(201).json({
                message: 'Images uploaded successfully',
                data: urls
            });
        } catch (error) {
            console.log("[MediaController][uploadImages]",error)
            if (error instanceof ApplicationError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    
    /**
     * Delete Image
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async deleteImage(req,res){
        try {
            await MediaService.deleteImage(req.query.id,req.query.imageId);
            res.status(200).json({
                message: 'Image deleted successfully',
                data: true
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
     * Get Images
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async getImages(req,res){
        try {
            const images = await MediaService.getImages(req.params.id);

            // Generate OPT url
            const optimizedUrl = images.map(image =>({
                ...image,
                thumbnailUrl: MediaService.generatOptimizedUrl(image.url,{
                    width: 200,
                    height: 200
                }),
                mediumUrl: MediaService.generateOptimizedUrl(image.url, {
                    width: 600
                }),
                originalUrl: image.url
            }));

            res.status(200).json({
                data: optimizedUrl
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
     * Upload 3D Model
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async upload3Dmodel(req,res){
        try {
            if(!req.file)
                throw new ApplicationError('No File Uploaded',400);

            // Valdiate File Size max 50Mb
            if(req.file.size > 50 * 1024 * 1024)
                throw new ApplicationError('File too large max 50mb',400);

            const modelUrl = await MediaService.upload3DModel(req.params.id, req.file);

            res.status(201).json({
                message: '3D model uploaded successfully',
                data: {
                    url: modelUrl
                }
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
     * Get 3D Model
     *
     * @static
     * @async
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Promise<Response>} 
     */
    static async get3Dmodel(req,res){
        try {
            const model = await MediaService.get3DModel(req.params.id);

            if(!model)
                throw new ApplicationError('3D Model not found',404);

            res.status(200).json({
                data: model
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
     * Handle Multer Error
     *
     * @static
     * @param {Error} err 
     * @param {Request} req 
     * @param {Response} res 
     * @param {import("express").NextFunction} next 
     * @returns {Response} 
     */
    static handeMulterError(err,req,res,next){
         if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'File too large. Maximum size is 5MB for images and 50MB for 3D models'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    message: 'Too many files. Maximum is 10 files per upload'
                });
            }
            return res.status(400).json({
                message: 'File upload error: ' + err.message
            });
        }
        next(err);
    }

    
    /**
     * Validate File Type
     *
     * @static
     * @param {Request} req 
     * @param {Response} res 
     * @param {import("express").NextFunction} next 
     * @returns {boolean | Response} 
     */
    static validateFileType(req,res,next){
        if (!req.files?.length && !req.file) {
            return next();
        }

        const files = req.files || [req.file];
        const invalidFile = files.find(file => {
            if (file.fieldname === 'images') {
                return !file.mimetype.startsWith('image/');
            }
            if (file.fieldname === 'model') {
                const allowed3DFormats = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
                return !allowed3DFormats.includes(file.mimetype);
            }
            return true;
        });

        if (invalidFile) {
            return res.status(400).json({
                message: `Invalid file type: ${invalidFile.originalname}`
            });
        }
        next();
    }
}

module.exports = {
    MediaController,
    upload,
    handleMulterError: MediaController.handeMulterError,
    validateFileTypes: MediaController.validateFileType
};