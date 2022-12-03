const inquirer = require("inquirer");
const connection = require("./config/connection");

const questions = [
    {
        name: "choice",
        message: "What would you like to access?",
        type: "list",
        choices: [
            {
                value: "viewDepts",
                name: "View all Departments"
            },
            {
                value: "viewRoles",
                name: "View all Roles"
            },
            {
                value: "viewEmpls",
                name: "View all Employees"
            },
            {
                value: "addDept",
                name: "Add a Department"
            },
            {
                value: "addRole",
                name: "Add a Role"
            },
            {
                value: "addEmpl",
                name: "Add an Employee"
            },
            {
                value: "updateEmpl",
                name: "Update an Employee Role"
            },
            {
                value: "finish",
                name: "Finish"
            }
        ]
    }
];

function viewDepts() {
    connection.promise().query("SELECT department.id, department.name FROM department;")
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
}

function viewRoles() {
    connection.promise().query("SELECT role.id, role.title, role.salary FROM role;")
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
}

function viewEmpls() {
    connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role_id, manager_id FROM employee;")
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => mainMenu())
}

function addDept() {

}

function addRole() {

}

function addEmpl() {

}

function updateEmpl() {

}

function mainMenu() {
    inquirer.prompt(questions)
        .then((response) => {
            if(response.choice === "viewDepts") {
                viewDepts();
            } else if (response.choice === "viewRoles") {
                viewRoles();
            } else if (response.choice === "viewEmpls") {
                viewEmpls();
            } else if (response.choice === "addDept") {
                addDept();
            } else if (response.choice === "addRole") {
                addRole();
            } else if (response.choice === "addEmpl") {
                addEmpl();
            } else if (response.choice === "updateEmpl") {
                updateEmpl();
            } else if (response.choice === "finish") {
                //finish
            }
        })
}

mainMenu();