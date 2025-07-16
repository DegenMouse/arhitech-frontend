export default function() : Promise<void> {
    const { auth, company } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    return fetch(dbApi + '/data/users_in_company/' + auth.value.id + '/company_id')
    .then(res => {
        if(!res.ok){
            throw new Error('User not in any company')
        }
        return res.json()
    })
    .then(data => {
        const companyData = data.data
        if(!(Array.isArray(companyData) && companyData.length == 0)){
            company.value.companyName = data.data.attributes.name
            company.value.isInCompany = true
            company.value.id = data.data.id
        }else{
            company.value.companyName = ""
            company.value.isInCompany = false
            company.value.isAdmin = false
            throw new Error('No company found')
        }
        // console.log(company.value.isInCompany)
    }).then(async () => {
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