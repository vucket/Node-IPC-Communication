import inquirer from 'inquirer';
import ClientIPC from './ClientIPC';
/* eslint-disable  no-use-before-define */
const client = new ClientIPC();
const mainQuestions = [
  {
    type: 'list',
    name: 'main',
    message: 'What do you want to do?',
    choices: [
      {
        value: 1,
        name: 'Connect to device'
      },
      {
        value: 2,
        name: 'Get device status'
      },
      {
        value: 3,
        name: 'Set device status'
      },
      {
        value: 4,
        name: 'Disconnect from device'
      },
      {
        value: 5,
        name: 'Quit'
      }
    ]
  }
];

const inquirerMain = async () => {
  inquirer.prompt(mainQuestions).then(answers => {
    switch (answers.main) {
      case 1:
        console.log('Trying to connect...');
        client.connect(() => {
          inquirerMain();
        });
        break;
      case 2:
        console.log('Getting device data...');
        client.getDeviceData(() => {
          inquirerMain();
        });
        break;
      case 3:
        inquirerSetData();
        break;
      case 4:
        client.disconnect(() => {
          inquirerMain();
        });
        break;
      case 5:
        inquirerQuit();
        break;
      default:
        inquirerQuit();
        break;
    }
  });
};

const inquirerSetData = () => {
  inquirer
    .prompt({
      type: 'input',
      name: 'data',
      message: 'Please enter the new device data value (Number)',
      validate(value) {
        if (!Number.isNaN(parseFloat(value))) {
          return true;
        }
        return 'Please enter a valid number';
      }
    })
    .then(ans => {
      console.log('Setting device data...');
      client.setDeviceData(parseFloat(ans.data), () => {
        inquirerMain();
      });
    });
};

const inquirerQuit = () => {
  inquirer
    .prompt({
      type: 'confirm',
      name: 'exit',
      message: 'Are you sure?'
    })
    .then(ans => {
      if (ans.exit) {
        console.log('Bye bye!');
        process.exit(0);
      } else {
        inquirerMain();
      }
    });
};

inquirerMain();
