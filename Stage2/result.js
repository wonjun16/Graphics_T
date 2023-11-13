function getItemsStartingWith(prefix) {
    var keys = Object.keys(localStorage);
    var result = [];
  
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
  
      if (key.startsWith(prefix)) {
        result.push(localStorage.getItem(key));
      }
    }
  
    return result;
  }

// "score_"로 시작하는 모든 키에 해당하는 점수들을 배열로 가져옴
var scores = getItemsStartingWith("score_")
// 내림차순 정렬
var sortedScores = scores.sort((a,b) => b-a).slice(0, 3);;
// 탑 3 텍스트 배열에 저장 like ['1st 300', '2nd 200', '3rd 100']
var prizeString = [];
for(let i = 0; i < 3; i++) {
    var temp = ''
    if(i == 0) {
        temp = '1st ' + sortedScores[i]; 
    } else if(i==1){
        temp = '2nd ' + sortedScores[i]; 
    } else {
        temp = '3rd ' + sortedScores[i];
    }
    prizeString.push(temp);
}

console.log(prizeString)

// <div class='menu'/> 엘리먼트를 선택
var menuDiv = document.querySelector('#middle');

// 각 문자열을 <div class='score'/> 엘리먼트에 담고 <div class='menu'/>에 추가
for (var i = 0; i < prizeString.length; i++) {
  var scoreDiv = document.createElement('div');
  scoreDiv.id = 'score';
  scoreDiv.textContent = prizeString[i];

  // <div class='score'/> 엘리먼트를 <div class='menu'/>의 자식으로 추가
  menuDiv.appendChild(scoreDiv);
}

