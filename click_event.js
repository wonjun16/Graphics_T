import * as THREE from "three"
import { camera, scene, heartList } from 'main'
import {renderHearts} from "render_hearts"
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var solutionList = new Set([]);

let heartCnt = 5;
function removeHeart() {
    heartCnt--;
    for (let i = 1; i <= heartList.length; i++){
        if(i > heartCnt) {
            heartList[i-1] = "x"
        }
    }
    renderHearts(heartList);
}

// 클릭 이벤트 핸들러	
export function onClick(event) {
    // 마우스 좌표를 정규화
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 레이캐스팅을 통해 클릭한 오브젝트 찾기
    raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(scene.children);
	const clickedObject = intersects[0]?.object
	if (intersects.length > 0) {
        // 큐브면 배열에 추가
		if (clickedObject.name.startsWith("cube")){
			solutionList.add(intersects[0].object.id)
		} else {
            if(heartCnt > 0) removeHeart();
        }
        // html 반영
	  	const SolutionDiv = document.getElementsByClassName("solution");
		const childDiv = document.createElement('div');
		childDiv.classList.add('count');
		var curCount = solutionList.size; // 예시 값
		var wholeCnt = 5; // 예시 값
		childDiv.textContent = curCount + '/' + wholeCnt;
		
		if (SolutionDiv[0].firstChild) {
			SolutionDiv[0].replaceChild(childDiv, SolutionDiv[0].firstChild);
		} else {
			SolutionDiv[0].appendChild(childDiv);
		}
 	}
}

