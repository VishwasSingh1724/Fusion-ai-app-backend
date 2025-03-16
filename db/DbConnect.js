import mongoose from "mongoose"

export default function DbConnect(){
    try {
        mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB🫡🫡🫡🫡'))
    } catch (error) {
        console.log(error)
        
    }
}