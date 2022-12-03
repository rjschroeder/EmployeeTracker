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
    inquirer.prompt([{
        name: "name",
        message: "What is the name of the new department?",
        type: "input"
    }])
        .then((response) => {
            connection.promise().query("INSERT INTO department SET ?", response)
            .then(() => mainMenu())
        })
}

function addRole() {
    let questions = [
        {
            name: "title",
            message: "What is the name of this new role?",
            type: "input"
        }, 
        {
            name: "salary",
            message: "What is the salary of this new role?",
            type: "input"
        },
        {
            name: "department_id",
            message: "What department id is this role under?",
            type: "input"
        }
    ]
    inquirer.prompt(questions)
        .then((response) => {
            connection.promise().query("INSERT INTO role SET ?", response)
            .then(() => mainMenu())
        })
}

function addEmpl() {
    let questions = [
        {
            name: "first_name",
            message: "What is the first name of this new employee?",
            type: "input"
        }, 
        {
            name: "last_name",
            message: "What is the last name of this new employee?",
            type: "input"
        },
        {
            name: "role_id",
            message: "What is the role id of this employee?",
            type: "input"
        },
        {
            name: "manager_id",
            message: "What is the id of the manager for this employee?",
            type: "input"
        }
    ]
    inquirer.prompt(questions)
    .then((response) => {
        connection.promise().query("INSERT INTO employee SET ?", response)
        .then(() => mainMenu())
    })
}

function updateEmpl() {
    connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name FROM employee;")
        .then(([rows]) => {
            console.log(rows);
            let choices =[]
            rows.forEach(element => {
                choices.push(`${element.first_name} ${element.last_name}`);
            })
            inquirer.prompt([{
                name: "employeeSelection",
                message: "Which employee's role do you want to update?",
                type: "list",
                choices: choices
            }])
            .then((response) => {
                console.log("Response here: " + response);
            })
        })
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
                process.exit();
            }
        })
}

mainMenu();