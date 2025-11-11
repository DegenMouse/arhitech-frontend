import { createClient } from 'redis';

interface requestBody {
    recipientEmail: string,
    senderEmail: string,
    docTypeId: string

}

async function connectRedis() {
    const redisClient = createClient({
      socket: {
        host: "127.0.0.1",
        port: 6379,
      },
    });
  
    redisClient.on('error', (err) => console.error('[Redis] Error:', err));
    redisClient.on('connect', () => console.log('[Redis] Connected'));
  
    await redisClient.connect();
    return redisClient;
}

async function sendOutboundEmailTask(taskData: any) {
    const redis = await connectRedis();
    const messageId = await redis.xAdd(
        "email.outbound",
        '*', // Auto-generate message ID
        taskData
      );
    console.log(`Task added to email.invite with ID: ${messageId}`);
    
} 

export default eventHandler(async (event) => {
  
  const body: requestBody = await readBody(event);
  console.log(body);
    await sendOutboundEmailTask({payload:JSON.stringify(body)})
    
    return { success: true, message: 'Email task queued successfully' }
})
