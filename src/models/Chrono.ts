import { Schema, Document, model } from 'mongoose';
import CubeType from '../../enums/CubeType';
import tokenGenerator from './utils/tokenGenerator';

interface IChrono extends Document {
    user: Schema.Types.ObjectId;
    cubeType: CubeType;
    token: string;
    scrambleMoves: string[];
    durationInSeconds: number | null;
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
        validate: {
            validator: (arr: string[]): boolean => {
                return arr.length > 0 && arr.every(move => typeof move === 'string');
            },
        },
        index: true,
    },
    durationInSeconds: {
        type: Number,
        index: true
    },
    comment: {
        type: String,
        maxlength: 1000,
        trim: true
    }
}, { timestamps: true });

const Chrono = model<IChrono>('Chrono', ChronoSchema);

export default Chrono;
