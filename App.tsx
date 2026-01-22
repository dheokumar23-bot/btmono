
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BluetoothStatus, MonoStatus } from './types';

const App: React.FC = () => {
  // App States
  const [isOn, setIsOn] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true); // Simulated system state
  const [isDeviceConnected, setIsDeviceConnected] = useState(true); // Simulated system state
  const [toast, setToast] = useState<string | null>(null);
  
  // Timers
  const toastTimer = useRef<number | null>(null);

  // Show popup logic
  const showPopup = (msg: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  // Status derived from states
  const btStatusText = !isBluetoothEnabled ? "Bluetooth: Off" : isDeviceConnected ? "Bluetooth: Connected" : "Bluetooth: Not Connected";
  const monoStatusText = isOn ? "BT Mono: ON" : "BT Mono: OFF";

  // Toggle Action
  const handleToggle = useCallback(() => {
    if (!isOn) {
      // Logic for turning ON
      if (!isBluetoothEnabled) {
        showPopup("Please turn on Bluetooth first.");
        return;
      }
      if (!isDeviceConnected) {
        showPopup("Please connect a Bluetooth headset.");
        return;
      }

      // Success Path
      setIsOn(true);
      // Internal logic: Start foreground service, set audio mode, force routing
      console.log("Internal: AudioManager.setMode(MODE_IN_COMMUNICATION)");
      console.log("Internal: AudioManager.startBluetoothSco()");
    } else {
      // Logic for turning OFF
      setIsOn(false);
      // Internal logic: Stop service, restore mode
      console.log("Internal: AudioManager.setMode(MODE_NORMAL)");
      console.log("Internal: AudioManager.stopBluetoothSco()");
    }
  }, [isOn, isBluetoothEnabled, isDeviceConnected]);

  // Runtime Monitoring (Simulated Bluetooth disconnect)
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      // Randomly simulate a disconnect for demo if the app is "ON" (rarely)
      if (isOn && Math.random() < 0.01) {
        setIsDeviceConnected(false);
        setIsOn(false);
        showPopup("Bluetooth disconnected. BT Mono turned off.");
      }
    }, 5000);
    return () => clearInterval(monitorInterval);
  }, [isOn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-sans select-none overflow-hidden">
      
      {/* Main UI Container - Strict Minimalist */}
      <div className="w-full max-w-sm h-screen md:h-[800px] bg-zinc-950 flex flex-col relative md:rounded-[3rem] md:border md:border-zinc-800 shadow-2xl">
        
        {/* Android Status Bar (Static) */}
        <div className="h-10 w-full flex items-center px-8 justify-between text-[11px] text-zinc-500 pt-4">
          <span className="font-semibold tracking-wide">12:00</span>
          <div className="flex gap-2 items-center">
            <svg className="w-4 h-4 fill-zinc-600" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/></svg>
            <svg className="w-4 h-4 fill-zinc-400" viewBox="0 0 24 24"><path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/></svg>
          </div>
        </div>

        {/* Brand Header */}
        <div className="px-8 mt-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">BTmono</h1>
          <div className="flex flex-col mt-4 space-y-1">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
              {btStatusText}
            </span>
            <span className={`text-xs uppercase tracking-widest font-bold ${isOn ? 'text-blue-500' : 'text-zinc-700'}`}>
              {monoStatusText}
            </span>
          </div>
        </div>

        {/* Large Single Button Area */}
        <div className="flex-1 flex items-center justify-center p-12">
          <button
            onClick={handleToggle}
            className={`
              relative w-64 h-64 rounded-full flex flex-col items-center justify-center
              transition-all duration-300 active:scale-95 border-[12px]
              ${isOn 
                ? 'bg-blue-600 border-blue-400 shadow-[0_0_80px_rgba(37,99,235,0.3)]' 
                : 'bg-zinc-900 border-zinc-800 shadow-none'
              }
            `}
          >
            <div className={`
              w-4 h-4 rounded-full mb-4 transition-colors duration-500
              ${isOn ? 'bg-white animate-pulse' : 'bg-zinc-700'}
            `} />
            <span className="text-6xl font-black text-white">{isOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Bottom Bar Indicator */}
        <div className="h-20 w-full flex items-center justify-center opacity-20">
          <div className="w-32 h-1.5 bg-white rounded-full" />
        </div>

        {/* Popup (Toast) Overlay */}
        {toast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[80%] pointer-events-none">
            <div className="bg-zinc-800/95 backdrop-blur-md text-white text-sm py-3 px-6 rounded-2xl shadow-2xl text-center border border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
              {toast}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
