USE companyEmployees;

INSERT INTO department (name)
VALUES  ("Sales"),
        ("Management"),
        ("Interns"),
        ("Service"),
        ("Engineers")

INSERT INTO role (title, salary, department_id)
VALUES  ("Lead Salesperson", 450000, 1),
        ("Senior Salesperson", 230000, 1),
        ("Training Salesperson", 150000, 1),
        ("Lead Manager", 970000, 2),
        ("Manager", 800000, 2),
        ("Harvard Intern", 30000, 3),
        ("Yale Intern", 40000, 3),
        ("Service Worker", 340000, 4),
        ("Lead Engineer", 900000, 5),
        ("Senior Engineer", 760000, 5),
        ("Junior Engineer", 450000, 5)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Ham", 4, NULL),
        ("Jack", "Black", 5, 1),
        ("Steve", "Carell", 5, 1),
        ("Jennifer", "Lawrence", 1, NULL),
        ("Michael", "Cera", 2, 4),
        ("Robert", "Downey Jr.", 2, 4),
        ("Evan", "Peters", 3, 5),
        ("Hayden", "Christensen", 3, 6),
        ("Ewan", "McGregor", 6, NULL),
        ("Channing", "Tatum", 7, NULL),
        ("George", "Clooney", 8, NULL),
        ("Chris", "Evans", 8, NULL),
        ("Margot", "Robbie", 9, NULL),
        ("Ryan", "Reynolds", 10, 13),
        ("Scarlett", "Johansson", 10, 13),
        ("Ryan", "Gosling", 11, 14),
        ("Will", "Smith", 11, 15),
        ("Matt", "Damon", 11, 14)