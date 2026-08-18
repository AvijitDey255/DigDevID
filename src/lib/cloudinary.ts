
import { v2 as cloudinary } from 'cloudinary'

import fs from 'fs'




const uploadCloudinary = async (filePath:Blob):Promise<string | null> => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {

        if (!filePath) return null

        const arrayBuffer =await filePath.arrayBuffer()
        const buffer =Buffer.from(arrayBuffer)

        return new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream({resource_type:"auto"},
                (error:any,result:any)=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve(result?.secure_url ?? null)
                    }

                }
            )
            uploadStream.end(buffer)
        })

        // const uploadResult = await cloudinary.uploader.upload(filePath)

        // if (fs.existsSync(filePath)) {
        //     fs.unlinkSync(filePath)
        // }

        // return {
        //     url: uploadResult.secure_url,
        //     public_id: uploadResult.public_id
        // }

    } catch (error) {
        console.log(error)
        return null

    }

}

export default uploadCloudinary