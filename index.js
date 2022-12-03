const inquirer = require("inquirer");
const { default: Choices } = require("inquirer/lib/objects/choices");
const connection = require("./config/connection");

const questions = [
    {
        name: "mainMenu",
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
            }
        ]
    }
];

function viewDepts() {

}

function viewRoles() {

}

function viewEmpls() {

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
    
}