#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// WiFi and MQTT settings
const char* ssid = "LAPTOP_TRAN_DAT";      
const char* password = "0975691135";       
const char* mqtt_broker = "192.168.1.7";  //// config this
const char* mqtt_sensor_topic = "sensor";    
const char* mqtt_action_topic = "action";
const char* mqtt_initial_topic = "mytopic";
const char* mqtt_username = "admin";        
const char* mqtt_password = "123456";       
const int mqtt_port = 1883;     

// Pins
// BT1 const int somethingPin = ...
const int DHTPIN = 5;
const int LDRPIN = A0; 
const int fanPin = 4; 
const int ledPin = 0;  
const int relayPin = 14;

// Timing
unsigned long lastPublishTime = 0; // Variable to store the last publish time
const unsigned long publishInterval = 2000; // Interval to publish data (2 seconds)

// MQTT client and DHT
WiFiClient espClient;
PubSubClient mqtt_client(espClient);
#define DHTTYPE DHT22       // Sensors PIN
DHT dht(DHTPIN, DHTTYPE);



// 
void connectToWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to the WiFi network");
}

void connectToMQTTBroker() {
    while (!mqtt_client.connected()) {
        String client_id = "esp8266-client-" + String(WiFi.macAddress());
        Serial.printf("Connecting to MQTT Broker as %s.....\n", client_id.c_str());
        if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Connected to MQTT broker");
            mqtt_client.subscribe(mqtt_action_topic);
            mqtt_client.subscribe(mqtt_initial_topic);
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
    mqtt_client.publish(mqtt_initial_topic, "esp_setup");
}

void handleDeviceControl(const JsonDocument& docs) {
    String device = docs["device"];
    String state = docs["state"];
    // int ledState = docs["led"];
    // int fanState = docs["fan"];
    // int relayState = docs["relay"];
    int i = 0;
    if(state == "on"){
      i = 1;
    }
    if(device == "led"){
      digitalWrite(ledPin, i);
    }else if(device == "fan"){
      digitalWrite(fanPin, i);
    }else if(device == "relay"){
      digitalWrite(relayPin, i);
    }
    Serial.println("State: " + state + " Device: " + device);
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  StaticJsonDocument<200> docs;
  String jsonString;
  for (unsigned int i = 0; i < length; i++) {
      jsonString += (char)payload[i];
  }
  DeserializationError error = deserializeJson(docs, jsonString);
  if (error) {
      return;
  }

  if(strcmp(topic, mqtt_action_topic) == 0){
    handleDeviceControl(docs);
    // announce that esp change state of device
    mqtt_client.publish(mqtt_action_topic, "True");
  }else if(strcmp(topic, mqtt_initial_topic) == 0){
    // handleDeviceControl(docs);
    int led = docs["led"] == "on" ? 1: 0;
    int fan = docs["fan"] == "on" ? 1: 0;
    int relay = docs["relay"] == "on" ? 1: 0;
    digitalWrite(ledPin, led);      
    digitalWrite(fanPin, fan);
    digitalWrite(relayPin, relay);
  }
}

void sendSensorData(){
  // read sensor data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int ldrValue  = analogRead(LDRPIN);
  // BT1 int sensorValue = analogRead(pin);
  if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
  }

  float vol = (ldrValue / 1023.0) * 3.3;
  float resistance =  (10000 * (3.3 - vol)) / vol;
  float light = 0.8 * 10000000 * pow(resistance, -1);
  light = min(light, (float)3000.0);

  // Prepare json
  StaticJsonDocument<200> jsonData;
  jsonData["temp"] = temperature;
  jsonData["humid"] = humidity;
  jsonData["light"] = light;
  // BT1 jsonData["data"] = sensorValue;
  char buffer[200];
  size_t n = serializeJson(jsonData, buffer);
  // verbose
  Serial.println(buffer);
  // publish
  mqtt_client.publish(mqtt_sensor_topic, buffer, n);
}

void setup() {
    Serial.begin(115200);
    dht.begin();

    pinMode(ledPin, OUTPUT);
    pinMode(fanPin, OUTPUT);
    pinMode(relayPin, OUTPUT);
    // BT1 pinMode(pin, INPUT)
    connectToWiFi();
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setCallback(mqttCallback);
    connectToMQTTBroker();
}

void loop() {
  if (!mqtt_client.connected()) {
      connectToMQTTBroker();
  }
  mqtt_client.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastPublishTime >= publishInterval) {
    lastPublishTime = currentMillis;
    sendSensorData();
  }
}
