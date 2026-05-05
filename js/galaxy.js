import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { FontLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';

// --- CONFIGURATION ---
const STAR_COUNT = 6000;
const STAR_SIZE = 0.5;
const STAR_SPEED_BASE = 0.2;
const STAR_SPEED_WARP = 10.0;

// --- STATE ---
let speed = STAR_SPEED_BASE;
let targetSpeed = STAR_SPEED_BASE;
let mouseX = 0;
let mouseY = 0;
let isDarkMode = true;
let currentBrand = 'default';
let systemFont = null;
let textParticles = [];
let scrollY = 0;

const textParticleWords = [
    'Supabase', 'Docker', 'React', 'JavaScript', 'VS Code', 'Claude', 'Gemini', 'ChatGPT', 'Copilot', 'v0', 'Lovable', 'Antigravity', 'Android Studio', 'IntelliJ IDEA'
];

// --- SETUP ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- MATRIX RAIN CANVAS ---
const matrixCanvas = document.getElementById('matrix-canvas');
const mCtx = matrixCanvas.getContext('2d');
let matrixColumns = [];

function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    matrixColumns = Array(Math.floor(columns)).fill(1);
}
resizeMatrix();

function drawMatrixRain() {
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.fillStyle = '#0F0';
    mCtx.font = '14px monospace';

    for(let i = 0; i < matrixColumns.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        mCtx.fillText(text, i * 14, matrixColumns[i] * 14);
        if(matrixColumns[i] * 14 > matrixCanvas.height && Math.random() > 0.975) {
            matrixColumns[i] = 0;
        }
        matrixColumns[i]++;
    }
}

// --- STARS ---
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(200, 200, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(100, 100, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const starGeo = new THREE.BufferGeometry();
const positions = new Float32Array(STAR_COUNT * 3);
const colors = new Float32Array(STAR_COUNT * 3);

for(let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const starMat = new THREE.PointsMaterial({
    vertexColors: true, size: STAR_SIZE, map: createStarTexture(),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// --- PLANET ---
const planetGeo = new THREE.IcosahedronGeometry(15, 1);
const planetMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, wireframe: true, transparent: true, opacity: 0.15 });
const planet = new THREE.Mesh(planetGeo, planetMat);
planet.position.set(25, -10, -40);
scene.add(planet);

// --- SHAPES ---
const shapesGroup = new THREE.Group();
scene.add(shapesGroup);

export function rebuildShapes(brand, theme, isDark) {
    while(shapesGroup.children.length > 0){
        const obj = shapesGroup.children[0];
        obj.geometry.dispose(); obj.material.dispose();
        shapesGroup.remove(obj);
    }
    const count = 40;
    for(let i = 0; i < count; i++) {
        let geom;
        if (brand === 'matrix') {
            geom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        } else {
            const shapeGeoms = [
                new THREE.IcosahedronGeometry(0.6, 0),
                new THREE.BoxGeometry(0.8, 0.8, 0.8),
                new THREE.TorusGeometry(0.5, 0.2, 8, 16),
                new THREE.OctahedronGeometry(0.8),
                new THREE.ConeGeometry(0.5, 1, 4)
            ];
            geom = shapeGeoms[Math.floor(Math.random() * shapeGeoms.length)];
        }
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 40);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = { rsX: (Math.random() - 0.5) * 0.02, rsY: (Math.random() - 0.5) * 0.02, y0: mesh.position.y, speed: Math.random() * 0.002 };

        const palette = theme.stars;
        const hex = palette[Math.floor(Math.random() * palette.length)];
        mesh.material.color.setHex(hex);
        mesh.material.opacity = isDark ? 0.15 : 0.4;
        shapesGroup.add(mesh);
    }
}

// --- TEXT PARTICLES ---
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.136.0/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    systemFont = font;
    for (let i = 0; i < 10; i++) {
        addTextParticle();
    }
});

function addTextParticle() {
    const word = textParticleWords[Math.floor(Math.random() * textParticleWords.length)];
    const geo = new TextGeometry(word, { font: systemFont, size: 3, height: 0.5, curveSegments: 6 });
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6), transparent: true, opacity: 0.7 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 180, (Math.random() - 0.5) * 100, -80 + Math.random() * 160);
    mesh.userData = { vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.04, vz: (Math.random() - 0.5) * 0.04, fade: 0.995 + Math.random() * 0.003 };
    scene.add(mesh);
    textParticles.push(mesh);
}

// --- INTERACTION ---
let currentMode = 'tech';

