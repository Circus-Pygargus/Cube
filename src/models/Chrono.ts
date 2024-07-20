import { Schema, Document, model } from 'mongoose';
import CubeType from '../../enums/CubeType';
import tokenGenerator from './utils/tokenGenerator';

interface IChrono extends Document {
    user: Schema.Types.ObjectId;
    cubeType: CubeType;
    token: string;
    scrambleMoves: string[];
    durationInSeconds: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
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
    token: {
        type: String,
        required: true,
        default: () => tokenGenerator.generate()
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
