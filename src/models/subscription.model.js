import mongoose,{Schema} from "mongoose"

const subscriptionSchema = new Schema({
   subscriber:{
    type:Schema.Types.ObjectId, //the one who is subscribing
    red:"user"
   },
   channel:{
      type:Schema.Types.ObjectId,
      red:"user"
   }
}
    
,{timestamps:true})

 export const Sunscription = mongoose.model("Subscribe",subscriptionSchema)