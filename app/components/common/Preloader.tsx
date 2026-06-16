'use client';

import Image from 'next/image';
import { usePreloader } from '../../contexts/PreloaderContext';

export function Preloader() {
    const { isLoading } = usePreloader();

    if (!isLoading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#020108',
                zIndex: 9999,
                animation: 'fadeOut 0.5s ease-in-out 1.5s forwards',
            }}
        >
            <style>{`

                @keyframes fadeOut {
                    from {
                        opacity:1;
                    }
                    to {
                        opacity:0;
                        pointer-events:none;
                    }
                }


                @keyframes orbit {
                    from {
                        transform:rotate(0deg);
                    }

                    to {
                        transform:rotate(360deg);
                    }
                }


                @keyframes pulse {
                    0%,100% {
                        opacity:.5;
                    }

                    50% {
                        opacity:1;
                    }
                }


                @keyframes float {
                    0%,100% {
                        transform:translateY(0);
                    }

                    50% {
                        transform:translateY(-10px);
                    }
                }



                .mars-core {
                    position:relative;
                    width:120px;
                    height:120px;
                }



               .mars-planet {
                position:absolute;
                width:120px;
                height:120px;

                border-radius:50%;
                overflow:hidden;

                box-shadow:
                0 0 55px rgba(255,120,60,.75),
                inset -20px -15px 30px rgba(0,0,0,.5);

                animation:
                marsRotate 25s linear infinite,
                marsFloat 6s ease-in-out infinite;
            }


                .mars-image {

                    width:100%;
                    height:100%;

                    object-fit:cover;
                    border-radius:50%;
                }



                @keyframes marsFloat {

                    0%,100% {
                        transform:translateY(0);
                    }

                    50% {
                        transform:translateY(-5px);
                    }
                }
            .mars-rotate {
                position:absolute;
                inset:0;

                animation:
                marsTextureRotate 30s linear infinite;
            }


                @keyframes marsTextureRotate {

                    from {
                        transform:scale(1.05) rotate(0deg);
                    }

                    to {
                        transform:scale(1.05) rotate(360deg);
                    }

                }


                .mars-image {
                    object-fit:cover;
                    border-radius:50%;
                }


                .orbit-path {

                    position:absolute;

                    width:200px;
                    height:200px;

                    border:1px solid rgba(255,149,71,.25);

                    border-radius:50%;

                    top:50%;
                    left:50%;

                    transform:
                    translate(-50%,-50%);
                }




                .satellite-wrapper {

                    position:absolute;

                    width:100%;
                    height:100%;

                    animation:
                    orbit 8s linear infinite;
                }



                .satellite {

                    position:absolute;

                    top:-40px;
                    left:50%;

                    transform:
                    translateX(-50%);
                }



                .sat-body {

                    width:16px;
                    height:24px;

                    background:
                    linear-gradient(
                        135deg,
                        #e8a537,
                        #c17a2c
                    );

                    border-radius:4px;


                    position:relative;


                    box-shadow:
                    0 0 12px rgba(232,165,55,.8);

                }




                .sat-panel {

                    position:absolute;

                    width:10px;
                    height:8px;

                    background:
                    linear-gradient(
                        135deg,
                        #4a90e2,
                        #2c5aa0
                    );


                    box-shadow:
                    0 0 8px rgba(74,144,226,.7);

                }



                .sat-panel-left {

                    top:50%;
                    left:-14px;

                    transform:
                    translateY(-50%);
                }



                .sat-panel-right {

                    top:50%;
                    right:-14px;

                    transform:
                    translateY(-50%);
                }



                .sat-antenna {

                    position:absolute;

                    width:2px;
                    height:12px;

                    background:#aaa;

                    top:-14px;
                    left:50%;

                    transform:
                    translateX(-50%);
                }




                .loading-text {

                    position:absolute;

                    bottom:-60px;

                    width:100%;

                    text-align:center;


                    color:
                    rgba(255,149,71,.8);


                    font-size:14px;

                    font-weight:500;

                    letter-spacing:2px;


                    animation:
                    float 2s ease-in-out infinite;

                }




                .dot {

                    display:inline-block;

                    width:6px;
                    height:6px;

                    background:
                    rgba(255,149,71,.8);

                    border-radius:50%;

                    margin:0 3px;


                    animation:
                    pulse 1.5s infinite;

                }



                .dot:nth-child(2){
                    animation-delay:.2s;
                }


                .dot:nth-child(3){
                    animation-delay:.4s;
                }


            `}</style>

            <div style={{ position: 'relative' }}>
                <div className="mars-core">
                    <div className="mars-planet">
                        <div className="mars-rotate">
                            <Image
                                src="/images/mars.png"
                                alt="Mars"
                                fill
                                priority
                                className="mars-image"
                            />
                        </div>
                    </div>
                    <div className="orbit-path" />

                    <div className="satellite-wrapper">
                        <div className="satellite">
                            <div className="sat-antenna" />

                            <div className="sat-body">
                                <div className="sat-panel sat-panel-left" />

                                <div className="sat-panel sat-panel-right" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="loading-text">
                    INITIALIZING
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </div>
            </div>
        </div>
    );
}
