// app/(tabs)/index.tsx
//
// ════════════════════════════════════════════════════════════════
// ConnectCord — React Native Client
// ════════════════════════════════════════════════════════════════
//
// Flow:
//   1. User connects phone to ESP32's WiFi ("ConnectCord-EVT001")
//   2. App detects it's on the ESP32 network
//   3. App fetches event data from ESP32 (192.168.4.1)
//   4. App caches event data locally
//   5. User taps Check In
//   6. App tells user to reconnect to regular WiFi
//   7. App sends check-in to Express backend
//   8. Backend stores in MySQL
// ════════════════════════════════════════════════════════════════

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

// ════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════

// ESP32 is always at this IP when in AP mode
// This NEVER changes — it's hardcoded in the ESP32 firmware
const ESP32_URL = "http://192.168.4.1";

// Your Express backend — use your computer's local network IP
// Find with: ipconfig (Windows) or ifconfig (Mac)
const BACKEND_URL = "http://10.143.130.113:3000";

// Request timeout in milliseconds
const TIMEOUT_MS = 5000;

// Temporary user ID — replace with real auth in production
const USER_ID = "USER-001";

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

// Event data from the ESP32
interface EventData {
  eventId: string;
  eventType: string;
  name: string;
  timeWindow: {
    start: string;
    end: string;
  };
  attendeeCount?: number;
  uptime?: number;
}

// Tracks which phase of the flow we're in
type AppPhase =
  | "idle"           // Initial state — nothing happening
  | "scanning"       // Trying to reach ESP32
  | "event_found"    // Got event data from ESP32
  | "ready_to_send"  // User checked in on ESP32, ready to sync to backend
  | "syncing"        // Sending check-in to backend
  | "complete";      // All done!

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

// Convert JavaScript timestamp to MySQL format
// "2026-02-19T00:08:05.967Z" → "2026-02-19 00:08:05"
const toMySQLDateTime = (iso: string): string => {
  return iso.slice(0, 19).replace("T", " ");
};

