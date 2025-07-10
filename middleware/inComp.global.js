export default defineNuxtRouteMiddleware((to, from) => {
  
    if (import.meta.server) return
  
    const { company } = useUser()
    
    if(to.path === '/companies' && !company.value.isInCompany){
        return navigateTo('/noComp')
    }

    if(to.path === '/noComp' && company.value.isInCompany){
        return navigateTo('/companies')
    }
  })