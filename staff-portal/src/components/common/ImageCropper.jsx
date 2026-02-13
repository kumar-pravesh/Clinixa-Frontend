import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Utility to create an image element from a source
 */
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

/**
 * Utility to get the cropped image as a Blob
 */
async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
}

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleApply = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedBlob);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] md:h-auto">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Adjust Portrait</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Scale and position your profile picture</p>
                    </div>
                    <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative flex-1 bg-slate-50 min-h-[300px]">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        cropShape="rect"
                        showGrid={true}
                    />
                </div>

                <div className="p-8 space-y-8">
                    {/* Zoom Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zoom Level</span>
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 accent-primary h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
                            />
                            <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 h-14 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" /> Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
