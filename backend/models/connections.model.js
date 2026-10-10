import mongoose, {Schema} from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    userId: { // whoever sent it (Kisne bheja)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference is 'User Model'
    },
    connectionId: { // to whom was it sent (kisko bheja)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference is 'User Model'
    },
    status_accepted: {
        type: Boolean, // If 'true' means friend connection request was 'accepted' then it is shown in 'my connections' section in frontend; If 'false' means the connection request was 'rejected', &,
        default: null, // If 'null' means request sent is in waiting condition (neither accepted nor rejected by the person to whom it was sent)
    }
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequestModel;