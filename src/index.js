const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');


class Rfid extends SerialPort {
    /**
     * constructor configuratión
     * @typedef Configuration
     * @property {string} portPath - Port parth of the arduino
     * @property {number} baudRate - Baud rate of the serial port
     */

    /**
     * @constructor
     * @param {Configuration} configuration 
     */
    constructor({ portPath, baudRate }) {
        super(portPath, {
            baudRate,
            autoOpen: true
        });

        /**@private */
        this.parser = this.pipe(new ReadLine());
    }

    /**
     * Responde Callback
     * @callback readCardCallback
     * @param {Error} error
     * @param {string} cardUid of the UID card
     */

    /**
     * Read de UID of a card 
     * @method
     * @param {number} [timeout = 9600] - Timeout to wait until a card is read 
     * @param {readCardCallback} callback - Callback function
     * @returns {Promise<string>} - returns de UID of the card read
     */
    readCard = (timeout = 6000, callback) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            callback && callback(new Error('time out! No card detected'));
            reject('time out! No card detected');
        }, timeout);
        this.parser.on('data', data => {
            parser.removeAllListeners();
            clearTimeout(timer);
            callback && callback(null, data);
            resolve(data);
        })
    })

    /**
     * 
     * @typedef Message
     * @property {string} type
     * @property  {object} payload
     */
    
    /**
     * function to send messages to the serial port
     * @method
     * @param {Message} message message to sen on the serial port
     * @return {Promise<void>} resolve when the message is send 
     */
    
    send = (message) => new Promise((resolve, reject) => {
        this.write(message);
        this.drain((error) => {
            if (error) return reject(error);
            resolve();
        })
    });


    /**
     * Disconnect the serial port
     * @method disconnect
     * @returns {Promise<void>} resolve when the connection is close
     */
    disconnect = () => new Promise((resolve, reject) =>{
        this.close(error => {
            if(error) return reject(error);
            resolve();
        });
    })

}


module.exports = Rfid



