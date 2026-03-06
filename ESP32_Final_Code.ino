#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <ArduinoJson.h>

// ─── Event Configuration ───
const char* EVENT_ID   = "EVT-001";
const char* EVENT_TYPE = "Work";
const char* EVENT_NAME = "ConnectCord Dev Event";
const char* TIME_START = "10:00";
const char* TIME_END   = "14:00";

// ─── WiFi AP Configuration ───
const char* AP_SSID     = "ConnectCord-EVT001";
const char* AP_PASSWORD = "";

// ─── Network Settings ───
IPAddress apIP(192, 168, 4, 1);
IPAddress netMask(255, 255, 255, 0);

// ─── Servers ───
WebServer webServer(80);
DNSServer dnsServer;
const byte DNS_PORT = 53;

// ─── Attendance Storage ───
struct AttendanceRecord {
  String oduserId;
  String checkInTime;
  String checkOutTime;
  bool checkedOut;
};

const int MAX_RECORDS = 100;
AttendanceRecord records[MAX_RECORDS];
int recordCount = 0;

// ─── HTML: Main Page (Dark Theme) ───
const char MAIN_PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ConnectCord</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            color: #FFFFFF;
        }

        .logo-container {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: #86b499;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 12px;
        }
        .logo-text {
            font-size: 22px;
            font-weight: 800;
            color: #FFFFFF;
            font-style: italic;
        }
        .header-title {
            font-size: 28px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 4px;
        }
        .header-subtitle {
            font-size: 14px;
            color: #AAAAAA;
            margin-bottom: 32px;
        }

        .card {
            background: #1A1A1A;
            border-radius: 16px;
            padding: 24px;
            width: 100%;
            max-width: 400px;
            border: 1px solid #2A2A2A;
        }
        .card-title {
            font-size: 20px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 16px;
        }

        .event-name {
            font-size: 18px;
            font-weight: 700;
            color: #86b499;
            margin-bottom: 8px;
        }
        .event-badge {
            display: inline-block;
            background: #2A2A2A;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #86b499;
            margin-bottom: 16px;
        }

        .details {
            background: #2A2A2A;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #333333;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-size: 14px;
            font-weight: 600;
            color: #AAAAAA;
        }
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #FFFFFF;
        }

        .form-group {
            margin-bottom: 16px;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            color: #AAAAAA;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            background: #2A2A2A;
            border: 1px solid #333333;
            border-radius: 12px;
            font-size: 16px;
            color: #FFFFFF;
            outline: none;
            transition: border-color 0.2s;
        }
        .form-group input::placeholder {
            color: #666666;
        }
        .form-group input:focus {
            border-color: #86b499;
        }

        .btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: opacity 0.2s;
            margin-top: 8px;
        }
        .btn:active {
            opacity: 0.7;
        }
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .btn-primary {
            background: #86b499;
            color: #FFFFFF;
        }
        .btn-danger {
            background: #E74C3C;
            color: #FFFFFF;
        }

        .phase {
            display: none;
        }
        .phase.active {
            display: block;
        }

        .status-banner {
            text-align: center;
            padding: 20px 0;
            margin-bottom: 16px;
        }
        .status-dot {
            width: 16px;
            height: 16px;
            border-radius: 8px;
            background: #4ADE80;
            margin: 0 auto 12px auto;
        }
        .status-title {
            font-size: 22px;
            font-weight: 700;
            color: #86b499;
        }
        .status-time {
            font-size: 14px;
            color: #AAAAAA;
            margin-top: 4px;
        }

        .hint-text {
            font-size: 14px;
            color: #666666;
            text-align: center;
            line-height: 20px;
            margin-bottom: 20px;
        }

        .event-name-small {
            font-size: 16px;
            color: #AAAAAA;
            text-align: center;
            margin-bottom: 16px;
        }

        .complete-container {
            text-align: center;
            padding: 20px 0;
        }
        .complete-check {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            border: 3px solid #86b499;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 16px auto;
            font-size: 36px;
            font-weight: 700;
            color: #86b499;
        }
        .complete-title {
            font-size: 24px;
            font-weight: 700;
            color: #86b499;
            margin-bottom: 8px;
        }
        .complete-detail {
            font-size: 14px;
            color: #AAAAAA;
            line-height: 1.6;
        }

        .status-msg {
            text-align: center;
            padding: 12px;
            border-radius: 12px;
            margin-top: 12px;
            display: none;
            font-size: 14px;
            font-weight: 600;
        }
        .status-msg.error {
            display: block;
            background: rgba(231, 76, 60, 0.15);
            color: #E74C3C;
            border: 1px solid rgba(231, 76, 60, 0.3);
        }
        .status-msg.success {
            display: block;
            background: rgba(134, 180, 153, 0.15);
            color: #86b499;
            border: 1px solid rgba(134, 180, 153, 0.3);
        }

        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #FFFFFF;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spinner-large {
            width: 40px;
            height: 40px;
            border-width: 4px;
            border-color: rgba(134, 180, 153, 0.3);
            border-top-color: #86b499;
            margin: 0 auto 16px auto;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="logo-container">
        <span class="logo-text">CC</span>
    </div>
    <div class="header-title">ConnectCord</div>
    <div class="header-subtitle">Event Check-In</div>

    <!-- Main Card -->
    <div class="card" id="mainCard">

        <!-- ═══ PHASE: CHECK IN ═══ -->
        <div id="phaseCheckIn" class="phase active">
            <div class="card-title">Event Detected</div>

            <div class="event-name" id="eventName">Loading...</div>
            <div class="event-badge" id="eventType">-</div>

            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Event ID</span>
                    <span class="detail-value" id="eventId">-</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time Window</span>
                    <span class="detail-value" id="timeWindow">-</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Attendees</span>
                    <span class="detail-value" id="attendeeCount">-</span>
                </div>
            </div>

            <div class="form-group">
                <label for="userId">Your Name or ID</label>
                <input type="text" id="userId" placeholder="Enter your name or ID" />
            </div>

            <button class="btn btn-primary" id="btnCheckIn" onclick="handleCheckIn()">
                Check In
            </button>
        </div>

        <!-- ═══ PHASE: CHECKED IN ═══ -->
        <div id="phaseCheckedIn" class="phase">
            <div class="status-banner">
                <div class="status-dot"></div>
                <div class="status-title">You're Checked In</div>
                <div class="status-time" id="checkInTimeDisplay">-</div>
            </div>

            <div class="event-name-small" id="eventNameCheckedIn">-</div>

            <div class="hint-text">
                When you're ready to leave,<br>tap Check Out below.
            </div>

            <button class="btn btn-danger" id="btnCheckOut" onclick="handleCheckOut()">
                Check Out
            </button>
        </div>

        <!-- ═══ PHASE: COMPLETE ═══ -->
        <div id="phaseDone" class="phase">
            <div class="complete-container">
                <div class="complete-check">✓</div>
                <div class="complete-title">All Done</div>
                <div class="complete-detail">
                    <span id="doneUser">-</span><br>
                    Check-in: <span id="doneCheckIn">-</span><br>
                    Check-out: <span id="doneCheckOut">-</span><br>
                    Duration: <span id="doneDuration">-</span>
                </div>
            </div>
        </div>

        <!-- Status Message -->
        <div id="statusMsg" class="status-msg"></div>
    </div>

    <script>
        let currentUser = null;
        let checkInTimestamp = null;
        let eventNameText = '';

        // ── Load Event ──
        window.onload = async function () {
            try {
                const response = await fetch('/api/event');
                const data = await response.json();
                eventNameText = data.name;
                document.getElementById('eventName').textContent = data.name;
                document.getElementById('eventType').textContent = data.eventType;
                document.getElementById('eventId').textContent = data.eventId;
                document.getElementById('timeWindow').textContent =
                    data.timeWindow.start + ' – ' + data.timeWindow.end;
                document.getElementById('attendeeCount').textContent = data.attendeeCount || 0;
            } catch (err) {
                document.getElementById('eventName').textContent = 'Could not load event';
            }
        };

        function showPhase(name) {
            document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
            document.getElementById('phase' + name).classList.add('active');
        }

        function showStatus(msg, type) {
            const el = document.getElementById('statusMsg');
            el.className = 'status-msg ' + type;
            el.textContent = msg;
            if (type === 'success') setTimeout(() => { el.className = 'status-msg'; }, 3000);
        }

        function clearStatus() {
            document.getElementById('statusMsg').className = 'status-msg';
        }

        function formatTime(iso) {
            return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }

        function calcDuration(start, end) {
            const ms = new Date(end) - new Date(start);
            const mins = Math.floor(ms / 60000);
            const secs = Math.floor((ms % 60000) / 1000);
            if (mins > 0) return mins + ' min ' + secs + ' sec';
            return secs + ' seconds';
        }

        // ── Check In ──
        async function handleCheckIn() {
            const userId = document.getElementById('userId').value.trim();
            clearStatus();

            if (!userId) { showStatus('Please enter your name or ID', 'error'); return; }

            const btn = document.getElementById('btnCheckIn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span>';

            try {
                checkInTimestamp = new Date().toISOString();
                const response = await fetch('/api/checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userId, timestamp: checkInTimestamp })
                });
                const result = await response.json();

                if (response.ok) {
                    currentUser = userId;
                    document.getElementById('checkInTimeDisplay').textContent =
                        'Since ' + formatTime(checkInTimestamp);
                    document.getElementById('eventNameCheckedIn').textContent = eventNameText;
                    if (result.total) document.getElementById('attendeeCount').textContent = result.total;
                    showPhase('CheckedIn');
                } else {
                    showStatus(result.error, 'error');
                    btn.disabled = false;
                    btn.textContent = 'Check In';
                }
            } catch (err) {
                showStatus('Connection error. Please try again.', 'error');
                btn.disabled = false;
                btn.textContent = 'Check In';
            }
        }

        // ── Check Out ──
        async function handleCheckOut() {
            if (!currentUser) return;
            clearStatus();

            const btn = document.getElementById('btnCheckOut');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span>';

            try {
                const checkOutTimestamp = new Date().toISOString();
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser, timestamp: checkOutTimestamp })
                });
                const result = await response.json();

                if (response.ok) {
                    document.getElementById('doneUser').textContent = currentUser;
                    document.getElementById('doneCheckIn').textContent = formatTime(checkInTimestamp);
                    document.getElementById('doneCheckOut').textContent = formatTime(checkOutTimestamp);
                    document.getElementById('doneDuration').textContent =
                        calcDuration(checkInTimestamp, checkOutTimestamp);
                    if (result.total !== undefined) {
                        document.getElementById('attendeeCount').textContent = result.total;
                    }
                    showPhase('Done');
                } else {
                    showStatus(result.error, 'error');
                    btn.disabled = false;
                    btn.textContent = 'Check Out';
                }
            } catch (err) {
                showStatus('Connection error. Please try again.', 'error');
                btn.disabled = false;
                btn.textContent = 'Check Out';
            }
        }
    </script>
