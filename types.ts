
export enum BluetoothStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  SCANNING = 'SCANNING'
}

export enum MonoStatus {
  ON = 'ON',
  OFF = 'OFF',
  PENDING = 'PENDING'
}

export interface AudioState {
  isScoActive: boolean;
  mode: string;
  samplingRate: number;
}
