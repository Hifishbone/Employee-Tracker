const inquirer = require('inquirer');
const db = require('./db/connection');
const actions = require('./utils/actions');

function promptInitQuestion() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: Object.keys(actions)
        }
    ]).then(actionData => {
        return actions[actionData.action]();
    });
}


function main() {
    db.connect(err => {
        if (err) throw err;
        console.log('Database connected.');
        promptInitQuestion()
        .catch(err => {
            console.log(err);
        });
    });
}

main();