import mongoose,{ model, models } from "mongoose"
const chatSchema = new mongoose.Schema({  
    chatName:{
        type:String,
        required:true
    },
    chatMessages: [{
    userMessage:{
       type:String,
       required:true
    },
    type:{
        type:String,
        required:true
    },
    AiResponse:{
        type:String,
        required:true
    }
}]
},{timestamps:true})

const Chat = models?.Chat || model('Chat',chatSchema) 
export default Chat