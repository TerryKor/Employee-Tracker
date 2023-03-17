const mysql = require("mysql2");
const inquire = require("inquirer");
const consoleTable = require("console.table");
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sql369369",
  database: "employee_tracker_db",
});


const allDepartments = []
const allRoles = []
const allManagers = []
const choicesArray = [
  "View all employees",
  "Add employee",
  "View all roles",
  "Add role",
  "View all departments",
  "Add department",
  "Exit"
];


const addDepartmentQuestions = [
  { type: "input", name: "name", message: "What is the name of the department ?" },
]





const addRoleQuestions = [
  { type: "input", name: "name", message: "What is role name?" },
  { type: "input", name: "salary", message: "What is role salary?" },
  {
    type: "list",
    name: "department_id",
    message: "Which department?",
    choices: allDepartments,
  },
];



const addEmployeeQuestions = [
  { type: "input", name: "name", message: "What is employee's first name?" },
  { type: "input", name: "salary", message: "What is employee's last name?" },
  {
    type: "list",
    name: "role_id",
    message: "What is employee's role?",
    choices: allRoles,
  },
  {
    type: "list",
    name: "manager_id",
    message: "Who's employee's manager",
    choices: allManagers,
  },
];

const menuQuestions = [
  {
    type: "list",
    name: "chosenOption",
    message: "What would you like to do?",
    choices: choicesArray,
  },
];



async function init(){
  db.query('SELECT * FROM department', function (err, results) {
    results.forEach((element)=>{
      allDepartments.push(element.name)
    })
  });
  db.query('SELECT * FROM role', function (err, results) {
    results.forEach((element)=>{
      allRoles.push(element.title)
    })
  
  });

  const menuResponses = await inquire.prompt(menuQuestions)
  if(menuResponses.chosenOption == choicesArray[0]){
    viewAllEmployees()
  }
  else if(menuResponses.chosenOption == choicesArray[1]){
    addEmployee()
  }
  else if(menuResponses.chosenOption == choicesArray[2]){
    viewAllRoles()
  }
  else if(menuResponses.chosenOption == choicesArray[3]){
    addRole()
  }
  else if(menuResponses.chosenOption == choicesArray[4]){
    viewAllDepartments()
  }
  else if(menuResponses.chosenOption == choicesArray[5]){
    addDepartment()
  }else{
    return;
  }




};



function viewAllEmployees(){
  db.query("SELECT * from employee", (err, results)=>{
    console.table(results)
  })


};
function addEmployee(){

};
function updateEmployeeRole(){

};
function viewAllRoles(){

  db.query("SELECT * from role", (err, results)=>{
      console.table(results)
    })
    
  };
  function addRole(){
  };
  function viewAllDepartments(){
    db.query("SELECT * from department", (err, results)=>{
        console.table(results)
      })
    
};
function addDepartment(){

};

app.use((req, res) => {
  res.status(404).end();
});



init();

