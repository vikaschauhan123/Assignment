# Assignment
### Problem statement: 
A school has created its timetable based on availability of six subject teachers (see Teacher wise class timetable PDF file). Using this as source, also available as csv files per teacher, answer the following questions:  
1. Read the CSV files and generate class wise timetable (Write a simple csv parser)  
2. Assuming that any teacher can be co-teacher to any other class, generate a new timetable such that no teacher is idle during the duration of school.  
3. Identify when all teachers are busy and a class can not be assigned a co-teacher. Calculate minimum number of extra co-teachers needed to solve it.


## Requirements:
- Node.js v11 or above.
- Epxress


# How to run
- Navigate inside ```timetable``` folder
- Run command ``` npm start``` in cmd


##Solution 1
- Converted time table into class wise.
ScreenShot: ![alt text](https://user-images.githubusercontent.com/22792502/99706474-1daf1400-2ac1-11eb-8224-42cb5e2d0aae.png)

##Solution 2
- Assigned vacant teachers to free time slots.
ScreenShot: ![alt text](https://user-images.githubusercontent.com/22792502/99706552-3dded300-2ac1-11eb-8e39-8aa30248e9ce.png)
