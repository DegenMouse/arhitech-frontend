export default eventHandler(async (event) => {
    const body = await readBody(event);
    const {email, inviteType} = body;
    return `${email} and ${inviteType}`   
})