</body>
</html>
)rawliteral";

// ════════════════════════════════════════════════════════════════
// ROUTE HANDLERS
// ════════════════════════════════════════════════════════════════

void handleRoot() {
  webServer.send(200, "text/html", MAIN_PAGE);
}

void handleGetEvent() {
  StaticJsonDocument<256> doc;
  doc["eventId"]   = EVENT_ID;
  doc["eventType"] = EVENT_TYPE;
  doc["name"]      = EVENT_NAME;

  JsonObject timeWindow = doc.createNestedObject("timeWindow");
  timeWindow["start"] = TIME_START;
  timeWindow["end"]   = TIME_END;

  int activeCount = 0;
  for (int i = 0; i < recordCount; i++) {
    if (!records[i].checkedOut) activeCount++;
  }

  doc["attendeeCount"] = activeCount;
  doc["totalRecords"]  = recordCount;
  doc["uptime"]        = millis() / 1000;

  String json;
  serializeJson(doc, json);

  webServer.sendHeader("Access-Control-Allow-Origin", "*");
  webServer.send(200, "application/json", json);
}

void handleCheckIn() {
  if (webServer.method() == HTTP_OPTIONS) {
    webServer.sendHeader("Access-Control-Allow-Origin", "*");
    webServer.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    webServer.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    webServer.send(204);
    return;
  }

  String body = webServer.arg("plain");
  Serial.printf("[CHECK-IN] Received: %s\n", body.c_str());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    webServer.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  const char* userId    = doc["userId"];
  const char* timestamp = doc["timestamp"];

  if (!userId || strlen(userId) == 0) {
    webServer.send(400, "application/json", "{\"error\":\"userId is required\"}");
    return;
  }

  for (int i = 0; i < recordCount; i++) {
    if (records[i].oduserId == String(userId) && !records[i].checkedOut) {
      webServer.sendHeader("Access-Control-Allow-Origin", "*");
      webServer.send(409, "application/json", "{\"error\":\"Already checked in\"}");
      return;
    }
  }

  if (recordCount >= MAX_RECORDS) {
    webServer.send(507, "application/json", "{\"error\":\"Attendance storage full\"}");
    return;
  }

  records[recordCount].oduserId     = String(userId);
  records[recordCount].checkInTime  = String(timestamp ? timestamp : "unknown");
  records[recordCount].checkOutTime = "";
  records[recordCount].checkedOut   = false;
  recordCount++;

  Serial.printf("[CHECK-IN] ✅ %s checked in (Total: %d)\n", userId, recordCount);

  int activeCount = 0;
  for (int i = 0; i < recordCount; i++) {
    if (!records[i].checkedOut) activeCount++;
  }

  String response = "{\"message\":\"Checked in successfully! Welcome, " + String(userId) + "\",\"total\":" + String(activeCount) + "}";
  webServer.sendHeader("Access-Control-Allow-Origin", "*");
  webServer.send(200, "application/json", response);
}

