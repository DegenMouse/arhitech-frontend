//
// server/api/minio-put.js
// ----------------------
// Nuxt server API route to generate a presigned PUT URL for MinIO object storage.
// Used to securely allow clients to upload files to MinIO without exposing credentials.
// Accepts `path` and optional `bucket` query parameters.
// Returns a presigned URL valid for 5 minutes.
//
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  const { path, bucket } = getQuery(event)
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing `path` parameter' })
  }

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

  // Presign a PUT URL valid for 5 minutes (300s)
  const url = await minioClient.presignedPutObject(
    bucket || config.public.buckets.companyFiles,
    path,
    300
  )
  
  return { url }
})
