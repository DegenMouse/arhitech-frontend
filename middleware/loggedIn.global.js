export default defineNuxtRouteMiddleware((to, from) => {
  
  if (import.meta.server) return

  const { auth, profile, company } = useUser()
  
  //check if user is logged in so that this isnt run on every page load
  if(!auth.value.isLoggedIn){
    console.log("auth.value.isLoggedIn is false")
    const jwtToken = localStorage.getItem('jwt')
    if (jwtToken) {
      try {
        const decodedJwt = JSON.parse(atob(jwtToken.split('.')[1]))
        if(isJWTExpired(decodedJwt.exp)) throw new Error('JWT is expired')

        console.log("decodedJwt")
        console.log(decodedJwt)
        console.log(decodedJwt.username)
        
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
        
        //fetch company that users is in
        const config = useRuntimeConfig()
        const apiUrl = config.public.apiUrl
        fetch(apiUrl + '/data/users/' + auth.value.id + '/company_id')
        .then(res => res.json())
        .then(data => {
            const companyData = data.data
            console.log("data")
            console.log(companyData)
            if(!(Array.isArray(companyData) && companyData.length == 0)){
                company.value.companyName = data.data.attributes.name
                company.value.isInCompany = true
            }else{
                company.value.isInCompany = false
            }
            console.log(company.value.isInCompany)
        }).catch(err => {
          console.error('Failed to fetch company data:', err)
        })
      } catch (err) {
        console.error('JWT is not valid:', err)
      }
    }
  }
  
  //not logged in users can only see : (/login and /)
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    console.log('JWT is expired')
    return abortNavigation()
  }else{
    console.log('JWT is not expired')
  }
})