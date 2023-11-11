export function renderHearts(heartImgList){
    const heartList = document.getElementsByClassName("heart_list");
    const childDiv = document.createElement('div');
    childDiv.classList.add('heart_box');
    for (let i = 1; i <= heartImgList.length; i++) {
        const img = document.createElement('img')
        img.classList.add("heart")

        if (heartImgList[i - 1] == 'o') {
            img.src = "../icon/heart.png"
        } else {
            img.src = "../icon/heart_gray.png"
        }

        childDiv?.appendChild(img)
    }
    if (heartList[0].firstChild) {
        heartList[0].replaceChild(childDiv, heartList[0].firstChild);
    } else {
        heartList[0].appendChild(childDiv);
    }
}