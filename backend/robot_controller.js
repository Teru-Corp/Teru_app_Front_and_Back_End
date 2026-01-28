const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// CONFIGURATION: Update these paths for your specific Pi setup!
// You can find them by running `ls /dev/ttyUSB*` on the Pi.
const PORTS = {
    NECK: '/dev/ttyUSB0',   // Adjust these
    EYE_L: '/dev/ttyUSB1',
    EYE_R: '/dev/ttyUSB2'
};
const BAUD_RATE = 115200; // Standard for ESP32

const connections = {};

function init() {
    Object.keys(PORTS).forEach(key => {
        const path = PORTS[key];
        try {
            const port = new SerialPort({ path, baudRate: BAUD_RATE, autoOpen: false });

            port.open((err) => {
                if (err) {
                    console.log(`[ROBOT] Could not open ${key} on ${path}:`, err.message);
                    // We don't crash, just log. Robot might not be connected yet.
                } else {
                    console.log(`[ROBOT] Connected to ${key} (${path})`);
                }
            });

            port.on('error', (err) => console.log(`[ROBOT] Error on ${key}:`, err.message));

            connections[key] = port;
        } catch (e) {
            console.log(`[ROBOT] Failed to initialize ${key}:`, e.message);
        }
    });
}

// Send a command to ALL connected parts
function broadcast(command) {
    const message = `${command}\n`; // Add newline for Readline parser on ESP32
    console.log(`[ROBOT] Broadcasting: ${command}`);

    Object.values(connections).forEach(port => {
        if (port.isOpen) {
            port.write(message, (err) => {
                if (err) console.log('[ROBOT] Write error:', err.message);
            });
        }
    });
}

function updateRobotExpression(weather) {
    let command = "NEUTRAL";

    if (weather.condition === 'Sunny') command = "HAPPY";
    if (weather.condition === 'Rainy') command = "SAD";
    if (weather.condition === 'Stormy') command = "STRESSED";
    if (weather.condition === 'Cloudy') command = "NEUTRAL";

    broadcast(command);
}

module.exports = { init, updateRobotExpression };
