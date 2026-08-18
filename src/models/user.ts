// user.ts
import mongoose from 'mongoose'

export interface SocialMedia {
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface UserInfo {
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  bio?: string;
  company?: string;
  country?: string;
}

export interface User {
  _id: mongoose.Types.ObjectId;
  name:string;
  userName: string;
  email: string;
  password?: string;
  mobile: string;
  image?: string;
  imageID?: string;
  isVerified: boolean;
  isEditInfo: boolean;
  socialMedia?: SocialMedia;
  info?: UserInfo;
}
const userSchema = new mongoose.Schema<User>({
    name:{
        type:String
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        trim: true,
        default: ""
    },
    image: {
        type: String
    },
    imageID: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isEditInfo: {
        type: Boolean,
        default: false
    },
    socialMedia: {
        website: {
            type: String
        },
        linkedin: {
            type: String
        },
        facebook:{
            type:String
        },
        github: {
            type: String
        },
    },
    info: {
        title: {
            type: String,
        },
        address: {
            type: String,

        },
        city: {
            type: String,

        },
        state: {
            type: String,

        },
        bio: {
            type: String,

        },
        company: {
            type: String,

        },
        country: {
            type: String,

        },
    },

})

const User = mongoose.model("User", userSchema)

export default User
