import {
    CONTEXT_TYPE_OFFSCREEN_DOCUMENT,
    NOT_CHARGING_NOTIFICATION_ID,
    IS_CHARGING_NOTIFICATION_ID,
    NOTIFICATION_TIMEOUT_MS,
    OFFSCREEN_EXISTS_MESSAGE,
} from 'utils/constants';
import { ChargingChangeMessage, ChargingInfo } from 'types';

/** Promise reference to track ongoing document creation */
let creating: Promise<void> | null = null;

/**
 * Checks if an offscreen document at the specified path already exists
 */
const offscreenDocumentExist = async (path: string) => {
    const offscreenUrl = chrome.runtime.getURL(path);
    const offscreenContexts = await chrome.runtime.getContexts({
        contextTypes: [CONTEXT_TYPE_OFFSCREEN_DOCUMENT],
        documentUrls: [offscreenUrl],
    });
    return !!offscreenContexts.length;
};

/**
 * Creates an offscreen document if it doesn't already exist.
 * Uses a lock mechanism to prevent multiple simultaneous creation attempts.
 */
const createOffscreenDocument = async (path: string) => {
    // Prevent multiple creation attempts
    if (creating) return;
    if (await offscreenDocumentExist(path)) return;

    creating = chrome.offscreen.createDocument({
        url: path,
        reasons: ['BATTERY_STATUS'],
        justification: 'Show notification when battery charging status changes',
    });

    try {
        await creating;
    } catch (error) {
        if (error instanceof Error && error.message === OFFSCREEN_EXISTS_MESSAGE)
            console.log('Offscreen document is already created.');
        else console.error('createOffscreenDocument > Error creating offscreen document:', error);
    } finally {
        creating = null;
    }
};

/** Reference to the timeout that will clear charging notifications */
let chargingNotificationTimeoutId: NodeJS.Timeout | null = null;

/**
 * Clears any pending timeout for charging notifications
 */
const clearChargingNotificationTimeout = () => {
    if (chargingNotificationTimeoutId) {
        clearTimeout(chargingNotificationTimeoutId);
        chargingNotificationTimeoutId = null;
    }
};

/**
 * Clears charging notifications and any associated timeouts
 */
const clearIsCharging = () => {
    chrome.notifications.clear(IS_CHARGING_NOTIFICATION_ID);
    clearChargingNotificationTimeout();
};

/**
 * Shows a notification when device starts charging
 * Automatically clears after NOTIFICATION_TIMEOUT_MS milliseconds
 */
const showChargingStartedNotification = (title: string, message: string, iconUrl: string) => {
    // Clear any existing not-charging notification
    chrome.notifications.clear(NOT_CHARGING_NOTIFICATION_ID);
    clearChargingNotificationTimeout();

    chrome.notifications.create(
        IS_CHARGING_NOTIFICATION_ID,
        {
            type: 'basic',
            iconUrl,
            title,
            message,
            priority: 2,
        },
        (id) => {
            chargingNotificationTimeoutId = setTimeout(() => {
                chrome.notifications.clear(id);
                chargingNotificationTimeoutId = null;
            }, NOTIFICATION_TIMEOUT_MS);
        },
    );
};

/**
 * Shows a persistent notification when device stops charging
 * Requires user interaction to dismiss
 */
const showChargingStoppedNotification = (title: string, message: string, iconUrl: string) => {
    clearIsCharging();
    chrome.notifications.create(NOT_CHARGING_NOTIFICATION_ID, {
        type: 'basic',
        iconUrl,
        title,
        message,
        priority: 2,
        requireInteraction: true,
    });
};

/**
 * Creates a notification when charging state changes
 */
const createChargingNotification = (title: string, message: string, iconUrl: string, charging: boolean) => {
    if (charging) showChargingStartedNotification(title, message, iconUrl);
    else showChargingStoppedNotification(title, message, iconUrl);
};

/**
 * Formats notification details based on battery status
 */
const getBatteryNotificationDetails = (chargingInfo: ChargingInfo) => {
    const { charging, level } = chargingInfo;
    const title = charging ? 'Battery is charging' : 'Battery is not charging';
    const batteryLevel = Math.round(level * 100);
    const msg = `Battery: ${batteryLevel}%`;
    const iconUrl = charging ? '../assets/icon-battery-charging.png' : '../assets/icon-battery-not-charging.png';
    return { title, msg, iconUrl, charging };
};

// Listen for messages from the offscreen document
chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
    // Verify message is from our extension
    if (!sender.id || sender.id !== chrome.runtime.id) return;

    const typedMessage = message as ChargingChangeMessage;

    if (typedMessage?.type === 'charging-change') {
        const { title, msg, iconUrl, charging } = getBatteryNotificationDetails(typedMessage.data);
        createChargingNotification(title, msg, iconUrl, charging);
    }
    sendResponse({ status: 'ok' });
});

/**
 * Initialize the offscreen document
 */
const initialize = async () => await createOffscreenDocument('offscreen/index.html');

// Set up event listeners for extension lifecycle events
chrome.runtime.onStartup.addListener(() => {
    void initialize();
});
chrome.runtime.onInstalled.addListener(() => {
    void initialize();
});

// Initial setup when service worker starts
void initialize();
