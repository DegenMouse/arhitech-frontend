const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

export async function fetchProjects(projects) {
    try {
        console.log("id",auth.value.id)
        const res = await fetch(dbApi + '/data/users_in_project/' + `?include=project_id&filter=user_id=${auth.value.id}`)
        if (!res.ok) {
        throw new Error('Failed to fetch projects')
        }
        
        const data = await res.json()

        let projectsData = data.includes || []
        projects.value = projectsData
    } catch (err) {
        console.error('Failed to fetch projects:', err)
    }
}