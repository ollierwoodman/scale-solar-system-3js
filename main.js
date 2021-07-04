import './style.css'

import * as THREE from 'three'
import { Color, GridHelper } from 'three';
import { CustomFlyControls } from './CustomFlyControls';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10000000000);
camera.position.set(0,2000,0);
camera.rotation.set(0, -3.14159/2, 0);

const scene = new THREE.Scene();

renderer.render(scene, camera);

// const au = 149598;
const au = 2000;
const c = 299792.458;

function loadTexture(path) {
  const texture = new THREE.TextureLoader().load(path);
  texture.flipY = true;
  
  return texture;
}

var planetTextures = Array(8);
planetTextures[0] = loadTexture('./assets/mercury/textures/Material.002_diffuse.jpeg'); //mercury
planetTextures[1] = loadTexture('./assets/venus/textures/Material.002_diffuse.jpeg'); //venus
planetTextures[2] = loadTexture('./assets/earth/textures/Material.002_diffuse.jpeg'); //earth
planetTextures[3] = loadTexture('./assets/mars/textures/Material.002_diffuse.jpeg'); //mars
planetTextures[4] = loadTexture('./assets/jupiter/textures/Material.002_diffuse.jpeg'); //jupiter
planetTextures[5] = loadTexture('./assets/saturn/textures/Material.002_diffuse.jpeg'); //saturn
planetTextures[6] = loadTexture('./assets/uranus/textures/Material.002_baseColor.jpeg'); //uranus
planetTextures[7] = loadTexture('./assets/neptune/textures/Material.002_diffuse.jpeg'); //neptune

var planets = Array(8);
planets[0] = ["Mercury",[2.44,40,40],{ color: 0x1a1a1a, map: planetTextures[0] },[0.467*au,0,0],[0,0,0]]; //mercury
planets[1] = ["Venus",[6.05,40,40],{ color: 0xe6e6e6, map: planetTextures[1] },[0.728*au,0,0],[0,0,0]]; //venus
planets[2] = ["Earth",[6.38,40,40],{ color: 0x2f6a69, map: planetTextures[2] },[1*au,0,0],[0,0,0]]; //earth
planets[3] = ["Mars",[3.39,40,40],{ color: 0x993d00, map: planetTextures[3] },[1.382*au,0,0],[0,0,0]]; //mars
planets[4] = ["Jupiter",[69.91,40,40],{ color: 0xb07f35, map: planetTextures[4] },[4.95*au,0,0],[0,0,0]]; //jupiter
planets[5] = ["Saturn",[58.23,40,40],{ color: 0xb08f36, map: planetTextures[5] },[9.041 * au,0,0],[0,0,0]]; //saturn
planets[6] = ["Uranus",[25.36,40,40],{ color: 0x5580aa, map: planetTextures[6] },[18.33 * au,0,0],[0,0,0]]; //uranus
planets[7] = ["Neptune",[24.62,40,40],{ color: 0x366896, map: planetTextures[7] },[29.81 * au,0,0],[0,0,0]]; //neptune

function addPlanets(array) {
  for (let index = 0; index < array.length; index++) {
    array[index] = addStandardMatSphere(array[index][1],array[index][2],array[index][3]);
  }
}

function addStandardMatSphere([radius,widthsegs,heightsegs], matprops, [x,y,z]) {
  const geo = new THREE.SphereGeometry( radius, widthsegs, heightsegs )
  const mat = new THREE.MeshStandardMaterial( matprops );
  const sphere = new THREE.Mesh(geo,mat);
  sphere.position.set( x,y,z );
  scene.add(sphere);
  return sphere;
}

function addBasicMatSphere([radius,widthsegs,heightsegs], matprops, [x,y,z]) {
  const geo = new THREE.SphereGeometry( radius, widthsegs, heightsegs )
  const mat = new THREE.MeshBasicMaterial( matprops );
  const sphere = new THREE.Mesh(geo,mat);
  sphere.position.set( x,y,z );
  scene.add(sphere);
  return sphere;
}

function generateStarCoords() {
  var coords = [0,0,0];
  var negPos = [-1,1];
  for (let index = 0; index < coords.length; index++) {
    coords[index] = negPos[randInt(0,1)] * randInt(0,100000000);
  }
  for (let index = 0; index < coords.length; index++) {
    if (Math.abs(coords[index]) > 50000000){
      return coords;
    }
  }
  return generateStarCoords();
}

function generateStarColor() {
  return new THREE.Color("rgb(255, 255, " + randInt(150, 255) + ")");
}

function addStar() {
  return addBasicMatSphere([50000,2,2],{ color: generateStarColor() },generateStarCoords());
}

function addSun() {
  const sunTexture = new THREE.TextureLoader().load('./assets/sun/textures/Material.002_baseColor.jpeg');
  return addBasicMatSphere([696,50,50],{ color: 0xffff99, map: sunTexture },[0,0,0]);
}

addPlanets(planets);
Array(2000).fill().forEach(addStar);
addSun();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// White directional light at half intensity shining from the left.
const pointLight = new THREE.PointLight( 0xffffff, 1, 10000000000 );
scene.add( pointLight );
pointLight.position.set(-1,0,0);

const gridHelper = new THREE.GridHelper(10000000,10000,0x00ff00,0x888888);
scene.add(gridHelper);

let controls = new CustomFlyControls( camera, renderer.domElement );
controls.movementSpeed = 1000;
controls.maxSpeed = c;
controls.minSpeed = 0.001;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 12;
controls.autoForward = false;
controls.dragToLook = true;

const clock = new THREE.Clock();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  console.log(CustomFlyControls);

  document.getElementById('info').innerHTML = 
    "(" + camera.getWorldPosition().x.toFixed(0) + ", " + camera.getWorldPosition().y.toFixed(0) + ", " + camera.getWorldPosition().z.toFixed(0) + ")";
  controls.update(clock.getDelta());

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();