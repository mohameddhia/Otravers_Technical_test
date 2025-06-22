const redis = require('../config/redis.config');
const { ApplicationError } = require('../utils/error');
/**
 * RedisService
 *
 * @class RedisService
 * @typedef {RedisService}
 */
class RedisService{

    
    /**
     * Save Refresh Token
     *
     * @async
     * @param {string} _userId 
     * @param {string} _sessionId
     * @param {string} _token
     * @returns {Promise<string>} 
     */
    async saveToken(_userId ,_sessionId, _token){
        try {
            // Store Session in Redis
            const rslt = await redis.set(
                `session:${_sessionId}`,
                JSON.stringify({
                    id: _userId,
                    sessionId : _sessionId,
                    _token,
                    createdAt: new Date().toISOString()
                }),
                'EX',
                7*24*60*60 // 7days in secs
            );
            console.log("[RedisService][SaveToken][rslt]",rslt);
            return true;
        } catch (error) {
            console.log("[RedisService][SaveToken][error]",error);
            throw new ApplicationError('Failed to save refresh token in redis',500);
        }
    }

    
    /**
     * Validate Redis Session
     *
     * @async
     * @param {string} _sessionId 
     * @returns {Promise<string | null>} 
     */
    async validateSession(_sessionId){
        try {
            const session = await redis.get(`session:${_sessionId}`);
            console.log("[RedisService][validateSession][session]",session)
            return session? JSON.parse(session) : null;
        } catch (error) {
            console.log("[RedisService][validateSession][error]",error)
            throw new ApplicationError('Failed to Validate Redis Session',500);
        }
    }
    
    /**
     * Delete Redis Session
     *
     * @async
     * @param {string} _sessionId 
     * @returns {void} 
     */
    async invalidateSession(_sessionId) {
        try {
            await redis.del(`session:${_sessionId}`);
        } catch (error) {
            throw new ApplicationError('Failed to delete Redis Session',500);
        }
      }
}

module.exports = RedisService = new RedisService();