// Fetch with timeout — prevents hanging forever
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export default function HomeScreen() {
  // ── State ──
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [event, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Step 1: Try to Reach ESP32 ──
  // This works ONLY when the phone is connected to the ESP32's WiFi.
  // If the phone is on regular WiFi, this will timeout.
  const scanForEvent = useCallback(async () => {
    console.log("[ConnectCord] Scanning for ESP32 portal...");
    setPhase("scanning");
    setError(null);
    setLoading(true);

    try {
      // Try to reach the ESP32's API endpoint
      const response = await fetchWithTimeout(`${ESP32_URL}/api/event`);

      if (!response.ok) {
        throw new Error(`ESP32 responded with status ${response.status}`);
      }

      // Parse the event data
      const data: EventData = await response.json();
      console.log("[ConnectCord] Event found:", data);

      // Cache the event data in state
      setEvent(data);
      setPhase("event_found");

    } catch (err: any) {
      console.log("[ConnectCord] ESP32 not reachable:", err.message);

      if (err.name === "AbortError") {
        setError(
          'Not connected to event WiFi.\n\nGo to Settings → WiFi and connect to "ConnectCord-EVT001"'
        );
      } else {
        setError(`Could not reach event portal: ${err.message}`);
      }
      setPhase("idle");

    } finally {
      setLoading(false);
    }
  }, []);

  // ── Step 2: Check In on ESP32 ──
  // Stores the check-in locally on the ESP32
  // This happens while still on the ESP32's WiFi
  const checkInOnESP32 = async () => {
    if (!event) return;
    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${ESP32_URL}/api/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Check-in failed on ESP32");
      }

      console.log("[ConnectCord] Checked in on ESP32:", result);

      // Move to next phase — ready to sync with backend
      setPhase("ready_to_send");

      Alert.alert(
        "✅ Checked In at Event!",
        "Now reconnect to your regular WiFi to sync with the server.\n\n" +
        'Go to Settings → WiFi → Connect to your regular network.',
        [{ text: "OK" }]
      );

    } catch (err: any) {
      console.error("[ConnectCord] ESP32 check-in error:", err.message);
      Alert.alert("Check-in Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Sync to Backend ──
  // Sends the check-in to Express backend over regular WiFi
  // This happens AFTER the user reconnects to regular WiFi
  const syncToBackend = async () => {
    if (!event) return;

    setPhase("syncing");
    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.eventId,
          userId: USER_ID,
          timestamp: toMySQLDateTime(new Date().toISOString()),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Backend sync failed");
      }

      console.log("[ConnectCord] Backend sync success:", result);

      setPhase("complete");
      Alert.alert(
        "✅ Synced!",
        "Your attendance has been recorded in the system."
      );

    } catch (err: any) {
      console.error("[ConnectCord] Backend sync error:", err.message);

      if (err.name === "AbortError") {
        Alert.alert(
          "Sync Failed",
          "Cannot reach the server. Make sure you're connected to regular WiFi (not the event WiFi)."
        );
      } else {
        Alert.alert("Sync Failed", err.message);
      }
      // Stay in ready_to_send so user can retry
      setPhase("ready_to_send");

    } finally {
      setLoading(false);
    }
  };

  // ── Reset ──
  const resetApp = () => {
    setPhase("idle");
    setEvent(null);
    setError(null);
    setLoading(false);
  };

  // ── Auto-scan on mount ──
  useEffect(() => {
    scanForEvent();
  }, [scanForEvent]);

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>📡 ConnectCord</Text>
      <Text style={styles.subtitle}>Event Attendance System</Text>

      {/* ── Phase: IDLE ── */}
      {/* Initial state or after reset */}
      {phase === "idle" && !error && (
        <View style={styles.card}>
          <Text style={styles.instructions}>
            To check in to an event:{"\n\n"}
            1️⃣  Connect to the event WiFi{"\n"}
            {"    "}(Look for "ConnectCord-..." in WiFi settings){"\n\n"}
            2️⃣  Come back to this app{"\n\n"}
            3️⃣  Tap the button below to detect the event
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanForEvent}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🔍 Detect Event</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: SCANNING ── */}
      {phase === "scanning" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.statusText}>Connecting to event portal...</Text>
        </View>
      )}

      {/* ── Error State ── */}
      {error && phase === "idle" && (
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={scanForEvent}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: EVENT FOUND ── */}
      {/* Show event details and Check In button */}
      {phase === "event_found" && event && (
        <View style={[styles.card, styles.eventCard]}>
          <Text style={styles.eventDetected}>📍 Event Detected!</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Event</Text>
            <Text style={styles.value}>{event.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{event.eventType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>{event.eventId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Window</Text>
            <Text style={styles.value}>
              {event.timeWindow.start} – {event.timeWindow.end}
            </Text>
          </View>
          {event.attendeeCount !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Attendees</Text>
              <Text style={styles.value}>{event.attendeeCount}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.checkInButton, loading && styles.disabledButton]}
            onPress={checkInOnESP32}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>✅ Check In</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: READY TO SEND ── */}
      {/* User checked in on ESP32, now needs to sync to backend */}
      {phase === "ready_to_send" && event && (
        <View style={[styles.card, styles.syncCard]}>
          <Text style={styles.syncTitle}>🟢 Checked In Locally!</Text>
          <Text style={styles.syncEvent}>{event.name}</Text>

          <View style={styles.syncInstructions}>
            <Text style={styles.syncStep}>
              📱 Reconnect to your regular WiFi
            </Text>
            <Text style={styles.syncStepDetail}>
              Settings → WiFi → Connect to your normal network
            </Text>
            <Text style={[styles.syncStep, { marginTop: 12 }]}>
              Then tap the button below to sync:
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.syncButton, loading && styles.disabledButton]}
            onPress={syncToBackend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🔄 Sync to Server</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: SYNCING ── */}
      {phase === "syncing" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.statusText}>Syncing with server...</Text>
        </View>
      )}

      {/* ── Phase: COMPLETE ── */}
      {phase === "complete" && event && (
        <View style={[styles.card, styles.completeCard]}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>All Done!</Text>
          <Text style={styles.completeMessage}>
            Your attendance at "{event.name}" has been recorded.
          </Text>

          <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
            <Text style={styles.buttonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },

  // ── Cards ──
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#E74C3C",
  },
  eventCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
  },
  syncCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  completeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
    alignItems: "center",
  },

  // ── Instructions ──
  instructions: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
    marginBottom: 20,
  },

  // ── Status ──
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },

  // ── Error ──
  errorText: {
    fontSize: 14,
    color: "#E74C3C",
    marginBottom: 12,
    lineHeight: 22,
  },

  // ── Event Details ──
  eventDetected: {
    fontSize: 20,
    fontWeight: "700",
    color: "#27AE60",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontWeight: "600",
    color: "#888",
  },
  value: {
    fontWeight: "600",
    color: "#1A1A2E",
  },

  // ── Sync Phase ──
  syncTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F39C12",
    marginBottom: 4,
  },
  syncEvent: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  syncInstructions: {
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  syncStep: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  syncStepDetail: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  // ── Complete Phase ──
  completeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#27AE60",
    marginBottom: 8,
  },
  completeMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },

  // ── Buttons ──
  scanButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  checkInButton: {
    backgroundColor: "#27AE60",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  syncButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#4A90D9",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  resetButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
