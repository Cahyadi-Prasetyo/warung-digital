'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type QRGeneratorProps = {
    productId: number;
    productName: string;
    uniqueCode: string;
};

export default function QRGenerator({ productId, productName, uniqueCode }: QRGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrGenerated, setQrGenerated] = useState(false);

    // Product URL for the QR code
    const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${uniqueCode}`;

    useEffect(() => {
        if (canvasRef.current) {
            // Generate QR code with medium size (256x256)
            QRCode.toCanvas(canvasRef.current, productUrl, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('Error generating QR code:', error);
                } else {
                    setQrGenerated(true);
                }
            });
        }
    }, [productUrl]);

    const handleDownload = () => {
        if (canvasRef.current) {
            // Convert canvas to blob and download
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `QR-${uniqueCode}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Link>
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">QR Code Generator</CardTitle>
                    <CardDescription>
                        Generate and download QR code for <span className="font-semibold text-gray-900">{productName}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                            <canvas ref={canvasRef} className="block" />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{productUrl}</code>
                            </p>
                            <p className="text-sm text-gray-600">
                                Unique Code: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{uniqueCode}</code>
                            </p>
                        </div>

                        <Button
                            onClick={handleDownload}
                            disabled={!qrGenerated}
                            className="w-full sm:w-auto"
                            size="lg"
                        >
                            <Download className="mr-2 h-4 w-4" /> Download QR Code (PNG)
                        </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                        <p className="font-semibold text-blue-900 mb-2">Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Click the download button to save the QR code as PNG</li>
                            <li>Print or share the QR code with your customers</li>
                            <li>When scanned, it will direct users to the product page</li>
                            <li>QR code size: 256x256 pixels (medium size)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
