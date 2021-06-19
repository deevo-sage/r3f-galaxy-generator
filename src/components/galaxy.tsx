import * as React from "react"
import { OrbitControls } from "@react-three/drei"
import { Canvas, MeshProps, BufferGeometryProps, PointsProps, useFrame } from "@react-three/fiber"
import { useRef, useMemo, useState, useEffect } from "react"
import { useControls } from "leva"
import { BufferAttribute } from "three"
const Base = ({ children }) => {

    return <Canvas alpha={true} style={{ width: "100vw", height: '100vh', background: 'black' }} camera={{ fov: 75, near: 0.1, far: 1000, position: [10, 10, 10] }}>
        <OrbitControls enableZoom={true} enablePan={true} />
        <Galaxy />
        <axesHelper />
    </Canvas>
}
export default Base
const Galaxy = ({ }) => {
    const { pointval, branches, radius, width, rotation, speed, exponential } = useControls({
        pointval: { value: 10000, min: 100, max: 100000 },
        branches: { value: 3, min: 2, max: 10, step: 1 },
        radius: { value: 10, min: 5, max: 50, step: 1 },
        width: { value: 0.1, min: 1, max: 10, step: 1 },
        rotation: { value: 0.01, min: 0.0001, max: 0.5, step: 0.0001 },
        speed: { value: 0.5, min: 0.5, max: 10, step: 0.1 },
        exponential: { value: 3, min: 1, max: 10, step: 0.5 }
    })
    const buff = useRef<BufferGeometryProps>()
    const mesh = useRef<PointsProps>()
    const pointsarr = useMemo(() => {
        const arr = new Float32Array(pointval * 3)
        console.log('running')
        const exp = () => width * Math.pow(Math.random(), exponential) * (Math.floor(Math.random() - 0.5) === 0 ? -1 : 1)
        const getrad = () => radius * Math.pow(Math.random(), exponential)
        for (let i = 0; i < pointval; i++) {
            let x = i * 3
            const rad = getrad()
            // const funangle = 2 * Math.PI * Math.sin(Math.tan(radius))
            const angle = 2 * Math.PI / branches * (i % branches)
            arr[x] = rad * Math.cos(angle + rad * rotation) + exp()
            arr[x + 1] = exp()
            arr[x + 2] = rad * Math.sin(angle + rad * rotation) + exp()
            // arr[i + 1] = Math.random() * 2 - 1;
        }
        return arr
    }, [pointval, branches, radius, rotation, width, exponential])
    useEffect(() => {
        buff.current.setAttribute("position", new BufferAttribute(pointsarr, 3))

    }, [pointsarr, branches, radius, rotation, width, exponential])
    useFrame(({ clock }) => {
        mesh.current.rotateY(speed * 0.0001)
    })
    return <points ref={mesh} >
        {/* <sphereGeometry args={[3]} /> */}
        <bufferGeometry attach="geometry" ref={buff}>
            <bufferAttribute attachObject={['attributes', 'position']} count={pointval} array={pointsarr} itemSize={3} needsUpdate={true} />
        </bufferGeometry>
        <pointsMaterial color={'#ffffff'} size={0.001} ></pointsMaterial>
    </points>

}