/********************************************
 * Code pour éléments graphqiues
 * Author: rey.olivier@gmail.com
 * License: GPL V3
 * Date: February 27 2023
 *******************************************/
"use strict";

let X = 0,
    Y = 0,
    CANVAS = "";

/*
Le référentiel original est celui du canvas
Origin en haut à gauche, axe des x vers la doite et des y vers le bas
---
Référentiel original R (O, i, j)
Référentiel nouveau R' (O', I, J)
H(x,y) dans R et H(X,Y) dans R'
I = ai + bj
J = ci + dj
avec ad-bc != 0
x = aX + cY + x0
y = bX + dY + y0
*/
class Referential {
    // Un nouveau référentiel est défini par une origine et deux vecteurs définis dans l'ancien référentiel
    constructor(ptOrigin, vectorI, vectorJ, originalReferential=, verbose=false){
        this.origin = ptOrigin;
        this.I = vectorI;
        this.J = vectorJ;
        this.verbose = verbose;
        if (verbose){
            console.log("Referential");
            console.log(this.origin);
            console.log(this.I);
            console.log(this.J);
        }
        this.ref_origin = { x:0, y:0 };
        this.ref_i      = { x:1, y:0 };
        this.ref_j      = { x:0, y:1 };
    }

    // Option: le référentiel défini est composé des coordonnées de O', I et J dans un référentiel original O,i,j
    // Mais nous allons avoir besoin de faire parfois une double transformation. Dans ce cas, le référentiel
    // original n'est pas O, 1, 1 mais un autre
    setOriginalReferential(ori, i, j) {
        this.ref_origin = ori;
        this.ref_i      = i;
        this.ref_j      = i;
    }
    
    // Cette fonction convertit les coordonnées dans le nouveau référentiel en coordonnées dans l'ancien
    // typiquement dans les coordonnées traçables
    convertCoordinates(ptNew) {
        return {
            x: (this.I.x * ptNew.x) + (this.J.x * ptNew.y) + this.origin.x ,
            y: (this.I.y * ptNew.x) + (this.J.y * ptNew.y) + this.origin.y
        };
    }

    // Identity in the case of the original referential
    convertCoordinatesOriginal(ptNew) {
        let pt = this.convertCoordinates(ptNew);
        return {
            x: (this.ref_i.x * pt.x) + (this.ref_j.x * pt.y) + this.ref_origin.x ,
            y: (this.ref_i.y * pt.x) + (this.ref_j.y * pt.y) + this.ref_origin.y
        }
    }
    
}

class Cell {
    constructor(x, y, h, v, verbose=false) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.v = v;
        this.verbose = verbose;
        if (this.verbose)
            console.log("x: %d - y: %d - w: %d - h: %d", x, y, h, v);
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x + 10 , this.y + 10 , this.h - 20 , this.v - 20);
        ctx.beginPath();
        ctx.fillStyle = "red"
        ctx.textAlign = "center";
        ctx.font = "20px serif";
        ctx.fillText("Zone Jaune", this.x + Math.trunc(this.h/2), this.y + Math.trunc(this.v/2));
        let step_h = Math.trunc(this.h/10);
        let step_v = Math.trunc(this.v/10);
        for (let i=0;i<11;i++) {
            drawPoint(ctx,{ x: this.x + (i*step_h), y: this.y }             , "red", 2 );
            drawPoint(ctx,{ x: this.x + (i*step_h), y: this.y + this.v }    , "red"    );
            drawPoint(ctx,{ x: this.x             , y: this.y + (i*step_v) }, "red"    );
            drawPoint(ctx,{ x: this.x + this.h    , y: this.y + (i*step_v) }, "red"    );
        }
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.quadraticCurveTo(300, 200, 500, 100);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        
    }
}

function drawPoint(ctx, pt, color="blue", siz=2) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(pt.x, pt.y, siz, 0, 2*Math.PI);
    ctx.fill();
}



function printStuff(canvas) {
    var ctxt = canvas.getContext("2d");
    /*
      ctxt.fillRect(x, y, width, height)
      // Draws a filled rectangle.

      ctxt.strokeRect(x, y, width, height)
      // Draws a rectangular outline.
      
      ctxt.clearRect(x, y, width, height)
      // Clears the specified rectangular area, making it fully transparent.
      */
    ctxt.beginPath();
    // ctxt.strokeStyle = "#E0E0E0";
    ctxt.strokeStyle = "#E8E8E8";
    //ctxt.strokeRect(500, 400, 100, 100);
    let step = 20;
    for (let i=0;i<=X;i=i+step) {
        for (let j=0;j<=Y;j=j+step) {
            ctxt.strokeRect(i, j, step, step);
            //console.log("%d %d",i,j);
        }
    }
    ctxt.fillStyle = "orange";
    ctxt.beginPath();
    ctxt.moveTo(75, 50);
    ctxt.lineTo(100, 75);
    ctxt.lineTo(100, 25);
    ctxt.closePath();
    ctxt.fill();

    console.log("entre les deux");

    let cell = new Cell(350,350,200,300, true);
    cell.draw(ctxt);
    
}


function printSpace() {
    console.log("%d", X, Y);
}

function main(can, x, y) {
    X = x;
    Y = y;
    printSpace();
    let canvas = document.getElementById(can);
    printStuff(canvas);
}

function testReferential(ctx, origin, I, J){
    let ref = new Referential(origin, I, J, true);
    let pt1 = {x: 2, y:2};
    console.log(pt1);
    let pt2 = ref.convertCoordinates(pt1);
    console.log(pt2);
    drawPoint(ctx,pt2,"green");
}



/*
point object with 2 coordinates{x: 12, y:345}
--
H is the coordinates of the point target of two lines in the quadratic curve
We calculate H coodinates in the referential of the AB segment, A being the origin
We name Y the segment AY orthognal to AB in A
ABY is an orthogonal referential with AB as the relative measure "1"

horizontalOffset is the x coordinate of H in AB referential
horizontalOffset is expressed in % of the AB length. If 0%, xH = 0, the same as A
If 100%, xH = AB, so the same as B

verticalOffset is the height orthogonal to the segment AB, the y coordinate of H
verticalOffset is in percentage noted decimal 0.1 means 10% of AB, 2 means 200%, it can be negative

All can be negative

Référentiel original R (O, i, j)
Référentiel nouveau R' (O', I, J)
H(x,y) dans R et H(X,Y) dans R'
I = ai + bj
J = ci + dj
avec ad-bc != 0
x = aX + cY + x0
y = bX + dY + y0
*/
function drawContinuousLine(pointA, verticalOffset, horizontalOffset, pointB, pointC, Aorigin=true) {
    // Calculer les coordonnées dans R du point Z, ZAB rectangle ZA = AB
    
    
}



function createCanvas() {
    let can = "newCanvas";
    let wid = document.getElementById("cwidth").value;
    let hei = document.getElementById("cheight").value;
    // remplissage élément dic avec un canvas
    document.getElementById("canvas").innerHTML =
        '<canvas id="'
        + can
        + '" width="'
        + wid
        + '" height="'
        + hei
        + '" style="border:2px solid #000000;"></canvas>';
    //alert("Hello!");
    let canvas = document.getElementById(can);
    var ctxt = canvas.getContext("2d");
    // à modifier
    main("newCanvas", wid, hei);
    // test ref
    testReferential(
        ctxt,
        {x: 0, y:800},
        {x:10, y:0},
        {x: 0, y: -10}
    );
}



