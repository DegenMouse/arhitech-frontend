<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const { auth, company } = useUser()
//
onMounted(() => {
  console.log("onMounted")
  fetch(apiUrl + '/data/users/' + auth.value.id + '/company_id')
  .then(res => res.json())
  .then(data => {
      const companyData = data.data
      console.log("data")
      console.log(companyData)
      if(!(Array.isArray(companyData) && companyData.length == 0)){
          company.value.companyName = data.data.attributes.name
          company.value.isInCompany = true
          // company.value.isAdmin = data.data.attributes.is_admin
          // localStorage.setItem('company_name', data.data.attributes.name)
      }else{
          company.value.isInCompany = false
      }
      console.log(company.value.isInCompany)
  })
})
</script>
