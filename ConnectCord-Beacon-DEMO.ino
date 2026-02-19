#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>        // ← Built-in, no install needed
#include <ArduinoJson.h>

// ─── Configuration ───
const char* ssid     = "redacted";
const char* password = "redacted";

// mDNS hostname — device will be reachable at "connectcord.local"
const char* MDNS_HOSTNAME = "connectcord";

const char* EVENT_ID   = "EVT-001";
const char* EVENT_TYPE = "Work";
const char* EVENT_NAME = "ConnectCord Dev Event";
const char* TIME_START = "10:00";
const char* TIME_END   = "14:00";

WebServer server(80);

// ─── CORS Headers ───
void setCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ─── GET /event ───
void handleEvent() {
  setCORSHeaders();

  StaticJsonDocument<256> doc;
  doc["eventId"]   = EVENT_ID;
  doc["eventType"] = EVENT_TYPE;
  doc["name"]      = EVENT_NAME;

  JsonObject timeWindow = doc.createNestedObject("timeWindow");
  timeWindow["start"] = TIME_START;
  timeWindow["end"]   = TIME_END;

  doc["deviceIP"]  = WiFi.localIP().toString();
  doc["hostname"]  = String(MDNS_HOSTNAME) + ".local";
  doc["uptime"]    = millis() / 1000;

  String json;
  serializeJson(doc, json);

  server.send(200, "application/json", json);
  Serial.println("[mDNS] Event data served");
}

// ─── GET /health ───
void handleHealth() {
  setCORSHeaders();

  StaticJsonDocument<128> doc;
  doc["status"]   = "online";
  doc["hostname"] = String(MDNS_HOSTNAME) + ".local";
  doc["ip"]       = WiFi.localIP().toString();
  doc["uptime"]   = millis() / 1000;

  String json;
  serializeJson(doc, json);

  server.send(200, "application/json", json);
}

void handleOptions() {
  setCORSHeaders();
  server.send(204);
}

void handleNotFound() {
  setCORSHeaders();
  server.send(404, "application/json", "{\"error\":\"Not found\"}");
}

// ─── WiFi Connection ───
void connectWiFi() {
  Serial.printf("[WiFi] Connecting to %s", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] Connection FAILED — restarting...");
    delay(5000);
    ESP.restart();
  }
}

// ─── mDNS Setup ───
void setupMDNS() {
  if (MDNS.begin(MDNS_HOSTNAME)) {
    Serial.printf("[mDNS] Hostname registered: http://%s.local\n", MDNS_HOSTNAME);

    // Advertise the HTTP service so network scanners can find it
    MDNS.addService("http", "tcp", 80);

    // Add custom service type for ConnectCord discovery
    // Mobile app can scan for "_connectcord._tcp" to find beacons
    MDNS.addService("connectcord", "tcp", 80);

    // Add TXT records — extra metadata discoverable via mDNS
    MDNS.addServiceTxt("connectcord", "tcp", "eventId", EVENT_ID);
    MDNS.addServiceTxt("connectcord", "tcp", "version", "1.0");

    Serial.println("[mDNS] Services advertised:");
    Serial.println("       _http._tcp (port 80)");
    Serial.println("       _connectcord._tcp (port 80)");
  } else {
    Serial.println("[mDNS] FAILED to start mDNS responder!");
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=== ConnectCord Beacon v1.1 (mDNS) ===");

  connectWiFi();
  setupMDNS();    // ← Start mDNS after WiFi connects

  server.on("/event",   HTTP_GET,     handleEvent);
  server.on("/event",   HTTP_OPTIONS, handleOptions);
  server.on("/health",  HTTP_GET,     handleHealth);
  server.on("/health",  HTTP_OPTIONS, handleOptions);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("[HTTP] Server started on port 80");
  Serial.printf("[HTTP] Access at: http://%s.local/event\n", MDNS_HOSTNAME);
}

void loop() {
  server.handleClient();

  // Reconnect WiFi + re-register mDNS if connection drops
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Lost connection — reconnecting...");
    connectWiFi();
    setupMDNS();  // Re-register mDNS after reconnect
  }
}
