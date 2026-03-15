import React, { useRef, useState } from 'react';

// Generates snap points from -1 to 1 (20 steps)
const SNAP_POINTS = Array.from({ length: 20 }, (_, i) => -1 + (i * 2) / 19);

interface EmotionalGridProps {
    onValueChange: (x: number, y: number) => void;
}

export default function EmotionalGrid({ onValueChange }: EmotionalGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dotPos, setDotPos] = useState({ x: 50, y: 50 }); // in percentages
    const [isDragging, setIsDragging] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 }); // -1 to 1

    const snap = (val: number) => {
        return SNAP_POINTS.reduce((prev, curr) =>
            Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
        );
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        updatePosition(e.clientX, e.clientY, false);
        // Capture pointer so dragging out of bounds doesn't lose focus
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX, e.clientY, false);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        updatePosition(e.clientX, e.clientY, true);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const updatePosition = (clientX: number, clientY: number, doSnap: boolean) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate raw percentage
        let percX = (clientX - rect.left) / rect.width;
        let percY = (clientY - rect.top) / rect.height;

        // Clamp between 0 and 1
        percX = Math.max(0, Math.min(1, percX));
        percY = Math.max(0, Math.min(1, percY));

        // Convert to -1 to 1 range
        let rawX = percX * 2 - 1;
        let rawY = -(percY * 2 - 1); // Invert Y

        if (doSnap) {
            rawX = snap(rawX);
            rawY = snap(rawY);

            // Convert back to percentage for rendering
            percX = (rawX + 1) / 2;
            percY = 1 - (rawY + 1) / 2;

            setCoords({ x: rawX, y: rawY });
            onValueChange(rawX, rawY);
        }

        setDotPos({ x: percX * 100, y: percY * 100 });
    };

    // Compute background color based on position
    const getBackgroundColor = () => {
        const x = coords.x;
        // Approximating the interpolation: left=purple, right=yellow, middle=greyish
        // In actual implementation we can use a CSS gradient that moves, but simple color is fine.
        if (x < -0.3) return 'rgba(167, 139, 250, 0.2)'; // purple
        if (x > 0.3) return 'rgba(251, 191, 36, 0.2)'; // yellow
        return 'rgba(243, 244, 246, 0.1)'; // lighter grey
    };

    return (
        <div className="grid-wrapper">
            <div
                className="grid-container"
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    backgroundColor: getBackgroundColor(),
                    touchAction: 'none' // Important to prevent scrolling while dragging
                }}
            >
                <span className="grid-label-abs top">High Energy</span>
                <span className="grid-label-abs bottom">Low Energy</span>
                <div className="grid-labels-x">
                    <span className="grid-label">Negative</span>
                    <span className="grid-label">Positive</span>
                </div>

                <div className="axis-x" />
                <div className="axis-y" />

                <div
                    className={`grid-dot ${isDragging ? 'dragging' : ''}`}
                    style={{
                        left: `${dotPos.x}%`,
                        top: `${dotPos.y}%`
                    }}
                />
            </div>

            <div className="status-text">
                Feeling: {coords.x.toFixed(2)} | Energy: {coords.y.toFixed(2)}
            </div>
        </div>
    );
}
