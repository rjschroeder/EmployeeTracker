//importing required modules
const inquirer = require("inquirer");
const connection = require("./config/connection");

//question array for main menu
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

//query function to get departments
function viewDepts() {
    connection.promise().query("SELECT department.id, department.name AS department FROM department;")
        //take response and table it in console with console.table
        .then(([rows]) => {
            console.log(" ");
            console.table(rows);
        })
        //after the table is displayed, show the action list again
        .then(() => mainMenu())
}

//query function to get roles
function viewRoles() {
    connection.promise().query("SELECT role.id, role.title AS role, role.salary FROM role;")
        //take response and table it in console with console.table
        .then(([rows]) => {
            console.log(" ");
            console.table(rows);
        })
        //after the table is displayed, show the action list again
        .then(() => mainMenu())
}

//query function to get employees
function viewEmpls() {
    connection.promise().query("SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name, role.title as role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
        //take response and table it in console with console.table
        .then(([rows]) => {
            console.log(" ");
            console.table(rows);
        })
        //after the table is displayed, show the action list again
        .then(() => mainMenu())
}

//query function that inserts a new department
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

//query function that inserts a new role
function addRole() {
    //non-list question array for inquirer
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
        //the response will have keyed objects, store them to use when inserting new role
        .then((response) => {
            let newTitle = response.title;
            let newSalary = response.salary;
            //get a list of just the department ids and names to give the user a choice between available departments
            connection.promise().query("SELECT department.id, department.name FROM department;")
            .then(([rows]) => {
                //these next 7 lines I used multiple times throughout the code
                //it creates an array of objects with a name value of the db query's name or title,
                //and a value of the corresponding id. The user will see the name or title, the 
                //program will use the id.
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
                        //create a new object with all of the paramaters for a new role
                        let newRole = {
                            title: newTitle,
                            salary: newSalary,
                            department_id: response.dept
                        }
                        //insert that object into role table
                        connection.promise().query("INSERT INTO role SET ?", newRole)
                        .then(() => mainMenu())
                    })
            })
        })
}

//multiple query function that inserts a new employee
function addEmpl() {
    //non-list question array for inquirer
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
            //the response will have keyed objects, store them to use when inserting new role
            let firstName = response.first_name;
            let lastName = response.last_name;
            //get a list of just the role ids and titles to give the user a choice between available roles
            connection.promise().query("SELECT role.id, role.title FROM role;")
                .then(([rows]) => {
                    //same referenced code block for matching names/titles to id's
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
                            //get a list of just the employee ids and first/last names to give the user a choice between available managers
                            connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name FROM employee;")
                                .then(([rows]) => {
                                    //same referenced code block for matching names/titles to id's
                                    let choices = [];
                                    rows.forEach(element => {
                                        choices.push({
                                            name: `${element.first_name} ${element.last_name}`,
                                            value: `${element.id}`
                                        });
                                    });
                                    //also push an extra choice on since there can be no manager for an employee
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
                                            //create a new object with all of the paramaters for a new employee
                                            let newEmployee = {
                                                first_name: firstName,
                                                last_name: lastName,
                                                role_id: role,
                                                manager_id: response.manager
                                            }
                                            //insert that object into employee table
                                            connection.promise().query("INSERT INTO employee SET ?", newEmployee)
                                                .then(() => mainMenu())
                                        })
                                        .then(() => mainMenu())
                                })
                        })
                })
        })
}

//multiple query function that updates an employee's role
function updateEmpl() {
    //get a list of just the employee ids and first/last names to give the user a choice of which employee to update
    connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name FROM employee;")
        .then(([rows]) => {
            //same referenced code block for matching names/titles to id's
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
                //store the user's response here so it doesnt get lost later in the function
                let employeeSelectionVar = response.employeeSelection
                //get a list of just the role ids and titles to give the user a choice of which role to update to
                connection.promise().query("SELECT role.id, role.title FROM role;")
                .then(([rows]) => {
                    //same referenced code block for matching names/titles to id's
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
                        //update that object to our passed in data
                        connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [response.roleSelection, employeeSelectionVar])
                    })
                    .then(() => mainMenu())
                })
            })
        })
}

//main menu function that handles user choice
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