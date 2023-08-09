import React from "react";
import "./styles.css";

import * as PoseDetector from '@tensorflow-models/pose-detection';
import {BlazePose, VideoPlayback, drawPose, MoveNetLoader} from "react-tfjs-models";

export default function App() {
    // const videoID = "videoElementId";
    // const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const videoSource = "climbing.mp4";
    const model = PoseDetector.SupportedModels.MoveNet;
    const keypointIndices = PoseDetector.util.getKeypointIndexBySide(model);
    const adjacentPairs = PoseDetector.util.getAdjacentPairs(model);
    const setCanvas = (canvas) => {
        canvasRef.current = canvas;
    };
    const onPoseEstimate = (pose) => {
        const ctx = canvasRef.current.getContext('2d');
        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPose(pose, keypointIndices, adjacentPairs, ctx);
    };
    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
    };
    return (
        <VideoPlayback style={style} videoSource={videoSource}
                       setCanvas={setCanvas} controlsEnabled={true}>
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
