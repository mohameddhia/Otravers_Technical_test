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
 */