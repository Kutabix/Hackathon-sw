import * as THREE from '../../node_modules/three/build/three.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';  

import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg'

import { planetInfoData } from '../js/planetInfoData'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(51,1,1);
controls.maxDistance = 5000;
controls.minDistance = 10;
controls.rotateSpeed = 0.1;


const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 8000;
    const y = (Math.random() - 0.5) * 8000;
    const z = (Math.random() - 0.5) * 8000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3  
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.set(-90, 444, 500);
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
    
    const randomAngle = Math.random() * Math.PI * 2;
    planet.position.set(
        distance * Math.cos(randomAngle),
        0,
        distance * Math.sin(randomAngle)
    );

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


function createRings(texture, innerRadius, outerRadius, planetN, radians) {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 100); 
    const material = new THREE.MeshBasicMaterial({ 
        side: THREE.DoubleSide, 
        map: textureLoader.load(texture),
        // roughness: 0.9,
        // metalness: 0.1 
    });


    const ring = new THREE.Mesh(geometry, material);
    ring.position.set(planetN.planet.position.x, planetN.planet.position.y, planetN.planet.position.z);
    ring.rotation.x = radians; 
    return ring;
}



const mercury = createPlanet(mercuryTexture, 3.2, 100, 0.1);
const venus = createPlanet(venusTexture, 7.93, 200, 0.06);
const earth = createPlanet(earthTexture, 8.36, 300, 0.12);
const mars = createPlanet(marsTexture, 4.44, 450, 0.09);
const jupiter = createPlanet(jupiterTexture, 91.6, 600, 0.0997);
const saturn = createPlanet(saturnTexture, 76.38, 850, 0.07);
const uranus = createPlanet(uranusTexture, 33.29, 1100, 0.1);
const neptune = createPlanet(neptuneTexture, 32.3, 1400, 0.0914);
const pluto = createPlanet(plutoTexture, 1.55, 1600, 0.0914);


