import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// Escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);

// Geometría y material
const geometry = new THREE.BoxGeometry(1, 1, 2);

// Datos de ejemplo para la recurrencia
const data = [
    { x: 0, y: 0, z: 0, value: 5 },
    { x: 2, y: 0, z: 0, value: 10 },
    { x: 4, y: 0, z: 0, value: 15 },
    { x: 6, y: 0, z: 0, value: 20 }
];

// Función para obtener el color basado en el valor
function getColor(value) {
    if (value > 15) return 0xff0000; // Rojo
    if (value > 10) return 0xffff00; // Amarillo
    if (value > 5) return 0x00ff00;  // Verde
    return 0x0000ff;                 // Azul
}

// Crear cubos basados en los datos
data.forEach(point => {
    const material = new THREE.MeshBasicMaterial({ color: getColor(point.value) });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(point.x, point.y, point.z);
    scene.add(cube);
});

// Calcular el tamaño de la plataforma
const minX = Math.min(...data.map(point => point.x)) - 1;
const maxX = Math.max(...data.map(point => point.x)) + 1;
const minZ = Math.min(...data.map(point => point.z)) - 3;
const maxZ = Math.max(...data.map(point => point.z)) + 3;
const width = maxX - minX;
const depth = maxZ - minZ;

// Crear una plataforma rectangular gris
const platformGeometry = new THREE.PlaneGeometry(width, depth);
const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.rotation.x = Math.PI / 2; // Rotar la plataforma para que sea horizontal
platform.position.set((minX + maxX) / 2, -0.5, (minZ + maxZ) / 2); // Ajustar la posición de la plataforma
scene.add(platform);

// Calcular el centro de los datos
const centerX = (minX + maxX) / 2;
const centerY = (data.reduce((sum, point) => sum + point.y, 0)) / data.length;
const centerZ = (minZ + maxZ) / 2;

controls.target.set(centerX, centerY, centerZ);
controls.update();

camera.position.set(centerX, centerY + 10, centerZ + 10); // Ajuste la posición inicial de la cámara

// Función de renderizado
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();