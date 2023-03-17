const mysql = require("mysql2");
const inquire = require("inquirer");
const consoleTable = require("console.table");
const express = require("express");

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

const allDepartments = [];
const allRoles = [];
const allManagers = [];
const choicesArray = [
  "View all employees",
  "Add employee",
  "View all roles",
  "Add role",
  "View all departments",
  "Add department",
  "Exit",
];

const addDepartmentQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the department ?",
  },
];

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
  {
    type: "input",
    name: "first_name",
    message: "What is employee's first name?",
  },
  {
    type: "input",
    name: "last_name",
    message: "What is employee's last name?",
  },
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

async function init() {
  db.query("SELECT * FROM department", function (err, results) {
    results.forEach((element) => {
      allDepartments.push({ value: element.id, name: element.name });
    });
  });

  db.query("SELECT * FROM role", function (err, results) {
    results.forEach((element) => {
      allRoles.push({ value: element.id, name: element.title });
    });
  });

  db.query("SELECT * FROM employee", (err, results) => {
    results.forEach((element) => {
      allManagers.push({
        value: element.id,
        name: element.first_name + " " + element.last_name,
      });
    });
  });

  const menuResponses = await inquire.prompt(menuQuestions);
  if (menuResponses.chosenOption == choicesArray[0]) {
    viewAllEmployees();
  } else if (menuResponses.chosenOption == choicesArray[1]) {
    addEmployee();
  } else if (menuResponses.chosenOption == choicesArray[2]) {
    viewAllRoles();
  } else if (menuResponses.chosenOption == choicesArray[3]) {
    addRole();
  } else if (menuResponses.chosenOption == choicesArray[4]) {
    viewAllDepartments();
  } else if (menuResponses.chosenOption == choicesArray[5]) {
    addDepartment();
  } else {
    return;
  }
}

function viewAllEmployees() {
  db.query("SELECT * from employee", (err, results) => {
    console.table(results);
  });
}
async function addEmployee() {
  const employeeResponses = await inquire.prompt(addEmployeeQuestions);

  console.log(employeeResponses);

  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employeeResponses.first_name}','${employeeResponses.last_name}','${employeeResponses.role_id}','${employeeResponses.manager_id}')`
  );
}
function updateEmployeeRole() {}
function viewAllRoles() {
  db.query("SELECT * from role", (err, results) => {
    console.table(results);
  });
}
async function addRole() {
  const rolesResponses = await inquire.prompt(addRoleQuestions);
  console.log(rolesResponses);

  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${rolesResponses.name}', '${rolesResponses.salary}','${rolesResponses.department_id}')`
  );
}
function viewAllDepartments() {
  db.query("SELECT * from department", (err, results) => {
    console.table(results);
  });
}
async function addDepartment() {
  const departmentReponses = await inquire.prompt(addDepartmentQuestions);

  console.log(departmentReponses);

  db.query(
    `INSERT INTO department(name) VALUES ('${departmentReponses.name}')`
  );
}

function roleFromID(role_id) {
  var results = "";
  db.query(`SELECT * FROM role WHERE id='${role_id}'`, (err, result) => {
    results = result[0].title;
  });
  return results;
}

app.use((req, res) => {
  res.status(404).end();
});

init();
