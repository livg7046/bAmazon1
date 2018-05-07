var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err;
        console.log(results);
        runInquirer();
    });
    
});

function runInquirer() {
    
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the item_ID of the item you would like to purchase?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }
    ]).then(function(answer) {
        var chosenItem = answer.item;
        var purchaseAmount = Number(answer.quantity);
        // console.log(chosenItem);
        // console.log(purchaseAmount);
        connection.query("SELECT * FROM products WHERE item_id =" + chosenItem, function(err, result) {
            // console.log(result[0].price);
            var item = result[0];
            var price = item.price;
            
            if(err) throw err;   
            if(result.stock_quanity < purchaseAmount) {
                console.log("Insufficient quantity")
            } else {
                var newQuant = (item.stock_quantity - purchaseAmount);
                console.log("The new stock quantitiy for this item is: " + newQuant);
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuant 
                    },
                    {
                        item_id: chosenItem
                    }
                ],
                function(err, result) {
                    if (err) throw err;
                    console.log("Your purchase total is: $" + purchaseAmount * price +". Thank you for you business!");
                    connection.end();
                });
            }  
    });
});
};


//List a set of menu options:
        // View Products for Sale
        // View Low Inventory
        // Add to Inventory
        // Add New Product
        // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
        // If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
        // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
        // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
                // type: "list",
                // name:"mainMenu",
                // message: "Main Menu-Select from the options below:"
                // choices: ["View Products", "View Low-Inventory Items", "Add to Inventory", "Add New Product", ]
            