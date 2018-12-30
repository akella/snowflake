const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ]
};


let gridSize = 8;
let angle = 0.3;

let getGrid = () => {
	let points = [];

	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			let u = x / (gridSize - 1);
			let v = y / (gridSize - 1);
			points.push([u,v]);
		}
	}
	return points;
}

let points = getGrid();
// console.log(points);


let drawBranch = (context, size , level, angle) => {
			if(level>3) return;

			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(size,0);
			context.closePath();
			context.stroke();


			for (var i = 0; i < 2; i++) {
				context.save();
				context.translate(size * i/2 ,0);
				context.scale(0.5,0.5);

					context.save();
						context.rotate(angle);
						drawBranch(context, size, level + 1, angle);
					context.restore();


					context.save();
						context.rotate(-angle);
						drawBranch(context, size,level + 1, angle);
					context.restore();


				context.restore();
			}
}

let snowFlake = (context, x,y, size, angle, symmetry) => {
	context.save()
	context.translate(x,y);
	for (var i = 0; i < symmetry; i++) {
		drawBranch(context, size, 0, angle);
		context.rotate(2*Math.PI/symmetry);
	}
	context.restore();
}



const sketch = () => {
  return ({ context, width, height }) => {
  	context.fillStyle = "#81a4d4";
  	context.fillRect(0,0,width,height);

  	let margin = width*0.2;
  	let size = (width - 2*margin)/gridSize/2;

    
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    points.forEach(([u,v])=>{
    	let x = lerp(margin, width - margin,u);
    	let y = lerp(margin, width - margin,v);

    	let angle = 0.2 + Math.random();
    	let symmetry = 3  + Math.floor(Math.random()*6);
    	snowFlake(context, x, y, size, angle,symmetry);

    })
  };
};

canvasSketch(sketch, settings);
