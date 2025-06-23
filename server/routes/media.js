const express = require('express');
const router = express.Router();
const { MediaController, upload, handleMulterError, validateFileTypes } = require('../controllers/media.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Product Media
 *   description: Product media management endpoints (Created by mohameddhia on 2025-06-23 12:44:16 UTC)
 *
 * components:
 *   parameters:
 *     productIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Product ID
 *       example: "550e8400-e29b-41d4-a716-446655440000"
 *     
 *     imageIdParam:
 *       in: path
 *       name: imageId
 *       required: true
 *       schema:
 *         type: string
 *       description: Image ID from ImageKit
 *       example: "6123456789abcdef"
 */

/**
 * @swagger
 * /products/{id}/media/images:
 *   post:
 *     summary: Upload product images
 *     tags: [Product Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (Max 10 files, 5MB each)
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Images uploaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "https://ik.imagekit.io/your_imagekit_id/products/123/gallery/image.jpg"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No files uploaded or invalid file type"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
    '/:id/media/images',
    verifyToken,
    upload.array('images', 10),
    validateFileTypes,
    MediaController.uploadImages
);

/**
 * @swagger
 * /products/{id}/media/images/{imageId}:
 *   delete:
 *     summary: Delete a product image
 *     tags: [Product Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *       - $ref: '#/components/parameters/imageIdParam'
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image not found"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
    '/:id/media/images/:imageId',
    verifyToken,
    MediaController.deleteImage
);

/**
 * @swagger
 * /products/{id}/media/images:
 *   get:
 *     summary: Get all product images
 *     tags: [Product Media]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       200:
 *         description: List of product images with optimized versions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileId:
 *                         type: string
 *                         example: "6123456789abcdef"
 *                       name:
 *                         type: string
 *                         example: "product-image.jpg"
 *                       originalUrl:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your_imagekit_id/products/123/gallery/image.jpg"
 *                       thumbnailUrl:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your_imagekit_id/tr:w-200,h-200/products/123/gallery/image.jpg"
 *                       mediumUrl:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your_imagekit_id/tr:w-600/products/123/gallery/image.jpg"
 *                       size:
 *                         type: number
 *                         example: 1048576
 *                       width:
 *                         type: number
 *                         example: 1920
 *                       height:
 *                         type: number
 *                         example: 1080
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
    '/:id/media/images',
    MediaController.getImages
);

/**
 * @swagger
 * /products/{id}/media/3dmodel:
 *   post:
 *     summary: Upload product 3D model
 *     tags: [Product Media]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 format: binary
 *                 description: 3D model file (Max 50MB, supported formats - GLB, GLTF)
 *     responses:
 *       201:
 *         description: 3D model uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3D model uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your_imagekit_id/products/123/3dmodel/model.glb"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded or invalid file type"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
    '/:id/media/3dmodel',
    verifyToken,
    upload.single('model'),
    validateFileTypes,
    MediaController.upload3Dmodel
);

/**
 * @swagger
 * /products/{id}/media/3dmodel:
 *   get:
 *     summary: Get product 3D model
 *     tags: [Product Media]
 *     parameters:
 *       - $ref: '#/components/parameters/productIdParam'
 *     responses:
 *       200:
 *         description: Product 3D model details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your_imagekit_id/products/123/3dmodel/model.glb"
 *                     fileId:
 *                       type: string
 *                       example: "6123456789abcdef"
 *                     name:
 *                       type: string
 *                       example: "product-model.glb"
 *                     size:
 *                       type: number
 *                       example: 5242880
 *       404:
 *         description: 3D model not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3D model not found"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
    '/:id/media/3dmodel',
    MediaController.get3Dmodel
);

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *     
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Internal server error"
 */

// Add error handler middleware
router.use(handleMulterError);

module.exports = router;