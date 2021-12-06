#include <SPI.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <DNSServer.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>

String ssid_s = ""; 
String password_s = "";
 //Enter your Wi-Fi credentials
const char* ssid = ssid_s.c_str(); 
const char* password = password_s.c_str(); 

// MQTT Broker
const char *mqtt_broker = "141.94.175.18";
const char *topic = "door_lock";
const char *mqtt_username = "robotika";
const char *mqtt_password = "robotika";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);
void callback(char *topic, byte *payload, unsigned int length) {
  String str;
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (unsigned int i = 0; i < length; i++) {
      Serial.print((char) payload[i]);
      str[i] += (char)payload[i];
  }
  Serial.println();
  Serial.println("-----------------------");
}
// void BT() {
//   const uint8_t* point = esp_bt_dev_get_address();

//   for (int i = 0; i < 6; i ++) {
//     char[3];
//     sprintf(str, "%02X", (int)point[i]);
//     Serial.print(str);
//     if (i < 5) {
//       Serial.print(":");
//     }
//   }
// }

// BluetoothSerial SerialB;

 String str = "";
String tagContent = "aaaaaaaaa";
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char *topic, byte *payload, unsigned int length) {
  
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  for (unsigned int i = 0; i < length; i++) {
      Serial.print((char) payload[i]); 
      str[i] += (char)payload[i];
  }
  Serial.println();
  Serial.println("-----------------------");
    const size_t capacity = JSON_ARRAY_SIZE(2)
                      + 2*JSON_OBJECT_SIZE(3)
                      + 4*JSON_OBJECT_SIZE(1);  
  DynamicJsonDocument doc(capacity) ;  

  const char* input = "{\"rfid\":\"0aaaaaaaa\",\"mac_wifi\":\"4eeeeeee\"}";
  
  DeserializationError error  = deserializeJson(doc,payload, length);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return ;
    
  }else {
    const char* rfid = doc["rfid"];
    const char* mac_wifi = doc["mac_wifi"];
    Serial.print(rfid);

}

// void BT() {
//   const uint8_t* point = esp_bt_dev_get_address();

//   for (int i = 0; i < 6; i ++) {
//     char[3];
//     sprintf(str, "%02X", (int)point[i]);
//     Serial.print(str);
//     if (i < 5) {
//       Serial.print(":");
//     }
//   }
// }

// BluetoothSerial SerialB;


  // SerialB();
  // connecting to a WiFi network
void mqtt(const char *mqtt_broker, const char *topic,const char *mqtt_username,const char *mqtt_password,const int mqtt_port ,const char *ssid, const char *password) {
 

  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback );
  while (!client.connected()) {
      String mac_bt = "esp8266-client-";
      mac_bt += String(WiFi.macAddress());
      Serial.printf("The client %s connects to the public mqtt broker\n", mac_bt.c_str());
      // BT();
      if (client.connect(mac_bt.c_str(), mqtt_username, mqtt_password)) {
          Serial.println("Robotika mqtt broker connected");
      } else {
          Serial.print("failed with state ");
          Serial.print(client.state());
          delay(2000);
      }
  }
  // publish and subscribe
  //client.publish(topic, "verifying");
  client.subscribe(topic);
}
String get_wifi(void){
    Serial.println("");
   /* Set ESP32 to Wi-Fi Station mode */
  WiFi.mode(WIFI_STA);
 //Erases Previous Wi-Fi Configuration. It erases Wi-Fi config at ESP reset
  WiFi.disconnect();  //Comment this line in practical application

//Without this line it will not connect to Wi-Fi
  WiFi.begin();         //Connect to Wi-Fi
  //Display Previously Stored SSID and PASSWORD
  Serial.print("Local Stored SSID:");
  Serial.println(WiFi.SSID());
  Serial.print("Local Stored Password:"); 
  Serial.println(WiFi.psk());
    if(WiFi.SSID() == "" && ssid_s == "" )
    {
        //Start Smart Config
      WiFi.beginSmartConfig();
        //Wait for SmartConfig packet from mobile
      Serial.println("Waiting for SmartConfig.");
  //If Wi-Fi connects stop smart config
      while (WiFi.status() != WL_CONNECTED) {  
        delay(500);
        Serial.print(".");
      }
        Serial.println("");
        Serial.println("SmartConfig done.");
    }
    else
    {
      Serial.println("Connecting with previously stored configuration");
      while(WiFi.status() != WL_CONNECTED)
      {
        Serial.print(".");
        delay(500);
      }
    }
     //Enter your Wi-Fi credentials
    ssid_s = WiFi.SSID(); 
    password_s = WiFi.psk(); 
    Serial.println("");
    //Print Wi-Fi SSID 
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(WiFi.SSID());
    //Print connected network password
    Serial.print("Password:");
    Serial.println(WiFi.psk());
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Connected to const char");
    Serial.print(ssid_s.c_str());
    return (ssid_s.c_str(),WiFi.psk(),WiFi.localIP())
}
bool isUserAuthorized(String tagContent, String rfid) {
    bool is_authorized = false;

    if (rfid == tagContent.c_str()){
      if(mac_wifi in )
    }
    else Serial.print("Not authorized");
}
void setup() {
  // Set software serial baud to 115200;
  WiFi.begin(ssid, password);
  Serial.begin(115200);

  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
  }  
  Serial.println("Connected to the WiFi network");
  
}


void loop(void){
} 