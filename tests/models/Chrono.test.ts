import dbManager from "../../src/db/databaseManager";
import Chrono from "../../src/models/Chrono";
import User from "../../src/models/User";
import tokenGenerator from "../../src/models/utils/tokenGenerator";

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
});
