//
// middleware/loggedIn.global.js
// ----------------------------
// Global route middleware to enforce authentication for protected routes.
// Disallows unauthenticated users to access anything but /login and /
// Triggers user data re-evaluation if required.
// Used to protect all routes except login and landing page.
//

// TODO: Mihai check daca mai e nevoie de asta

export default defineNuxtRouteMiddleware(async (to, from) => {
  
  if (import.meta.server) return

  // console.log("loggedIn.global.js")
  
  if(to.path.startsWith('/dev')){
    return
  }

  // Check if the user is logged in
  const { auth } = useUser()
  // Re-evaluate user data if required (e.g., after login)
  if(auth.value.reEvalRequired){
    auth.value.reEvalRequired = false
    await fetchUserData()
  }

  // Not logged in users can only see: /login and /
  if(to.path != '/' && to.path != '/login' && !auth.value.isLoggedIn){
    // console.log("not logged in")
    if (to.path.startsWith('/invite/')) {
      // Store invite ID for later use (you can add this to localStorage or a global state)
      const id = to.params.id;
      const { enType, enId } = to.query;

      const inviteLink = `/invite/${id}?enType=${enType}&enId=${enId}`;

      localStorage.setItem('pendingInvite', inviteLink);
    }

    return navigateTo('/login')
  }
})