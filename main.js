document.addEventListener('DOMContentLoaded', () => {
    // 1. NAVIGATION TAB MANAGER
    const tabButtons = [
        document.getElementById('btn-host'),
        document.getElementById('btn-ext'),
        document.getElementById('btn-social')
    ];

    const panels = [
        document.getElementById('panel-host'),
        document.getElementById('panel-ext'),
        document.getElementById('panel-social')
    ];

    function switchTab(selectedIndex) {
        tabButtons.forEach(btn => { if (btn) btn.classList.remove('active'); });
        panels.forEach(pane => { if (pane) pane.classList.remove('active'); });

        if (tabButtons[selectedIndex]) tabButtons[selectedIndex].classList.add('active');
        if (panels[selectedIndex]) panels[selectedIndex].classList.add('active');
    }

    if (tabButtons[0]) tabButtons[0].addEventListener('click', () => switchTab(0));
    if (tabButtons[1]) tabButtons[1].addEventListener('click', () => switchTab(1));
    if (tabButtons[2]) tabButtons[2].addEventListener('click', () => switchTab(2));


    // 2. NATIVE BROWSER CLOUD WEBSOCKET HANDSHAKES
    let cloudSocket = null;
    const statusLog = document.getElementById('wl-status-log');

    function connectToCloudServer(roomId, roleName) {
        // 👑 RENDER LINK CONNECTION CONFIGURATION
        // Swap this text string out with your free Render app web link URL!
        const RENDER_BACKEND_URL = "wss://://onrender.com";

        if (cloudSocket) {
            cloudSocket.close();
        }

        if (statusLog) {
            statusLog.innerText = "Status: Connecting to cloud...";
            statusLog.style.color = "#f1c40f";
        }

        cloudSocket = new WebSocket(RENDER_BACKEND_URL);

        cloudSocket.onopen = () => {
            if (statusLog) {
                statusLog.innerText = `Status: Live! (${roleName})`;
                statusLog.style.color = "#2ecc71";
            }
            // Send our room activation data packet down the network line
            cloudSocket.send(JSON.stringify({ type: 'join', roomId: roomId }));
            alert(`🎉 Success! Connected to Render Cloud.\n\nRoom: ${roomId}\nRole: ${roleName}`);
        };

        cloudSocket.onmessage = (event) => {
            try {
                const incomingData = JSON.parse(event.data);
                console.log("[WarpLink Cloud] Arrived data tracking matrix block packet:", incomingData);
                
                // Live Simple3D vectors decoding data streams get captured right inside here!
            } catch (err) {}
        };

        cloudSocket.onclose = () => {
            if (statusLog) {
                statusLog.innerText = "Status: Disconnected";
                statusLog.style.color = "#e74c3c";
            }
        };

        cloudSocket.onerror = () => {
            alert("⚠️ Connection failed! Check that your Render server is live and running.");
            if (statusLog) {
                statusLog.innerText = "Status: Connection Error";
                statusLog.style.color = "#e74c3c";
            }
        };
    }

    // 3. WIRE BUTTON HOOKS STRAIGHT TO THE INPUT ELEMENT DATA FIELDS
    const roomInputField = document.getElementById('wl-room-input');
    const hostButtonAction = document.getElementById('wl-host-btn');
    const joinButtonAction = document.getElementById('wl-join-btn');

    if (hostButtonAction) {
        hostButtonAction.onclick = () => {
            const enteredCode = roomInputField ? roomInputField.value.trim() : '';
            if (!enteredCode) return alert("Please enter a room name first!");
            
            connectToCloudServer(enteredCode, "Host");
        };
    }

    if (joinButtonAction) {
        joinButtonAction.onclick = () => {
            const enteredCode = roomInputField ? roomInputField.value.trim() : '';
            if (!enteredCode) return alert("Please enter a room name first!");
            
            connectToCloudServer(enteredCode, "Joiner");
        };
    }
});
