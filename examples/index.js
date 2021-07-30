const Rfid = require('../src');


const rfid = new Rfid({
    baudRate: 9600, 
    portPath: 'COM8'
});


rfid.onReady(()=> {
    rfid.readCardOnce((err, value) => {
        if(err) return console.log(err);
        console.log(value);
    });
});


