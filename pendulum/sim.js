class Circle {
    constructor(mass, phi, pos) {
        this.pos = pos;
        this.mass = mass;
        this.phi = phi;
        this.dPhi = 0;
        this.d2Phi = 0;
        this.x;
        this.y;
        this.line = {
            x0: X0,
            y0: Y0,
            x: 0,
            y: 0
        };
    };
};

var Circles = [];

$('#set_variables_form').submit((e) => {
    e.preventDefault();
    let i = 0;
    while(true) {
        i++;
        if(!document.getElementById('mass'+i)) {
            console.log(`stopped at ${i}`);
            break;
        };
        Circles.push(new Circle(
            document.getElementById('mass'+i).value,
            document.getElementById('Phi'+i).value/180*(Math.PI),
            i-1
        ));
    };

    run();
});
  
function drawCircle(circle, ctx) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.mass, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
};
  
function drawLine(myLine, ctx) {
    ctx.beginPath();
    ctx.moveTo(myLine.x0, myLine.y0);
    ctx.lineTo(myLine.x, myLine.y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
};
  
function animate(crcls, canvas, ctx) {
    var mu =  1 + Circles[0].mass / Circles[1].mass;

    for(var i = 0; i < crcls.length; i++) {
        let circle = crcls[i];

        /*if(!Circles[i].dPhi) Circles[i].dPhi = Math.PI * (Math.random() * 5) + 1;
        if(!Circles[i].d2Phi) Circles[i].d2Phi = Math.PI * (Math.random() * 5) + 1;
        if(!Circles[i].phi) Circles[i].phi = Math.PI * (Math.random() * 5) + 1;*/

        Circles[0].dPhi = Circles[0].dPhi;
        Circles[1].dPhi = Circles[1].dPhi;

        if(!circle.pos) {
            Circles[i].d2Phi = (g*(Math.sin(Circles[1].phi)*Math.cos(Circles[0].phi-Circles[1].phi)-mu*Math.sin(Circles[0].phi))-(l1*Circles[1].dPhi*Circles[1].dPhi+l1*Circles[0].dPhi*Circles[0].dPhi*Math.cos(Circles[0].phi-Circles[1].phi))*Math.sin(Circles[0].phi-Circles[1].phi))/(l1*(mu-Math.cos(Circles[0].phi-Circles[1].phi)*Math.cos(Circles[0].phi-Circles[1].phi)));
        } else {
            Circles[i].d2Phi = (mu*g*(Math.sin(Circles[0].phi)*Math.cos(Circles[0].phi-Circles[1].phi)-Math.sin(Circles[1].phi))+(mu*l1*Circles[0].dPhi*Circles[0].dPhi+l1*Circles[1].dPhi*Circles[1].dPhi*Math.cos(Circles[0].phi-Circles[1].phi))*Math.sin(Circles[0].phi-Circles[1].phi))/(l1*(mu-Math.cos(Circles[0].phi-Circles[1].phi)*Math.cos(Circles[0].phi-Circles[1].phi)));
        };
        Circles[i].dPhi = Circles[i].d2Phi * time;
        Circles[i].phi = Circles[i].d2Phi * time;

        var changeX = 'X0+l1*Math.sin(circle.phi);';
        var changeY = 'Y0+l1*Math.cos(circle.phi);';
        for(let j = circle.pos; j > 0; j--) {
            changeX = `X0+l1*Math.sin(${Circles[j].phi}) + ` + changeX;
            changeY = `Y0+l1*Math.cos(${Circles[j].phi}) + ` + changeY;
        };

        eval(`Circles[${i}].x = ${changeX}; Circles[${i}].y = ${changeY};`);

        Circles[i].line.x = Circles[i].x;
        Circles[i].line.y = Circles[i].y;
        if(circle.pos) {
            Circles[i].line.x0 = Circles[0].x;
            Circles[i].line.y0 = Circles[0].x;
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawLine(Circles[i].line, ctx)
        drawCircle(Circles[i], ctx);
    };
};
  
//Physics Constants
var l1     = 150;
var X0     = 350;
var Y0     = 60;
var g      = 9.8;
var time   = 0.05;

var canvas  = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var init    = {};
  
function run() {
    for(let i; i < Circles.length; i++) {
        Circles[i].line = {
            x0: X0,
            y0: Y0,
            x: 0,
            y: 0
        };
        if(Circles[i].pos == 0) {
            Circles[i].x = X0 + l1 * Math.sin(Circles[i].phi);
            Circles[i].y = Y0 + l1 * Math.cos(Circles[i].phi);
        } else {
            Circles[i].x = X0 + l1 * Math.sin(Circles[i-1].phi) + l1 * Math.sin(Circles[i].phi);
            Circles[i].y = Y0 + l1 * Math.cos(Circles[i-1].phi) + l1 * Math.cos(Circles[i].phi)
        };
    };
    clearInterval(init);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    init = setInterval(() => {
        animate(Circles, canvas, ctx);
    }, 5);
};