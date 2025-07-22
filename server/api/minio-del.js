// server/api/presign-delete.js
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event)
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing `key` parameter' })

  const config = useRuntimeConfig()
  const endpointUrl = new URL(config.public.minioEndpoint)

  const minioClient = new Client({
    endPoint:  endpointUrl.hostname,
    port:      Number(endpointUrl.port) || (endpointUrl.protocol === 'https:' ? 443 : 80),
    useSSL:    endpointUrl.protocol === 'https:',
    accessKey: config.minio.accessKeyId,
    secretKey: config.minio.secretAccessKey
  })

  // presign a DELETE URL valid for 5 minutes
  const url = await minioClient.presignedDeleteObject(
    config.public.bucket,
    key,
    300
  )

  return { url }
})
