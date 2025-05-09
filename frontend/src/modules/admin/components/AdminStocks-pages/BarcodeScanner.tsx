import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScanned: (barcode: string) => void;
    onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanned, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const scannerId = "qr-reader";
        
        // Make sure we have the DOM element
        if (!document.getElementById(scannerId)) {
            return;
        }

        setIsLoading(true);
        setError(null);
        
        // Create the scanner instance
        const html5QrCode = new Html5Qrcode(scannerId);
        html5QrCodeRef.current = html5QrCode;

        // Get available cameras
        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    // Select the rear camera if available
                    const rearCamera = devices.find(device => 
                        device.label.toLowerCase().includes('back') || 
                        device.label.toLowerCase().includes('rear'));
                    
                    const cameraId = rearCamera ? rearCamera.id : devices[0].id;
                    
                    // Start scanning
                    return html5QrCode.start(
                        cameraId,
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0
                        },
                        (decodedText) => {
                            // Success callback
                            console.log("Scanned barcode:", decodedText);
                            onScanned(decodedText);
                            html5QrCode.stop();
                            onClose();
                        },
                        (errorMessage) => {
                            // Just log the errors but don't update state to avoid too many re-renders
                            console.log("QR scan error:", errorMessage);
                        }
                    );
                } else {
                    throw new Error("No cameras found on this device");
                }
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Scanner error:", err);
                setError(err.toString());
                setIsLoading(false);
            });

        // Cleanup function
        return () => {
            if (html5QrCodeRef.current && 
                html5QrCodeRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
                html5QrCodeRef.current.stop()
                    .catch(err => console.error("Failed to stop scanner:", err));
            }
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
                
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                )}
                
                {error && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                        <p>Error: {error}</p>
                        <p className="text-sm">Please make sure to allow camera access.</p>
                    </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                    Position the barcode in front of your camera
                </p>
                
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};