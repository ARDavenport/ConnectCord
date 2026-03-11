// app/(tabs)/index.tsx
//
// ════════════════════════════════════════════════════════════════
// ConnectCord — React Native Client (Dark Theme)
// ════════════════════════════════════════════════════════════════
import { API_BASE_URL } from '../../constants/api';


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

const ESP32_URL = "http://192.168.4.1";
const BACKEND_URL = "http://10.143.204.109:3000"; // ← Update with your current IP
const TIMEOUT_MS = 5000;
const USER_ID = "USER-001";

// ════════════════════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════════════════════

const COLORS = {
  background: "#000000",
  card: "#1A1A1A",
  cardBorder: "#2A2A2A",
  primary: "#86b499",
  secondary: "#4ADE80",
  danger: "#E74C3C",
  warning: "#F39C12",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textMuted: "#666666",
  inputBg: "#1A1A1A",
  inputBorder: "#333333",
  divider: "#2A2A2A",
};

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

interface EventData {
  eventId: string;
  eventType: string;
  name: string;
  timeWindow: {
    start: string;
    end: string;
  };
  attendeeCount?: number;
  totalRecords?: number;
  uptime?: number;
}

interface AdminRecord {
  eventId: string;
  userId: string;
  checkInTime: string;
  checkOutTime: string;
  checkedOut: boolean;
}

type AppPhase =
  | "idle"
  | "scanning"
  | "event_found"
  | "checked_in"
  | "ready_to_send"
  | "syncing"
  | "admin_fetching"
  | "admin_ready"
  | "admin_syncing"
  | "complete";

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

