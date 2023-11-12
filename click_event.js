import * as THREE from "three"
import { camera, scene, heartList } from 'main'
import {renderHearts} from "render_hearts"
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var solutionList = new Set([]);

export let heartCnt = 5;
export let solutionCnt = 0;
function removeHeart() {
    heartCnt--;

	// 목숨 소진 시, 점수 집계 후 결과 페이지로 이동
	if(heartCnt === 0) {
		
		const scoreKey = "score_" + Math.floor(Math.random() * 1000);
		const score = solutionCnt*100;
		localStorage.setItem(scoreKey, score);
		window.location.href = "resultpage.html";
	}

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
		solutionCnt = solutionList.size; // 예시 값
		var wholeCnt = 5; // 예시 값
		childDiv.textContent = solutionCnt + '/' + wholeCnt;
		
		if (SolutionDiv[0].firstChild) {
			SolutionDiv[0].replaceChild(childDiv, SolutionDiv[0].firstChild);
		} else {
			SolutionDiv[0].appendChild(childDiv);
		}
 	}
}

