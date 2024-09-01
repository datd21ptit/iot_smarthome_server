const express = require('express');
const AppRepository = require('./repository');
const MqttClient = require('./mqtt'); // Import the MQTT setup function
const app = express()

const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

let mqtt_action_topic = "action";
const appRepository = new AppRepository();
const client = new MqttClient(appRepository); // Pass the database connection to mqtt.js

const file = fs.readFileSync('./apidoc.yaml', 'utf-8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/dashboard', (req, res) => appRepository.getDashboardData(res));

app.post('/dashboard', (req, res) => {
    let dat = {
        led: req.query.led,
        fan: req.query.fan,
        relay: req.query.relay
    };

    client.publishAction(mqtt_action_topic, dat, res);
  });

app.get('/table/sensor', (req, res) => appRepository.getSensorTable(req, res));

app.get('/table/action', (req, res) => appRepository.getActionTable(req, res));


const server = app.listen(3001, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
