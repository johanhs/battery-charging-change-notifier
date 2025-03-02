export interface ChargingChangeMessage {
    type: string;
    target: string;
    data: ChargingInfo;
}

export interface ChargingInfo {
    charging: boolean;
    level: number;
}

declare global {
    interface BatteryManager extends EventTarget {
        charging: boolean;
        chargingTime: number;
        dischargingTime: number;
        level: number;
        onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
        onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
        ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
        onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
    }

    interface Navigator {
        getBattery?: () => Promise<BatteryManager>;
    }
}
