import CubeType from "../../../enums/CubeType";

const scrambler = require('cube-scramble.js');

const generateScramble = (cubeType: string = '3x3', movesNb?: number): string[] => {
    if (!Object.values(CubeType).includes(cubeType as CubeType)) {
        throw new Error(`Invalid cube type : ${cubeType}`);
    }

    let scrambleString: string[];
    if (movesNb) {
        scrambleString = scrambler.scramble(cubeType, movesNb);
    } else {
        scrambleString = scrambler.scramble(cubeType);
    }

    const scrambleMoves: string[] = scrambleString;

    return scrambleMoves;
};

export default generateScramble;
