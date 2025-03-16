import DbConnect from "@/db/DbConnect";
import Chat from "@/db/models/chat_data.model";

export default async function SaveChat({chatName,userMessage,type,AiResponse}){
    console.log(chatName,userMessage,type,AiResponse);
    
    await DbConnect()
    const chat = await Chat.findOne({chatName:chatName})
    if(chat){
        chat.chatMessages.push({userMessage,type,AiResponse})
        await chat.save()
        }else{  
            const newChat = await Chat.create({
                chatName: chatName,
                chatMessages:[{
                    userMessage,
                    type,
                    AiResponse
                }]
             })
        }
    console.log(chat)
    return chat
}