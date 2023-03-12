/********************************************
 * Code pour éléments graphiques
 * Author: rey.olivier@gmail.com
 * License: GPL V3
 * Date: February 27 2023
 *******************************************/
"use strict";

/*--------------------------------------------------------------------------------
class without encapsulation
Permet d'encapsuler les x, y mais aussi le style du point,
son référentiel et le ctx du canvas.
--------------------------------------------------------------------------------*/
class Point {
    // can be accessed directly
    size = 2;
    label = "";
    align = "center";
    font= "12px serif";
    offset = 10; //pixels
    orient = "S"; // N, S, W, E

    constructor(ctx, ref, x, y) {
        this.ctx = ctx;
        this.ref = ref;
        this.x = x;
        this.y = y;
    }

    //draw is always in the context of the referential
    draw(color="blue") {
        let temp = this.ref.convertCoordinatesOriginal({x: this.x, y: this.y});
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(Math.round(temp.x), Math.round(temp.y), this.size, 0, 2*Math.PI);
        this.ctx.fill();
        if (this.label != "") {
            this.ctx.beginPath();
            this.ctx.textAlign = this.align;
            this.ctx.font = this.font;
            //warning: offset is in absolute !!! TODO: integrate alignment
            let xoffset = 0, yoffset = 0;
            let southCorrection = Math.round(this.offset * 2 / 3);
            let northCorrection = Math.round(this.offset * 1 / 3);
            switch (this.orient) {
            case 'N':
                yoffset = -this.offset + northCorrection;
                break;
            case 'S':
                yoffset = this.offset + southCorrection;
                break;
            case 'W':
                xoffset = -this.offset;
                break;
            case 'E':
                xoffset = this.offset;
                break;
            default:
                break;
            }
            this.ctx.fillText(
                this.label,
                Math.round(temp.x) + xoffset,
                Math.round(temp.y) + yoffset
            );
        }
    }

    setLabel(label, orient="S") {
        this.label = label;
        this.orient = orient;
    }
}


/*--------------------------------------------------------------------------------
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
--------------------------------------------------------------------------------*/
class Referential {
    // Un nouveau référentiel est défini par une origine et deux vecteurs définis dans l'ancien référentiel
    constructor(ptOrigin, vectorI, vectorJ, verbose=false){
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
    setOriginalReferential(ref) {
        this.ref_origin = ref.origin;
        this.ref_i      = ref.I;
        this.ref_j      = ref.J;
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

    //convertit des coordonnées canvas en coordonnées référentiel
    canvasToRef(x0, y0) {
        return {
            x: 0,
            y: 0
        }
    }
    
}

// fonction de base dans le référentiel absolu
// cette focntion doit être réservée aux points bruts {x: , y:} car pour les
// Point, il y a Point.draw()
function drawPoint(ctx, pt, color="blue", siz=2) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(Math.round(pt.x), Math.round(pt.y), siz, 0, 2*Math.PI);
    ctx.fill();
}

// Fonction dessinant dans le référentiel utilisateur
// idem au dessus : Point.draw permet de prendre en compte les changements de référentiels
function refDrawPoint(ctx, ref, pt, color="blue", siz=2) {
    let temp = ref.convertCoordinatesOriginal(pt);
    drawPoint(ctx, temp, color, siz);
}


/*--------------------------------------------------------------------------------
Class cell, sans doute à reprendre un peu
--------------------------------------------------------------------------------*/
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
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.font = "20px serif";
        ctx.fillText("Zone Jaune", this.x + Math.round(this.h/2), this.y + Math.round(this.v/2));
        let step_h = Math.round(this.h/10);
        let step_v = Math.round(this.v/10);
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

/*--------------------------------------------------------------------------------
Class grid : travaille au niveau canvas, sans avoir besoin du référentiel
--------------------------------------------------------------------------------*/
class Grid {
    constructor(ctx, width, height, size, color="#E8E8E8") {
        this.ctx = ctx,
        this.width = width;
        this.height = height;
        this.size = size;
        this.color = color;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        for (let i=0; i<=this.width; i=i+this.size) {
            for (let j=0;j<=this.height;j=j+this.size) {
                this.ctx.strokeRect(i, j, this.size, this.size);
                //console.log("%d %d",i,j);
            }
        }
    }

}


// Fonction de base dans le référentiel absolu
// les points sont des Point
function drawSegment(pt1, pt2, color="blue") {
    let temp1 = pt1.ref.convertCoordinatesOriginal(pt1);
    let temp2 = pt2.ref.convertCoordinatesOriginal(pt2);
    let ctx = pt1.ctx;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(Math.round(temp1.x), Math.round(temp1.y));
    ctx.lineTo(Math.round(temp2.x), Math.round(temp2.y));
    ctx.stroke();
}

// absolute drawing
// Tofill = false indique qu'on laisse à drawQuadratic la reponsabilité
// de tirer des traits indépendants.
// Avec = true, c'est l'appelant qui gère le path pour faire un close puis un fill
function drawQuadratic(pt1, pt2, angle, color="blue", size=1, tofill=false) {
    let temp1 = pt1.ref.convertCoordinatesOriginal(pt1);
    let temp2 = pt2.ref.convertCoordinatesOriginal(pt2);
    let ang = angle.ref.convertCoordinatesOriginal(angle);
    //drawPoint(pt1.ctx, ang, "green"); //trace
    let ctx = pt1.ctx;
    // si on est en mode tofill, le contrôle du path est fait par l'appelant
    if (! tofill)
        ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.moveTo(Math.round(temp1.x), Math.round(temp1.y));
    ctx.quadraticCurveTo(
        Math.round(ang.x),
        Math.round(ang.y),
        Math.round(temp2.x),
        Math.round(temp2.y)
    );
    ctx.stroke();
}


/*--------------------------------------------------------------------------------
Class MyVector
--------------------------------------------------------------------------------*/
class MyVector extends Point {
    constructor(ptA, ptB) {
        if (ptA.ref != ptB.ref)
            alert("Points are not in the same referential, diagram will be false");
        super(
            ptA.ctx,
            ptA.ref,
            ptB.x - ptA.x,
            ptB.y - ptA.y
        );
    }
    getOrthogonalVector() {
        return new MyVector(
            new Point(this.ctx, this.ref, 0,  0),
            new Point(this.ctx, this.ref, -this.y, this.x)
        );
    }
    getTargetPoint(source) {
        if (this.ref != source.ref)
            alert("Point is not in the same referential than vector, diagram will be false");
        return new Point(
            this.ctx,
            this.ref,
            this.x + source.x,
            this.y + source.y);
    }
}

/*--------------------------------------------------------------------------------
Utilitaires géométriques
--------------------------------------------------------------------------------*/
function getRandomNb(min, max) {
    return (Math.random() * (max - min)) + min;
}

function distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

/*--------------------------------------------------------------------------------
Classe Droite
--------------------------------------------------------------------------------*/
class Droite {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.ctx = p1.ctx;
        this.ref = p1.ref
        this.pente = (p2.y - p1.y) / (p2.x - p1.x);
        this.cons = p1.y - (this.pente * p1.x);
        console.log("Equation de la droite : %f x + %f", this.pente, this.cons);
        //drawSegment(p1, p2, "red"); //trace
        this.direction = 'N';
        if ((this.p1.x > this.p2.x) && (this.p1.y > this.p2.y))
            this.direction = 'SW';
        if ((this.p1.x > this.p2.x) && (this.p1.y < this.p2.y))
            this.direction = 'NW';
        if ((this.p1.x < this.p2.x) && (this.p1.y > this.p2.y))
            this.direction = 'SE';
        if ((this.p1.x < this.p2.x) && (this.p1.y < this.p2.y))
            this.direction = 'NE';

