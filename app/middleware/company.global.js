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


    console.log("company.value", company.value)
    
    // Redirect to /noComp if not in a company and accessing company routes
    if(['/arhitect/companies', '/arhitect/companyMember', '/arhitect/companyAdmin'].includes(to.path) && !company.value.isInCompany){
        return navigateTo('/arhitect/noComp')
    }

    var path = to.path;
    if(to.path === '/arhitect/noComp' && company.value.isInCompany){
        path = '/arhitect/companies'
    }

    // console.log("isAdmin", company.value.isAdmin)

    // Redirect to admin dashboard if user is admin
    if((path === '/arhitect/companies' || path === '/arhitect/companyMember') && company.value.isAdmin){
        return navigateTo('/arhitect/companyAdmin')
    // Redirect to member dashboard if user is not admin
    }else if((path === '/arhitect/companies' || path === '/arhitect/companyAdmin') && !company.value.isAdmin){
        // console.log("navigating to companyMember from companyAdmin")
        return navigateTo('/arhitect/companyMember')
    }
  })