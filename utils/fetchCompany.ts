export default function() : void {
    const { auth, company } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    console.log("fetching company data")
    console.log(dbApi + '/data/users/' + auth.value.id + '/company_id')
    fetch(dbApi + '/data/users/' + auth.value.id + '/company_id')
    .then(res => res.json())
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
    }).catch(err => {
        console.error('Failed to fetch company data:', err)
    })
}