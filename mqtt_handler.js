const mqtt = require("mqtt");

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = "mqtt://141.94.175.18:1883";
        this.username = "robotika"; // mqtt credentials if these are needed to connect
        this.password = "robotika";
    }


    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host, {
            username: this.username,
            password: this.password,
        });

        // Mqtt error calback
        this.mqttClient.on("error", (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on("connect", () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe("door_lock", { qos: 0 });
        this.mqttClient.on('message', function(topic, payload) {
            if (topic.toString() == "door_lock") {
                console.log("Mesage Received " + payload.toString());
            }
        });

        //this.mqttClient.subscribe("http://localhost:3000/login/registerDevice");
        // When a message arrives, console.log it
        this.mqttClient.on("message", function() {
            console.log(message.toString());
            console.log(message);

        });

        this.mqttClient.on("close", () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: robotika
    sendMessage(message) {
        this.mqttClient.publish("door_lock", message);
    }
}

module.exports = MqttHandler;