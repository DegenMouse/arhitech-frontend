export default defineNuxtRouteMiddleware((to, from) => {
  
  if (import.meta.server) return

  const { auth } = useUser()
  console.log("loggedIn.global.js")
  //not logged in users can only see : (/login and /)
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    console.log("not logged in")
    return abortNavigation()
  }
})