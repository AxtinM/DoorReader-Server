#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <Arduino.h>
#include <ESP8266HTTPClient.h>
// #include <ArduinoJson.h>

//Enter your Wi-Fi credentials
#define WIFI_SSID "micky"
#define WIFI_PASS "12345678"

// Set AP credentials
#define AP_SSID "ESP8266"
#define AP_PASS "myesp2021"

// #define IP "192.168.100.82"
#define RST_PIN         D0         // Configurable, see typical pin layout above
#define SS_PIN          D8        // Configurable, see typical pin layout above
#define open            D1   
MFRC522 rfid(SS_PIN, RST_PIN);  // Create MFRC522 instance
MFRC522::MIFARE_Key key;
// Init array that will store new NUID
String tag;
String tagCheck;
String macAddr;
WiFiClient client;

int numTones = 10;
int tones[] = {261, 277, 294, 311, 330, 349, 370, 392, 415, 440};

bool httpCheck(String tag);
// String rfidCheck(String tagCheck);
void setup()
{

  Serial.begin(9600);		// Initialize serial communications with the PC
	SPI.begin();			// Init SPI bus
	rfid.PCD_Init();		// Init MFRC522
  Serial.print(F("Reader :"));
	rfid.PCD_DumpVersionToSerial();	// Show details of PCD - MFRC522 Card Reader details
  
  // Connecting to WiFi...
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
      delay(2000);
      Serial.println("Connecting to WiFi..");
  }  
  
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Opening Access Point");
  WiFi.softAP(AP_SSID, AP_PASS);

  Serial.print("MAC address for ");
  Serial.print(AP_SSID);
  Serial.print(" : ");
  Serial.print(WiFi.softAPmacAddress());
  macAddr = WiFi.softAPmacAddress();
  Serial.println("");
  tagCheck = "";
  pinMode(open, OUTPUT);
}

void loop() {
  
  if (rfid.PICC_IsNewCardPresent()){
  // Verify if the NUID has been readed
    if (rfid.PICC_ReadCardSerial()) {
    for (byte i = 0; i < 4; i++){ 
      tag += rfid.uid.uidByte[i];
    }    
      if (httpCheck(tag)){
        Serial.println("Access Granted");
        for (int i = 0; i < 3; i++) {
        tone(open, 1600, 100);
        delay(300);
        }
        tone(open, 2000, 600);
      }else
      {
        for (int i = 0; i < numTones; i++)
        {
          tone(open, tones[i]);
          delay(100);

        } 
          noTone(open);
      }
  }
 }
 tag = "";
 rfid.PICC_HaltA();
 rfid.PCD_StopCrypto1();
}


bool httpCheck(String tag){
  HTTPClient http;
  Serial.println("tag: " + tag);
  http.begin(client, "http://192.168.100.57:3000/api/device/tag/" + macAddr + "/" + tag); //HTTP
   int code = http.GET();
    if (code > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", code);

        // rfid found at server
        if (code == 200) {
          const String& payload = http.getString();
          Serial.println(payload);
          http.end();
          return true;
        }else {
          const String& payload = http.getString();
          Serial.println(payload);
          return false;
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(code).c_str());
        http.end();
        return false;
      }
}

// String rfidCheck() {
//   // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
//  if (! rfid.PICC_IsNewCardPresent())
//     return "";
//  // Verify if the NUID has been readed
//  if (rfid.PICC_ReadCardSerial()) {
//    for (byte i = 0; i < 4; i++){ 
//      tag += rfid.uid.uidByte[i];
//    }
//  }
//  Serial.println("tag check : ");
//  Serial.print(tag);
//  return tag;
// }