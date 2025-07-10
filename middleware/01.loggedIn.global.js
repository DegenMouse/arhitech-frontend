export default defineNuxtRouteMiddleware((to, from) => {
  
  if (import.meta.server) return

  const { auth, profile, company } = useUser()
  
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
        fetchCompany()
        
      } catch (err) {
        console.error('JWT is not valid:', err)
      }
    }
  }
  
  //not logged in users can only see : (/login and /)
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    console.log("not logged in")
    return abortNavigation()
  }
})