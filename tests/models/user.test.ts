import bcrypt from 'bcrypt';
import User from "../../src/models/User";
import dbManager from '../../src/db/databaseManager';
import { MongoServerError } from 'mongodb';

beforeAll(async () => {
    await dbManager.connect();
});

afterAll(async () => {
    await dbManager.disconnect();
});

// Delete all recorded users before each test
beforeEach(async () => {
    await User.deleteMany({});
});

describe('User model', () => {
    it('should create and save a user with valid data', async () => {
        const user = new User({
            name: 'testuser',
            email: 'testuser@exemple.com',
            password: 'password123'
        });

        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe('testuser');
        expect(savedUser.email).toBe('testuser@exemple.com');
        expect(savedUser.password).toBeDefined();
    });

    describe('Name property', () => {
        it('should not create a user with an already recorded name', async () => {
            const user = new User({
                name: 'testuser',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            await user.save();

            const user2 = new User({
                name: 'testuser',
                email: 'testuser2@exemple.com',
                password: 'password123'
            });
            let err: MongoServerError | undefined;
            try {
                await user2.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err?.name).toBe('MongoServerError');
            expect(err?.code).toBe(11000); // Code d'erreur pour duplication d'index
        });

        it('should not create a user with an empty name', async () => {
            const user = new User({
                name: '',
                email: 'emptyName@example.com',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Le pseudo est obligatoire !');
        });

        it('should not create a user with a name shorter than 3', async () => {
            const user = new User({
                name: 'ab',
                email: 'testuser@exemple.com',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Ce pseudo est trop court. Il doit contenir au moins 3 caractères.');
        });

        it('should not create a user with a name longer than 25', async () => {
            const user = new User({
                name: 'abcdefghijklmnopqrstuvwxyz',
                email: 'testuser@exemple.com',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Ce pseudo est trop long. Il doit contenir au maximum 25 caractères.');
        });

        it('should not create create a user with dangerous name', async () => {
            const user = new User({
                name: '{ "$ne": "" }',
                email: 'testuser@exemple.com',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.name).toBeDefined();
            expect(err.errors.name.message).toBe('Le pseudo ne peut contenir que des lettres, des chiffres, des espaces et des underscores.');
        });
    });

    describe('Email property', () => {
        it('should not create a user with an email already recorded', async () => {
            const user = new User({
                name: 'testuser',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            await user.save();

            const user2 = new User({
                name: 'testuser2',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            let err: MongoServerError | undefined;
            try {
                await user2.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err?.name).toBe('MongoServerError');
            expect(err?.code).toBe(11000); // Code d'erreur pour duplication d'index
        });

        it('should not create create a user with invalid email', async () => {
            const user = new User({
                name: 'testuser2',
                email: 'invalidemail',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.email).toBeDefined();
            expect(err.errors.email.message).toBe('Veuillez fournir une adresse email valide');
        });

        it('should not create a user with an empty email', async () => {
            const user = new User({
                name: 'testuser',
                email: '',
                password: 'password123'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.email).toBeDefined();
            expect(err.errors.email.message).toBe('L\'email est obligatoire !');
        });
    });

    describe('Password property', () => {
        it('should not create a user with a short password', async () => {
            const user = new User({
                name: 'testuser3',
                email: 'testuser3@exemple.com',
                password: '123456'
            });

            let err: any;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err).toBeDefined();
            expect(err.name).toBe('ValidationError');
            expect(err.errors.password).toBeDefined();
            expect(err.errors.password.message).toBe('Le mot de passe doit contenir au moins 7 caractères !');
        });

        it('should hash the password before saving', async () => {
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
});
