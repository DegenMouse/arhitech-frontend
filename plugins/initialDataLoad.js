//
// plugins/initialDataLoad.js
// -------------------------
// Nuxt plugin to load user data on initial app startup.
// Ensures authentication and profile state are set before app renders.
// Calls fetchUserData composable to initialize user session.
//
export default defineNuxtPlugin(async () => {
    // Load user data on app initialization
    await fetchUserData()
})
