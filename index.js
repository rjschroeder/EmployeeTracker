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
        }
    ]
    inquirer.prompt(questions)
        .then((response) => {
            let newTitle = response.title;
            let newSalary = response.salary;
            connection.promise().query("SELECT department.id, department.name FROM department;")
            .then(([rows]) => {
                let choices = [];
                rows.forEach(element => {
                    choices.push({
                        name: `${element.name}`,
                        value: `${element.id}`
                    });
                });
                inquirer.prompt([{
                    name: "dept",
                    message: "What department is this role under?",
                    type: "list",
                    choices: choices
                }])
                    .then((response) => {
                        let newRole = {
                            title: newTitle,
                            salary: newSalary,
                            department_id: response.dept
                        }
                        connection.promise().query("INSERT INTO role SET ?", newRole)
                        .then(() => mainMenu())
                    })
            })
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
        }
    ]
    inquirer.prompt(questions)
        .then((response) => {
            let firstName = response.first_name;
            let lastName = response.last_name;
            connection.promise().query("SELECT role.id, role.title FROM role;")
                .then(([rows]) => {
                    let choices = [];
                    rows.forEach(element => {
                        choices.push({
                            name: `${element.title}`,
                            value: `${element.id}`
                        });
                    });
                    inquirer.prompt([{
                        name: "role",
                        message: "Which role do you want to assign?",
                        type: "list",
                        choices: choices
                    }])
                        .then((response) => {
                            let role = response.role;
                            connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name FROM employee;")
                                .then(([rows]) => {
                                    let choices = [];
                                    rows.forEach(element => {
                                        choices.push({
                                            name: `${element.first_name} ${element.last_name}`,
                                            value: `${element.id}`
                                        });
                                    });
                                    choices.push({
                                        name: "No manager",
                                        value: null
                                    });
                                    inquirer.prompt([{
                                        name: "manager",
                                        message: "Who is this employee's manager?",
                                        type: "list",
                                        choices: choices
                                    }])
                                        .then((response) => {
                                            let newEmployee = {
                                                first_name: firstName,
                                                last_name: lastName,
                                                role_id: role,
                                                manager_id: response.manager
                                            }
                                            connection.promise().query("INSERT INTO employee SET ?", newEmployee)
                                                .then(() => mainMenu())
                                        })
                                        .then(() => mainMenu())
                                })
                        })
                })
        })
}

function updateEmpl() {
    connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name FROM employee;")
        .then(([rows]) => {
            let choices = [];
            rows.forEach(element => {
                choices.push({
                    name: `${element.first_name} ${element.last_name}`,
                    value: `${element.id}`
                });
            })
            inquirer.prompt([{
                name: "employeeSelection",
                message: "Which employee's role do you want to update?",
                type: "list",
                choices: choices
            }])
            .then((response) => {
                let employeeSelectionVar = response.employeeSelection
                connection.promise().query("SELECT role.id, role.title FROM role;")
                .then(([rows]) => {
                    let choices = [];
                    rows.forEach(element => {
                        choices.push({
                            name: `${element.title}`,
                            value: `${element.id}`
                        });
                    })
                    inquirer.prompt([{
                        name: "roleSelection",
                        message: "Which role do you want to assign?",
                        type: "list",
                        choices: choices
                    }])
                    .then((response) => {
                        console.log("emplselvar:" + employeeSelectionVar + " role: " + response.roleSelection);
                        connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [response.roleSelection, employeeSelectionVar])
                    })
                    .then(() => mainMenu())
                })
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