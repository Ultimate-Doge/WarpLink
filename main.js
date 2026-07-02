document.addEventListener('DOMContentLoaded', () => {
    let cloudSocket = null;
    const statusLog = document.getElementById('wl-status-log');
    const roomInputField = document.getElementById('wl-room-input');

    function connectToCloudServer(roomId, roleName) {
        // 👑 UPDATE THIS: Point this URL path to your free running Render Web Service url address!
        const RENDER_BACKEND_URL = "wss://://onrender.com";

        if (cloudSocket) {
            cloudSocket.close();
        }

        if (statusLog) {
            statusLog.innerText = "Status: Connecting to Render cloud...";
            statusLog.style.color = "#f1c40f";
        }

        cloudSocket = new WebSocket(RENDER_BACKEND_URL);

        cloudSocket.onopen = () => {
            if (statusLog) {
                statusLog.innerText = `Status: Live! (${roleName})`;
                statusLog.style.color = "#2ecc71";
            }
            // Fire the room activation payload package down the network pipeline
            cloudSocket.send(JSON.stringify({ type: 'join', roomId: roomId }));
            alert(`🎉 Connected to Render Cloud!\n\nRoom Node: ${roomId}\nRole Assignment: ${roleName}`);
        };

        cloudSocket.onmessage = (event) => {
            try {
                const incomingPacket = JSON.parse(event.data);
                console.log("[WarpLink Cloud] Received live room stream:", incomingPacket);
            } catch (err) {}
        };

        cloudSocket.onclose = () => {
            if (statusLog) {
                statusLog.innerText = "Status: Disconnected";
                statusLog.style.color = "#e74c3c";
            }
        };

        cloudSocket.onerror = () => {
            alert("⚠️ Connection dropped. Double-check that your Render background app is live and active!");
            if (statusLog) {
                statusLog.innerText = "Status: Connection Error";
                statusLog.style.color = "#e74c3c";
            }
        };
    }

    // Attach click events to your form handlers
    const hostBtn = document.getElementById('wl-host-btn');
    const joinBtn = document.getElementById('wl-join-btn');

    if (hostBtn) {
        hostBtn.onclick = () => {
            const code = roomInputField ? roomInputField.value.trim() : '';
            if (!code) return alert("Please specify a room key first!");
            connectToCloudServer(code, "Host Master");
        };
    }

    if (joinBtn) {
        joinBtn.onclick = () => {
            const code = roomInputField ? roomInputField.value.trim() : '';
            if (!code) return alert("Please specify a room key first!");
            connectToCloudServer(code, "Client Joiner");
        };
    }
});
