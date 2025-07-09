import { useState } from 'nuxt/app'

export function useUser() {
    // holds the JWT, expiration date, and login status together
    const auth = useState<{
      jwtToken: string | null;
      expireDate: string | null;
      isLoggedIn: boolean;
      id: string | null;
    }>('auth', () => ({
      jwtToken: null,
      expireDate: null,
      isLoggedIn: false,
      id: null
    }))
  
    // holds the user’s profile data
    const profile = useState<{ username: string; email: string } | null>(
      'userProfile',
      () => null
    )

    const company = useState<{ companyName: string, isInCompany: boolean , isAdmin: boolean }>(
      'company',
      () => ({ 
        companyName: "", 
        isInCompany: false, 
        isAdmin: false
      })
    )
  
    return { auth, profile, company }
}