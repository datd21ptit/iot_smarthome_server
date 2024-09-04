# Smart Home Server
This is repository has 3 part:

1. [mysql](https://github.com/datd21ptit/iot_smarthome_server/tree/master/mysql) contains 2 ".db" file which is structure of 2 table used for this server
2. [smartHomeEsp826](https://github.com/datd21ptit/iot_smarthome_server/tree/master/smartHomeEsp8266) contains implementation of ESP8266
3. [node](https://github.com/datd21ptit/iot_smarthome_server/tree/master/node) is implementation of server.

The server source in this repository can be used with this [SmartHome Android Application](https://github.com/datd21ptit/iot_smart_home_app.git) 
# Description
- This server is a part of smart home system project for "IoT and application" subject
- This server plays a role as a bridge for communication between ESP8266 and application. It collects sensor output, write it to database, send it to application. It also listen user's controlling to controll device.

# API Docs
- API Docs in ```localhost:3001/api-docs```
# Installation
## Mosquitto
1. Download and install mosquitto in [Mosquitto Eclipse](https://mosquitto.org/download/)
2. Open cmd or terminal and run ```cd your_directory/mosquitto```
3. Create a file to save username and password in ```your_directory/mosquitto``` in format username:password and run ```mosquitto_passwd your_directory/mosquitto/passFile```
4. Create ```broker.conf``` to config mosquitto:
```
listener 1883
password_file passFile
allow_anonymous true
```
5. Run ```mosquitto -v -c broker.conf``` to run mosquitto with configuration in broker.conf

## Install Database
1. Open MySql Workbench
2. Create new schema ```smarthome```
3. Import table from folder ```./mysql```
## Install NodeJs
1. **Clone the repository.** Open Terminal and run this command: ```git clone https://github.com/datd21ptit/iot_smarthome_server.git```
2. Open folder node in Visual Studio or any else IDE
3. Run ```npm install``` to install all dependencies
4. Open ```repository.js``` and ```mqtt.js``` to modify these fields
```
'./reposistory.js'
var db_config = {
    host: "localhost",      //replace with your host
    user: "root",           //replace with your username
    password: "123456",     //replace with your password
    database: "smarthome",
    port: "3306"
    }

'./mqtt.js'
const options = { 
    clientId: 'ESP32', 
    port: 1883, 
    keepalive: 60,          
    username: 'admin',      //replce with your mqtt username
    password: '123456'      //replace with your mqtt password
    };
```
4. Run ```node smarthome.js``` to run server
## ESP8266
1. Open ```./smartHomeEsp8266/smartHomeEsp8266.ino``` in Arduino IDE
2. Plug ESP8266 in by a data cable
3. Select a COM port which you pluged in and select board ```Adafruit Feather HUZZAH ESP8266```
4. Install library
- DHT library: ```DHT sensor library by Adafruit``` in library manager
- ArduinoJson library: ```ArduinoJson by Benoit Blanchon```
- ESP8266WiFi library
- PubSubClient library
5. Compile and upload code

