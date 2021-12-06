var mqtt = require('mqtt');
var settings = { port: 1883 };
var broker = new mqtt.Server(settings);

broker.on('ready', () => {
    console.log('Broker is ready!')
})
broker.on('published', (packet) => {
    message = packet.payload.toString();
    console.log(message)
})