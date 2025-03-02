import { ChargingInfo } from 'types';

/**
 * Sends battery status messages to the service worker
 */
const sendMessageToServiceWorker = (type: string, data: ChargingInfo) => {
    void chrome.runtime.sendMessage({ type, data });
};

/**
 * Event listener for battery charging status changes
 */
const chargingListener = (e: Event) => {
    const battery = e.target as BatteryManager;
    sendMessageToServiceWorker('charging-change', { charging: battery.charging, level: battery.level });
};

/**
 * Initializes the battery monitoring
 * Sets up listeners for battery charging changes
 */
const init = async () => {
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            // Set up listener for charging state changes
            battery.onchargingchange = chargingListener;
        } else console.log('getBattery does not exist in navigator!');
    } catch (error) {
        console.error('Error initializing battery status:', error);
    }
};

// Initialize battery monitoring
void init();
