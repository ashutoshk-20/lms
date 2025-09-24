import mongoose from 'mongoose';

const doubtsSchema = new mongoose.Schema({
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },

    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Lecture",
        require: true
    },

    doubts: [
        {
            question: {
                type: String,
                required: true
            },
            answers: [
                {
                    type: String
                }
            ],
            askedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps : true})

const Doubts = mongoose.model("Doubt",doubtsSchema);

export default Doubts;