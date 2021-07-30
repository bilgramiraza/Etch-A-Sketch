const grid = document.querySelector('.board');
const primary=document.querySelector('#primary');
const secondary=document.querySelector('#secondary');
const dimensions=document.querySelector('#dimensions');
const reset=document.querySelector('#reset');
const pen=document.querySelectorAll('input[name="pen"]');
let primaryPen=false;
let secondaryPen=false;
let box= [];
let rainbow=false;
let lighten=false;
let darken=false;
createGrid();
dimensions.addEventListener('input',createGrid);

reset.addEventListener('click',()=>{
    location.reload();
});


pen.forEach((item)=>{
    item.addEventListener('change',(event)=>{
        penEffect(event.target.value);
    });
});


function penToggle(press){
    switch(press){
        case 1:primaryPen=!(primaryPen);
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
            if(rainbow)
                primary.value='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'); //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
            else if(lighten)
                primary.value=LightenDarkenColor(event.target.style.backgroundColor,25);
            else if(darken){
                primary.value=LightenDarkenColor(event.target.style.backgroundColor,-25);
                console.log("darken");
            }

            if(primaryPen)
                event.target.style.backgroundColor=primary.value;
            else if(secondaryPen)
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
        case "rainbow":rainbow=true;
            lighten=false;
            darken=false;
            break;
        case "lighten":lighten=true;
            rainbow=false;
            darken=false;
            break;
        case "darken":darken=true;
            lighten=false;
            rainbow=false;
            break;
    }
    secondary.value="#ffffff";
    if(effect!=="rainbow" && effect!=="lighten" && effect!=="darken"){
        rainbow=false;
        lighten=false;
        darken=false;
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
