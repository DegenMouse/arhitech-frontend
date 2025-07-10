export default defineNuxtRouteMiddleware((to, from) => {
  
    if (import.meta.server) return
  
    const { auth, profile, company } = useUser()
    
    if(to.path === '/companies' && !company.value.isInCompany){
      return navigateTo('/noComp')
    }
  })