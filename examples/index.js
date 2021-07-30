const Rfid = require('../src');
const ReadLine = require('@serialport/parser-readline');
const Ready = require('@serialport/parser-ready');


const rfid = new Rfid({
    baudRate: 9600, 
    portPath: 'COM8'
});

const readyParser = rfid.pipe(new Ready({delimiter: 'READY'}));

readyParser.on('ready', () => {
    rfid.readCardOnce((err, value) => {
        if(err) return console.log(err);
        console.log(value);
    })
})


/* const cancelFunction = rfid.readCard((err, data) => {
    if(err) return console.log(err);
    console.log(data.payload);
}); */
