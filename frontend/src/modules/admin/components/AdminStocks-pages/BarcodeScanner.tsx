import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScanned: (barcode: string) => void;
    onClose: () => void;
}

// Supported barcode formats using library's constants
const VALID_BARCODE_FORMATS = [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8, 
    Html5QrcodeSupportedFormats.UPC_A, 
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODE_128, 
    Html5QrcodeSupportedFormats.CODE_39, 
    Html5QrcodeSupportedFormats.CODE_93, 
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.CODABAR
];

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanned, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [invalidAttempts, setInvalidAttempts] = useState(0);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    
    // Validate barcode format and content
    const validateBarcode = (barcode: string): boolean => {
        // Don't process the same barcode multiple times in quick succession
        if (barcode === lastScanned) {
            return false;
        }
        
        // Basic validation rules
        if (!barcode || barcode.length < 8) {
            console.log("Invalid barcode: too short");
            setInvalidAttempts(prev => prev + 1);
            return false;
        }
        
        // EAN-13 validation (most common retail barcode)
        if (barcode.length === 13 && /^\d{13}$/.test(barcode)) {
            // Check EAN-13 checksum
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
            }
            const checkDigit = (10 - (sum % 10)) % 10;
            if (parseInt(barcode[12]) !== checkDigit) {
                console.log("Invalid EAN-13 checksum");
                setInvalidAttempts(prev => prev + 1);
                return false;
            }
            return true;
        }
        
        // UPC-A validation
        if (barcode.length === 12 && /^\d{12}$/.test(barcode)) {
            // Check UPC-A checksum
            let sum = 0;
            for (let i = 0; i < 11; i++) {
                sum += parseInt(barcode[i]) * (i % 2 === 0 ? 3 : 1);
            }
            const checkDigit = (10 - (sum % 10)) % 10;
            if (parseInt(barcode[11]) !== checkDigit) {
                console.log("Invalid UPC-A checksum");
                setInvalidAttempts(prev => prev + 1);
                return false;
            }
            return true;
        }
        
        // Allow other numeric barcodes of reasonable length
        if (/^\d{8,14}$/.test(barcode)) {
            return true;
        }
        
        // Allow alphanumeric barcodes for CODE-128, CODE-39 etc.
        if (/^[A-Z0-9\-\.\/\+]{8,24}$/i.test(barcode)) {
            return true;
        }
        
        setInvalidAttempts(prev => prev + 1);
        return false;
    };

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
                            aspectRatio: 1.0,
                            /*formatsToSupport: VALID_BARCODE_FORMATS*/
                        },
                        (decodedText) => {
                            // Success callback
                            console.log("Scanned barcode:", decodedText);
                            
                            // Validate the barcode
                            if (validateBarcode(decodedText)) {
                                setLastScanned(decodedText);
                                onScanned(decodedText);
                                html5QrCode.stop();
                                onClose();
                            } else {
                                // If it's an invalid barcode, just log it and continue scanning
                                console.log("Invalid barcode format, continuing to scan...");
                                if (invalidAttempts > 3) {
                                    setError("Multiple invalid barcodes detected. Please ensure you're scanning a standard product barcode.");
                                }
                            }
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
                
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>Position the barcode in front of your camera</p>
                </div>
                
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