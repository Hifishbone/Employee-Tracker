const db = require('../db/connection');
const cTable = require('console.table');


const processQuery = (sql) => {
    db.promise().query(sql)
    .then(([rows]) => {
        console.table(rows);
    })
    .catch(console.log)
    .then(() => db.end());
}


const ViewAllDep = 'View all departments';
const viewAllDep = () => {
    const sql = `SELECT * FROM department`;
    processQuery(sql);
}

const ViewAllRol = 'View all roles';
const viewAllRol = () => {
    const sql = `SELECT * FROM role`;
    processQuery(sql);
}

const ViewAllEmp = 'View all employees';
const viewAllEmp = () => {
    const sql = `SELECT * FROM employee`;
    processQuery(sql);
}

const AddDep = 'Add a departments';
const addDep = () => {}

const AddRol = 'Add a roles';
const addRol = () => {}

const AddEmp = 'Add an employees';
const addEmp = () => {}

const UpdateEmpRol = 'Update an employee role';
const updateEmpRol = () => {}

const actions = {
    [ViewAllDep]: viewAllDep,
    [ViewAllRol]: viewAllRol,
    [ViewAllEmp]: viewAllEmp,
    [AddDep]: addDep,
    [AddRol]: addRol,
    [AddEmp]: addEmp,
    [UpdateEmpRol]: updateEmpRol
}

module.exports = actions;