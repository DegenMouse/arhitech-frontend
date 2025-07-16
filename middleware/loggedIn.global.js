export default defineNuxtRouteMiddleware(async (to, from) => {
  
  if (import.meta.server) return

  console.log("loggedIn.global.js")

  const { auth } = useUser()
  if(auth.value.reEvalRequired){
    auth.value.reEvalRequired = false
    await fetchUserData()
  }
  
  //not logged in users can only see : (/login and /)
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    console.log("not logged in")
    return abortNavigation()
  }
})