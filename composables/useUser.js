//
// composables/useUser.js
// ---------------------
// Provides global reactive state for authentication, user profile, and company info.
// Used throughout the app for user/session management.
// Exposes refs for auth, profile, and company objects.
//
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
  email: '',
  accountType: ''
})

const company = ref({ 
  companyName: "", 
  isInCompany: false, 
  isAdmin: false,
  id: null
})

// Export composable function for use in components
export default function() {
  return { auth, profile, company }
}