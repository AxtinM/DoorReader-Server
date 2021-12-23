#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <Arduino.h>
#include <ESP8266HTTPClient.h>
// #include <ArduinoJson.h>

//Enter your Wi-Fi credentials
#define WIFI_SSID "Robotika"
#define WIFI_PASS "Robotika2121"

// Set AP credentials
#define AP_SSID "ESP8266"
#define AP_PASS "myesp2021"

#define IP "192.168.100.35"
#define RST_PIN         D3         // Configurable, see typical pin layout above
#define SS_PIN          D8        // Configurable, see typical pin layout above
#define open            D1   
MFRC522 rfid(SS_PIN, RST_PIN);  // Create MFRC522 instance
MFRC522::MIFARE_Key key;
// Init array that will store new NUID
String tag;
String tagCheck;
String macAdd;
WiFiClient client;
boolean repeat;
String httpCheck(String tag, boolean repeat);
String rfidCheck(String tagCheck);
void setup() {
	
  Serial.begin(115200);		// Initialize serial communications with the PC
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

  Serial.print("IP address for ");
  Serial.print(AP_SSID);
  Serial.print(" : ");
  Serial.print(WiFi.softAPIP());
  
  uint8_t macAddr[6];
  WiFi.softAPmacAddress(macAddr);
  Serial.printf("\nWith MAC address = %02x:%02x:%02x:%02x:%02x:%02x\n", macAddr[0], macAddr[1], macAddr[2], macAddr[3], macAddr[4], macAddr[5]);
  tagCheck = "";
  pinMode(open, OUTPUT);

}
 
void loop() {
  
 tag = rfidCheck(tagCheck);
 if (tagCheck == tag) {
   repeat = false;
  } else { 
   repeat = true;
  }
  macAdd = httpCheck(tag, repeat);

if (macAdd == "04:8C:9A:A8:49:F3" && repeat) { 
  Serial.println("Access Granted");
  for (int i = 0; i < 3; i++) {
  tone(open, 1600, 100);
  delay(300);
  }
  tone(open, 2000, 600);
 }

if (macAdd != "04:8C:9A:A8:49:F3" && repeat) {
  Serial.println("Access Denied");
  for (int i = 0; i < 3; i++) {
    tone(open, 1600, 100);
    delay(300);
  } 
  tone(open, 800, 600);
}
 tag = "";
 macAdd = "";
 rfid.PICC_HaltA();
 rfid.PCD_StopCrypto1();
}





String httpCheck(String tag, boolean repeat){
 HTTPClient http;
 http.begin(client, "http://192.168.100.35:8080/api/" + tag); //HTTP
 int code = http.GET();
  if (repeat == true) {
    if (code > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", code);

        // rfid found at server
        if (code == 200) {
          const String& payload = http.getString();
          macAdd = payload.substring(payload.indexOf("fi\"")+5, payload.indexOf("user")-3);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(code).c_str());
        macAdd = "";
      }
  }
  http.end();
  
  return macAdd;
}

String rfidCheck(String tagCheck) {
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
 if (! rfid.PICC_IsNewCardPresent())
    return "";
 // Verify if the NUID has been readed
 if (rfid.PICC_ReadCardSerial()) {
   for (byte i = 0; i < 4; i++){ 
     tag += rfid.uid.uidByte[i];
   }
 }
 Serial.println("tag check : " + tag);
 if (! (tagCheck == tag)){
   tagCheck = tag;
 }
 return tag;
}