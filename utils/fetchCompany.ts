export default function() : Promise<void> {
    const { auth, company } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    return fetch(dbApi + '/data/users/' + auth.value.id + '/company_id')
    .then(res => {
        if(!res.ok){
            throw new Error('response not ok')
        }
        return res.json()
    })
    .then(data => {
        const companyData = data.data
        if(!(Array.isArray(companyData) && companyData.length == 0)){
            company.value.companyName = data.data.attributes.name
            company.value.isInCompany = true
        }else{
            company.value.companyName = ""
            company.value.isInCompany = false
            company.value.isAdmin = false
        }
        // console.log(company.value.isInCompany)
    })
}