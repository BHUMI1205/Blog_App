import mongoose from "mongoose";

const categoryschema = mongoose.Schema({
    theme: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status: {
       type:Boolean,
       default:true
    }
},
    {
        timestamps: true
    });

const category = mongoose.model('category', categoryschema);

export { category };