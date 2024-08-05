import { ACCESS_TOKEN } from 'src/config-global'
import axios, { endpoints } from 'src/utils/axios'

export const uploadImage = async (file: File) => {
    console.log(`uploading ${JSON.stringify(file)}`)
    const formData = new FormData()
    formData.append('file', file)
    const config = {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'multipart/form-data',
        },
    }
    const res = await axios.post(endpoints.image.upload, formData, config)

    if (res.status !== 200) {
        throw new Error('Failed to upload image')
    }
    return res.data ?? 'empty-url'
}
