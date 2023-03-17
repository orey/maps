/********************************************
 * Map
 * Author: rey.olivier@gmail.com
 * License: GPL V3
 * Date: February 27 2023
 *******************************************/
"use strict";

const CANVAS = "newCanvas";
let REF = null;
let MOUSE_REF = null;
let CTX = null;

/*
PC = true => PointChain
PC = false => ClosedArea
*/
function complexGrammar(elems, PC) {
    if (elems.length < 3){
        if (PC)
            console.warn("Command 'pointschain': 2 parameters required at least (2 points)");
        else
            console.warn("Command 'closedarea': 2 parameters required at least (2 points)");
    }
    let temp1 = elems[1].split(':');
    let temp2 = elems[2].split(':');
    let pc = null;
    if (PC)
        pc = new PointsChain(
            new Point(CTX, REF,parseInt(temp1[1]), parseInt(temp1[2])),
            new Point(CTX, REF,parseInt(temp2[1]), parseInt(temp2[2])),
        );
    else
        pc = new ClosedArea(
            new Point(CTX, REF,parseInt(temp1[1]), parseInt(temp1[2])),
            new Point(CTX, REF,parseInt(temp2[1]), parseInt(temp2[2])),
        );
    let size2 = 1;
    let color2 = "blue";
    let tofill = false;
    if (elems.length > 3){
        let p = null;
        for (let subcommand of elems.slice(3)) {
            let token = subcommand.split(':');
            switch (token[0]) {
            case 'pt':
                p = new Point(CTX, REF, parseInt(token[1]), parseInt(token[2]));
                pc.addPoint(p);
                break;
            case 'color':
                color2 = token[1];
                break;
            case 'size':
                size2 = token[1];
                break;
            default:
                if (PC)
                    console.warn("Command 'pointschain': argument not valid: " + token);
                else
                    console.warn("Command 'closedarea': argument not valid: " + token);
                break;
            }                        
        }
    }
    pc.draw(color2,size2,tofill);   
}


/*--------------------------------------------------------------------------------
Export sous forme d'image
--------------------------------------------------------------------------------*/
function parse() {
    let commands = document.getElementById("ccommands").value;
    console.log(commands);
    let lines = commands.split('\n');
    let elems = [];
    for (let command of lines) {
        elems = command.split(' ');
        console.log(elems);
        switch(elems[0]) {
            //====== point
        case "point":
            let p = null;
            let color = "";
            let label = "";
            let poslabel = "";
            let size = "";
            for (let subcommand of elems.slice(1)) {
                // next stuff is coordinates
                let token = subcommand.split(':');
                switch (token[0]) {
                case 'pt':
                    p = new Point(CTX, REF, parseInt(token[1]), parseInt(token[2]));
                    break;
                case 'color':
                    color = token[1];
                    break;
                case 'label':
                    label = token[1].replace(/_/g, " ");
                    break;
                case 'poslabel':
                    poslabel = token[1];
                    break;
                case 'size':
                    size = token[1];
                    break;
                default:
                    console.warn("Command 'point': argument not valid: " + token);
                    break;
                }
            }
            if (p == null) {
                console.warn("Command 'point': argument not valid: " + token);
                break;
            }
            if (label != "") p.label = label;
            if (poslabel != "") p.orient = poslabel;
            if (size != "") p.size = parseInt(size);
            if (color != "")
                p.draw(color);
            else
                p.draw();
            break;
            //======= pointschain
        case "pointschain":
            complexGrammar(elems, true);
            break;
        case "closedarea":
            complexGrammar(elems,false);
            break;
        default:
            console.warn("Command '" + elems[0] + "': unknown");
            break;
        }
        
    }
    
}

/*--------------------------------------------------------------------------------
Sauvegarder les commandes
--------------------------------------------------------------------------------*/
function save() {
    let d = new Date();
    let filename = String(d.getFullYear())
        + String(d.getMonth()).padStart(2, '0')
        + String(d.getDate()).padStart(2, '0') + '-'
        + String(d.getHours()).padStart(2, '0')
        + String(d.getMinutes()).padStart(2, '0')
        + String(d.getSeconds()).padStart(2, '0') + '.map';

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'
                         + encodeURIComponent(document.getElementById('ccommands').value));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
}

function uploadFile() {
    const content = document.querySelector('.content');
    const [file] = document.querySelector('input[type=file]').files;
    const reader = new FileReader();
    
    reader.addEventListener("load", () => {
        // this will then display a text file on the console
        console.log(reader.result);
        document.getElementById('ccommands').value = reader.result;
    }, false);
    
    if (file) {
        reader.readAsText(file);
    }
}



/*--------------------------------------------------------------------------------
Export sous forme d'image
--------------------------------------------------------------------------------*/
function exportImage() {
    var img = new Image();
    let canvas = document.getElementById(CANVAS);
    img.src = canvas.toDataURL();
    document.body.appendChild(img);
}

/*--------------------------------------------------------------------------------
Print mouse position
--------------------------------------------------------------------------------*/
function printMousePosition(canvas, event){
    let div = document.getElementById("coord");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("x: %d, y: %d", x, y);
    console.log(MOUSE_REF);
    div.innerHTML = "x: "
        + Math.round(MOUSE_REF.convertCoordinates({x, y}).x)
        + " | y: "
        + Math.round(MOUSE_REF.convertCoordinates({x, y}).y);
}

/*--------------------------------------------------------------------------------
Point d'entrée principal
--------------------------------------------------------------------------------*/
function createCanvas() {
    let wid = document.getElementById("cwidth").value;
    let hei = document.getElementById("cheight").value;
    let grid = document.getElementById("cgrid").value;
    let refgrid = grid == "" ? 10 : parseInt(grid);
    // remplissage élément dic avec un canvas
    document.getElementById("canvas").innerHTML =
        '<canvas id="'
        + CANVAS
        + '" width="'
        + wid
        + '" height="'
        + hei
        + '" style="border:2px solid #000000;"></canvas>';
    // récupérer l'objet HTML canvas
    let canvas = document.getElementById(CANVAS);
    CTX = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    // Nous positionnons le référentiel classique
    // x vers la doite, y vers le haut et affichage de la zone x et y > 0
    REF = new Referential(
        {x:  0,      y: h},        // origin
        {x: refgrid, y: 0},        // I
        {x: 0,       y: -refgrid}, // J
        true
    );
    if (grid != "") {
        let mygrid = new Grid(CTX, w, h, parseInt(grid));
        console.log(mygrid);
        mygrid.draw();
    }
    MOUSE_REF = new Referential(
        {x:  0,                    y: h/refgrid },        // origin
        {x: 1/refgrid, y: 0},        // I
        {x: 0,                     y: -1/refgrid}, // J
        true
    );
    canvas.addEventListener(
        "click",
        function(e)
        {
            printMousePosition(canvas, e);
        }
    );
    
    
}

