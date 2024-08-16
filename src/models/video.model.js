import mongoose , { Schema} from "mongoose"
import mongoAggrigatePerinate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new Schema({
  
    VideoFile:{
        type:String, //clooudinary url
        required:true
    },
    thumbnail:{
        type:String, // cloudinary url
        required:true

    },
    title:{
    type:String,
    requird:true,

   },
    description:{
    type:String,
    requird:true,
   },
    duration:{
    type:Number,
    required:true
   },
    views:{
        type:Number,
        default: 0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        red:"User"
    }
    
},
{
    timestamps:true
}
)  

 VideoSchema.plugin(mongoAggrigatePerinate)
export const Video = mongoose.model("Video", VideoSchema)