// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/fonts.css'],

  runtimeConfig: {
    public: {
      dbApi: "https://dbapi01.softaccel.net/apis/arhiTech",
      minioEndpoint: 'http://gamma.softaccel.net:9000',
      buckets:         {
        templates: 'templates',
        companyFiles: 'cmpfiles'
      },
    },
    minio: {
      accessKeyId:     'mihai',
      secretAccessKey: '1par2ola3'
    }
  }
})
