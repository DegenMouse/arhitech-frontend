import { createClient } from 'redis';

async function connectRedis() {
    const redisClient = createClient({
      socket: {
        host: "127.0.0.1",
        port: "6379",
      },
    });
  
    redisClient.on('error', (err) => console.error('[Redis] Error:', err));
    redisClient.on('connect', () => console.log('[Redis] Connected'));
  
    await redisClient.connect();
    return redisClient;
}

async function insertTeamMember(userId, companyId) {
  const dbApi = useRuntimeConfig().public.dbApi
  const requestBody = {
    data: {
      // type: 'users_in_company',
      attributes: {
        user_id: userId,
        company_id: companyId
      }
    }
  }

  console.log("requestBody")
  console.log(requestBody)

  try {
    const res = await fetch(dbApi + '/data/users_in_company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    if(!res.ok) {
      console.log(res)
      // return
    }
    const data = await res.json()
    console.log(data)
    return data
  } catch (e) {
      console.log(e)
  }



}

export default eventHandler(async (event) => {
    const body = await readBody(event);
    const { token: key, inviteType, userEmail, userId } = body;
    const redis = await connectRedis();

    console.log(`${inviteType} ${userEmail}`);
    console.log(key)
    const result = await redis.get(key)
    const data = JSON.parse(result);

    if (data.inviteType == inviteType && data.email == userEmail) {
      if(inviteType == "team-member") {
        console.log('incercam sa inseram');
        await insertTeamMember(userId, data.entityId)
      }
    }
    else {
      console.log(`${data.inviteType} ${data.email}`);
      console.log(`${inviteType} ${userEmail}`);
    }

})