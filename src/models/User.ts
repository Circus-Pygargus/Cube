import { Schema, Document, model } from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        unique: true,
        required: [true, 'Le pseudo est obligatoire !'],
        minlength: [3, 'Ce pseudo est trop court.'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'L\'email est obligatoire !'],
        trim: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Veuillez fournir une adresse email valide'
        }
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire !'],
        trim: true,
        minlength: [7, 'Ce mot de passe est trop petit !'],
    }
});

UserSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

const User = model<IUser>('User', UserSchema);

export default User;
