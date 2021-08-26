const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const Ready = require('@serialport/parser-ready');

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
            autoOpen: false
        });

        /**@private */
        this.parser = this.pipe(new ReadLine());

    }

    
    onReady (callback) {
        const readyParser = this.pipe(new Ready({
            delimiter: 'READY'
        }));
        readyParser.on('ready', callback);
    }


    /**
     * 
     * @typedef Message
     * @property {string} type
     * @property  {object} payload
     * @property {string} payload.id
     */

    /**
     * Responde Callback
     * @callback readCardCallback
     * @param {Error} error
     * @param {Message} data 
     */

    /**
     * Read de UID of a card 
     * @method
     * @param {number} [timeout = 9600] - Timeout to wait until a card is read 
     * @param {readCardCallback} callback - Callback function
     * @returns {function} - returns de UID of the card read
     */
    readCardOnce = (callback, timeout = 10000) => {
        let timer;
        this.activeReadingMode(true);
        const listnerCallback = (data) => {
            try{
                const json = JSON.parse(data);  
                if(json.type !== 'CARD_READ') return;
                this.parser.removeListener('data', listnerCallback);
                clearTimeout(timer);
                this.activeReadingMode(false, () => {
                    callback && callback(null, json);
                });
            } catch (error) {
                console.log(error.message);
            }
        };

        this.parser.on('data', listnerCallback);

        timer = setTimeout(() => {
            this.activeReadingMode(false);
            this.parser.removeListener('data', listnerCallback);
            callback && callback(new Error('time out! No card detected'));
        }, timeout);

        return () => {
            this.activeReadingMode(false);
            clearTimeout(timer);
            this.parser.removeListener('data', listnerCallback);
            console.log('The card reading was canceled');
        }
    }


    /**
     * Responde Callback
     * @callback readCardCallback
     * @param {Error} error
     * @param {Message} data of the UID card
     */

    /**
     * Read de UID of a card 
     * @method
     * @param {number} [timeout = 9600] - Timeout to wait until a card is read 
     * @param {readCardCallback} callback - Callback function
     * @returns {function} - returns de UID of the card read
     */
    readCard = (callback) => {
        this.activeReadingMode(true);
        const listnerCallback = (data) => {
            try{
                const json = JSON.parse(data);  
                if(json.type !== 'CARD_READ') return;
                callback && callback(null, json);
            } catch (error) {
                console.log(error.message);
            }
        };

        this.parser.on('data', listnerCallback);

        return () => {
            this.activeReadingMode(false);
            this.parser.removeListener('data', listnerCallback);
            console.log('The card reading was canceled');
        }
    }

    
    
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

    /**
     * fFunction to active the reading mode of the RFID
     * @param {boolean} active
     * @param {function(): void} 
     */
    activeReadingMode(active, callback) {
        const strMessage = JSON.stringify({
            type: 'READING_MODE',
            payload: {
                active
            } 
        });

        this.write(Buffer.from(strMessage));
        this.drain(error => {
            if(error) return console.log("Error: ", error);
            console.log("se envio el mensaje desde el drain");
            callback && callback();
        })
    }


    onConnectState(callback) {
       this.on('open', () => {
           callback && callback(null, 'CONNECTED')
       });
       this.on('close', () => {
           callback && callback(null, 'DISCONNECTED')
       });
    }

}


module.exports = Rfid



