//
// middleware/company.global.js
// ---------------------------
// Global route middleware to enforce company membership and role-based redirects.
// Redirects users to /noComp if not in a company when accessing company routes.
// Redirects to admin/member dashboards based on isAdmin flag.
// Used to control access to company-related pages and ensure correct dashboard.
//
export default defineNuxtRouteMiddleware((to, from) => {
  
    if (import.meta.server) return

    // console.log('company.global.js')
  
    const { company } = useUser()

    // console.log("company.value", company.value)
    
    // Redirect to /noComp if not in a company and accessing company routes
    if(['/companies', '/companyMember', '/companyAdmin'].includes(to.path) && !company.value.isInCompany){
        return navigateTo('/noComp')
    }

    var path = to.path;
    if(to.path === '/noComp' && company.value.isInCompany){
        path = '/companies'
    }

    // console.log("isAdmin", company.value.isAdmin)

    // Redirect to admin dashboard if user is admin
    if((path === '/companies' || path === '/companyMember') && company.value.isAdmin){
        return navigateTo('/companyAdmin')
    // Redirect to member dashboard if user is not admin
    }else if((path === '/companies' || path === '/companyAdmin') && !company.value.isAdmin){
        // console.log("navigating to companyMember from companyAdmin")
        return navigateTo('/companyMember')
    }
  })