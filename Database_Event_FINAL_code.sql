-- Run this in MySQL to create the required table
CREATE DATABASE IF NOT EXISTS connectcord;
USE connectcord;

CREATE TABLE IF NOT EXISTS attendance (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    eventId      VARCHAR(50)  NOT NULL,
    userId       VARCHAR(50)  NOT NULL,
    checkInTime  DATETIME     NOT NULL,
    checkOutTime DATETIME     NULL,
    createdAt    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_event_user (eventId, userId),
    INDEX idx_active_checkin (eventId, userId, checkOutTime)
);

DESCRIBE attendance;
DROP TABLE attendance;
SELECT * FROM attendance;
DELETE FROM attendance;
