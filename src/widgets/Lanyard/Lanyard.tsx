import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Band } from '@/entities/Band';

const Lanyard = () => {
  return (
    <div
      className="relative h-screen w-full"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="flex h-screen w-full"
        style={{ pointerEvents: 'none' }}
      >
        <Canvas
          camera={{ position: [0, 0, 13], fov: 20 }}
          gl={{ alpha: true, antialias: true }}
          style={{
            background: 'transparent',
            pointerEvents: 'auto',
            marginTop: '-20px',
            marginLeft: '-20px',
          }}
          onPointerDown={() => console.log('Canvas clicked')}
        >
          <ambientLight intensity={Math.PI / 2} />
          <Physics
            debug={false}
            interpolate
            gravity={[0, -40, 0]}
            timeStep={1 / 60}
          >
            <Band />
          </Physics>
          <Environment background={false} blur={0.75}>
            <Lightformer
              intensity={1}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={1.5}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={1.5}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={5}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    </div>
  );
};

export default Lanyard;
