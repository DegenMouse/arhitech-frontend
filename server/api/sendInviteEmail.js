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

async function sendEmailTask(taskData) {
    const redis = await connectRedis();
    const messageId = await redis.xAdd(
        "email.invite",
        '*', // Auto-generate message ID
        taskData
      );
    console.log(`Task added to email.invite with ID: ${messageId}`);
    
} 

export default eventHandler(async (event) => {
    const body = await readBody(event);
    const {email, inviteType, entityId} = body;
    const payload = {
        email,
        entityId,
        inviteType
        }
    sendEmailTask({payload:JSON.stringify(payload)})
    
    // this should call the send email redis consumer stream from backend.
})