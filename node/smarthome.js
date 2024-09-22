const express = require('express');
const AppRepository = require('./repository');
const MqttClient = require('./mqtt'); // Import the MQTT setup function
const app = express()
// Swagger for API doc
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const file = fs.readFileSync('./apidoc.yaml', 'utf-8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Repository va MQTT Client
const appRepository = new AppRepository();
const client = new MqttClient(appRepository);

// Method
app.get('/dashboard', (req, res) => appRepository.getDashboardData(req, res));

let listDevice = ["led", "fan", "relay"]

app.post('/dashboard', (req, res) => {
    let device = req.query.device
    let state = req.query.state
    // console.log(device);
    // console.log(state);
    
    if(listDevice.includes(device) && ["on", "off"].includes(state)){
      client.publishAction(device, state, res);
    }else{
      res.status(415).send()
    }
  });

app.get('/table/sensor', (req, res) => appRepository.getSensorTable(req, res));

app.get('/table/action', (req, res) => appRepository.getActionTable(req, res));

const server = app.listen(3001, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});