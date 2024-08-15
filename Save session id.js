const fs = require('fs');

function saveSessionId(sessionId) {
    fs.writeFileSync('./session.json', JSON.stringify(sessionId));
}

// Call this function after the QR code is scanned and the session ID is generated
saveSessionId(sessionId);
