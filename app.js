const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Sample data to simulate database
let students = [
  { id: 1, name: 'John Doe', section: 'A', college_id: 1 },
  { id: 2, name: 'Jane Smith', section: 'B', college_id: 2 }
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// READ data endpoint
app.get('/api/students/:userRole', (req, res) => {
  const userRole = req.params.userRole;
  const userId = req.headers['user-id'];

  if (userRole === 'super_admin') {
    res.json(students);
  } else if (userRole === 'admin') {
    const collegeId = req.headers['college-id'];
    const filteredStudents = students.filter(student => student.college_id == collegeId);
    res.json(filteredStudents);
  } else if (userRole === 'teacher') {
    const section = req.headers['section'];
    const filteredStudents = students.filter(student => student.section === section);
    res.json(filteredStudents);
  } else if (userRole === 'student' && userId) {
    const student = students.find(student => student.id == userId);
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

// WRITE data endpoint
app.post('/api/students', (req, res) => {
  const userRole = req.headers['user-role'];

  if (userRole === 'admin' || userRole === 'teacher') {
    const student = req.body;
    students.push(student);
    res.status(201).send('Student added successfully');
  } else {
    res.status(403).send('Unauthorized');
  }
});

// UPDATE data endpoint
app.put('/api/students/:userRole/:id', (req, res) => {
  const userRole = req.params.userRole;
  const id = req.params.id;

  if (userRole === 'admin' || userRole === 'teacher') {
    const index = students.findIndex(student => student.id == id);
    if (index !== -1) {
      students[index] = { id, ...req.body };
      res.send('Student updated successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

// DELETE data endpoint
app.delete('/api/students/:userRole/:id', (req, res) => {
  const userRole = req.params.userRole;
  const id = req.params.id;

  if (userRole === 'admin' || userRole === 'teacher') {
    const index = students.findIndex(student => student.id == id);
    if (index !== -1) {
      students.splice(index, 1);
      res.send('Student deleted successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