const pointLight = new THREE.PointLight(0xffffff, 2, 10000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const axesHelper = new THREE.AxesHelper( 500 );
// scene.add(axesHelper);



const mercuryOrbitalPeriod = 88;
const venusOrbitalPeriod = 225;
const earthOrbitalPeriod = 365.25;
const marsOrbitalPeriod = 687;
const jupiterOrbitalPeriod = 4333;
const saturnOrbitalPeriod = 10759;
const uranusOrbitalPeriod = 30685;
const neptuneOrbitalPeriod = 60190;

const mercuryRotationPeriod = 58.6;
const venusRotationPeriod = 243;
const earthRotationPeriod = 20;
const marsRotationPeriod = 1.03;
const jupiterRotationPeriod = 0.41;
const saturnRotationPeriod = 0.45;
const uranusRotationPeriod = 0.72;
const neptuneRotationPeriod = 0.62;


const gui = new GUI({ width: 500 });
const params = {
    speed: 1, 
};
gui.add(params, 'speed', 0.0001, 5).name('Speed');
  
let activePlanet = null;
function selectPlanet(planetName) {
    switch (planetName) {
        case 'sun':
            activePlanet = sun;
            break;
        case 'mercury':
            activePlanet = mercury.planet;
            break;
        case 'venus':
            activePlanet = venus.planet;
            break;
        case 'earth':
            activePlanet = earth.planet;
            break;
        case 'mars':
            activePlanet = mars.planet;
            break;
        case 'jupiter':
            activePlanet = jupiter.planet;
            break;
        case 'saturn':
            activePlanet = saturn.planet;
            break;
        case 'uranus':
            activePlanet = uranus.planet;
            break;
        case 'neptune':
            activePlanet = neptune.planet;
            break;
        case 'pluto':
            activePlanet = pluto.planet;
            break;
        default:
            activePlanet = null;
    }
}
// const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
// scene.add(ambientLight);



// // const ringMesh = new THREE.Mesh( geometry, material ); 
// // ringMesh.position.set(saturn.planet.position.x, saturn.planet.position.y, saturn.planet.position.z);
// // ringMesh.rotation.x = Math.PI / 2 + Math.PI/12  ;
const saturnRing = createRings(saturnRingTexture, 100, 140, saturn, Math.PI/3);
saturn.orbit.add(saturnRing)

const uranusRing = createRings(uranusRingTexture, 50, 60, uranus, Math.PI/22);
uranus.orbit.add(uranusRing)

const planetListItems = document.querySelectorAll('.object-panel ul li');

planetListItems.forEach(item => {
    item.addEventListener('click', () => {
        const planetName = item.getAttribute('onclick').match(/'(.+)'/)[1]; 
        selectPlanet(planetName);
        const infoPanel = document.getElementById('infoPanel');
        const planetNameElement = document.getElementById('planetName');
        const planetInfoElement = document.getElementById('planetInfo');

        const planetInfo = planetInfoData[planetName];

        if (planetInfo) {
            planetNameElement.innerText = planetInfo.name;
            planetInfoElement.innerHTML = `
                <p>${planetInfo.info}</p>
                <p><strong>Promień: ${planetInfo.radius}</strong></p>
                <p><strong>Masa:</strong> ${planetInfo.mass}</strong></p>
                <p><strong>Okres orbitalny:</strong> ${planetInfo.orbitalPeriod}</strong></p>
                <p><strong>Księżyce:</strong> ${planetInfo.moons}</strong></p>
            `;
            infoPanel.style.display = 'block';
        }
    });
});

  
function animate() {
    requestAnimationFrame(animate);
      
    timeScale = params.speed;
      
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;
    stars.rotation.z -= 0.0001;
    sun.rotation.y -= 0.003;


    mercury.planet.rotation.y += (timeScale / mercuryRotationPeriod) * 2 * Math.PI; 
    venus.planet.rotation.y += (timeScale / venusRotationPeriod) * 2 * Math.PI;
    earth.planet.rotation.y += (timeScale / earthRotationPeriod) * 2 * Math.PI;
    mars.planet.rotation.y += (timeScale / marsRotationPeriod) * 2 * Math.PI;
    jupiter.planet.rotation.y += (timeScale / jupiterRotationPeriod) * 2 * Math.PI;
    saturn.planet.rotation.y += (timeScale / saturnRotationPeriod) * 2 * Math.PI;
    uranus.planet.rotation.y += (timeScale / uranusRotationPeriod) * 2 * Math.PI;
    neptune.planet.rotation.y += (timeScale / neptuneRotationPeriod) * 2 * Math.PI;

    mercury.orbit.rotation.y += (timeScale / mercuryOrbitalPeriod) * 2 * Math.PI; 
    venus.orbit.rotation.y += (timeScale / venusOrbitalPeriod) * 2 * Math.PI;
    earth.orbit.rotation.y += (timeScale / earthOrbitalPeriod) * 2 * Math.PI;
    mars.orbit.rotation.y += (timeScale / marsOrbitalPeriod) * 2 * Math.PI;
    jupiter.orbit.rotation.y += (timeScale / jupiterOrbitalPeriod) * 2 * Math.PI;
    saturn.orbit.rotation.y += (timeScale / saturnOrbitalPeriod) * 2 * Math.PI;
    uranus.orbit.rotation.y += (timeScale / uranusOrbitalPeriod) * 2 * Math.PI;
    neptune.orbit.rotation.y += (timeScale / neptuneOrbitalPeriod) * 2 * Math.PI;



    if (activePlanet) {
        const planetPosition = new THREE.Vector3();
        activePlanet.getWorldPosition(planetPosition);

        let newCameraPosition;
        if(activePlanet.geometry.parameters.radius > 20) 
            newCameraPosition = planetPosition.clone().add(new THREE.Vector3(240, 160, 100)); 
        else 
            newCameraPosition = planetPosition.clone().add(new THREE.Vector3(120, 80, 200));
        camera.position.lerp(newCameraPosition, 0.05); 
    
        controls.target.lerp(planetPosition, 0.1);
        controls.update();


    }
    renderer.render(scene, camera);
}
animate();