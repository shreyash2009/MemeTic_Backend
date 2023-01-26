import mongoose from 'mongoose'


const memeSchema = mongoose.Schema({
    title: String,
    desc: String,
    name: String,
    creator: String,
    tags:[String],
    imageFile:String,
    createdAt:{
        type:Date,
        default: new Date(),
    },
    likes: {
        type: [String],
        default: [],
    }
});

const MemeModel = mongoose.model("Meme", memeSchema);

export default MemeModel;