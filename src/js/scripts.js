import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import wenusTexture from '../img/venus.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(51,1,1);
controls.maxDistance = 1000;
controls.minDistance = 10;
controls.rotateSpeed = 0.1;


const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3  
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.set(-90, 140, 140);
controls.update();

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(32, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(texture, size, distance, tilt) {
    const orbit = new THREE.Object3D(); 
    orbit.rotation.x = tilt; 
    scene.add(orbit);

    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.set(distance, 0, 0); 
    orbit.add(planet);

    const orbitPath = createOrbit(distance);
    orbit.add(orbitPath);

    return { planet, orbit };
}

function createOrbit(radius) {
    const segments = 64; 
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitVertices = [];

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        orbitVertices.push(x, 0, z); 
    }

    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x474745 });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);

    return orbit;
}

const mercury = createPlanet(mercuryTexture, 3.2, 100, 0.1);
const venus = createPlanet(wenusTexture, 2.48*3.2, 200, 0.2); 
const earth="";
const mars="";
const jupiter=""
const saturn=""
const uranus=""
const neptune=""

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const axesHelper = new THREE.AxesHelper( 500 );
scene.add(axesHelper);




function animate() {
    requestAnimationFrame(animate);

    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;
    stars.rotation.z -= 0.0001;
    sun.rotation.y -= 0.003;

    const mercuryPosition = new THREE.Vector3();
    mercury.planet.getWorldPosition(mercuryPosition);
    

    mercury.orbit.rotation.y += 0.01;
    venus.orbit.rotation.y += 0.005;

    mercury.planet.rotation.y += 0.005;
    venus.planet.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();