export function setGalaxyState(brand, isDark) {
    currentBrand = brand;
    isDarkMode = isDark;

    // Auto-detect mode based on body class if possible, or use provided brand
    const isLogistics = document.body.classList.contains('logistics-mode');
    currentMode = isLogistics ? 'logistics' : 'tech';

    scene.fog.color.setHex(isDark ? 0x000000 : 0xffffff);
    planetMat.opacity = isDark ? 0.15 : 0.3;

    // Reset star positions for the new mode
    transitionStars();
}

function transitionStars() {
    const positionsArr = starGeo.attributes.position.array;
    for(let i = 0; i < STAR_COUNT; i++) {
        if (currentMode === 'logistics') {
            // Rearrange into a 3D grid (Warehouse Racks)
            const x = (i % 20) * 10 - 100;
            const y = (Math.floor(i / 20) % 20) * 10 - 100;
            const z = (Math.floor(i / 400)) * -10;
            positionsArr[i * 3] = x;
            positionsArr[i * 3 + 1] = y;
            positionsArr[i * 3 + 2] = z;
        } else {
            // Return to random Galaxy spread
            positionsArr[i * 3] = (Math.random() - 0.5) * 400;
            positionsArr[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positionsArr[i * 3 + 2] = (Math.random() - 0.5) * 400;
        }
    }
    starGeo.attributes.position.needsUpdate = true;
}

export function updateStarColors(palette, isDark) {
    const colorsAttr = starGeo.attributes.color;
    const colorObj = new THREE.Color();
    for(let i = 0; i < STAR_COUNT; i++) {
        const hex = palette[Math.floor(Math.random() * palette.length)];
        let finalHex = hex;
        if (!isDark && hex === 0xffffff) finalHex = 0x333333;
        colorObj.setHex(finalHex);
        colorsAttr.setXYZ(i, colorObj.r, colorObj.g, colorObj.b);
    }
    colorsAttr.needsUpdate = true;
}

export function setTargetSpeed(s) { targetSpeed = s; }
export function getTargetSpeed() { return targetSpeed; }

// --- ANIMATION ---
function animate() {
    requestAnimationFrame(animate);
    if (currentBrand === 'matrix') drawMatrixRain();

    speed += (targetSpeed - speed) * 0.05;
    const targetFOV = (targetSpeed > 1) ? 100 : 60;
    camera.fov += (targetFOV - camera.fov) * 0.05;
    camera.updateProjectionMatrix();

    const positionsArr = starGeo.attributes.position.array;
    const strafeX = -mouseX * speed * 0.5;
    const strafeY = mouseY * speed * 0.5;

    for(let i = 0; i < STAR_COUNT; i++) {
        if (currentBrand === 'matrix') {
            positionsArr[i * 3 + 1] -= speed * 2;
            if(positionsArr[i * 3 + 1] < -200) positionsArr[i * 3 + 1] = 200;
        } else {
            positionsArr[i * 3 + 2] += speed;
            positionsArr[i * 3] += strafeX;
            positionsArr[i * 3 + 1] += strafeY;
            if(positionsArr[i * 3 + 2] > 200) positionsArr[i * 3 + 2] = -400;
            if(positionsArr[i * 3] > 200) positionsArr[i * 3] -= 400;
            if(positionsArr[i * 3] < -200) positionsArr[i * 3] += 400;
        }
    }
    starGeo.attributes.position.needsUpdate = true;

    stars.rotation.x += (mouseY * 0.1 - stars.rotation.x) * 0.05;
    stars.rotation.y += (mouseX * 0.1 - stars.rotation.y) * 0.05;
    stars.rotation.z += (targetSpeed > 1) ? 0.005 : 0.001;

    shapesGroup.rotation.x += (mouseY * 0.25 - shapesGroup.rotation.x) * 0.05;
    shapesGroup.rotation.y += (mouseX * 0.25 - shapesGroup.rotation.y) * 0.05;
    const time = Date.now();
    shapesGroup.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rsX;
        mesh.rotation.y += mesh.userData.rsY;
        mesh.position.y = mesh.userData.y0 + Math.sin(time * mesh.userData.speed) * 2;
    });

    for (let i = textParticles.length - 1; i >= 0; i--) {
        const mesh = textParticles[i];
        mesh.position.x += mesh.userData.vx;
        mesh.position.y += mesh.userData.vy;
        mesh.position.z += mesh.userData.vz;
        mesh.material.opacity *= mesh.userData.fade;
        if (mesh.material.opacity < 0.08) {
            scene.remove(mesh);
            textParticles.splice(i, 1);
            if (systemFont) addTextParticle();
        }
    }

    planet.rotation.y += 0.002;
    planet.rotation.z += 0.001;
    planet.position.y = -10 + (scrollY * 0.03);
    camera.rotation.z = -scrollY * 0.0002;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('scroll', () => { scrollY = window.scrollY; });

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeMatrix();
});

export function takeScreenshot() {
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL('image/png');
}
