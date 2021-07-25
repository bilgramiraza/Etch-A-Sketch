const grid = document.querySelector('.board');
const penColor=document.querySelector('#penColor');
const reset=document.querySelector('label>button');

function gridMaker(rows,colums){
    for(let i =0;i<rows;i++)
        for(let j =0;j<colums;j++){
            const box = document.createElement('div');
            box.classList.add('box');
            grid.appendChild(box);
        }
}
window.onload = gridMaker(16,16);


reset.addEventListener('click',()=>{
    const rows=document.querySelector('#rows');
    const columns=document.querySelector('#columns');
    gridMaker(rows.value,columns.value)
});