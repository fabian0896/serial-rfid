const Rfid = require('../src');
const ReadLine = require('@serialport/parser-readline');
const Ready = require('@serialport/parser-ready');


const rfid = new Rfid({
    baudRate: 9600, 
    portPath: 'COM8'
});




const cancelFunction = rfid.readCard((err, data) => {
    if(err) return console.log(err);
    console.log(data.payload);
});



setTimeout(cancelFunction, 10000);