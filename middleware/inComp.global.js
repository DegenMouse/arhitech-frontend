export default defineNuxtRouteMiddleware((to, from) => {
  
    if (import.meta.server) return
  
    const { company } = useUser()
    
    if(to.path === '/companies' && !company.value.isInCompany){
        return navigateTo('/noComp')
    }
    
    var path = to.path;
    if(to.path === '/noComp' && company.value.isInCompany){
        path = '/companies'
    }

    if((path === '/companies' || path === '/companyMember') && company.value.isAdmin){
        return navigateTo('/companyAdmin')
    }else if((path === '/companies' || path === '/companyAdmin') && !company.value.isAdmin){
        return navigateTo('/companyMember')
    }
  })