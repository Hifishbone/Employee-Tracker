const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const checkNotEmpty = input => {
    if (input) {
        return true;
    } else {
        console.log('\nPlease do not skip this question!');
        return false;
    }
}

const getTableString = (sql) => {
    return db.promise().query(sql)
        .then(([rows]) => {
            return cTable.getTable(rows);
        })
        .catch(console.log);
}



const ViewAllDep = 'View all departments';
const viewAllDep = () => {
    const sql = `SELECT * FROM department`;
    return getTableString(sql);
}

const ViewAllRol = 'View all roles';
const viewAllRol = () => {
    const sql = `SELECT title, role.id AS id, department.name AS department, salary 
                 FROM role
                 LEFT JOIN department ON department_id = department.id`;
    return getTableString(sql);
}

const ViewAllEmp = 'View all employees';
const viewAllEmp = () => {
    const sql = `SELECT employee.id, first_name, last_name, title, department.name AS department, salary, manager_id 
    FROM employee LEFT JOIN role ON role_id = role.id LEFT JOIN department ON department_id = department.id`;
    return getTableString(sql);
}


const AddDep = 'Add a departments';
const addDep = () => {
    return inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: checkNotEmpty
    }]).then(data => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        return db.promise().query(sql, [data.name])
            .then(() => {
                return `Added ${data.name} to the database`;
            })
            .catch(console.log);
    });
}

const AddRol = 'Add a roles';
const addRol = async () => {
    const departments = [];
    await db.promise().query({
        sql: 'SELECT name FROM department',
        rowsAsArray: true
    }).then(([rows]) => rows.forEach(row => departments.push(row[0])));
    return inquirer.prompt([{
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?',
            validate: checkNotEmpty
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: checkNotEmpty
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            loop: false,
            choices: departments
        }
    ]).then(data => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        return db.promise().query(sql, [data.title, data.salary, departments.indexOf(data.department) + 1])
            .then(() => {
                return `Added ${data.title} to the database`;
            })
            .catch(console.log);
    });
}

const AddEmp = 'Add an employees';
const addEmp = async () => {

    const roles = [];
    await db.promise().query({
        sql: 'SELECT title FROM role',
        rowsAsArray: true
    }).then(([rows]) => rows.forEach(row => roles.push(row[0])));

    const managers = [];
    await db.promise().query({
        sql: 'SELECT first_name, last_name FROM employee',
        rowsAsArray: true
    }).then(([rows]) => rows.forEach(row => managers.push(row[0] + ' ' + row[1])));

    return inquirer.prompt([{
            type: 'input',
            name: 'fisrtName',
            message: 'What is the employee\'s first name?',
            validate: checkNotEmpty
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?',
            validate: checkNotEmpty
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the employee\'s role?',
            loop: false,
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee\'s manager?',
            loop: false,
            choices: managers.concat(['None'])
        }
    ]).then(data => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        return db.promise().query(sql, [data.fisrtName, data.lastName, roles.indexOf(data.role) + 1, data.manager === 'None' ? null : managers.indexOf(data.manager) + 1])
            .then(() => {
                return `Added ${data.fisrtName} ${data.lastName} to the database`;
            })
            .catch(console.log);
    });
}

const UpdateEmpRol = 'Update an employee role';
const updateEmpRol = async () => {

    const employees = [];
    await db.promise().query({
        sql: 'SELECT first_name, last_name FROM employee',
        rowsAsArray: true
    }).then(([rows]) => rows.forEach(row => employees.push(row[0] + ' ' + row[1])));

    const roles = [];
    await db.promise().query({
        sql: 'SELECT title FROM role',
        rowsAsArray: true
    }).then(([rows]) => rows.forEach(row => roles.push(row[0])));

    return inquirer.prompt([{
            type: 'list',
            name: 'employee',
            message: 'Which employee\'s role do you want to update?',
            loop: false,
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the new role for the employee?',
            loop: false,
            choices: roles
        }
    ]).then(data => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        return db.promise().query(sql, [roles.indexOf(data.role) + 1, employees.indexOf(data.employee) + 1])
            .then(() => {
                return `Updated ${data.employee}'s new role to the database`;
            })
            .catch(console.log);
    });

}

const actions = {
    [ViewAllDep]: viewAllDep,
    [ViewAllRol]: viewAllRol,
    [ViewAllEmp]: viewAllEmp,
    [AddDep]: addDep,
    [AddRol]: addRol,
    [AddEmp]: addEmp,
    [UpdateEmpRol]: updateEmpRol
}


const promptInitQuestion = () => {
    return inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        loop: false,
        choices: Object.keys(actions)
    }]).then(dealWithInitQuestion).then(console.log).then(promptInitQuestion);
}

const dealWithInitQuestion = (actionData) => {
    const action = actionData.action;
    return actions[action]();
}


const main = () => {
    db.connect(err => {
        if (err) throw err;
        console.log('Database connected.');
        promptInitQuestion()
            .then(dealWithInitQuestion)
            .then(() => db.end())
            .catch(err => {
                console.log(err);
            });
    });
    return;
}

main();