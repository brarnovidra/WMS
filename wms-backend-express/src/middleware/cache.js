import redis from '../services/redis.js'

/**
 * Redis cache middleware
 * @param {Function} cacheKeyFn - function to generate a unique key from req
 * @param {number} ttl - cache time-to-live in seconds
 */
export function redisCache(cacheKeyFn, ttl = 300) {
  return async (req, res, next) => {
    try {
      const key = cacheKeyFn(req)

      if (!key) return next() // Skip if no key

      const cached = await redis.get(key)
      if (cached) {
        const data = JSON.parse(cached)
        return res.status(200).json({
          status: 'success',
          message: 'Content loaded (from cache)',
          data
        })
      }

      // Override res.send to intercept and cache the response
      const originalJson = res.json.bind(res)

      res.json = async (body) => {
        if (body?.status === 'success' && body?.data) {
          await redis.set(key, JSON.stringify(body.data), { EX: ttl })
        }
        return originalJson(body)
      }

      next()
    } catch (err) {
      console.error('Redis middleware error:', err)
      next() // Don't block request if cache fails
    }
  }
}