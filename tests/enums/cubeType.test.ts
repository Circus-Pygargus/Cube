import CubeType from '../../enums/CubeType';

describe('CubeType Enum', () => {
    it('should contain all and only the correct cube types', () => {
        const expectedCubeTypes = [
            '2x2',
            '3x3',
            '4x4',
            '5x5',
            '6x6',
            '7x7'
            // add here any other wanted cube type
        ];

        const actualCubeTypes = Object.values(CubeType);

        // Check if the number of actual cube types matches the number of expected cube types
        expect(actualCubeTypes).toHaveLength(expectedCubeTypes.length);

        // Check if all expected cubetypes are in the actual types
        expectedCubeTypes.forEach(type => {
            expect(actualCubeTypes).toContain(type);
        });

        // Check if there are no extra cube types in the actual types
        actualCubeTypes.forEach(type => {
            expect(expectedCubeTypes).toContain(type);
        });
    });
});
