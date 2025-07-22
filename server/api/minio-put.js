// server/api/presign.js
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  const { path, bucket } = getQuery(event)
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing `path` parameter' })
  }

  const config = useRuntimeConfig()
  const endpointUrl = new URL(config.public.minioEndpoint)

  const minioClient = new Client({
    endPoint:  endpointUrl.hostname,
    port:      Number(endpointUrl.port) || (endpointUrl.protocol === 'https:' ? 443 : 80),
    useSSL:    endpointUrl.protocol === 'https:',
    accessKey: config.minio.accessKeyId,
    secretKey: config.minio.secretAccessKey
  })

  // presign a PUT URL valid for 5 minutes (300s)
  const url = await minioClient.presignedPutObject(
    bucket || config.public.buckets.companyFiles,
    path,
    300
  )
  
  return { url }
})
