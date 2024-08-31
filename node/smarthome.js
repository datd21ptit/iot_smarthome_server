const express = require('express');
const AppRepository = require('./repository');
const MqttClient = require('./mqtt'); // Import the MQTT setup function
const app = express()

let mqtt_action_topic = "action";
const appRepository = new AppRepository();
const client = new MqttClient(appRepository); // Pass the database connection to mqtt.js

app.get('/data', (req, res) => appRepository.getDashboardData(res));

app.get('/table/sensor', (req, res) => appRepository.getSensorTable(req, res));

app.get('/table/action', (req, res) => appRepository.getActionTable(req, res));

app.post('/action', (req, res) => {
    let dat = {
        led: req.query.led,
        fan: req.query.fan,
        relay: req.query.relay
    };

    client.publishAction(mqtt_action_topic, dat, res);
  });

const server = app.listen(3001, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
