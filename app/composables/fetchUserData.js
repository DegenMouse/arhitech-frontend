//
// composables/fetchUserData.js
// ---------------------------
// Loads user authentication and profile data from JWT in localStorage.
// Sets up the auth and profile state in the useUser composable.
// Fetches company data if user is authenticated.
// Handles JWT expiration and error cases.
//
export default async function () {
  const { auth, profile } = useUser()
  
  // Check if user is logged in so that this isn't run on every page load
  if(!auth.value.isLoggedIn){
    const jwtToken = localStorage.getItem('jwt')
    if (jwtToken) {
      try {
        // Decode JWT and check expiration
        const decodedJwt = JSON.parse(atob(jwtToken.split('.')[1]))
        if(isJWTExpired(decodedJwt.exp)) throw new Error('JWT is expired')
        
        // Set authentication state
        auth.value = {
          jwtToken: jwtToken,
          expireDate: decodedJwt.exp,
          isLoggedIn: true,
          id: decodedJwt.id
        }
        // Set user profile state
        profile.value = {
          username: decodedJwt.username || '',
          email: decodedJwt.email || '',
          accountType: decodedJwt.accountType || ''
        }

        // console.log("profile.value", profile.value.accountType)
        
        // Fetch company that user is in
        await fetchCompany().catch(err => {
          console.error('Failed to fetch company:', err)
        })
        
      } catch (err) {
        console.error('JWT processing error:', err)
      }
    }
  }
}