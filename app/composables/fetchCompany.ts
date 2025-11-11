//
// composables/fetchCompany.ts
// --------------------------
// Fetches the company data for the currently authenticated user.
// Updates the company state in the useUser composable.
// Checks if the user is an admin and updates isAdmin accordingly.
// Throws errors if the user is not in a company or if the fetch fails.
//

import { useRuntimeConfig } from "nuxt/app"

export default function() : Promise<void> {
    const { auth, company } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    // Fetch the company for the current user
    return fetch(dbApi + '/data/users_in_company/' + auth.value.id + '/company_id')
    .then(res => {
        if(!res.ok){
            throw new Error('User not in any company')
        }
        return res.json()
    })
    .then(data => {
        const companyData = data.data
        // If company data exists, update state
        if(!(Array.isArray(companyData) && companyData.length == 0)){
            company.value.companyName = data.data.attributes.name
            company.value.companyTransactionalEmail = data.data.attributes.transactionalEmail
            company.value.isInCompany = true
            company.value.id = data.data.id
        }else{
            // No company found, reset state
            company.value.companyName = ""
            company.value.companyTransactionalEmail = ""
            company.value.isInCompany = false
            company.value.isAdmin = false
            throw new Error('No company found')
        }
        // console.log(company.value.isInCompany)
    }).then(async () => {
        // Check if user is admin
        await fetch(dbApi + '/data/admins/' + auth.value.id)
        .then(res => {
            if(!res.ok){
                console.log("not admin")
                company.value.isAdmin = false
            }else{
                console.log("admin")
                company.value.isAdmin = true
            }
        })
    })
}
