/********************************************
 * Map
 * Author: rey.olivier@gmail.com
 * License: GPL V3
 * Date: February 27 2023
 *******************************************/
"use strict";

const CANVAS = "newCanvas";
let REF = null;
let CTX = null;

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
            if (elems.length != 3){
                console.warn("Command 'point': missing argument");
                break;
            }
            let p = new Point(CTX, REF, parseInt(elems[1]), parseInt(elems[2]));
            p.draw();
            break;
            //======= pointschain
        case "pointschain":
            if (elems.length < 5){
                console.warn("Command 'pointschain': 4 parameters required at least (2 points)");
                break;
            }            
            let pc = new PointsChain(
                new Point(CTX, REF,parseInt(elems[1]), parseInt(elems[2])),
                new Point(CTX, REF,parseInt(elems[3]), parseInt(elems[4])),
            );
            if (elems.length > 5){
                let nbpoints = (elems.length - 5) / 2;
                if (! Number.isInteger(nbpoints)){
                    console.log(nbpoints);
                    console.warn("Command 'pointschain': parameters invalid after 2 first points");
                    break;
                }
                for (let i = 0; i<nbpoints;i++){
                    pc.addPoint(new Point(CTX, REF,parseInt(elems[2*i + 5]), parseInt(elems[2*i + 6])));
                }
            }
            pc.draw();
            break;
        default:
            console.warn("Command '" + elems[0] + "': unknown");
            break;
        }
        
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
Point d'entrée principal
--------------------------------------------------------------------------------*/
function createCanvas() {
    let wid = document.getElementById("cwidth").value;
    let hei = document.getElementById("cheight").value;
    let grid = document.getElementById("cgrid").value;
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
        {x:  0,             y: h},               // origin
        {x: parseInt(grid), y: 0},               // I
        {x: 0,              y: -parseInt(grid)}, // J
        true
    );
    if (grid != "") {
    let mygrid = new Grid(CTX, w, h, parseInt(grid));
        console.log(mygrid);
        mygrid.draw();
    }
    
    
}