        if ((this.p1.x == this.p2.x) && (this.p1.y > this.p2.y))
            this.direction = 'S';
        if ((this.p1.x == this.p2.x) && (this.p1.y < this.p2.y))
            this.direction = 'N';
        if ((this.p1.x < this.p2.x) && (this.p1.y == this.p2.y))
            this.direction = 'E';
        if ((this.p1.x > this.p2.x) && (this.p1.y == this.p2.y))
            this.direction = 'W';
        console.log("direction: " + this.direction);
    }

    getPointAfterP2(dist) {
        let deltax = Math.sqrt(Math.pow(dist, 2) / (1 + Math.pow(this.pente, 2)));
        // car nous allons mettre l'offset dans le sens de la demi droite, il faut prendre abs
        let deltay = Math.abs(deltax * this.pente); 
        let x = this.p2.x;
        let y = this.p2.y;
        switch(this.direction) {
        case 'SW':
            x -= deltax;
            y -= deltay;
            break;
        case 'NW':
            x -= deltax;
            y += deltay;
            break;
        case 'SE':
            x += deltax;
            y -= deltay;
            break;
        case 'NE':
            x += deltax;
            y += deltay;
            break;
        case 'S':
            y -= deltay;
            break;
        case 'N':
            y += deltay;
            break;
        case 'E':
            x += deltax;
            break;
        case 'W':
            x -= deltax;
            break;
        }
        return new Point(
            this.ctx,
            this.ref,
            x,
            y
        );
    }

    getIntersection(droit) {
        let x0 = (- this.cons + droit.cons) / (this.pente - droit.pente);
        let y0 = this.pente * x0 + this.cons;
        return new Point(this.ctx, this.ref, x0, y0);
    }
}


/*--------------------------------------------------------------------------------
Class PointsChain
--------------------------------------------------------------------------------*/
class PointsChain {
    constructor(p1, p2, offsetmin = 0.4, offsetmax = 0.6) {
        this.A = p1;
        this.B = p2;
        this.P = null; // point de courbure initial
        this.points = [];
        this.angles = [];
        this.ctx = p1.ctx;
        this.ref = p1.ref
        this.offmin = offsetmin;
        this.offmax = offsetmax;
    }
    addPoint(pt) {
        this.points[this.points.length] = pt;
    }
   getOffset() {
        return getRandomNb(this.offmin, this.offmax);
    }
    
