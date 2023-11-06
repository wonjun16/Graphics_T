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
	camera.position.x = -1;
	camera.position.y = 5;
	camera.position.z = 8;

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

	  // 회전할 각도를 라디안으로 계산
	  const angleInRadians = 16 * Math.PI / 180;

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

		if (
			camera.position.x + moveX <= 4.73 &&
			camera.position.x + moveX >= -6.26 &&
			camera.position.z + moveZ <= 9.19 &&
			camera.position.z + moveZ >= -7.69
		  ) {
			camera.position.x += moveX;
			camera.position.z += moveZ;
		  }

	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}
}