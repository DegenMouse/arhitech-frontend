export default defineNuxtRouteMiddleware((to, from) => {
  
    if (import.meta.server) return

    console.log('company.global.js')
  
    const { company } = useUser()

    console.log("company.value", company.value)
    
    if(['/companies', '/companyMember', '/companyAdmin'].includes(to.path) && !company.value.isInCompany){
        return navigateTo('/noComp')
    }

    var path = to.path;
    if(to.path === '/noComp' && company.value.isInCompany){
        path = '/companies'
    }

    console.log("isAdmin", company.value.isAdmin)

    if((path === '/companies' || path === '/companyMember') && company.value.isAdmin){
        return navigateTo('/companyAdmin')
    }else if((path === '/companies' || path === '/companyAdmin') && !company.value.isAdmin){
        console.log("navigating to companyMember from companyAdmin")
        return navigateTo('/companyMember')
    }
  })