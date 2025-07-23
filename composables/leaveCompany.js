//
// composables/leaveCompany.js
// --------------------------
// Handles the process of leaving a company for the current user.
// Updates the company state and shows error messages on failure.
// Uses the useUser composable for state management.
//
export default async function (error) {
  console.log("leaveCompany")
  const { auth, company } = useUser()
  const dbApi = useRuntimeConfig().public.dbApi
  
  // Send DELETE request to remove user from company
  return fetch(dbApi + '/data/users_in_company/' + auth.value.id, {
    method: 'DELETE'
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Leave Company'
      error.message = 'There was an error while trying to leave the company. Please try again.'
      error.show = true
      throw new Error('Failed to leave company')
    }else{
      // Reset company state on success
      company.value = { 
        companyName: "", 
        isInCompany: false, 
        isAdmin: false
      }
    } 
  }).catch(err => {
    console.error(err)
    if (!error.show) {
      error.title = 'Network Error'
      error.message = 'Unable to connect to the server. Please check your internet connection and try again.'
      error.show = true
    }
    throw err
  })
}