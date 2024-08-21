import mongoose,{Schema} from "mongoose"

const subscriptionSchema = new Schema({
   subscriber:{
    type:Schema.Types.ObjectId, //the user who is subscribing
    red:"User"
   },
   channel:{
      type:Schema.Types.ObjectId, // the channel being subscribed to 
      red:"User"
   }
}
    
,{timestamps:true})

 export const Subscription = mongoose.model("Subscription",subscriptionSchema)