const toMySQLDateTime = (iso: string): string => {
  if (!iso || iso === "unknown" || iso.length < 19) return iso;
  return iso.slice(0, 19).replace("T", " ");
};

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
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [event, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [cachedAdminRecords, setCachedAdminRecords] = useState<
    AdminRecord[] | null
  >(null);

  // ════════════════════════════════════════════════════════════
  // ATTENDEE FLOW
  // ════════════════════════════════════════════════════════════

  const scanForEvent = useCallback(async () => {
    setPhase("scanning");
    setError(null);
    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${ESP32_URL}/api/event`);
      if (!response.ok) throw new Error(`ESP32 responded with status ${response.status}`);

      const data: EventData = await response.json();
      setEvent(data);
      setPhase("event_found");
    } catch (err: any) {
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

  const checkInOnESP32 = async () => {
    if (!event) return;
    setLoading(true);

    try {
      const now = new Date().toISOString();
      const response = await fetchWithTimeout(`${ESP32_URL}/api/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, timestamp: now }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Check-in failed");

      setCheckInTime(now);
      setPhase("checked_in");
    } catch (err: any) {
      Alert.alert("Check-in Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOutOnESP32 = async () => {
    if (!event) return;
    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${ESP32_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Check-out failed");

      setPhase("ready_to_send");
      Alert.alert(
        "Checked Out",
        "Now reconnect to your regular WiFi to sync.",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      Alert.alert(
        "Check-out Failed",
        err.message + "\n\nSkip checkout and sync anyway?",
        [
          { text: "Retry", style: "cancel" },
          { text: "Skip & Sync", onPress: () => setPhase("ready_to_send") },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const syncToBackend = async () => {
    if (!event) return;
    setPhase("syncing");
    setLoading(true);

    try {
      const checkInResponse = await fetchWithTimeout(`${BACKEND_URL}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.eventId,
          userId: USER_ID,
          timestamp: toMySQLDateTime(checkInTime || new Date().toISOString()),
        }),
      });

      const checkInResult = await checkInResponse.json();
      if (!checkInResponse.ok) throw new Error(checkInResult.error || "Sync failed");

      await fetchWithTimeout(`${BACKEND_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.eventId,
          userId: USER_ID,
          timestamp: toMySQLDateTime(new Date().toISOString()),
        }),
      });

      setPhase("complete");
      Alert.alert("Synced!", "Your attendance has been recorded.");
    } catch (err: any) {
      if (err.name === "AbortError") {
        Alert.alert("Sync Failed", "Make sure you're on regular WiFi.");
      } else {
        Alert.alert("Sync Failed", err.message);
      }
      setPhase("ready_to_send");
    } finally {
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════
  // ADMIN FLOW
  // ════════════════════════════════════════════════════════════

  const adminFetchRecords = async () => {
    if (!event) return;
    setPhase("admin_fetching");
    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${ESP32_URL}/api/attendance`);
      if (!response.ok) throw new Error("Failed to fetch records");

      const data = await response.json();

      if (data.records.length === 0) {
        Alert.alert("No Records", "No attendance records on the ESP32.");
        setPhase("event_found");
        setLoading(false);
        return;
      }

      const cached: AdminRecord[] = data.records.map((r: any) => ({
        eventId: data.eventId,
        userId: r.userId,
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        checkedOut: r.checkedOut,
      }));

      setCachedAdminRecords(cached);
      setPhase("admin_ready");
      Alert.alert(
        `${cached.length} Records Found`,
        "Reconnect to regular WiFi to sync them.",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      Alert.alert("Error", err.message);
      setPhase("event_found");
    } finally {
      setLoading(false);
    }
  };

  const adminPushToBackend = async () => {
    if (!cachedAdminRecords || cachedAdminRecords.length === 0) return;
    setPhase("admin_syncing");
    setLoading(true);

    let successCount = 0;
    let failCount = 0;

    for (const record of cachedAdminRecords) {
      try {
        const checkInResponse = await fetchWithTimeout(`${BACKEND_URL}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: record.eventId,
            userId: record.userId,
            timestamp: toMySQLDateTime(record.checkInTime),
          }),
        });

        if (!checkInResponse.ok && checkInResponse.status !== 409) {
          failCount++;
          continue;
        }

        if (record.checkedOut && record.checkOutTime && record.checkOutTime !== "") {
          await fetchWithTimeout(`${BACKEND_URL}/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: record.eventId,
              userId: record.userId,
              timestamp: toMySQLDateTime(record.checkOutTime),
            }),
          });
        }

        successCount++;
      } catch {
        failCount++;
      }
    }

    setLoading(false);
    Alert.alert(
      "Sync Complete",
      `Synced: ${successCount}\nFailed: ${failCount}\nTotal: ${cachedAdminRecords.length}`
    );
    setCachedAdminRecords(null);
    setPhase("complete");
  };

  // ════════════════════════════════════════════════════════════
  // SHARED
  // ════════════════════════════════════════════════════════════

  const resetApp = () => {
    setPhase("idle");
    setEvent(null);
    setError(null);
    setLoading(false);
    setCheckInTime(null);
    setCachedAdminRecords(null);
  };

  useEffect(() => {
    scanForEvent();
  }, [scanForEvent]);

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CC</Text>
        </View>
        <Text style={styles.title}>ConnectCord</Text>
        <Text style={styles.subtitle}>Event Attendance</Text>
      </View>

      {/* ── Phase: IDLE ── */}
      {phase === "idle" && !error && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.instructions}>
            To check in to an event:{"\n\n"}
            1. Connect to the event WiFi{"\n"}
            {"   "}Look for "ConnectCord-..." in WiFi settings{"\n\n"}
            2. Come back to this app{"\n\n"}
            3. Tap the button below
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={scanForEvent}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Detect Event</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: SCANNING ── */}
      {phase === "scanning" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Connecting to event portal...</Text>
        </View>
      )}

      {/* ── Error State ── */}
      {error && phase === "idle" && (
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorTitle}>Connection Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={scanForEvent}>
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: EVENT FOUND ── */}
      {phase === "event_found" && event && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event Detected</Text>

          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>{event.eventType}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event ID</Text>
              <Text style={styles.detailValue}>{event.eventId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time Window</Text>
              <Text style={styles.detailValue}>
                {event.timeWindow.start} – {event.timeWindow.end}
              </Text>
            </View>
            {event.attendeeCount !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Active</Text>
                <Text style={styles.detailValue}>{event.attendeeCount}</Text>
              </View>
            )}
            {event.totalRecords !== undefined && (
              <View style={[styles.detailRow, styles.lastDetailRow]}>
                <Text style={styles.detailLabel}>Total Records</Text>
                <Text style={styles.detailValue}>{event.totalRecords}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={checkInOnESP32}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Check In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, loading && styles.disabledButton]}
            onPress={adminFetchRecords}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.outlineButtonText}>
                Admin: Sync All Records
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: CHECKED IN ── */}
      {phase === "checked_in" && event && (
        <View style={styles.card}>
          <View style={styles.statusBanner}>
            <View style={styles.statusDot} />
            <Text style={styles.statusTitle}>You're Checked In</Text>
            <Text style={styles.statusTime}>
              Since{" "}
              {checkInTime
                ? new Date(checkInTime).toLocaleTimeString()
                : "now"}
            </Text>
          </View>

          <Text style={styles.eventNameSmall}>{event.name}</Text>

          <Text style={styles.hintText}>
            When you're ready to leave, tap Check Out.{"\n"}
            You must still be on the event WiFi.
          </Text>

          <TouchableOpacity
            style={[styles.dangerButton, loading && styles.disabledButton]}
            onPress={checkOutOnESP32}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Check Out</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: READY TO SEND ── */}
      {phase === "ready_to_send" && event && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ready to Sync</Text>
          <Text style={styles.eventNameSmall}>{event.name}</Text>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionStep}>
              1. Reconnect to your regular WiFi
            </Text>
            <Text style={styles.instructionDetail}>
              Settings → WiFi → Your normal network
            </Text>
            <Text style={[styles.instructionStep, { marginTop: 12 }]}>
              2. Tap the button below to sync
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={syncToBackend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Sync to Server</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: SYNCING ── */}
      {phase === "syncing" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Syncing with server...</Text>
        </View>
      )}

      {/* ── Phase: ADMIN FETCHING ── */}
      {phase === "admin_fetching" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching records from ESP32...</Text>
        </View>
      )}

      {/* ── Phase: ADMIN READY ── */}
      {phase === "admin_ready" && cachedAdminRecords && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Records Cached</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Records</Text>
              <Text style={styles.detailValue}>
                {cachedAdminRecords.length}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Checked Out</Text>
              <Text style={styles.detailValue}>
                {cachedAdminRecords.filter((r) => r.checkedOut).length}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Still Active</Text>
              <Text style={styles.detailValue}>
                {cachedAdminRecords.filter((r) => !r.checkedOut).length}
              </Text>
            </View>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionStep}>
              1. Reconnect to your regular WiFi
            </Text>
            <Text style={styles.instructionDetail}>
              Settings → WiFi → Your normal network
            </Text>
            <Text style={[styles.instructionStep, { marginTop: 12 }]}>
              2. Tap below to sync all records
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={adminPushToBackend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Sync All ({cachedAdminRecords.length} records)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Phase: ADMIN SYNCING ── */}
      {phase === "admin_syncing" && (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Syncing records to server...</Text>
          {cachedAdminRecords && (
            <Text style={styles.loadingSubtext}>
              {cachedAdminRecords.length} records
            </Text>
          )}
        </View>
      )}

      {/* ── Phase: COMPLETE ── */}
      {phase === "complete" && (
        <View style={styles.card}>
          <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>✓</Text>
            <Text style={styles.completeTitle}>All Done</Text>
            <Text style={styles.completeMessage}>
              {event
                ? `Attendance for "${event.name}" has been recorded.`
                : "All records have been synced to the server."}
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={resetApp}>
            <Text style={styles.primaryButtonText}>Start Over</Text>
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
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    fontStyle: "italic",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // ── Card ──
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  errorCard: {
    borderColor: COLORS.danger,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },

  // ── Event Header ──
  eventHeader: {
    marginBottom: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  eventBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ── Details ──
  detailsContainer: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  // ── Status Banner (Checked In) ──
  statusBanner: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  eventNameSmall: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },

  hintText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  // ── Instruction Box ──
  instructionBox: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  instructionStep: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  instructionDetail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // ── Instructions (Idle) ──
  instructions: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  // ── Error ──
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.danger,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },

  // ── Loading ──
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  // ── Complete ──
  completeContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
  },
  completeEmoji: {
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.primary,
    width: 80,
    height: 80,
    lineHeight: 80,
    textAlign: "center",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 16,
    overflow: "hidden",
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  completeMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // ── Buttons ──
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
});