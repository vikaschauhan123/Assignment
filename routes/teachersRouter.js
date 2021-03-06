var express = require('express');
var router = express.Router();
var {readCsvFile} = require('../services/CsvFileReader');
const {convertCSVToMatrix} = require('../utilities/Utitlities');
const classSchedule = require('../memorydb/class_schedule');
const teacherSchedule = require('../memorydb/teacher_schedule');
/* GET users listing. */
router.get('/load', async function (req, res, next) {
    const timeTable = await readAllTeachersSchedule();
    let timeTable2 = JSON.stringify(classSchedule)

    timeTable2 = timeTable2.replace(/null,null,null,null,null,null,null,null,null,null,null/gi, '')
   // console.log('timeTable2:----> ',timeTable2.replace(/[]/gi),'')
    res.render('solution2', { classSchedule: JSON.parse(timeTable2) });
    //res.send('test')
});

const prefix = 'Teacher wise class timetable - ';
const subjects = ['English', 'Hindi', 'Kannada', 'Science', 'Maths']
const readAllTeachersSchedule = async () => {
   for(const subject of subjects){
       const fileName = prefix+subject+'.csv';
       const lines = await readCsvFile(fileName);
       const matrix = convertCSVToMatrix(lines);
       loadIntoMemoryDb(subject, matrix);
       await convertToClassMatrix(subject, matrix);
   }

   //console.log(classSchedule);
    // console.log(matrix);
}

const loadIntoMemoryDb = (subject, matrix) => {
    teacherSchedule[subject.toLowerCase()] = matrix;
}

const convertToClassMatrix = async (subject, matrix) => {
    for (let i = 2; i < 11; i++) {
        for (let j = 1; j < 7; j++) {
            if (matrix[i][j] !== '') {
                classSchedule[matrix[i][j].trim()][i][0] = matrix[i][0];
                classSchedule[matrix[i][j].trim()][i][j] = subject;
            }
        }
    }

    // console.log('Hello Bro', classSchedule);
}


module.exports = router;
