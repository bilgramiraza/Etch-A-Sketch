const grid = document.querySelector('.board');
const primary=document.querySelector('#primary');
const secondary=document.querySelector('#secondary');
const dimensions=document.querySelector('#dimensions');
const reset=document.querySelector('#reset');
const pen=document.querySelectorAll('input[name="pen"]');
const gridLines=document.querySelector('input[name="gridLines"');
let isPrimaryPen=false;
let isSecondaryPen=false;
let box= [];
let isRainbow=false;
let isLighten=false;
let isDarken=false;
createGrid();
const cell=document.querySelectorAll('.box');
dimensions.addEventListener('input',createGrid);

reset.addEventListener('click',()=>{
    location.reload();
});

gridLines.addEventListener('click',()=>{
    cell.forEach((item)=>item.classList.toggle('outline'));
});

pen.forEach((item)=>{
    item.addEventListener('change',(event)=>{
        penEffect(event.target.value);
    });
});


function penToggle(press){
    switch(press){
        case 1:isPrimaryPen=!(isPrimaryPen);
            if(isPrimaryPen)
                isSecondaryPen=false;
            break;

        case 3: isSecondaryPen=!(isSecondaryPen);
            if(isSecondaryPen)
                isPrimaryPen=false;
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
            if(isPrimaryPen)
                event.target.style.backgroundColor=primary.value;
        });
        box[i].addEventListener('contextmenu',(event)=>{
            event.preventDefault();
            penToggle(event.which);
            if(isSecondaryPen)
                event.target.style.backgroundColor=secondary.value;
        });
        box[i].addEventListener('mouseover',(event)=>{
            if(isRainbow)
                primary.value='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'); //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
            else if(isLighten)
                primary.value=LightenDarkenColor(event.target.style.backgroundColor,25);
            else if(isDarken){
                primary.value=LightenDarkenColor(event.target.style.backgroundColor,-25);
                console.log("darken");
            }

            if(isPrimaryPen)
                event.target.style.backgroundColor=primary.value;
            else if(isSecondaryPen)
                event.target.style.backgroundColor=secondary.value;
            
        });
        grid.appendChild(box[i]);
    }
}



function penEffect(effect){
    switch(effect){
        case "normal":primary.value="#000000";
            break;
        case "eraser":primary.value="#ffffff";
            break;
        case "rainbow":isRainbow=true;
            isLighten=false;
            isDarken=false;
            break;
        case "lighten":isLighten=true;
            isRainbow=false;
            isDarken=false;
            break;
        case "darken":isDarken=true;
            isLighten=false;
            isRainbow=false;
            break;
    }
    secondary.value="#ffffff";
    if(effect!=="rainbow" && effect!=="lighten" && effect!=="darken"){
        isRainbow=false;
        isLighten=false;
        isDarken=false;
    }
}
function LightenDarkenColor(rgb,mod){
    let RGB=[];
    let rgbholder="";
    let hex=[];

    rgbholder=rgb.slice(4,(rgb.length-1));
    RGB=rgbholder.split(", ");

    RGB.forEach(function(item,index,array){
        hex[index]=parseInt(array[index])+mod;
        if(hex[index]>255)
            hex[index]=255;
        else if(hex[index]<0)
            hex[index]=0;
    });
    hex.forEach(function(item,index){
        hex[index]=(hex[index].toString(16));
        hex[index]=(hex[index].length===1)?"0"+hex[index]:hex[index];
    });
    return '#'+hex.join('');
}
