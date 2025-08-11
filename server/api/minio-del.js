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
  try {
    console.log('=== MINIO DELETE DEBUG ===')
    const { key, bucket } = getQuery(event)
    console.log('Query params:', { key, bucket })
    
    if (!key) {
      console.log('ERROR: Missing key parameter')
      throw createError({ statusCode: 400, statusMessage: 'Missing `key` parameter' })
    }

    // Automatically add .pdf extension if not present
    const filePath = key.endsWith('.pdf') ? key : `${key}.pdf`
    console.log('File path after PDF extension:', filePath)

    const config = useRuntimeConfig()
    console.log('Runtime config buckets:', config.public.buckets)
    console.log('MinIO endpoint:', config.public.minioEndpoint)
    console.log('MinIO credentials:', { 
      accessKey: config.minio.accessKeyId, 
      secretKey: config.minio.secretAccessKey
    })
    
    const targetBucket = bucket || config.public.buckets.companyFiles
    console.log('Target bucket:', targetBucket)
    
    const endpointUrl = new URL(config.public.minioEndpoint)
    console.log('Parsed endpoint:', {
      hostname: endpointUrl.hostname,
      port: endpointUrl.port,
      protocol: endpointUrl.protocol,
      useSSL: endpointUrl.protocol === 'https:'
    })

    // Create MinIO client instance
    const minioClient = new Client({
      endPoint:  endpointUrl.hostname,
      port:      Number(endpointUrl.port) || (endpointUrl.protocol === 'https:' ? 443 : 80),
      useSSL:    endpointUrl.protocol === 'https:',
      accessKey: config.minio.accessKeyId,
      secretKey: config.minio.secretAccessKey
    })
    console.log('MinIO client created successfully')

    // Presign a DELETE URL valid for 5 minutes
    console.log('Attempting to presign DELETE URL for:', { bucket: targetBucket, filePath })
    // const url = await minioClient.presignedDeleteObject(
    //   targetBucket,
    //   filePath,
    //   300
    // )
    const url = await minioClient.presignedUrl('DELETE', targetBucket, filePath, 24 * 60 * 60)
    console.log('Successfully generated delete URL:', url)

    return { url }
  } catch (error) {
    console.error('=== MINIO DELETE ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error details:', error)
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `MinIO delete URL generation failed: ${error.message}` 
    })
  }
})
