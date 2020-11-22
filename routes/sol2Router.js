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
    let timeTable2 = JSON.stringify(classSchedule2)

    timeTable2 = timeTable2.replace(/null,null,null,null,null,null,null,null,null,null,null/gi, '')
   // console.log('timeTable2:----> ',timeTable2.replace(/[]/gi),'')
    const newSchedule = JSON.parse(timeTable2);
    const teacherRequired = calcFreePeriods(classSchedule2);
    newSchedule['teacherRequired'] =  teacherRequired;
    res.render('solution2', { classSchedule2: newSchedule });
    //res.send('test')
});

const reassignTeachersToFreeTime = (classSchedule) => {
    for(let klass in teacherSchedule){
       //console.log(teacherSchedule[klass]);
       for(let i =2; i < teacherSchedule[klass].length; i++){
           for(let j = 1; j <teacherSchedule[klass][i].length; j++ ){
               if(teacherSchedule[klass][i][j] !== "") continue;
               assignTeacherToClass(klass,j, i, teacherSchedule);
           }
       }
    }
}

const assignTeacherToClass = (subject, dayIndex, timeslot) => {
    //console.log('subject: ',subject,' dayIndex: ', dayIndex, ' timeslot: ', timeslot);
    let found = false;
    let breakpoint = 0;
    let counter = 0;
    const classes = ['6th', '7th', '8th', '9th', '10th'];
    for(let klass in classSchedule2){
        counter= counter + 1;
        if(!classSchedule2[klass][timeslot][dayIndex] && !classSchedule2[klass][timeslot].includes('co-teacher-'+subject)){
            classSchedule2[klass][timeslot][dayIndex]= 'co-teacher-'+subject;
            teacherSchedule[subject][timeslot][dayIndex]=klass;
            break;
        }
    }

}

const calcFreePeriods = (classSchedule123) => {
    let teacherRequired = 0;
    for(let klass in classSchedule123){
        //console.log(classSchedule[klass]);
        for(let i =2; i < classSchedule123[klass].length; i++){
            let counter = 0;
            for(let j = 1; j <=6; j++ ){
                if(!classSchedule123[klass][i][j]) {
                    counter = counter+1;
                };
            }
            teacherRequired = teacherRequired > counter ? teacherRequired : counter;
            console.log('Class: ', klass, ' teacher required: ', counter);
        }
    }
    console.log('Teacher Required: ', teacherRequired);
    return teacherRequired
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

}


module.exports = router;
