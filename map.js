/********************************************
 * Map
 * Author: rey.olivier@gmail.com
 * License: GPL V3
 * Date: February 27 2023
 *******************************************/
"use strict";

const CANVAS = "newCanvas";

/*--------------------------------------------------------------------------------
Export sous forme d'image
--------------------------------------------------------------------------------*/
function parse() {
    alert("Parse function");
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
    let ctx = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    // Nous positionnons le référentiel classique
    // x vers la doite, y vers le haut et affichage de la zone x et y > 0
    let ref = new Referential(
        {x:  0,             y: h},               // origin
        {x: parseInt(grid), y: 0},               // I
        {x: 0,              y: -parseInt(grid)}, // J
        true
    );
    if (grid != "") {
    let mygrid = new Grid(ctx, w, h, parseInt(grid));
        console.log(mygrid);
        mygrid.draw();
    }
    
    
}

