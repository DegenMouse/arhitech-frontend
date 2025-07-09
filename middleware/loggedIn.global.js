export default defineNuxtRouteMiddleware((to, from) => {

  if (import.meta.server) return

  const { auth, profile } = useUser()
  if(!auth.value.isLoggedIn){
    const jwtToken = localStorage.getItem('jwt')
    if (jwtToken) {
      try {
        const decodedJwt = JSON.parse(atob(jwtToken.split('.')[1]))
        auth.value = {
          jwtToken: jwtToken,
          expireDate: decodedJwt.exp, // Convert to milliseconds
          isLoggedIn: isJWTExpired(decodedJwt.exp),
          id: decodedJwt.id
        }
        profile.value = {
          username: decodedJwt.name || '',
          email: decodedJwt.email || ''
        }
      } catch (err) {
        console.error('Failed to decode JWT:', err)
        auth.value = {
          token: null,
          expireDate: null,
          isLoggedIn: false
        }
      }
    }
  }
  
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    console.log('JWT is expired')
    return abortNavigation()
  }else{
    console.log('JWT is not expired')
  }
})