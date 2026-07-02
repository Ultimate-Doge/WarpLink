(function() {
    'use strict';
    
    // Check if the UI is already loaded to prevent duplicate windows
    if (document.getElementById('wl-injected-studio-box')) return;

    console.log("[WarpLink] Initializing single-room collaborative editor...");

    // 🎨 1. INJECT YOUR EXACT THEME BOX SPECIFICATIONS
    const uiWrapper = document.createElement('div');
    uiWrapper.id = "wl-injected-studio-box";
    uiWrapper.style.position = "fixed";
    uiWrapper.style.bottom = "20px";
    uiWrapper.style.right = "20px";
    uiWrapper.style.zIndex = "999999";

    // Your exact signature 5px solid red border and 270x465 dark theme panel layout
    uiWrapper.innerHTML = `
        <div style="border: 5px solid #ff4d4d; width: 278px; height: 473px; display: flex; justify-content: center; align-items: center; background: #2d2d2d; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 10px;">
            <div style="width: 270px; height: 465px; background: #1f1f1f; border-radius: 10px; padding: 24px 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-top: 10px;">
                    <h2 style="font-size: 28px; color: #ffffff !important; margin-bottom: 8px; font-weight: bold; line-height: 1.2;">WarpLink</h2>
                    <p style="font-size: 13px; color: #d8d8d8; line-height: 1.4;">Collaborative editor studio. Connected automatically to your private shared room.</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; align-items: center;">
                    <span style="font-size: 11px; color: #ff4d4d; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; display: block; width: 100%;">Multiplayer Link State</span>
                    <div id="wl-status-log" style="font-size: 13px; font-weight: bold; text-align: center; color: #f1c40f; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; width: 100%; border: 1px solid #223142; box-sizing: border-box;">Status: Connecting...</div>
                </div>
                
                <div style="font-size: 10px; color: #a0aec0; text-align: center; margin-bottom: 10px;">
                    WarpLink Serverless Peer-to-Peer Gateway
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(uiWrapper);

    // =========================================================================
    // 👑 2. AUTOMATIC PRIVATE SINGLE-ROOM NETWORK ENGINE
    // =========================================================================
    let cloudSocket = null;
    const statusLog = document.getElementById('wl-status-log');
    
    // Generate a completely randomized unique identifier string for this session's mouse tracking
    const deviceSessionId = 'user-' + Math.floor(Math.random() * 100000);
    // Assign a random bright neon color vector for this player's visual mouse cursor pointer
    const assignedCursorColor = ['#ff4d4d', '#2ecc71', '#00d2ff', '#e91e63', '#f1c40f'][Math.floor(Math.random() * 5)];

    function bootAutomaticCloudTunnel() {
        // 👑 UPDATE THIS: Paste your running Render link handle here (use wss:// instead of https://)
        const BACKEND_URL = "wss://://onrender.com";

        if (statusLog) {
            statusLog.innerText = "Status: Tuning data line...";
            statusLog.style.color = "#f1c40f";
        }

        cloudSocket = new WebSocket(RENDER_BACKEND_URL);

        cloudSocket.onopen = () => {
            if (statusLog) {
                statusLog.innerText = "Status: Connected Live!";
                statusLog.style.color = "#2ecc71";
            }
            
            // 👑 FIXED SINGLE ROOM KEY: Instantly forces both browsers into the exact same shared channel block
            cloudSocket.send(JSON.stringify({ type: 'join', roomId: 'master-studio-sync-room' }));
            
            // Turn on real-time event trackers
            initializeEditorCollaboration();
        };

        cloudSocket.onclose = () => {
            if (statusLog) {
                statusLog.innerText = "Status: Reconnecting...";
                statusLog.style.color = "#e74c3c";
            }
            setTimeout(bootAutomaticCloudTunnel, 3000);
        };
    }

    function initializeEditorCollaboration() {
        // 🖐️ Broadcast visual mouse movements natively across the shared room channel
        document.addEventListener('mousemove', (event) => {
            if (cloudSocket && cloudSocket.readyState === WebSocket.OPEN) {
                cloudSocket.send(JSON.stringify({
                    type: 'broadcast',
                    action: 'mouse_move',
                    userId: deviceSessionId,
                    userColor: assignedCursorColor,
                    mouseX: event.clientX,
                    mouseY: event.clientY
                }));
            }
        });

        // Event-triggered blocks click captures with zero loop overhead lag
        document.addEventListener('click', (event) => {
            const targetElement = event.target;
            if (targetElement.closest('.blocklyDraggable') || targetElement.closest('.blocklyBlockCanvas')) {
                if (cloudSocket && cloudSocket.readyState === WebSocket.OPEN) {
                    cloudSocket.send(JSON.stringify({
                        type: 'broadcast',
                        action: 'block_update',
                        userId: deviceSessionId,
                        targetId: targetElement.id || 'unknown-block'
                    }));
                }
            }
        });

        // Catch incoming socket signals and draw friend's custom circle mouse pointer box
        cloudSocket.onmessage = (event) => {
            try {
                const packet = JSON.parse(event.data);
                if (packet.type !== 'broadcast' || packet.userId === deviceSessionId) return;

                if (packet.action === 'mouse_move') {
                    let remoteCursor = document.getElementById('cursor-' + packet.userId);
                    if (!remoteCursor) {
                        remoteCursor = document.createElement('div');
                        remoteCursor.id = 'cursor-' + packet.userId;
                        remoteCursor.style.position = 'fixed';
                        remoteCursor.style.width = '14px';
                        remoteCursor.style.height = '14px';
                        remoteCursor.style.borderRadius = '50%';
                        remoteCursor.style.zIndex = '9999999';
                        remoteCursor.style.pointerEvents = 'none';
                        document.body.appendChild(remoteCursor);
                    }
                    remoteCursor.style.background = packet.userColor;
                    remoteCursor.style.left = packet.mouseX + 'px';
                    remoteCursor.style.top = packet.mouseY + 'px';
                }
            } catch (err) {}
        };
    }

    // Run the automatic cloud tunnel handshake natively on execution pass
    bootAutomaticCloudTunnel();
})();