void handleCheckOut() {
  if (webServer.method() == HTTP_OPTIONS) {
    webServer.sendHeader("Access-Control-Allow-Origin", "*");
    webServer.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    webServer.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    webServer.send(204);
    return;
  }

  String body = webServer.arg("plain");
  Serial.printf("[CHECK-OUT] Received: %s\n", body.c_str());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    webServer.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  const char* userId    = doc["userId"];
  const char* timestamp = doc["timestamp"];

  if (!userId || strlen(userId) == 0) {
    webServer.send(400, "application/json", "{\"error\":\"userId is required\"}");
    return;
  }

  bool found = false;
  for (int i = 0; i < recordCount; i++) {
    if (records[i].oduserId == String(userId) && !records[i].checkedOut) {
      found = true;
      records[i].checkedOut = true;
      records[i].checkOutTime = String(timestamp ? timestamp : "unknown");
      Serial.printf("[CHECK-OUT] ✅ %s checked out\n", userId);
      break;
    }
  }

  if (!found) {
    webServer.sendHeader("Access-Control-Allow-Origin", "*");
    webServer.send(404, "application/json", "{\"error\":\"User not checked in\"}");
    return;
  }

  int activeCount = 0;
  for (int i = 0; i < recordCount; i++) {
    if (!records[i].checkedOut) activeCount++;
  }

  String response = "{\"message\":\"Checked out successfully\",\"total\":" + String(activeCount) + "}";
  webServer.sendHeader("Access-Control-Allow-Origin", "*");
  webServer.send(200, "application/json", response);
}

