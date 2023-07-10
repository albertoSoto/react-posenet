import React from "react";
import "./styles.css";
// import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import {drawKeypoints, drawSkeleton} from "./utilities";

export default function App() {
    const videoID = "videoElementId";
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const detectWebcamFeed = async (posenet_model) => {
        const domElement = document.getElementById(videoID);
        if (
            domElement &&
            domElement.readyState === 4
        ) {
            // Get Video Properties
            const video = domElement.src;
            domElement.setAttribute('crossOrigin', 'anonymous');
            const videoWidth = domElement.videoWidth;
            const videoHeight = domElement.videoHeight;
            // Set video width
            if (videoRef.current){
                videoRef.current.width = videoWidth;
                videoRef.current.height = videoHeight;
            }
            // Make Estimation
            // console.log("here")
            // const pose = await posenet_model.estimateMultiplePoses(domElement);
            const pose = await posenet_model.estimateSinglePose(domElement);
            drawResult(pose, domElement, videoWidth, videoHeight, canvasRef);
        }
    };
    const runPosenet = async () => {
        const posenet_model = await posenet.load({
            inputResolution: {width: 640, height: 480},
            scale: 0.8
        });
        //
        setInterval(() => {
            detectWebcamFeed(posenet_model);
        }, 100);
    };
    runPosenet();
    const drawResult = (pose, video, videoWidth, videoHeight, canvas) => {
        if(canvas && canvas.current){
            const ctx = canvas.current.getContext("2d");
            canvas.current.width = videoWidth;
            canvas.current.height = videoHeight;
            if (ctx){
                drawKeypoints(pose["keypoints"], 0.6, ctx);
                drawSkeleton(pose["keypoints"], 0.7, ctx);
                // console.log("draw")
            }
        }
    };
    return (
        <div className="App">
            <header className="App-header">

                <video controls autoPlay={true}
                       id={videoID}
                       ref={videoRef}
                       src={"climbing.mp4"}
                       style={{
                           position: "absolute",
                           marginLeft: "auto",
                           marginRight: "auto",
                           left: 0,
                           right: 0,
                           textAlign: "center",
                           zindex: 9,
                           width: 640,
                           height: 480
                       }}
                >
                    {/*<source src="climbing.mp4" type="video/mp4"/>*/}
                </video>
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480
                    }}
                />
            </header>
        </div>
    );
}
