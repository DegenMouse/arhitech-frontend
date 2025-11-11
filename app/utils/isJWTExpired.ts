//
// utils/isJWTExpired.ts
// --------------------
// Utility function to check if a JWT expiry date (in seconds) is expired.
// Returns true if the current time is past the expiry date, false otherwise.
// Used for validating JWT tokens in authentication flows.
//
export default function(expiryDate: number): boolean {
  if (!expiryDate) return true
  // Compare current time (ms) to expiry (s)
  return Date.now() >= expiryDate * 1000
}
