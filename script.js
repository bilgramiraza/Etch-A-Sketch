const grid = document.querySelector('.board');
const primary=document.querySelector('#primary');
const secondary=document.querySelector('#secondary');
const reset=document.querySelector('label>button');
const dimensions=document.querySelector('#dimensions');
let primaryPen=false;
let secondaryPen=false;
let box= [];

window.onload=createGrid();

dimensions.addEventListener('input',createGrid);

box.forEach((cell)=>{
    cell.addEventListener('click',(event)=>{
        penToggle(event.which);
        if(primaryPen)
            event.target.style.backgroundColor=primary.value;
    });
    cell.addEventListener('contextmenu',(event)=>{
        event.preventDefault();
        penToggle(event.which);
        if(secondaryPen)
            event.target.style.backgroundColor=secondary.value;
    });
    cell.addEventListener('mouseover',(event)=>{
        if(primaryPen)
            event.target.style.backgroundColor=primary.value;
        else if(secondaryPen)
            event.target.style.backgroundColor=secondary.value;
    })
});

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
        box[i]=document.createElement('div');
        box[i].classList.add('box');
        grid.appendChild(box[i]);
    };

}