var express = require('express');
var router = express.Router();
var {readCsvFile} = require('../services/CsvFileReader');
const {convertCSVToMatrix} = require('../utilities/Utitlities');
const classSchedule = require('../memorydb/class_schedule');
const classSchedule2 = require('../memorydb/solution2');
const teacherSchedule = require('../memorydb/teacher_schedule');
/* GET users listing. */
router.get('/', async function (req, res, next) {
    const timeTable = await readAllTeachersSchedule();

    let clonedClassSchedule = cloneClassSchedule(classSchedule);
    reassignTeachersToFreeTime(clonedClassSchedule, teacherSchedule );
    let timeTable2 = JSON.stringify(classSchedule)

    timeTable2 = timeTable2.replace(/null,null,null,null,null,null,null,null,null,null,null/gi, '')
   // console.log('timeTable2:----> ',timeTable2.replace(/[]/gi),'')
    res.render('solution2', { classSchedule: JSON.parse(timeTable2) });
    //res.send('test')
});


const reassignTeachersToFreeTime = (classSchedule) => {
    for(let klass in teacherSchedule){
       console.log(teacherSchedule[klass]);
       for(let i =2; i < teacherSchedule[klass].length; i++){
           for(let j = 1; j <teacherSchedule[klass][i].length; j++ ){
               if(teacherSchedule[klass][i][j] !== "") continue;
               assignTeacherToClass(klass,j, i, teacherSchedule);
           }
       }
    }
}

const assignTeacherToClass = (subject, dayIndex, timeslot) => {
    console.log('subject: ',subject,' dayIndex: ', dayIndex, ' timeslot: ', timeslot);
    let found = false;
    let breakpoint = 0;
    const classes = ['6th', '7th', '8th', '9th', '10th'];
    while (!found && breakpoint<10){
        const klass = classes[~~(classes.length * Math.random())];
        if(!classSchedule[klass][timeslot][dayIndex]){
            classSchedule[klass][timeslot][dayIndex]=subject;
            teacherSchedule[subject][timeslot][dayIndex]=klass;
            found = true;
            breakpoint++;
        }
    }
    // for(let klass in classSchedule){
    //     if(!classSchedule[klass][timeslot][dayIndex]){
    //         classSchedule[klass][timeslot][dayIndex]=subject;
    //         teacherSchedule[subject][timeslot][dayIndex]=klass;
    //         break;
    //     }
    // }

}

const cloneClassSchedule = (classSchedule) => {
    for(let key in classSchedule){
        for(let i = 0; i < classSchedule[key].length; i++){
            for(let j = 0; j < classSchedule[key][i].length; j++){
                classSchedule2[key][i][j] = classSchedule[key][i][j];
            }
        }
    }

    return classSchedule2;
}

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
