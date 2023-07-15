import Particles from "react-tsparticles";
import {loadFull} from "tsparticles";
import {useCallback} from "react";

export const FireEmbers = () => {

    const particlesInit = useCallback(async (engine:any) => {
        await loadFull(engine);
    }, []);

    return(
        <Particles
            style={{position: "absolute", width: "100%", height: "100%"}}
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen:{
                  enable: false,
                },
                particles: {
                    color: {
                        value: ["#ff9800", "#ff5722", "#ffeb3b", "#ffc107"],
                    },
                    links: {
                        enable: false,
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "top",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "destroy",
                            bottom: "destroy",
                        },
                        attract: {
                            enable: false,
                        },
                    },
                    number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 800,
                        },
                    },
                    opacity: {
                        value: 0.5,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                        },
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 4,
                            size_min: 0.3,
                        },
                    },
                },
                detectRetina: true,
            }}
        />
    )
}