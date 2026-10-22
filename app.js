
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

import { OrbitControls } from
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, cabinetGroup;
let resizeObserver;

export function init3D(container) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#e7e4dc");

  camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.set(3.2, 2.6, 4.5);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.replaceChildren(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x71604c, 2));

  const light = new THREE.DirectionalLight(0xffffff, 2.5);
  light.position.set(4, 7, 5);
  light.castShadow = true;
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: "#dedbd2" })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  cabinetGroup = new THREE.Group();
  scene.add(cabinetGroup);

  resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  resizeObserver.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  updateCabinet({
    width: 120,
    height: 200,
    depth: 55,
    doors: 5,
    color: "#a66d3f"
  });
}

export function updateCabinet(options) {
  if (!cabinetGroup) return;

  cabinetGroup.clear();

  const w = options.width / 100;
  const h = options.height / 100;
  const d = options.depth / 100;
  const count = options.doors;
  const wood = options.color;

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: wood,
    roughness: 0.8
  });

  const insideMaterial = new THREE.MeshStandardMaterial({
    color: "#c6a783",
    roughness: 0.9
  });

  const handleMaterial = new THREE.MeshStandardMaterial({
    color: "#d8c7a0",
    metalness: 0.65,
    roughness: 0.3
  });

  function addBox(width, height, depth, x, y, z, material) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    cabinetGroup.add(mesh);
    return mesh;
  }

  const board = 0.035;

  // الجانبان العلوي والسفلي
  addBox(board, h, d, -w / 2 + board / 2, h / 2, 0, woodMaterial);
  addBox(board, h, d, w / 2 - board / 2, h / 2, 0, woodMaterial);
  addBox(w, board, d, 0, h - board / 2, 0, woodMaterial);
  addBox(w, board, d, 0, board / 2, 0, woodMaterial);

  // اللوح الخلفي
  addBox(w - 2 * board, h - 2 * board, 0.018,
    0, h / 2, -d / 2 + 0.009, insideMaterial);

  // الرفوف الداخلية
  for (let i = 1; i <= 3; i++) {
    addBox(
      w - 2 * board,
      0.025,
      d - 0.05,
      0,
      h * i / 4,
      0,
      insideMaterial
    );
  }

  // الأبواب ومقابضها
  const frontZ = d / 2 + 0.018;
  const doorWidth = (w - 2 * board) / count;

  for (let i = 0; i < count; i++) {
    const x = -w / 2 + board + doorWidth * (i + 0.5);

    addBox(
      doorWidth - 0.009,
      h - 2 * board,
      0.035,
      x,
      h / 2,
      frontZ,
      woodMaterial
    );

    const handleX = x + doorWidth * 0.35;

    addBox(
      0.012,
      0.11,
      0.018,
      handleX,
      h / 2,
      frontZ + 0.028,
      handleMaterial
    );
  }
}
