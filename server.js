const mysql = require("mysql2");
const inquire = require("inquirer");
const consoleTable = require("console.table");


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
  "What would you like to do?",
  "View all employees",
  "Add employee",
  "View all roles",
  "Add role",
  "View all departments",
  "Add department",

];


const addDepartment = [
  { type: "input", name: "name", message: "What is the name of the department ?" },
]





const addRole = [
  { type: "input", name: "name", message: "What is role name?" },
  { type: "input", name: "salary", message: "What is role salary?" },
  {
    type: "list",
    name: "department_id",
    message: "Which department?",
    choices: allDepartments,
  },
];



const addEmployee = [
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
    message: "Would you like to add another team member?",
    choices: choicesArray,
  },
];

async function init(){





};



function viewAllEmployees(){

};
function addEmployee(){

};
function updateEmployeeRole(){

};
function viewAllRoles(){

};
function addRole(){

};
function viewAllDepartments(){

};
function addDepartment(){

};