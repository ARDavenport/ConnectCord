// app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

// ─── Types ───
interface TimeWindow {
  start: string;
  end: string;
}

interface EventData {
  eventId: string;
  eventType: string;
  name: string;
  timeWindow: TimeWindow;
  deviceIP?: string;
  uptime?: number;
}

interface CheckInPayload {
  eventId: string;
  userId: string;
  timestamp: string;
}

// ─── Configuration ───
// TODO: Replace with mDNS discovery or config file
const ESP32_BASE_URL = "http://10.143.138.87";
const BACKEND_BASE_URL = "http://10.143.130.113:3000"; // Your backend machine IP
const FETCH_TIMEOUT_MS = 5000;
const USER_ID = "USER-001"; // TODO: Replace with actual auth

// ─── Timeout wrapper for fetch ───
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = FETCH_TIMEOUT_MS
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

export default function HomeScreen() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);

  // ─── Detect Event from ESP32 ───
  const detectEvent = useCallback(async () => {
    console.log("[ConnectCord] Scanning for event beacon...");
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithTimeout(`${ESP32_BASE_URL}/event`);

      if (!response.ok) {
        throw new Error(`ESP32 responded with status ${response.status}`);
      }

      const data: EventData = await response.json();
      console.log("[ConnectCord] Event detected:", data);

      setEvent(data);
      setCheckedIn(false); // Reset check-in state for new detection
    } catch (err: any) {
      console.error("[ConnectCord] Detection failed:", err.message);

      if (err.name === "AbortError") {
        setError("ESP32 beacon not reachable (timeout). Are you on the same network?");
      } else {
        setError(`Could not detect event: ${err.message}`);
      }
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Check In via Backend ───
  const handleCheckIn = async () => {
    if (!event) return;

    setCheckInLoading(true);

    const payload: CheckInPayload = {
      eventId: event.eventId,
      userId: USER_ID,
      timestamp: new Date().toISOString(),
    };

    console.log("[ConnectCord] Sending check-in:", payload);

    try {
      const response = await fetchWithTimeout(
        `${BACKEND_BASE_URL}/checkin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Check-in failed");
      }

      const result = await response.json();
      console.log("[ConnectCord] Check-in success:", result);

      setCheckedIn(true);
      Alert.alert("✅ Checked In", `You're checked in to ${event.name}`);
    } catch (err: any) {
      console.error("[ConnectCord] Check-in error:", err.message);
      Alert.alert("Check-in Failed", err.message);
    } finally {
      setCheckInLoading(false);
    }
  };

  // ─── Check Out via Backend ───
  const handleCheckOut = async () => {
    if (!event) return;

    setCheckInLoading(true);

    try {
      const response = await fetchWithTimeout(
        `${BACKEND_BASE_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.eventId,
            userId: USER_ID,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Check-out failed");
      }

      console.log("[ConnectCord] Check-out success");
      setCheckedIn(false);
      setEvent(null);
      Alert.alert("👋 Checked Out", "You've been checked out successfully.");
    } catch (err: any) {
      console.error("[ConnectCord] Check-out error:", err.message);
      Alert.alert("Check-out Failed", err.message);
    } finally {
      setCheckInLoading(false);
    }
  };

  useEffect(() => {
    detectEvent();
  }, [detectEvent]);

  // ─── Render ───
  return (
    <View style={styles.container}>
      <Text style={styles.title}> ConnectCord</Text>
      <Text style={styles.subtitle}>Event Presence Detection</Text>

      {/* Loading State */}
      {loading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.statusText}>Scanning for event beacon...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={[styles.statusCard, styles.errorCard]}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={detectEvent}>
            <Text style={styles.buttonText}>Retry Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Event Detected */}
      {event && !loading && (
        <View style={styles.eventCard}>
          <Text style={styles.eventDetected}>📍 Event Detected</Text>

          <View style={styles.eventDetail}>
            <Text style={styles.label}>Event</Text>
            <Text style={styles.value}>{event.name}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{event.eventType}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>{event.eventId}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Text style={styles.label}>Window</Text>
            <Text style={styles.value}>
              {event.timeWindow.start} – {event.timeWindow.end}
            </Text>
          </View>

          {/* Action Buttons */}
          {!checkedIn ? (
            <TouchableOpacity
              style={[styles.checkInButton, checkInLoading && styles.disabledButton]}
              onPress={handleCheckIn}
              disabled={checkInLoading}
            >
              {checkInLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>✅ Check In</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.checkedInBadge}>🟢 You are checked in</Text>
              <TouchableOpacity
                style={[styles.checkOutButton, checkInLoading && styles.disabledButton]}
                onPress={handleCheckOut}
                disabled={checkInLoading}
              >
                {checkInLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>👋 Check Out</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Rescan */}
          <TouchableOpacity style={styles.rescanButton} onPress={detectEvent}>
            <Text style={styles.rescanText}>🔄 Rescan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* No Event, No Error */}
      {!event && !error && !loading && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>No event beacon detected.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={detectEvent}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
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
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 14,
    color: "#E74C3C",
    marginBottom: 12,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventDetected: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#27AE60",
  },
  eventDetail: {
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
  checkInButton: {
    backgroundColor: "#27AE60",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  checkOutButton: {
    backgroundColor: "#E67E22",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  checkedInBadge: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#27AE60",
  },
  retryButton: {
    backgroundColor: "#4A90D9",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  rescanButton: {
    alignItems: "center",
    marginTop: 16,
  },
  rescanText: {
    color: "#4A90D9",
    fontWeight: "600",
  },
});