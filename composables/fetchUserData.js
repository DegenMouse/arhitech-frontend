export default async function () {
  const { auth, profile } = useUser()
  
  //check if user is logged in so that this isnt run on every page load
  if(!auth.value.isLoggedIn){
    const jwtToken = localStorage.getItem('jwt')
    if (jwtToken) {
      try {
        const decodedJwt = JSON.parse(atob(jwtToken.split('.')[1]))
        if(isJWTExpired(decodedJwt.exp)) throw new Error('JWT is expired')
        
        auth.value = {
          jwtToken: jwtToken,
          expireDate: decodedJwt.exp,
          isLoggedIn: true,
          id: decodedJwt.id
        }
        profile.value = {
          username: decodedJwt.username || '',
          email: decodedJwt.email || ''
        }
        
        //fetch company that user is in
        await fetchCompany().catch(err => {
          console.error('Failed to fetch company:', err)
        })
        
      } catch (err) {
        console.error('JWT processing error:', err)
      }
    }
  }
}