//
// composables/leaveCompany.js
// --------------------------
// Handles the process of leaving a company for the current user.
// Updates the company state and shows error messages on failure.
// Uses the useUser composable for state management.
//
const { error, success } = useUI()

export default async function () {
  console.log("leaveCompany")
  const { auth, company } = useUser()
  const dbApi = useRuntimeConfig().public.dbApi
  
  // Send DELETE request to remove user from company
  const res = await fetch(dbApi + '/data/users_in_company/' + auth.value.id, {
    method: 'DELETE'
  })
  if(!res.ok){
    throw new Error('Failed to leave company')
  }else{
    // Reset company state on success
    company.value = { 
      companyName: "", 
      companyTransactionalEmail: "",
      isInCompany: false, 
      isAdmin: false
    }
  }
}