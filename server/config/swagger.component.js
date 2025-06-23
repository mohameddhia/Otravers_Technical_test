/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         genre:
 *           type: string
 *           enum: [MAN, WOMAN]
 *         birthDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductMedia:
 *       type: object
 *       properties:
 *         Image:
 *           type: array
 *           items:
 *             type: string
 *         model3d:
 *           type: string
 *     
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         price:
 *           type: number
 *         discount:
 *           type: number
 *         stock:
 *           type: number
 *         media:
 *           $ref: '#/components/schemas/ProductMedia'
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *         businessId:
 *           type: string
 *         promoted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ImageKitFile:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: "https://ik.imagekit.io/your_imagekit_id/products/123/gallery/1624456789-product.jpg"
 *         fileId:
 *           type: string
 *           example: "6123456789abcdef"
 *         name:
 *           type: string
 *           example: "product-image.jpg"
 *         size:
 *           type: number
 *           example: 1048576
 *         height:
 *           type: number
 *           example: 1080
 *         width:
 *           type: number
 *           example: 1920
 *         thumbnailUrl:
 *           type: string
 *           example: "https://ik.imagekit.io/your_imagekit_id/tr:w-200,h-200/products/123/gallery/1624456789-product.jpg"
 *         mediumUrl:
 *           type: string
 *           example: "https://ik.imagekit.io/your_imagekit_id/tr:w-600/products/123/gallery/1624456789-product.jpg"
 *         originalUrl:
 *           type: string
 *           example: "https://ik.imagekit.io/your_imagekit_id/products/123/gallery/1624456789-product.jpg"
 *
 *     ThreeDModel:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: "https://ik.imagekit.io/your_imagekit_id/products/123/3dmodel/1624456789-model.glb"
 *         fileId:
 *           type: string
 *           example: "6123456789abcdef"
 *         name:
 *           type: string
 *           example: "product-model.glb"
 *         size:
 *           type: number
 *           example: 5242880
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - genre
 *         - birthDate
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         genre:
 *           type: string
 *           enum: [MAN, WOMAN]
 *         birthDate:
 *           type: string
 *           format: date
 *     getUserById:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *     getUserByEmail:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         genre:
 *           type: string
 *           enum: [MAN, WOMAN]
 *         birthDate:
 *           type: string
 *           format: date
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *           minLength: 8
 *     deleteUser:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Profile retrieved successfully"
 *         data:
 *           $ref: '#/components/schemas/User'
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - price
 *         - businessId
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         price:
 *           type: number
 *         discount:
 *           type: number
 *         stock:
 *           type: number
 *         media:
 *           $ref: '#/components/schemas/ProductMedia'
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         businessId:
 *           type: string
 *         promoted:
 *           type: boolean
 *
 *     UpdateStockRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           description: The quantity to add (positive) or remove (negative)
 *
 *     SearchProductsRequest:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *         inStock:
 *           type: boolean
 *         search:
 *           type: string
 *         page:
 *           type: number
 *           default: 1
 *         limit:
 *           type: number
 *           default: 10
 *
 *     SearchProductsResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         totalPages:
 *           type: number
 *     UploadImagesResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Images uploaded successfully"
 *         data:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://ik.imagekit.io/your_imagekit_id/products/123/gallery/1624456789-product.jpg"
 *
 *     GetImagesResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ImageKitFile'
 *
 *     Upload3DModelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "3D model uploaded successfully"
 *         data:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://ik.imagekit.io/your_imagekit_id/products/123/3dmodel/1624456789-model.glb"
 *
 *     Get3DModelResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ThreeDModel'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Error message description"
 *
 *   parameters:
 *     productId:
 *       name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: The ID of the product
 *       example: "550e8400-e29b-41d4-a716-446655440000"
 *     
 *     imageId:
 *       name: imageId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: The ImageKit file ID of the image
 *       example: "6123456789abcdef"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Failed to fetch user"
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   requestBodies:
 *     UploadImages:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload (max 10 files, 5MB each)
 *     
 *     Upload3DModel:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *             properties:
 *               model:
 *                 type: string
 *                 format: binary
 *                 description: 3D model file (max 50MB, supported formats - glTF, GLB)
 */