    draw(color = "blue", size = 1) {
        // pour le premier point, les offsets sont positifs
        let offsetx = this.getOffset();
        let offsety = this.getOffset();
        console.log("offsetx: %f - offsety %f", offsetx, offsety);
        let dis = distance(this.A, this.B);
        this.P = new Point(this.ctx,
                           this.ref,
                           this.A.x + (offsetx * dis),
                           this.A.y + (offsety * dis));
        this.ctx.beginPath();
        drawQuadratic(this.A, this.B, this.P, color, size);
        // équation de la droite PB, droite tangente initiale
        let origin = this.B;
        let angleancien = this.P;
        let d = null;
        let angle = null;
        let dist = 0;
        let offset = 0;
        for (let k of this.points) {
            d = new Droite(angleancien, origin);
            dist = distance(origin, k);
            offset = this.getOffset();
            angle = d.getPointAfterP2(offset * dist);
            //angle.draw("green"); // trace
            drawQuadratic(origin, k, angle, color, size);
            //prepare for next iteration
            origin = k;
            angleancien = angle;
        }
    }
}

/*--------------------------------------------------------------------------------
Class ClosedArea
--------------------------------------------------------------------------------*/
class ClosedArea {
    constructor(p1, p2, offsetmin = 0.4, offsetmax = 0.6) {
        this.A = p1;
        this.B = p2;
        this.P = null; // point de courbure initial
        this.points = [];
        this.angles = [];
        this.ctx = p1.ctx;
        this.ref = p1.ref
        this.offmin = offsetmin;
        this.offmax = offsetmax;
        this.fill = true;
    }
    addPoint(pt) {
        this.points[this.points.length] = pt;
    }
   getOffset() {
        return getRandomNb(this.offmin, this.offmax);
    }
    
    draw(color = "blue", size = 1) {
        // pour le premier point, les offsets sont positifs
        let offsetx = this.getOffset();
        let offsety = this.getOffset();
        console.log("offsetx: %f - offsety %f", offsetx, offsety);
        let dis = distance(this.A, this.B);
        this.P = new Point(this.ctx,
                           this.ref,
                           this.A.x + (offsetx * dis),
                           this.A.y + (offsety * dis));
        this.ctx.beginPath();
        drawQuadratic(this.A, this.B, this.P, color, size, this.fill);
        // équation de la droite PB, droite tangente initiale
        let origin = this.B;
        let angleancien = this.P;
        let d = null;
        let angle = null;
        let dist = 0;
        let offset = 0;
        let k = null;
        for (k of this.points) {
            d = new Droite(angleancien, origin);
            dist = distance(origin, k);
            offset = this.getOffset();
            angle = d.getPointAfterP2(offset * dist);
            //angle.draw("green"); // trace
            drawQuadratic(origin, k, angle, color, size, this.fill);
            //prepare for next iteration
            origin = k;
            angleancien = angle;
        }
        // traitement du dernier point : il est connecté avec le premier
        // mais les tangentes sont imposées
        // k est le dernier point, angleancien est le dernier point quadratique
        // A est le premier point et P le prenier point de quadratique
        
        // création des deux droites dans le bon sens
        let orig = new Droite(this.P, this.A);
        let term = new Droite(angleancien, k);
        let inter = term.getIntersection(orig);
        drawQuadratic(k, this.A, inter, color, size, this.fill);
        // distance entre les deux derniers points ; reuse de la var
        /*dist = distance(this.A,k);
        let ctrl_k = term.getPointAfterP2(- dist * 0.5);
        ctrl_k.draw();
        let ctrl_A = orig.getPointAfterP2(- dist * 0.5);
        ctrl_A.draw()
        this.A.draw();
        this.P.draw();
        k.draw();
        angleancien.draw();
        this.ctx.moveTo(k.x,k.y);
        this.ctx.bezierCurveTo(ctrl_k.x,ctrl_k.y,ctrl_A.x,ctrl_A.y,this.A.x,this.A.y);
        this.ctx.stroke();*/
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.A.ref.convertCoordinatesOriginal(this.A).x,
                        this.A.ref.convertCoordinatesOriginal(this.A).y,);
        this.ctx.lineTo(this.B.ref.convertCoordinatesOriginal(this.B).x,
                        this.B.ref.convertCoordinatesOriginal(this.B).y,);
        for (k of this.points)
            this.ctx.lineTo(k.ref.convertCoordinatesOriginal(k).x,
                            k.ref.convertCoordinatesOriginal(k).y);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.A.ref.convertCoordinatesOriginal(this.A).x,
                        this.A.ref.convertCoordinatesOriginal(this.A).y,);
        this.ctx.lineTo(this.B.ref.convertCoordinatesOriginal(this.B).x,
                        this.B.ref.convertCoordinatesOriginal(this.B).y,);
        for (k of this.points)
            this.ctx.lineTo(k.ref.convertCoordinatesOriginal(k).x,
                            k.ref.convertCoordinatesOriginal(k).y);
        this.ctx.stroke();
    }

    
}
