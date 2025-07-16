export default async function (error) {
  console.log("leaveCompany")
  const { auth, company } = useUser()
  const dbApi = useRuntimeConfig().public.dbApi
  

  return fetch(dbApi + '/data/users_in_company/' + auth.value.id, {
    method: 'DELETE'
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Leave Company'
      error.message = 'There was an error while trying to leave the company. Please try again.'
      error.show = true
      throw new Error('Failed to leave company')
    }else{
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