import CubeType from "../../enums/CubeType";
import dbManager from "../../src/db/databaseManager";
import Chrono from "../../src/models/Chrono";
import User from "../../src/models/User";
import tokenGenerator from "../../src/models/utils/tokenGenerator";
import { MongoServerError } from 'mongodb';

beforeAll( async () => {
    await dbManager.connect();
});

afterAll( async () => {
    await dbManager.disconnect();
});

beforeEach(async () => {
    await User.deleteMany();
    await Chrono.deleteMany();
});

describe('Chrono model', () => {
    it('should handle lifecycle of a chrono', async () => {
        // what should happen when a user asks for a cube scramble
        const user = new User({
            name: 'testuser for chrono',
            email: 'testuser@exemple.com',
            password: 'password123'
        });
        const savedUser = await user.save();

        const chrono = new Chrono({
            user: savedUser,
            cubeType: '3x3',
            token: tokenGenerator.generate(),
            scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
            durationInSeconds: null,
            comment: 'just a comment.',
        });

        const savedChrono = await chrono.save();
        expect(savedChrono._id).toBeDefined();
        expect(savedChrono.user).toBe(savedUser);
        expect(savedChrono.cubeType).toBe('3x3');
        expect(savedChrono.token).toBeDefined();
        expect(savedChrono.scrambleMoves).toStrictEqual(['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2']);
        expect(savedChrono.durationInSeconds).toBe(null);
        expect(savedChrono.comment).toBe('just a comment.');

        const now = new Date();
        expect(savedChrono.createdAt).toBeDefined();
        expect(savedChrono.createdAt).toBeInstanceOf(Date);
        expect(Math.abs(savedChrono.createdAt!.getTime() - now.getTime())).toBeLessThan(5000); // within 5 seconds
        expect(savedChrono.updatedAt).toBeDefined();
        expect(savedChrono.updatedAt).toBeInstanceOf(Date);
        expect(savedChrono.updatedAt).toBe(savedChrono.createdAt);

        // what should happen when user has solved the scrambled cube
        savedChrono.durationInSeconds = 132.05;

        const chronoWithDuration = await savedChrono.save();
        expect(chronoWithDuration._id).toEqual(savedChrono._id);
        expect(chronoWithDuration.user).toEqual(savedChrono.user);
        expect(chronoWithDuration.cubeType).toEqual(savedChrono.cubeType);
        expect(chronoWithDuration.token).toEqual(savedChrono.token);
        expect(chronoWithDuration.scrambleMoves).toEqual(savedChrono.scrambleMoves);
        expect(chronoWithDuration.comment).toEqual(savedChrono.comment);
        expect(chronoWithDuration.createdAt).toEqual(savedChrono.createdAt);
        expect(chronoWithDuration.durationInSeconds).toEqual(132.05);
        expect(savedChrono.updatedAt).toBeDefined();
        expect(savedChrono.updatedAt).toBeInstanceOf(Date);
        expect(savedChrono.updatedAt?.getTime()).toBeGreaterThan(savedChrono.createdAt?.getTime()!);
    });

    describe('tests chrono\'s user property', () => {
        it('should not create a chrono if user is not defined.', async () => {
            const chrono = new Chrono({
                cubeType: '3x3',
                token: tokenGenerator.generate(),
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.user).toBeDefined();
            expect(err!.errors.user.message).toBe('Path `user` is required.');
        });
    });

    describe('tests chrono\'s cubeType property', () => {
        it('should not create a chrono if cubeType is not defined.', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                token: tokenGenerator.generate(),
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.cubeType).toBeDefined();
            expect(err!.errors.cubeType.message).toBe('Path `cubeType` is required.');
        });

        it('should not create a chrono if cubeType is not set.', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '',
                token: tokenGenerator.generate(),
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.cubeType).toBeDefined();
            expect(err!.errors.cubeType.message).toBe('Path `cubeType` is required.');
        });
    });

    it('should not create a chrono if cubeType is not a known CubeType.', async () => {
        const user = new User({
            name: 'testuser for chrono',
            email: 'testuser@exemple.com',
            password: 'password123'
        });
        const savedUser = await user.save();

        const chrono = new Chrono({
            user: savedUser,
            cubeType: '1x1',
            token: tokenGenerator.generate(),
            scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
            durationInSeconds: null,
            comment: 'just a comment.',
        });

        let err: MongoServerError | undefined;
        try {
            await chrono.save();
        } catch (error) {
            err = error as MongoServerError;
        }

        expect(err).toBeDefined();
        expect(err!.name).toBe('ValidationError');
        expect(err!.errors.cubeType).toBeDefined();
        expect(err!.errors.cubeType.message).toBe('`'+chrono.cubeType+'` is not a valid enum value for path `cubeType`.');
    });

    describe('tests chrono\'s token property', () => {
        it('should generate a token if not provided (done by mongodb)', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            const savedChrono = await chrono.save();

            expect(savedChrono.token).toBeDefined();
            expect(savedChrono.token).not.toBe('');
        });

        it('should not create a chrono with an explicitly undefined token', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                token: undefined,
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            const savedChrono = await chrono.save();

            expect(savedChrono.token).toBeDefined();
            expect(savedChrono.token).not.toBe('');
        });

        it('should not create a chrono with an explicitly null token', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                token: null,
                scrambleMoves: ['B2','F\'','R','L\'','D','B2','F2','D','B\'','L\'','B','F\'','U\'','B','L','R\'','F2','U2','F2','L\'','B2','R\'','L2','D2','R2'],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.token).toBeDefined();
            expect(err!.errors.token.message).toBe('Path `token` is required.');
        });
    });

    describe('tests chrono\'s scrambleMoves property', () => {
        it('should not create a chrono if scrambleMoves is not defined.', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                token: tokenGenerator.generate(),
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.scrambleMoves).toBeDefined();
            expect(err!.errors.scrambleMoves.message).toBe('Validator failed for path `scrambleMoves` with value ``');
        });

        it('should not create a chrono if scrambleMoves is not set.', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                token: tokenGenerator.generate(),
                scrambleMoves: [],
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.scrambleMoves).toBeDefined();
            expect(err!.errors.scrambleMoves.message).toBe('Validator failed for path `scrambleMoves` with value ``');
        });

        it('should not create a chrono if scrambleMoves is set with bad values.', async () => {
            const user = new User({
                name: 'testuser for chrono',
                email: 'testuser@exemple.com',
                password: 'password123'
            });
            const savedUser = await user.save();

            const chrono = new Chrono({
                user: savedUser,
                cubeType: '3x3',
                token: tokenGenerator.generate(),
                scrambleMoves: [1, 2, 5, null], // 1, 2 and 5 will be transformed in string by mongoDB, but null will make the validation fail
                durationInSeconds: null,
                comment: 'just a comment.',
            });

            let err: MongoServerError | undefined;
            try {
                await chrono.save();
            } catch (error) {
                err = error as MongoServerError;
            }

            expect(err).toBeDefined();
            expect(err!.name).toBe('ValidationError');
            expect(err!.errors.scrambleMoves).toBeDefined();
            expect(err!.errors.scrambleMoves.message).toBe('Validator failed for path `scrambleMoves` with value `1,2,5,`');
        });
    });
});