void handleGetAttendance() {
  DynamicJsonDocument doc(8192);
  doc["eventId"]      = EVENT_ID;
  doc["eventName"]    = EVENT_NAME;
  doc["totalRecords"] = recordCount;

  int activeCount = 0;
  int checkedOutCount = 0;

  JsonArray arr = doc.createNestedArray("records");
  for (int i = 0; i < recordCount; i++) {
    JsonObject record = arr.createNestedObject();
    record["userId"]       = records[i].oduserId;
    record["checkInTime"]  = records[i].checkInTime;
    record["checkOutTime"] = records[i].checkOutTime;
    record["checkedOut"]   = records[i].checkedOut;

    if (records[i].checkedOut) checkedOutCount++;
    else activeCount++;
  }

  doc["activeCount"]     = activeCount;
  doc["checkedOutCount"] = checkedOutCount;

  String json;
  serializeJson(doc, json);

  webServer.sendHeader("Access-Control-Allow-Origin", "*");
  webServer.send(200, "application/json", json);
}

// ─── Captive Portal Handlers ───
void handleCaptivePortal() {
  Serial.printf("[PORTAL] Captive detect: %s\n", webServer.uri().c_str());
  webServer.sendHeader("Location", "http://192.168.4.1/");
  webServer.send(302, "text/html", "<html><body>Redirecting...</body></html>");
}

void handleAndroidDetect() {
  String host = webServer.hostHeader();
  Serial.printf("[PORTAL] Android/Samsung detect — Host: %s URI: %s\n", host.c_str(), webServer.uri().c_str());
  webServer.sendHeader("Location", "http://192.168.4.1/");
  webServer.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  webServer.send(302, "text/plain", "Portal");
}

