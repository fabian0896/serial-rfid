const Rfid = require('..');


/* Rfid.list().then(ports => {
    console.log(ports);
}); */

const rfid = new Rfid({
    baudRate: 9600, 
    portPath: 'COM7'
});

rfid.onConnectState((err, state) => {
    if(err) return console.log(err);
    console.log(state);
});

rfid.onReady(()=> {
    rfid.readCard((err, value) => {
        if(err) return console.log(err);
        console.log(value);
    });
});


