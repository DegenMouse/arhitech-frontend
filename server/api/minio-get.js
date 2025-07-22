// server/api/presign-get.js
import { Client } from 'minio'

export default defineEventHandler(async (event) => {
  console.log("minio-get")
  const { path, bucket } = getQuery(event)
  if (!path) throw createError({ statusCode: 400, statusMessage: 'Missing `path` parameter' })

  const config = useRuntimeConfig()
  const endpointUrl = new URL(config.public.minioEndpoint)

  const minioClient = new Client({
    endPoint:  endpointUrl.hostname,
    port:      Number(endpointUrl.port) || (endpointUrl.protocol === 'https:' ? 443 : 80),
    useSSL:    endpointUrl.protocol === 'https:',
    accessKey: config.minio.accessKeyId,
    secretKey: config.minio.secretAccessKey
  })

  // presign a GET URL valid for 5 minutes
  const url = await minioClient.presignedGetObject(
    bucket || config.public.buckets.companyFiles,
    path,
    300
  )

  console.log("url get server")
  console.log(url)

  return { url }
})
