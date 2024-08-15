const fs = require('fs');
const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");

async function startBotWithSession() {
    // Load the session ID from the file
    let sessionData = {};
    try {
        sessionData = JSON.parse(fs.readFileSync('./session.json', 'utf-8'));
    } catch (err) {
        console.error('Session file not found or invalid. Please scan the QR code.');
        return;
    }

    // Initialize the bot with the session data
    const { state, saveState } = await useSingleFileAuthState('./session.json');

    const bot = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
    });

    // Save credentials when they are updated
    bot.ev.on('creds.update', saveState);

    // Your bot event handlers and command logic here

    bot.ev.on('messages.upsert', async (chatUpdate) => {
        const message = chatUpdate.messages[0];
        if (!message.message) return;

        const messageContent = message.message.conversation || message.message.extendedTextMessage?.text || '';

        // Check if the message starts with the prefix (e.g., ".menu")
        if (messageContent.startsWith('.')) {
            const command = messageContent.slice(1).trim();
            if (command === 'menu') {
                await handleMenuCommand(bot, message);
            }
        }
    });
}

startBotWithSession();
async function handleMenuCommand(bot, message) {
    const commands = {
        help: 'Display the help menu',
        ping: 'Check bot response time',
        about: 'Learn more about this bot',
        // Add more commands as needed
    };

    let menuMessage = '📋 *Bot Commands* 📋\n\n';
    for (let command in commands) {
        menuMessage += `• *${command}*: ${commands[command]}\n`;
    }

    await bot.sendMessage(message.key.remoteJid, { text: menuMessage });
}
  
  
