import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';
import forEach from 'lodash/forEach';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { LocationVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';
import dataTestids from './dataTestids';

type CachedObjectMap = {
  [key: number | string]: THREE.Group | undefined;
};

type Props = {
  players: PlayerAgg[];
  units: UnitAgg[];
  cameraLocation: LocationVo;
  items: ItemAgg[];
};

function GameCanvas({ players, units, cameraLocation, items }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 5, 10);
    newScene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
    hemiLight.position.set(0, 20, 0);
    newScene.add(hemiLight);

    const grid = new THREE.GridHelper(1000, 1000, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    newScene.add(grid);

    return newScene;
  });
  const [camera] = useState<THREE.PerspectiveCamera>(() => {
    const newCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    scene.add(newCamera);
    return newCamera;
  });
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const newRender = new THREE.WebGLRenderer({ antialias: true });
    newRender.outputEncoding = THREE.sRGBEncoding;
    newRender.shadowMap.enabled = true;
    return newRender;
  });
  const { loadModel, cloneModel } = useContext(ThreeJsContext);
  const cachedPlayerObjects = useRef<CachedObjectMap>({});
  const cachedUnitObjects = useRef<CachedObjectMap>({});

  useEffect(() => {
    items.forEach((item) => loadModel(item.getModelSrc()));
    loadModel('/characters/car.gltf');
    loadModel('/bases/grass.gltf');
  }, [items, players]);

  useEffect(
    function putRendererOnWrapperRefReady() {
      if (!wrapperRef.current) {
        return;
      }

      wrapperRef.current.appendChild(renderer.domElement);
    },
    [wrapperRef.current]
  );

  useEffect(
    function updateRendererOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      renderer.setSize(wrapperDomRect.width, wrapperDomRect.height);
      renderer.setPixelRatio(wrapperDomRect.width / wrapperDomRect.height);
    },
    [renderer, wrapperDomRect]
  );

  useEffect(
    function updateCameraAndLightOnLocationChange() {
      const cameraLocationX = cameraLocation.getX();
      const cameraLocationZ = cameraLocation.getZ();

      camera.position.set(cameraLocationX, 15, cameraLocationZ + 20);
      camera.lookAt(cameraLocationX, 0, cameraLocationZ);
    },
    [cameraLocation]
  );

  useEffect(
    function updateCameraAspectOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.updateProjectionMatrix();
    },
    [camera, wrapperDomRect]
  );

  useEffect(
    function handleBasesUpdated() {
      const grassObject = cloneModel('/bases/grass.gltf');
      if (!grassObject) return;

      grassObject.position.set(0.5, -0.15, 0.5);
      grassObject.scale.set(1000, 1, 1000);
      scene.add(grassObject);
    },
    [scene, cloneModel]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        let playerObject: THREE.Group | null;
        const cachedPlayerOject = cachedPlayerObjects.current[player.getId()];

        if (cachedPlayerOject) {
          playerObject = cachedPlayerOject;
        } else {
          playerObject = cloneModel('/characters/car.gltf');
          if (playerObject) {
            scene.add(playerObject);
            cachedPlayerObjects.current[player.getId()] = playerObject;
          }
        }

        if (playerObject) {
          playerObject.position.set(player.getLocation().getX() + 0.5, 0, player.getLocation().getZ() + 0.5);
          playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
        }
      });

      const playerKeys = players.map((player) => player.getId());
      forEach(cachedPlayerObjects.current, (playerObject, playerId) => {
        if (!playerKeys.includes(playerId) && playerObject) {
          scene.remove(playerObject);
          delete cachedPlayerObjects.current[playerId];
        }
      });
    },
    [scene, cloneModel, players]
  );

  useEffect(
    function handleUnitsUpdated() {
      units.forEach((unit) => {
        const item = items.find((_item) => _item.getId() === unit.getItemId());
        if (!item) return;

        const unitId = unit.getIdentifier();
        let unitObject: THREE.Group | null;
        const cachedUnitOject = cachedUnitObjects.current[unitId];

        if (cachedUnitOject) {
          unitObject = cachedUnitOject;
        } else {
          unitObject = cloneModel(item.getModelSrc());
          if (unitObject) {
            scene.add(unitObject);
            cachedUnitObjects.current[unitId] = unitObject;
          }
        }

        if (unitObject) {
          unitObject.position.set(unit.getLocation().getX() + 0.5, 0, unit.getLocation().getZ() + 0.5);
        }
      });

      const unitIds = units.map((unit) => unit.getIdentifier());
      forEach(cachedUnitObjects.current, (unitObject, unitId) => {
        if (!unitIds.includes(unitId) && unitObject) {
          scene.remove(unitObject);
          delete cachedUnitObjects.current[unitId];
        }
      });
    },
    [scene, cloneModel, items, units]
  );

  useEffect(
    function animateEffect() {
      let animationId: number | null = null;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationId !== null) cancelAnimationFrame(animationId);
      };
    },
    [renderer, scene, camera]
  );

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
