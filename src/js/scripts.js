import * as THREE from 'three';
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
import plutoTexture from '../img/pluto.jpg';
import starsTexture from '../img/stars.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(51,1,1);
controls.maxDistance = 1500;
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

/*
function createRings(texture, innerRadius, outerRadius) {
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texture),
        side: THREE.DoubleSide,
        transparent: true
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2; // Ustawienie nachylenia
    return ring;
}

*/

const mercury = createPlanet(mercuryTexture, 3.2, 100, 0.1);
const venus = createPlanet(venusTexture, 7.93, 200, 0.12);
const earth = createPlanet(earthTexture, 8.36, 300, 0.15);
const mars = createPlanet(marsTexture, 4.44, 400, 0.18);
const jupiter = createPlanet(jupiterTexture, 91.6, 600, 0.2);
const saturn = createPlanet(saturnTexture, 76.38, 800, 0.25);
const uranus = createPlanet(uranusTexture, 33.29, 1000, 0.3);
const neptune = createPlanet(neptuneTexture, 32.3, 1200, 0.33);
const pluto = createPlanet(plutoTexture, 1.56, 1400, 0.35);


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
const plutoOrbitalPeriod = 90560;

const mercuryRotationPeriod = 58.6;
const venusRotationPeriod = 243;
const earthRotationPeriod = 1;
const marsRotationPeriod = 1.03;
const jupiterRotationPeriod = 0.41;
const saturnRotationPeriod = 0.45;
const uranusRotationPeriod = 0.72;
const neptuneRotationPeriod = 0.67;
const plutoRotationPeriod = 6.39;


const gui = new GUI({ width: 500 });
const params = {
    speed: 1, 
};
gui.add(params, 'speed', 0.0001, 5).name('Speed');

  
function selectPlanet(planet) {
    const infoPanel = document.getElementById('infoPanel');
    const planetName = document.getElementById('planetName');
    const planetInfo = document.getElementById('planetInfo');
  
    let targetPosition;
  
    if (planetData[planet]) {
      planetName.textContent = planetData[planet].name;
      planetInfo.textContent = planetData[planet].info;
      infoPanel.style.display = 'block'; // Show the panel
      
      // Set the camera to focus on the selected planet
      switch(planet) {
        case 'sun':
          targetPosition = sun.position.clone();
          break;
        case 'mercury':
          targetPosition = mercury.planet.position.clone();
          break;
        case 'venus':
          targetPosition = venus.planet.position.clone();
          break;
        case 'earth':
          targetPosition = earth.planet.position.clone();
          break;
        case 'mars':
          targetPosition = mars.planet.position.clone();
          break;
        case 'jupiter':
          targetPosition = jupiter.planet.position.clone();
          break;
        case 'saturn':
          targetPosition = saturn.planet.position.clone();
          break;
        case 'uranus':
          targetPosition = uranus.planet.position.clone();
          break;
        case 'neptune':
          targetPosition = neptune.planet.position.clone();
          break;
        case 'pluto':
          targetPosition = pluto.planet.position.clone();
          break;
      }
  
      // Zoom into the planet by moving the camera closer
      const zoomDistance = 50; // Adjust distance to get closer to the planet
      camera.position.copy(targetPosition.multiplyScalar(1.5)); 
      camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z + zoomDistance); 
      controls.update();
  
    } else {
      infoPanel.style.display = 'none'; // Hide the panel if no planet selected
    }
  }
  


  
function animate() {
    requestAnimationFrame(animate);

    timeScale = params.speed;

    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0001;
    stars.rotation.z -= 0.0001;
    sun.rotation.y -= 0.003;

    // Przykład dla każdej planety

    mercury.planet.rotation.y += (timeScale / mercuryRotationPeriod) * 2 * Math.PI; 
    venus.planet.rotation.y += (timeScale / venusRotationPeriod) * 2 * Math.PI;
    earth.planet.rotation.y += (timeScale / earthRotationPeriod) * 2 * Math.PI;
    mars.planet.rotation.y += (timeScale / marsRotationPeriod) * 2 * Math.PI;
    jupiter.planet.rotation.y += (timeScale / jupiterRotationPeriod) * 2 * Math.PI;
    saturn.planet.rotation.y += (timeScale / saturnRotationPeriod) * 2 * Math.PI;
    uranus.planet.rotation.y += (timeScale / uranusRotationPeriod) * 2 * Math.PI;
    neptune.planet.rotation.y += (timeScale / neptuneRotationPeriod) * 2 * Math.PI;
    pluto.planet.rotation.y += (timeScale / plutoRotationPeriod) * 2 * Math.PI;

    mercury.orbit.rotation.y += (timeScale / mercuryOrbitalPeriod) * 2 * Math.PI; 
    venus.orbit.rotation.y += (timeScale / venusOrbitalPeriod) * 2 * Math.PI;
    earth.orbit.rotation.y += (timeScale / earthOrbitalPeriod) * 2 * Math.PI;
    mars.orbit.rotation.y += (timeScale / marsOrbitalPeriod) * 2 * Math.PI;
    jupiter.orbit.rotation.y += (timeScale / jupiterOrbitalPeriod) * 2 * Math.PI;
    saturn.orbit.rotation.y += (timeScale / saturnOrbitalPeriod) * 2 * Math.PI;
    uranus.orbit.rotation.y += (timeScale / uranusOrbitalPeriod) * 2 * Math.PI;
    neptune.orbit.rotation.y += (timeScale / neptuneOrbitalPeriod) * 2 * Math.PI;
    pluto.orbit.rotation.y += (timeScale / plutoOrbitalPeriod) * 2 * Math.PI;

    renderer.render(scene, camera);
}
animate();