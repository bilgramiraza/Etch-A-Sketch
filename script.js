const grid = document.querySelector('.board');
const primary=document.querySelector('#primary');
const secondary=document.querySelector('#secondary');
const dimensions=document.querySelector('#dimensions');
const reset=document.querySelector('#reset');
const pen=document.querySelectorAll('input[name="pen"]');
let primaryPen=false;
let secondaryPen=false;
let box= [];
createGrid();
dimensions.addEventListener('input',createGrid);

reset.addEventListener('click',()=>{
    location.reload();});


function penToggle(press){
    switch(press){
        case 1: primaryPen=!(primaryPen);
                if(primaryPen)
                    secondaryPen=false;
                break;
        case 3: secondaryPen=!(secondaryPen);
                if(secondaryPen)
                    primaryPen=false;
                break;
    }
}

function createGrid(){
    grid.style.gridTemplateColumns=`repeat(${dimensions.value}, 1fr)`;
    grid.style.gridTemplateRows=`repeat(${dimensions.value}, 1fr)`;
    for(let i=0;i<(parseInt(dimensions.value)**2);i++){
        if(box[i]){
            grid.removeChild(box[i]);
        }
        box[i]=document.createElement('div');
        box[i].classList.add('box');
        box[i].style.backgroundColor=secondary.value;

        box[i].addEventListener('click',(event)=>{
            penToggle(event.which);
            if(primaryPen)
                event.target.style.backgroundColor=primary.value;
        });
        box[i].addEventListener('contextmenu',(event)=>{
            event.preventDefault();
            penToggle(event.which);
            if(secondaryPen)
                event.target.style.backgroundColor=secondary.value;
        });
        box[i].addEventListener('mouseover',(event)=>{
            if(primaryPen)
                event.target.style.backgroundColor=primary.value;
            else if(secondaryPen)
                event.target.style.backgroundColor=secondary.value;
        });
        grid.appendChild(box[i]);
    }
}