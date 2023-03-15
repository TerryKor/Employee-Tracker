INSERT INTO department (id, name)
VALUES (001, "Engineering"),
       (002, "Finance"),
       (003, "Legal"),
       (004, "Sales");



INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Sales Lead",100000.00,4),
       (002, "Salesperson",80000.00,4),
       (003, "Lead Engineer",150000.00,1),
       (004, "Software Engineer",120000.00,1),
       (005, "Account Manager",160000.00,2),
       (006, "Accountant",125000.00,2),
       (007, "Legal Team Lead",250000.00,3),
       (008, "Lawyer",190000.00,3);



INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John","Doe",1,NULL),
       (002, "Mike","Chan",2,2),
       (003, "Ashley","Rodriguez",3,NULL),
       (004, "Kevin","Tupik",4,3),
       (005, "Kunal","Singh",5,NULL),
       (006, "Malia","Brown",6,5),
       (007, "Sarah","Lourd",7,NULL),
       (008, "Tom","Allen",8,7);