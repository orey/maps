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
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(this.x + (i*step_h), this.y, 2, 0, 2*Math.PI);
            ctx.fill()
            ctx.beginPath();
            ctx.arc(this.x + (i*step_h), this.y + this.v, 2, 0, 2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y + (i*step_v), 2, 0, 2*Math.PI);
            ctx.fill()
            ctx.beginPath();
            ctx.arc(this.x + this.h, this.y + (i*step_v), 2, 0, 2*Math.PI);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.quadraticCurveTo(300, 200, 500, 100);
        ctx.strokeStyle = "blue";
        ctx.stroke();
        
    }
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
function draw continuousLine(pointA, verticalOffset, horizontalOffset, pointB, pointC, Aorigin=true) {
    // Calculer les coordonnées dans R du point Z, ZAB rectangle ZA = AB
    
    
}



function createCanvas() {
    let wid = document.getElementById("cwidth").value;
    let hei = document.getElementById("cheight").value;
    document.getElementById("canvas").innerHTML = '<canvas id="newCanvas" width="'
        + wid
        + '" height="'
        + hei
        + '" style="border:2px solid #000000;"></canvas>';
    //alert("Hello!");
    main("newCanvas", wid, hei);
}



