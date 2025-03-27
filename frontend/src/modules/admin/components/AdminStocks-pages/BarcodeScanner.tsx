import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScanned: (barcode: string) => void;
    onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanned, onClose }) => {
    const scannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scannerRef.current) return;

        const html5QrCode = new Html5Qrcode("qr-reader");

        const startScanning = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        onScanned(decodedText);
                        html5QrCode.stop();
                        onClose();
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            } catch (err) {
                console.error("Scanner initialization error:", err);
            }
        };

        startScanning();

        return () => {
            html5QrCode.stop().catch(err => {
                console.error("Failed to stop scanner:", err);
            });
        };
    }, [onScanned, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Scan Barcode</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div 
                    id="qr-reader"
                    ref={scannerRef}
                    className="w-full h-64 relative overflow-hidden rounded-md"
                />
                <p className="text-sm text-gray-500 mt-2">
                    Position the barcode in front of your camera
                </p>
            </div>
        </div>
    );
};