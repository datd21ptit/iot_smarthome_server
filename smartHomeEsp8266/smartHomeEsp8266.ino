#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>
#include <ArduinoJson.hpp>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// WiFi settings
#define ssid  "TRAN DAT"        // Replace with your WiFi name
#define password  "0975691135"  // Replace with your WiFi password

// MQTT Broker settings
#define mqtt_broker "192.168.1.10"  // EMQX broker endpoint

#define mqtt_sensor_topic "sensor"       // MQTT topic
#define mqtt_action_topic "action"
#define mqtt_initial_topic "mytopic"
#define mqtt_username "admin"      // MQTT username for authentication
#define mqtt_password "123456"     // MQTT password for authentication
#define mqtt_port 1883             // MQTT port (TCP)


#define DHTTYPE DHT22       // Sensors PIN
#define LDRPIN A0           //A0
#define DHTPIN 14          // D5

const int fan = 5;            //D6     // Device PIN 
const int led = 4;           //D7
const int relay = 0;          // D8

unsigned long lastPublishTime = 0; // Variable to store the last publish time
const unsigned long publishInterval = 2000; // Interval to publish data (2 seconds)

WiFiClient espClient;
PubSubClient mqtt_client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void connectToWiFi();

void connectToMQTTBroker();

void mqttCallback(char *topic, byte *payload, unsigned int length);

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
            // subcribe vao topic de server gui tin hieu action
            mqtt_client.subscribe(mqtt_action_topic);
            // Publish message upon successful connection
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

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  if(strcmp(topic, mqtt_action_topic) == 0){
    StaticJsonDocument<200> docs;
    String jsonString;
    for (unsigned int i = 0; i < length; i++) {
      jsonString += (char)payload[i];
    }
    DeserializationError error = deserializeJson(docs, jsonString);
    if(error){
      return;
    }
    int ledV = docs["led"];
    int fanV = docs["fan"];
    int relayV = docs["relay"];
    
    //make change to device.
    digitalWrite(led, ledV);
    digitalWrite(fan, fanV);
    digitalWrite(relay, relayV);

    // announce that esp change state of device
    mqtt_client.publish(mqtt_action_topic, "True");
    
    Serial.print("Got an action ");
    Serial.print("ledV: ");
    Serial.print(ledV);
    Serial.print(" fanV: ");
    Serial.print(fanV);
    Serial.print(" relayV: ");
    Serial.print(relayV);
    Serial.println();
    Serial.println("-----------------------");    
  }else if(strcmp(topic, mqtt_initial_topic) == 0){
    StaticJsonDocument<200> docs;
    String jsonString;
    for (unsigned int i = 0; i < length; i++) {
      jsonString += (char)payload[i];
    }
    Serial.println(jsonString);
    DeserializationError error = deserializeJson(docs, jsonString);
    if(error){
      return;
    }
    int ledV = docs["led"];
    int fanV = docs["fan"];
    int relayV = docs["relay"];
    
    //make change to device.
    digitalWrite(led, ledV);
    digitalWrite(fan, fanV);
    digitalWrite(relay, relayV);
  }
}


void sendSensorData(){
  // read sensor data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int ldrValue  = analogRead(LDRPIN);
  float vol = (ldrValue / 1023.0) * 3.3;
  float resistance =  (10000 * (3.3 - vol)) / vol;
  float light = 0.8 * 10000000 * pow(resistance, -1);
  // jsonify
  StaticJsonDocument<200> jsonData;
  jsonData["temp"] = temperature;
  jsonData["humid"] = humidity;
  jsonData["light"] = light;
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
    pinMode(led, OUTPUT);
    pinMode(fan, OUTPUT);
    pinMode(relay, OUTPUT);
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
