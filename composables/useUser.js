const auth = ref({
  jwtToken: null,
  expireDate: null,
  isLoggedIn: false,
  id: null
})

// holds the user's profile data
const profile = ref({ 
  username: '',
  email: '' 
})

const company = ref({ 
  companyName: "", 
  isInCompany: false, 
  isAdmin: false
})

export default function() {
  return { auth, profile, company }
}