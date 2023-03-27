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
const allManagers2 = ["None"];
const choicesArray = [
  "View all employees",
  "Add employee",
  "Update Employee Role",
  "View all roles",
  "Add role",
  "View all departments",
  "Add department",
  "Update employee managers",
  "View employees by manager",
  "View employees by department",
  "Delete departments",
  "Delete role",
  "Delete employee",
  "View the total utilized budget of a department",
  "Exit",
];
// Update employee managers.

// View employees by manager.

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
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
    message: "Who's employee's manager?",
    choices: allManagers2,
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
const deleteEmployeeQuestion = [
  {
    type: "list",
    name: "chosenOption",
    message: "Which employee would you like to delete?",
    choices: allManagers,
  },
];
const deleteRoleQuestion = [
  {
    type: "list",
    name: "chosenOption",
    message: "Which role would you like to delete?",
    choices: allRoles,
  },
];
const deleteDepartmentQuestion = [
  {
    type: "list",
    name: "chosenOption",
    message: "Which department would you like to delete?",
    choices: allDepartments,
  },
];

const updateManagerQuestion = [
  {
    type: "list",
    name: "employeeToBeUpdated",
    message: "Which employee to update?",
    choices: allManagers,
  },
  {
    type: "list",
    name: "updatedManager",
    message: "Choose new manager",
    choices: allManagers,
  },
];
const viewManagerQuestion = [
  {
    type: "list",
    name: "managerToBeViewed",
    message: "Which manager would you like to view?",
    choices: allManagers,
  },
];
const viewDepartmentQuestion = [
  {
    type: "list",
    name: "departmentToBeViewed",
    message: "Which department would you like to view?",
    choices: allDepartments,
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
      allManagers2.push({
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
  } else if (menuResponses.chosenOption == choicesArray[7]) {
    await updateEmployeesManager();
  } else if (menuResponses.chosenOption == choicesArray[8]) {
    await viewEmployeesBymanager();
  } else if (menuResponses.chosenOption == choicesArray[9]) {
    await viewEmployeesByDepartment();
  } else if (menuResponses.chosenOption == choicesArray[10]) {
    await deleteDepartment();
  } else if (menuResponses.chosenOption == choicesArray[11]) {
    await deleteRole();
  } else if (menuResponses.chosenOption == choicesArray[12]) {
    await deleteEmployee();
  } else if (menuResponses.chosenOption == choicesArray[13]) {
    await viewTotalBudget();
  } else {
    process.exit();
  }
  //while loop with promise or delay in view functions
  init();
}

var employees = [];
async function viewAllEmployees() {
  employees=[]
  return new Promise((resolve, reject) => {
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
            : employeeManager[0].first_name +
              " " +
              employeeManager[0].last_name;
        employees.push(element);
        delete element.role_id;
        delete element.manager_id;
      });
      console.log("\n ");
      console.table(employees);

      if (true) {
        resolve(employees);
      } else {
        reject();
      }
    });
  });
}
async function addEmployee() {
  const employeeResponses = await inquire.prompt(addEmployeeQuestions);
var manager = employeeResponses.manager_id == "None"
? 'NULL'
:`${employeeResponses.manager_id}` ;
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${
      employeeResponses.first_name
    }','${employeeResponses.last_name}','${employeeResponses.role_id}',${
      manager
    })`
  );
}
async function updateEmployeeRole() {
  return new Promise((resolve, reject) => {
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
      if (true) {
        resolve(true);
      } else {
        reject();
      }
    });
  });
}
async function viewAllRoles() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * from role", (err, results) => {
      results.forEach((element) => {
        var roleDepartment = allDepartments.filter(function (data) {
          return data.value == element.department_id;
        });
        element.department = roleDepartment[0].name;
        delete element.department_id;
      });
      console.log("\n ");
      console.table(results);
      console.log("\n ");

      if (true) {
        resolve(results);
      } else {
        reject();
      }
    });
  });
}
async function addRole() {
  const rolesResponses = await inquire.prompt(addRoleQuestions);

  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${rolesResponses.name}', '${rolesResponses.salary}','${rolesResponses.department_id}')`
  );
}
async function viewAllDepartments() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * from department", (err, results) => {
      console.log("\n ");
      console.table(results);
      console.log("\n ");

      if (true) {
        resolve(results);
      } else {
        reject();
      }
    });
  });
}
async function addDepartment() {
  const departmentReponses = await inquire.prompt(addDepartmentQuestions);

  db.query(
    `INSERT INTO department(name) VALUES ('${departmentReponses.name}')`
  );
}
async function deleteDepartment() {
  const departmentToBeDeleted = await inquire.prompt(deleteDepartmentQuestion);
  return new Promise((resolve, reject) => {
   
    db.query(
      `DELETE FROM department WHERE id=${departmentToBeDeleted.chosenOption}`
    );
    console.log("Deleted successfully");

    if (true) {
      resolve(true);
    } else {
      reject();
    }
  });
}
async function deleteRole() {
  const roleToBeDeleted = await inquire.prompt(deleteRoleQuestion);
  return new Promise((resolve, reject) => {
  
    db.query(`DELETE FROM role WHERE id=${roleToBeDeleted.chosenOption}`);
    console.log("Deleted successfully");
    if (true) {
      resolve(true);
    } else {
      reject();
    }
  });
}
async function deleteEmployee() {
  const employeeToBeDeleted = await inquire.prompt(deleteEmployeeQuestion);
  return new Promise((resolve, reject) => {
    
    db.query(
      `DELETE FROM employee WHERE id = ${employeeToBeDeleted.chosenOption}`
    );
    console.log("Deleted successfully");
    if (true) {
      resolve(true);
    } else {
      reject();
    }
  });
}
async function updateEmployeesManager() {
  const employeesManagerToBeUpdated = await inquire.prompt(
    updateManagerQuestion
  );
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE employee SET manager_id=${employeesManagerToBeUpdated.updatedManager} WHERE id=${employeesManagerToBeUpdated.employeeToBeUpdated}`
    );

    if (true) {
      resolve(true);
    } else {
      reject();
    }
  });
}

async function viewEmployeesBymanager() {
  var employeeDump = [];
  const employeeToViewByManager = await inquire.prompt(viewManagerQuestion);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * from employee WHERE manager_id=${employeeToViewByManager.managerToBeViewed}`,
      (err, results) => {
        results.forEach((element) => {
          var employeeRole = allRoles.filter(function (data) {
            return data.value == element.role_id;
          });
          var employeeDepartment = allDepartments.filter(function (data) {
            return data.value == employeeRole[0].department_id;
          });

          element.title = employeeRole[0].name;
          element.salary = employeeRole[0].salary;
          element.department = employeeDepartment[0].name;

          employeeDump.push(element);
          delete element.role_id;
          delete element.manager_id;
        });
        console.log("\n ");
        console.table(employeeDump);

        if (true) {
          resolve(employeeDump);
        } else {
          reject();
        }
      }
    );
  });
}
async function viewEmployeesByDepartment() {
  var employeeDump = [];
  const employeeToViewByDepartment = await inquire.prompt(
    viewDepartmentQuestion
  );
  return new Promise((resolve, reject) => {
    db.query(`SELECT * from employee`, (err, results) => {
      results.forEach((element) => {
        var employeeRole = allRoles.filter(function (data) {
          return data.value == element.role_id;
        });
        if (
          employeeRole[0].department_id ==
          employeeToViewByDepartment.departmentToBeViewed
        ) {
          var employeeDepartment = allDepartments.filter(function (data) {
            return data.value == employeeRole[0].department_id;
          });

          element.title = employeeRole[0].name;
          element.salary = employeeRole[0].salary;
          element.department = employeeDepartment[0].name;

          employeeDump.push(element);
          delete element.role_id;
          delete element.manager_id;
        }
      });
      console.log("\n ");
      console.table(employeeDump);

      if (true) {
        resolve(employeeDump);
      } else {
        reject();
      }
    });
  });
}
async function viewTotalBudget() {
  var departmentDump = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT * from employee`, (err, results) => {
      results.forEach((employeeElement) => {
        var elementForDepartment = {};
        var employeeRole = allRoles.filter(function (data) {
          return data.value == employeeElement.role_id;
        });
        var employeeDepartment = allDepartments.filter(function (data) {
          return data.value == employeeRole[0].department_id;
        });
        elementForDepartment.department = employeeDepartment[0].name;
        elementForDepartment.salary = employeeRole[0].salary;
        departmentDump.push(elementForDepartment);
      });

      var salaryDump = [];
      departmentDump.forEach((departmentElement) => {
        var salary = salaryDump.filter(function (data) {
          return data.department == departmentElement.department;
        });
        if (salary.length == 0) {
          var element = {};
          element.department = departmentElement.department;
          element.salary = departmentElement.salary;
          salaryDump.push(element);
        } else {
          salary.forEach((salaryTile) => {
            if (salaryTile.department == departmentElement.department) {
              salaryTile.salary = `${
                parseFloat(salaryTile.salary) +
                parseFloat(departmentElement.salary)
              }`;
            }
          });
        }
      });

      //console.log("\n ");
      console.table(salaryDump);

      if (true) {
        resolve(salaryDump);
      } else {
        reject();
      }
    });
  });
}

app.use((req, res) => {
  res.status(404).end();
});

init();
