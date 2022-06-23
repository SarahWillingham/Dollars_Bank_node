const classes = require('./classes');
const readline = require('readline');
const prompt = require('prompt-sync');
//allow for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//global variables
var current;
var accounts = new Array();

//default accounts and transactions
function setup() {
    var acc1 = new classes.Account('1234', 500.0);
    var acc2 = new classes.Account('4321', 200.0);
    acc1.transactions = [500.0, 400.0, -350.0, 250.0, -300.0];
    acc2.transactions = [900.0, 300.0, 450.0, -600.0, -250.0];
    accounts.push(acc1, acc2);
}

//This is what the user first sees
function start() {
    //reset current account to null for subsequent account access
    current = null;
    //display the menu and take user input
    rl.question('\nHello!  Please choose an option: \n1. Open new account.\n2. Access your account\n' , function (option){
        if(option == 1){
            newAccount();
        }else if(option == 2){
            accountAccess();
        }else{
            console.log('Invalid input!');
            start();
        }
    })
}

//create a new account with pin and initial balance
function newAccount() {
    rl.question('Enter a 4 digit pin for your account: ' , function (pinInput){
        if(pinInput.length == 4 && !isNaN(parseInt(pinInput))){ //good till here
            rl.question('Reenter your pin: ' , function (pin){
                if(pinInput == pin){
                    newDeposit(pin);
                }else if(pinInput == null){
                    console.log('No input!  Returning to previous menu.');
                    menu();
                }else{
                    console.log('The numbers you entered do not match.  Please try again.\n');
                    newAccount();
                }
            })
        }else{
            console.log('Pin must be a 4 digit number.  Please enter a valid pin.\n');
            newAccount();
        }
    })
}

// verify that balance entered for new account is valid
function newDeposit(pin) {
    rl.question('How much would you like to deposit?\n' , function (balance){
        if(!isNaN(parseFloat(balance)) && parseFloat(balance) >= 0){
            var acc = new classes.Account(pin, balance);
            accounts.push(acc);
            current = acc;
            current.transactions.push(balance);
            console.log(`\nNew account created with pin: ${acc.pin} and balance: ${parseFloat(acc.balance).toFixed(2)}`);
            menu();
        }else{
            console.log('Please enter a valid number.');
            newDeposit();
        }
    })
}


//user enters their pin  to access their account
function accountAccess() {
    var loginSuccess = false;
    rl.question('Enter your pin: ' , function (pin){
        //search accounts array for a matching pin number
        for(var i = 0; i < accounts.length; i++){
            if(accounts[i].pin == pin){
                loginSuccess = true;
                //set global current account to the account with matching pin
                current = accounts[i];
                break;
            }
        }
        //if the pin is found, go to the main menu
        if(loginSuccess == true){
            console.log(`Welcome!`);
            menu();
        //go back to start if user enters nothing
        }else if(pin == ''){
            console.log('\nNo input! Returning to previous menu.');
            start();
        //if input is wrong, restart the function
        }else{
            console.log(`\nIncorrect pin.  Please try again`);
            accountAccess();
        }
    })
}

//displays list of account options
function menu() {
    rl.question('\nSelect an option:\n1: Check account balance\n2: Print transactions\n3: Update pin\n4: Withdraw funds\n5: Deposit funds\nPress enter to finish\n' , function (option){
        //user input determines which function is triggered
        if(option == 1){
            getBalance();
        }else if(option == 2){
            printTransactions();
        }else if(option == 3){
            changePin();
        }else if(option == 4){
            withdraw();
        }else if(option == 5){
            deposit();
        }else if(option != null){
            console.log('Please take your card.  Have a nice day!');
            start();
        }
    })
}


function getBalance() {
    console.log(`balance = ${parseFloat(current.balance).toFixed(2)}\n`);
    rl.question('Press enter to go back to menu.\n' , function (response){
        if(response != null){
            menu();
        } 
    })
}


function printTransactions() {
    console.log(`\nCurrent account balance: ${parseFloat(current.balance).toFixed(2)}\n\nRecent transactions:`);
    console.log(current.transactions.toString());
    rl.question('Press enter to go back to menu.\n' , function (input){
        if(input != null){
            menu();
        } 
    })
}


function changePin(){
    rl.question('Enter your current pin: ' , function (pinInput){
        if(pinInput == current.pin){
            rl.question('Enter your new pin: ' , function (newPin){
                if(newPin.length != 4 || isNaN(parseInt(newPin))){
                    console.log('invalid pin');
                    changePin();
                }else{
                    current.pin = newPin;
                    rl.question(`Your new pin is set to ${current.pin}.  Press enter to go back to menu.` , function (input){
                        if(input != null){
                            menu();
                        }
                    })
                }
            })
        }else{
            console.log('Incorrect pin.');
            changePin();
        }
    })
}


function withdraw() {
    console.log(`\nCurrent account balance is: ${parseFloat(current.balance).toFixed(2)}`);

    rl.question('\nHow much would you like to withdraw?\n' , function (withdrawal){
        if(withdrawal == ''){
            menu();
        }else if(isNaN(parseFloat(withdrawal))){
            console.log('Please enter a valid number.');
            withdraw();
        }else{
            if(current.balance >= withdrawal){
                current.balance = current.balance - withdrawal;
                current.transactions.push(-withdrawal);
                console.log(`Your balance is now ${parseFloat(current.balance).toFixed(2)}`);
                menu();
            }else{
                console.log('Insufficient funds! Try a smaller amount or press enter to go back to previous menu.');
                withdraw();
            }

        }
    })
}


function deposit() {
    console.log(`Current account balance is: ${parseFloat(current.balance).toFixed(2)}`);
    rl.question('How much would you like to deposit?\n' , function (deposit){
        if(isNaN(parseFloat(deposit))){
            console.log('Please enter a valid number.');
            deposit();
        }else{
            current.balance = parseFloat(current.balance) + parseFloat(deposit);
            current.transactions.push(deposit);
            console.log(`Your balance is now ${parseFloat(current.balance).toFixed(2)}`);
            menu();
        }
    })
}


module.exports = { setup, start }