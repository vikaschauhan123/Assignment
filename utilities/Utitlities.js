const convertCSVToMatrix = function (lines) {
    const matrix = [[]];

    for (const line of lines) {
        const arr = line.split(",");
        matrix.push(arr);
    }

    // console.log(matrix);

    return matrix;

}

module.exports = {convertCSVToMatrix};