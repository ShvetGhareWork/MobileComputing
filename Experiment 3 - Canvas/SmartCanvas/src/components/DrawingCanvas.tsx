import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, PanResponder, GestureResponderEvent } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    SkPath,
    SkImage,
    useCanvasRef,
} from '@shopify/react-native-skia';

interface DrawingCanvasProps {
    color: string;
    strokeWidth: number;
    tool: 'pen' | 'eraser';
}

export interface DrawingCanvasRef {
    clear: () => void;
    undo: () => void;
    redo: () => void;
    getSnapshot: () => Promise<SkImage | null>;
}

interface PathData {
    path: SkPath;
    color: string;
    strokeWidth: number;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
    ({ color, strokeWidth, tool }, ref) => {
        const [paths, setPaths] = useState<PathData[]>([]);
        const [redoStack, setRedoStack] = useState<PathData[]>([]);
        const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
        const canvasRef = useCanvasRef();

        const panResponder = useRef(
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt: GestureResponderEvent) => {
                    const { locationX, locationY } = evt.nativeEvent;
                    const newPath = Skia.Path.Make();
                    newPath.moveTo(locationX, locationY);
                    setCurrentPath(newPath);
                },
                onPanResponderMove: (evt: GestureResponderEvent) => {
                    if (currentPath) {
                        const { locationX, locationY } = evt.nativeEvent;
                        // Native Event locationX/Y is relative to the view
                        const newRef = currentPath.copy();
                        newRef.lineTo(locationX, locationY);
                        setCurrentPath(newRef);
                    }
                },
                onPanResponderRelease: () => {
                    if (currentPath) {
                        const newPathData: PathData = {
                            path: currentPath,
                            color: tool === 'eraser' ? '#ffffff' : color,
                            strokeWidth: strokeWidth,
                        };
                        setPaths((prev) => [...prev, newPathData]);
                        setRedoStack([]);
                        setCurrentPath(null);
                    }
                },
                onPanResponderTerminate: () => {
                    setCurrentPath(null);
                }
            })
        ).current;

        useImperativeHandle(ref, () => ({
            clear: () => {
                setPaths([]);
                setRedoStack([]);
                setCurrentPath(null);
            },
            undo: () => {
                setPaths((prev) => {
                    if (prev.length === 0) return prev;
                    const newPaths = [...prev];
                    const removedPath = newPaths.pop();
                    if (removedPath) {
                        setRedoStack((prevRedo) => [...prevRedo, removedPath]);
                    }
                    return newPaths;
                });
            },
            redo: () => {
                setRedoStack((prev) => {
                    if (prev.length === 0) return prev;
                    const newRedo = [...prev];
                    const restoredPath = newRedo.pop();
                    if (restoredPath) {
                        setPaths((prevPaths) => [...prevPaths, restoredPath]);
                    }
                    return newRedo;
                });
            },
            getSnapshot: async () => {
                const image = canvasRef.current?.makeImageSnapshot();
                return image || null;
            },
        }));

        return (
            <View style={styles.container} {...panResponder.panHandlers}>
                <Canvas style={styles.canvas} ref={canvasRef} pointerEvents="none">
                    {paths.map((p, index) => (
                        <Path
                            key={index}
                            path={p.path}
                            color={p.color}
                            style="stroke"
                            strokeWidth={p.strokeWidth}
                            strokeCap="round"
                            strokeJoin="round"
                        />
                    ))}
                    {currentPath && (
                        <Path
                            path={currentPath}
                            color={tool === 'eraser' ? '#ffffff' : color}
                            style="stroke"
                            strokeWidth={strokeWidth}
                            strokeCap="round"
                            strokeJoin="round"
                        />
                    )}
                </Canvas>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    canvas: {
        flex: 1,
    },
});

export default DrawingCanvas;
