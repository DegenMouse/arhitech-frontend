//
// server/api/minio-get.js
// ----------------------
// Nuxt server API route to generate a presigned GET URL for MinIO object storage.
// Used to securely allow clients to download files from MinIO without exposing credentials.
// Accepts `path` and optional `bucket` query parameters.
// Returns a presigned URL valid for 5 minutes.
//
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  console.log("minio-get")
  const { path, bucket } = getQuery(event)
  if (!path) throw createError({ statusCode: 400, statusMessage: 'Missing `path` parameter' })

  // Automatically add .pdf extension if not present
  const filePath = path.endsWith('.pdf') ? path : `${path}.pdf`

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

  // Presign a GET URL valid for 5 minutes
  const url = await minioClient.presignedGetObject(
    bucket || config.public.buckets.companyFiles,
    filePath,
    300
  )

  console.log("url get server")
  console.log(url)

  return { url }
})
