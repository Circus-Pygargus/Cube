import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from "../../src/models/User";

beforeAll(async () => {
    const MONGODB_URI = 'mongodb://127.0.0.1:27017/cube_test';
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('connexion réussie à la base de données de test');
    } catch (err: any) {
        console.log('La connextion à la base de données de test n\'a pas pu être effectuée. Les tests ne seront pas effectués.');
    }
}, 10000);

afterAll(async () => {
    await mongoose.connection.close();
}, 10000);

describe('User model', () => {
    it('should create a user with valid data', async () => {
        const user = new User({
            name: 'testuser',
            email: 'testuser@exemple.com',
            password: 'password123'
        });

        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe('testuser');
        expect(savedUser.email).toBe('testuser@exemple.com');
    });

    it ('should fail to create a user with invalid email', async () => {
        const user = new User({
            name: 'testuser2',
            email: 'invalidemail',
            password: 'password123'
        });

        let err: Error | undefined;
        try {
            await user.save();
        } catch (error: any) {
            err = error as Error;
        }

        // here I used ! to indicate to typescript that err and its properties are not null or undefined (and so I don't have any more warnings in my IDE)
        expect(err!).toBeDefined();
        expect((err! as any).errors.email).toBeDefined();
        expect((err! as any).errors.email.message).toBe('Veuillez fournir une adresse email valide');
    });

    it ('should hash the password before saving', async () => {
        const user = new User({
            name: 'testuser3',
            email: 'testuser3@exemple.com',
            password: 'password123'
        });

        const savedUser = await user.save();
        expect(savedUser.password).not.toBe('password123');
        expect(await bcrypt.compare('password123', savedUser.password)).toBe(true);
    });
});
