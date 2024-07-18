import { Schema, Document, model } from 'mongoose';
import CubeType from '../../enums/CubeType';

interface IChrono extends Document {
    user: Schema.Types.ObjectId;
    cubeType: CubeType;
    scrambleMoves: string[];
    durationInSeconds: number;
    date: Date;
    comment: string;
}

const ChronoSchema: Schema<IChrono> = new Schema<IChrono>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    cubeType: {
        type: String,
        enum: Object.values(CubeType), // the only strings accepted
        required: true,
        index: true
    },
    scrambleMoves: {
        type: [String],
        required: true,
        index: true
    },
    durationInSeconds: {
        type: Number,
        required: true,
        index: true
    },
    comment: {
        type: String
    }
}, { timestamps: true });

const Chrono = model<IChrono>('Chrono', ChronoSchema);

export default Chrono;
