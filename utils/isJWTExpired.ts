/**
 * Checks if a JWT expiry date has been surpassed
 * @param {string} expiryDate - The expiry date to check
 * @returns {boolean} - True if expired, false if still valid
 */
export function isJWTExpired(expiryDate) {
  if (!expiryDate) return true
  
  const currentTime = new Date().getTime()
  const expireTime = new Date(expiryDate).getTime()
  
  return currentTime > expireTime
}
