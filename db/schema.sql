DROP DATABASE IF EXISTS companyEmployees;
CREATE DATABASE companyEmployees;

USE companyEmployees;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);