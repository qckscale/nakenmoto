import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ujhkm2yt',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
})
