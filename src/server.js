const { WebSocketServer } = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WarpLink WebSocket Server Active\n');
});

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ server });
const activeRooms = {};

wss.on('connection', (ws) => {
    let assignedRoomKey = null;

    ws.on('message', (message) => {
        try {
            const packet = JSON.parse(message);

            if (packet.type === 'join' && packet.roomId) {
                assignedRoomKey = packet.roomId;
                if (!activeRooms[assignedRoomKey]) {
                    activeRooms[assignedRoomKey] = [];
                }
                activeRooms[assignedRoomKey].push(ws);
                console.log(`User registered into room: ${assignedRoomKey}`);
            }

            if (packet.type === 'broadcast' && assignedRoomKey && activeRooms[assignedRoomKey]) {
                activeRooms[assignedRoomKey].forEach((client) => {
                    if (client !== ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify(packet));
                    }
                });
            }
        } catch (e) {}
    });

    ws.on('close', () => {
        if (assignedRoomKey && activeRooms[assignedRoomKey]) {
            activeRooms[assignedRoomKey] = activeRooms[assignedRoomKey].filter(client => client !== ws);
            if (activeRooms[assignedRoomKey].length === 0) {
                delete activeRooms[assignedRoomKey];
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`WarpLink Server executing on Port: ${PORT}`);
});
