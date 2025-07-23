//
// server/api/minio-del.js
// ----------------------
// Nuxt server API route to generate a presigned DELETE URL for MinIO object storage.
// Used to securely allow clients to delete files from MinIO without exposing credentials.
// Accepts `key` query parameter for the object key to delete.
// Returns a presigned URL valid for 5 minutes.
//
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event)
  if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing `key` parameter' })

  const config = useRuntimeConfig()
  const endpointUrl = new URL(config.public.minioEndpoint)

  // Create MinIO client instance
  const minioClient = new Client({
    endPoint:  endpointUrl.hostname,
    port:      Number(endpointUrl.port) || (endpointUrl.protocol === 'https:' ? 443 : 80),
    useSSL:    endpointUrl.protocol === 'https:',
    accessKey: config.minio.accessKeyId,
    secretKey: config.minio.secretAccessKey
  })

  // Presign a DELETE URL valid for 5 minutes
  const url = await minioClient.presignedDeleteObject(
    config.public.bucket,
    key,
    300
  )

  return { url }
})
