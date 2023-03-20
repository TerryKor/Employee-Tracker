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
  "Update Employee Role",
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
        allRoles.push({
          value: element.id,
          name: element.title,
          department_id: element.department_id,
          salary: element.salary,
        });
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
      await viewAllEmployees();
    } else if (menuResponses.chosenOption == choicesArray[1]) {
      await addEmployee();
    } else if (menuResponses.chosenOption == choicesArray[2]) {
      await updateEmployeeRole();
    } else if (menuResponses.chosenOption == choicesArray[3]) {
      await viewAllRoles();
    } else if (menuResponses.chosenOption == choicesArray[4]) {
      await addRole();
    } else if (menuResponses.chosenOption == choicesArray[5]) {
      await viewAllDepartments();
    } else if (menuResponses.chosenOption == choicesArray[6]) {
      await addDepartment();
    } else {
      process.exit();
    }
    
}

async function viewAllEmployees() {
  var employees = [];
  db.query("SELECT * from employee", (err, results) => {
    results.forEach((element) => {
      var employeeRole = allRoles.filter(function (data) {
        return data.value == element.role_id;
      });
      var employeeDepartment = allDepartments.filter(function (data) {
        return data.value == employeeRole[0].department_id;
      });
      var employeeManager = results.filter(function (data) {
        return data.id == element.manager_id;
      });

      element.title = employeeRole[0].name;
      element.salary = employeeRole[0].salary;
      element.department = employeeDepartment[0].name;
      element.manager =
        employeeManager[0] == undefined
          ? null
          : employeeManager[0].first_name + " " + employeeManager[0].last_name;
      employees.push(element);
      delete element.role_id;
      delete element.manager_id;
    });
    console.table(employees);
    return employees
  });
}
async function addEmployee() {
  const employeeResponses = await inquire.prompt(addEmployeeQuestions);

  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employeeResponses.first_name}','${employeeResponses.last_name}','${employeeResponses.role_id}','${employeeResponses.manager_id}')`
  );
}
async function updateEmployeeRole() {
  var allEmployeeNames = [];
  const employeeToBeUpdatedQuestions = [
    {
      type: "list",
      name: "employeeToBeUpdated",
      message: "Which employee to update?",
      choices: allEmployeeNames,
    },
  ];
  const roleToBeAddedQuestions = [
    {
      type: "list",
      name: "roleToBeAdded",
      message: "Which role would you like to give to the employee?",
      choices: allRoles,
    },
  ];
  db.query(`SELECT * FROM employee`, async (err, results) => {
    results.forEach((element) => {
      var full_name = element.first_name + " " + element.last_name;
      var employeeID = element.id;

      allEmployeeNames.push({ value: employeeID, name: full_name });
    });
    const employeeToBeUpdated = await inquire.prompt(
      employeeToBeUpdatedQuestions
    );
    const roleToBeAdded = await inquire.prompt(roleToBeAddedQuestions);

    db.query(
      `UPDATE employee SET role_id=${roleToBeAdded.roleToBeAdded} WHERE id=${employeeToBeUpdated.employeeToBeUpdated}`
    );
  });
}

async function viewAllRoles() {
  db.query("SELECT * from role", (err, results) => {
    results.forEach((element) => {
      var roleDepartment = allDepartments.filter(function (data) {
        return data.value == element.department_id;
      });
      element.department = roleDepartment[0].name;
      delete element.department_id;
    });
    console.table(results);
    return results
  });
}
async function addRole() {
  const rolesResponses = await inquire.prompt(addRoleQuestions);

  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${rolesResponses.name}', '${rolesResponses.salary}','${rolesResponses.department_id}')`
  );
}
async function viewAllDepartments() {
  db.query("SELECT * from department", (err, results) => {
    console.table(results);
    
  });
}
async function addDepartment() {
  const departmentReponses = await inquire.prompt(addDepartmentQuestions);

  db.query(
    `INSERT INTO department(name) VALUES ('${departmentReponses.name}')`
  );
}

app.use((req, res) => {
  res.status(404).end();
});

init();
