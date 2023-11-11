import * as THREE from "three"
import {PointerLockControls} from "PointerLockControls";
import {OrbitControls} from "OrbitControls";
import {GLTFLoader} from "GLTFLoader";
import { mouseMove } from "mouseMove";

let APressed = false;
let DPressed = false;
let WPressed = false;
let SPressed = false;
let CPressed = false;

const canvas = document.getElementById( "gl-canvas" );
export const camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
export const scene = new THREE.Scene();

export let heartCnt = 5;
export let heartList = ["o", "o", "o", "o", "o"];


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
	if (event.key === 'c') {
        CPressed = true;
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
	if (event.key === 'c') {
        CPressed = false;
    }
});
window.onload = function init()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	scene.background = new THREE.Color(0x000000);
	
	//camera.rotation.y = 45/180*Math.PI;
	camera.position.x = -1;
	camera.position.y = 6.5;
	camera.position.z = 8;

	//const controls = new OrbitControls(camera, renderer.domElement);

	//마우스로 시야 전환
	// const pointerLock = new PointerLockControls(camera, document.body);
	const MouseMove = new mouseMove(camera, document.body);

	const hlight = new THREE.AmbientLight (0x404040,50);
	scene.add(hlight);

	const light = new THREE.PointLight(0xc4c4c4,10);
	light.position.set(0,3000,5000);
	scene.add(light);
	const loader = new GLTFLoader();
	loader.load('../models/armoury/scene.gltf', function(gltf){
	  const map = gltf.scene.children[0];
	  map.scale.set(1.0,1.0,1.0);

	  // 회전할 각도를 라디안으로 계산
	  const angleInRadians = 48 * Math.PI / 180;

	  //Euler 객체를 생성하여 회전 각도를 설정
	  const rotation = new THREE.Euler(0, angleInRadians, 0);

	  // gltf.scene의 rotation 속성에 새로운 회전값을 할당
	  gltf.scene.rotation.copy(rotation);

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

		let moveX = 0.0;
		let moveZ = 0.0;

		// 'a'를 누르고 있을 때 왼쪽으로 이동
		if (APressed) {
			moveX += newX * 0.1;
			moveZ += newZ * 0.1;
		}
		// 'd'를 누르고 있을 때 오른쪽으로 이동
		if (DPressed) {
			moveX -= newX * 0.1;
			moveZ -= newZ * 0.1;
		}
		// 'w'를 누르고 있을 때 앞으로 이동
		if (WPressed) {
			moveX += cameraDirection.x * 0.1;
			moveZ += cameraDirection.z * 0.1;
		}
		// 's'를 누르고 있을 때 뒤로 이동
		if (SPressed) {
			moveX -= cameraDirection.x * 0.1;
			moveZ -= cameraDirection.z * 0.1;
		}
		if(CPressed){
			if(camera.position.y > 3.5) camera.position.y -= 0.1;
		}
		else{
			if(camera.position.y < 6.5) camera.position.y += 0.1;
		}


		if (
			camera.position.x + moveX <= 8.72 &&
			camera.position.x + moveX >= -7.52 &&
			camera.position.z + moveZ <= 8.33 &&
			camera.position.z + moveZ >= -9.16
		  ) {
			camera.position.x += moveX;
			camera.position.z += moveZ;
		  }

	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}
}