# Rfid module with serial port

This is a module to comunicate with the Arduino an a node aplication

## Usage

````js
const Rfid = require('rfid');

Rfid.list().then(portList => {
    console.log(portList);
})

const rfid = new Rfid({
    baudRate: 9600, //baud rate of the port,
    portPath: 'COM3' // Path of the port to connect 
});

rfid.readCard(5000)
    .then(cardId => {
        console.log(cardId);
    })
    .catch(err => {
        console.log(err)
    });


rfid.send({
    type: 'TYPE_MESSAGE',
    payload:{
        some: 'info'
    }
})
.then(() => {
    console.log("The message has send");
})
.catch((err) => {
    console.error(err);
})
````

the `rfid.readCard()` function also works with a callback pass after the timeout  

## Examples

You can try a terminal example running the comand

`npm run example`


## License

Licensed under MIT