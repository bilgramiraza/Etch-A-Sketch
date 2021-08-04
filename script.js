//GLOBAL CONSTANTS
const BLACK="#000000";
const WHITE="#FFFFFF";
const LIGHTEN10=25;
const DARKEN10=-25;
//GLOBAL CONSTANTS

//EVENT HANDLERS DECLARATIONS 
const dimensions=document.querySelector('#dimensions');
const reset=document.querySelector('#reset');
const pen=document.querySelectorAll('input[name="pen"]');
const gridLines=document.querySelector('input[name="gridLines"');
//EVENT HANDLERS DECLARATIONS 

// PEN'S MODE TRACKING FLAGS
let isPrimaryPen=false;
let isSecondaryPen=false;
let isRainbow=false;
let isLighten=false;
let isDarken=false;
//PEN'S MODE TRACKING FLAGS

//STARTUP FUNCTION
window.onload = createGrid(parseInt(dimensions.value));
//STARTUP FUNCTION

//TOOLBAR EVENT HANDLERS
//Recreate the grid if the griz size has been changed
dimensions.addEventListener('input',()=>{
    destroyGrid();
    createGrid(parseInt(dimensions.value));
});

//Reloads the Page AKA resets the page
reset.addEventListener('click',()=>{
    location.reload();
});

//Adds or removes the grid lines on the board AKA adds or removes the outline around the cells using a class
gridLines.addEventListener('click',()=>{
    const cell=document.querySelectorAll('.box');
    if(gridLines.checked)
        cell.forEach((item)=>item.classList.add('outline'));
    else
        cell.forEach((item)=>item.classList.remove('outline'));
});

//Used to change the Pen's mode(Normal/Eraser/Random Color/Lightening/Darkening)
pen.forEach((item)=>{
    item.addEventListener('change',(event)=>{
        penEffect(event.target.value);
    });
});

//Checks which mouse input is being used M1 or M2 
//To select Primary Color or Secondary Color for the Cell
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

//Responsible for creating the NxN Grid
function createGrid(gridSize){
    const grid = document.querySelector('.board');
    setGridSize(gridSize,grid);
    let box;
    for(let i=0;i<gridSize**2;i++){
        box=initCell();         //a set of properties are returned to the object
        cellInteractions(box);  //event handlers are attached to this object
        grid.appendChild(box);  //object is added to the DOM
    }
}

//Since the board uses the grid layout, the board only supports a square layout
//i dynamically set the size of the grid using the 'gridsize' input
function setGridSize(gridSize,grid){
    grid.style.gridTemplateColumns=`repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows=`repeat(${gridSize}, 1fr)`;
}

//I initialize an Object which i return back to the main object. 
//Helps to keep the code cleaner
function initCell(){
    let cell;
    const secondary=document.querySelector('#secondary');
    cell=document.createElement('div');
    cell.classList.add('box');
    cell.style.backgroundColor=secondary.value;
    return cell;
}

//Attaches Event handlers to each individual cell
//the painting works on the basis of a 'toggle' system rather than a 'press and hold' system
function cellInteractions(cell){
    const primary=document.querySelector('#primary');
    const secondary=document.querySelector('#secondary');

    //This checks if M1 has been clicked
    cell.addEventListener('click',(event)=>{
        penToggle(event.which);             //enables M1 and disables M2
        if(isPrimaryPen)                    //colors this specific cell.
            event.target.style.backgroundColor=primary.value;
    });

    //Checks if M2 has been clicked
    cell.addEventListener('contextmenu',(event)=>{
        event.preventDefault();             //disables the context menu 
        penToggle(event.which);             //enables M2 and disables M1
        if(isSecondaryPen)                  //colors this specific cell.
            event.target.style.backgroundColor=secondary.value;
    });

    // Changes the color of the grid depending on whether M1 or M2 has been toggled
    //Color change is either the Primary/Secondary color depending on the Mode.
    cell.addEventListener('mouseover',(event)=>{
        if(isRainbow)       //Code to Change the primary color to a random color. (16777215) is the max permutations of a 6 digit 15(hex) combo
            primary.value='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'); //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj 
                            //Has padding in case number is 4/5 digits(edge case)
        else if(isLighten)  //Changes the primary color by increasing saturation by 10%
            primary.value=LightenDarkenColor(event.target.style.backgroundColor,LIGHTEN10);
        else if(isDarken)   //Changes the primary color by decreasing saturation by 10%
            primary.value=LightenDarkenColor(event.target.style.backgroundColor,DARKEN10);

        if(isPrimaryPen)    //applies the primary color if M1 flag is set to True
            event.target.style.backgroundColor=primary.value;
        else if(isSecondaryPen)     //applies the secondary color if M1 flag is set to True
            event.target.style.backgroundColor=secondary.value;
    });
}

//function to delete all the grid cells 
//Works by leveraging the fact that quarySelectorAll returns a nodelist of ALL elements with 'box' class
// We take the node list and run it through an iteration  and delete every individual node
function destroyGrid(){
    let box=document.querySelectorAll('.box');
    box.forEach((item)=>item.remove());
}

//function to set the Mode of the pen. 
function penEffect(effect){
    const primary=document.querySelector('#primary');
    const secondary=document.querySelector('#secondary');
    switch(effect){
        case "normal":primary.value=BLACK;  //basic Default Mode
            break;
        case "eraser":primary.value=WHITE;  //Sets primary color to white
            break;
        case "rainbow":isRainbow=true;      //Sets the mode to Random color mode 
            isLighten=false;                //Also sets the other modes to False
            isDarken=false;                 //Since it cannot be in multiple modes
            break;                          //At once
        case "lighten":isLighten=true;
            isRainbow=false;
            isDarken=false;
            break;
        case "darken":isDarken=true;
            isLighten=false;
            isRainbow=false;
            break;
    }
    secondary.value=WHITE;              //Sets the Secondary color to white 
    if(effect!=="rainbow" && effect!=="lighten" && effect!=="darken"){  //Reset condition incase the current mode is 
        isRainbow=false;                                                //neither of the Three options
        isLighten=false;
        isDarken=false;
    }
    if(effect==="normal")               //Hides or shows the Color selection 
        toggleColorPanel(true);         //if normal mode is selected
    else
        toggleColorPanel(false);
    const display=document.querySelector(".display");
    display.textContent=effect.toUpperCase();
}

//Function to Increase or decrease the brightness of a color 
//The backgroundcolor returns values in a string format in 'rgb(xxx,yyy,zzz)' format
//So we strip the 'rgb('  and ')' values from the string then split the string into 3 sub strings containing only the numbers
//We convert them to integers then integers. Then add/subtract '25' (10% of 255) to the initial number to stimulate a 10% increase/decrease of saturation in color
//finally we convert these numbers to a hexadecimal number combine them into a string and return it. 
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

//Function to hide or show the 'Color Selection Panel' 
//does so by simply adding or removing the 'hide' class 
//which sets "display:none" 
function toggleColorPanel(flag){
    const colorPanel=document.querySelector(".colorPanel");
    if(flag)
        colorPanel.classList.remove("hide");
    else
        colorPanel.classList.add("hide");
}