void handleNotFound() {
  String uri = webServer.uri();
  String host = webServer.hostHeader();
  Serial.printf("[CATCH-ALL] Host: %s | URI: %s\n", host.c_str(), uri.c_str());

  if (uri.indexOf("generate_204") >= 0 || uri.indexOf("gen_204") >= 0 ||
      host.indexOf("connectivitycheck") >= 0 || host.indexOf("gstatic") >= 0 ||
      host.indexOf("samsung") >= 0) {
    webServer.sendHeader("Location", "http://192.168.4.1/");
    webServer.send(302, "text/plain", "Portal");
    return;
  }

  if (uri.indexOf("hotspot-detect") >= 0 || host.indexOf("apple") >= 0 ||
      host.indexOf("captive") >= 0) {
    webServer.sendHeader("Location", "http://192.168.4.1/");
    webServer.send(302, "text/plain", "redirect");
    return;
  }

  webServer.send(200, "text/html", MAIN_PAGE);
}

// ════════════════════════════════════════════════════════════════
// SETUP
// ════════════════════════════════════════════════════════════════

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n");
  Serial.println("════════════════════════════════════════");
  Serial.println("  ConnectCord Captive Portal v9.0");
  Serial.println("════════════════════════════════════════");

  Serial.println("\n[1/3] Setting up WiFi Access Point...");
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, netMask);
  WiFi.softAP(AP_SSID, AP_PASSWORD, 1, 0, 4);
  Serial.printf("       SSID: %s\n", AP_SSID);
  Serial.printf("       IP:   %s\n", WiFi.softAPIP().toString().c_str());

  Serial.println("\n[2/3] Starting DNS server...");
  dnsServer.start(DNS_PORT, "*", apIP);
  Serial.println("       All DNS queries → 192.168.4.1 ✅");

  Serial.println("\n[3/3] Starting web server...");

  webServer.on("/", HTTP_GET, handleRoot);
  webServer.on("/checkin", HTTP_GET, handleRoot);

  webServer.on("/api/event",      HTTP_GET,  handleGetEvent);
  webServer.on("/api/checkin",    HTTP_POST, handleCheckIn);
  webServer.on("/api/checkin",    HTTP_OPTIONS, handleCheckIn);
  webServer.on("/api/checkout",   HTTP_POST, handleCheckOut);
  webServer.on("/api/checkout",   HTTP_OPTIONS, handleCheckOut);
  webServer.on("/api/attendance", HTTP_GET,  handleGetAttendance);

  webServer.on("/generate_204",              HTTP_GET, handleAndroidDetect);
  webServer.on("/gen_204",                   HTTP_GET, handleAndroidDetect);
  webServer.on("/connectivity-check.html",   HTTP_GET, handleAndroidDetect);
  webServer.on("/hotspot-detect.html",       HTTP_GET, handleCaptivePortal);
  webServer.on("/library/test/success.html", HTTP_GET, handleCaptivePortal);
  webServer.on("/ncsi.txt",                  HTTP_GET, handleCaptivePortal);
  webServer.on("/connecttest.txt",           HTTP_GET, handleCaptivePortal);
  webServer.on("/canonical.html",            HTTP_GET, handleCaptivePortal);

  webServer.onNotFound(handleNotFound);

  webServer.begin();
  Serial.println("       Web server started ✅");

  Serial.println("\n════════════════════════════════════════");
  Serial.println("  CAPTIVE PORTAL v9.0 IS LIVE");
  Serial.println("════════════════════════════════════════");
  Serial.printf("  WiFi: %s\n", AP_SSID);
  Serial.printf("  URL:  http://%s/\n", WiFi.softAPIP().toString().c_str());
  Serial.println("  Waiting for connections...");
  Serial.println("════════════════════════════════════════\n");
}

// ════════════════════════════════════════════════════════════════
// MAIN LOOP
// ════════════════════════════════════════════════════════════════

unsigned long lastStatus = 0;

void loop() {
  dnsServer.processNextRequest();
  webServer.handleClient();

  if (millis() - lastStatus > 10000) {
    int activeCount = 0;
    for (int i = 0; i < recordCount; i++) {
      if (!records[i].checkedOut) activeCount++;
    }
    Serial.printf("[Status] Clients: %d | Active: %d | Total records: %d\n",
      WiFi.softAPgetStationNum(), activeCount, recordCount);
    lastStatus = millis();
  }
}
