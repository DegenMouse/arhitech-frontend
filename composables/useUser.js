const auth = ref({
  jwtToken: null,
  expireDate: null,
  isLoggedIn: false,
  id: null,
  // this is used to re-evaluate the user data on the next page load
  // this is needed beacause the userData is loaded only once on the first page load
  // and we need to re-evaluate the user data for example on login
  reEvalRequired: false
})

// holds the user's profile data
const profile = ref({ 
  username: '',
  email: '' 
})

const company = ref({ 
  companyName: "", 
  isInCompany: false, 
  isAdmin: false,
  id: null
})

export default function() {
  return { auth, profile, company }
}