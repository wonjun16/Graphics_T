import * as THREE from "three";
import {PointerLockControls} from "PointerLockControls";
import {OrbitControls} from "OrbitControls";
import {GLTFLoader} from "GLTFLoader";

let APressed = false;
let DPressed = false;
let WPressed = false;
let SPressed = false;

document.addEventListener('keydown', function(event) {
    if (event.key === 'a') {
        APressed = true;
    }
	if (event.key === 'w') {
        WPressed = true;
    }
	if (event.key === 's') {
        SPressed = true;
    }
	if (event.key === 'd') {
        DPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'a') {
        APressed = false;
    }
	if (event.key === 'w') {
        WPressed = false;
    }
	if (event.key === 's') {
        SPressed = false;
    }
	if (event.key === 'd') {
        DPressed = false;
    }
});

window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);
	renderer.outputEncoding = THREE.sRGBEncoding;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	//카메라 시작 지점
	const camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	//camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 5;
	camera.position.y = 5;
	camera.position.z = 5;

	//const controls = new OrbitControls(camera, renderer.domElement);

	//마우스로 시야 전환
	const pointerLock = new PointerLockControls(camera, document.body);

	document.addEventListener("click",()=>pointerLock.lock());

	const hlight = new THREE.AmbientLight (0x404040,50);
	scene.add(hlight);

	const light = new THREE.PointLight(0xc4c4c4,10);
	light.position.set(0,3000,5000);
	scene.add(light);

	const loader = new GLTFLoader();
	loader.load('models/billiards_room/scene.gltf', function(gltf){
	  const map = gltf.scene.children[0];
	  map.scale.set(1.0,1.0,1.0);
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	function animate() {
		//카메라 정면 벡터값
		const cameraDirection = new THREE.Vector3();
    	camera.getWorldDirection(cameraDirection);

		// 코사인(-90도)을 곱해서 회전 적용
		const angle = -90 * (Math.PI / 180);
		const cosAngle = Math.cos(angle);
		const newX = cameraDirection.x * cosAngle - cameraDirection.z * Math.sin(angle);
		const newZ = cameraDirection.x * Math.sin(angle) + cameraDirection.z * cosAngle;

		// 'a'를 누르고 있을 때 왼쪽으로 이동
		if (APressed) {
			camera.position.x += newX * 0.1;
			camera.position.z += newZ * 0.1;
		}
		// 'd'를 누르고 있을 때 오른쪽으로 이동
		if (DPressed) {
			camera.position.x -= newX * 0.1;
			camera.position.z -= newZ * 0.1;
		}
		// 'w'를 누르고 있을 때 앞으로 이동
		if (WPressed) {
			camera.position.x += cameraDirection.x * 0.1;
			camera.position.z += cameraDirection.z * 0.1;
		}
		// 's'를 누르고 있을 때 뒤로 이동
		if (SPressed) {
			camera.position.x -= cameraDirection.x * 0.1;
			camera.position.z -= cameraDirection.z * 0.1;
		}

	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}
}