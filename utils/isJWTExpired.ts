export default function(expiryDate: number): boolean {
  if (!expiryDate) return true
  return Date.now() >= expiryDate * 1000
}
