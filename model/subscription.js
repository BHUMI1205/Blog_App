import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    payerId: {
        type: String,
        required: true,
    },
    subscriptionPlan: {
        type: String,
        required: true,
    },
    IspaymentPending: {
        type: Boolean,
        default: true,
    },
    subscriptionEnd: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

},
    {
        timestamps: true
    });

const subscription = mongoose.model("subscription", subscriptionSchema);

export { subscription };