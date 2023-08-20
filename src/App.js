import "./styles.css";
import React, {useRef, useState} from 'react';
import * as PoseDetector from '@tensorflow-models/pose-detection';
import {BlazePose, VideoPlayback, drawPose, MoveNetLoader} from "react-tfjs-models";

export default function App() {
    const [originalSize, setOriginalSize] = useState(null);
    const canvasRef = useRef(null);
    const videoPlaybackRef = useRef(null);
    const model = PoseDetector.SupportedModels.MoveNet;
    const keypointIndices = PoseDetector.util.getKeypointIndexBySide(model);
    const adjacentPairs = PoseDetector.util.getAdjacentPairs(model);
    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
    };
    const [videoSource, setVideoSource] = useState("/climbing.mp4");

    let isPoseShown = false;
    const onPoseEstimate = (pose) => {
        const ctx = canvasRef.current.getContext('2d');
        const canvas = canvasRef.current;
        if (!isPoseShown) {
            console.log(pose);
            console.log(originalSize);
            isPoseShown = true;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPose(pose,
            keypointIndices,
            adjacentPairs,
            ctx,
            {width: canvas.width, height: canvas.height},
            originalSize
        );
    };

    const setCanvas = (canvas) => {
        canvasRef.current = canvas;
        console.log(`Current size of canvas: ${canvas.width}x${canvas.height}`)
    };

    return (
        <VideoPlayback style={style} videoSource={videoSource} ref={videoPlaybackRef}
                       setCanvas={setCanvas} controlsEnabled={false}
                       setOriginalVideoSize={setOriginalSize}>
            <BlazePose
                backend='webgl'
                runtime='tfjs'
                type={PoseDetector.movenet.modelType.SINGLEPOSE_THUNDER}
                maxPoses={1}
                flipHorizontal={true}
                loader={MoveNetLoader}
                onPoseEstimate={onPoseEstimate}/>
        </VideoPlayback>
    );
}
