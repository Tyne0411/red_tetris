import { TETRIMINOS } from "./Shape.js";

function emptyBoard() {
	let board = new Array(20)
		.fill()
		.map(() => new Array(10).fill(0));
	return (board)
}

function makeShadow(currentShape, layer) {
	let copy = currentShape.clone()
	copy.colorid = 8
	while (copy.tick(layer)) ;
	return copy;
}

function draw(currentShape, layer) {
	let board;
	let shadow = makeShadow(currentShape, layer);

	board = shadow.drawOn(layer)
	board = currentShape.drawOn(board)
	return board
}

export function launchGame(io, room, socket) {
	console.log(io, room, socket);
	let gameover = false
	let currentShape;
	let i = 0;
	let layer = emptyBoard();
	let board = emptyBoard();

	let score = 0;
	let level = 0;
	let lines = 0;

	let interval = setInterval(() => {
		if (currentShape == undefined)
		{
			let newShape = TETRIMINOS[i++ % TETRIMINOS.length]
				.constructShape()
			if (newShape.intersect(layer))
			{
				gameover = true
				clearInterval(interval)
				return ;
			}
			currentShape = newShape
		}
		
		let moved = currentShape.tick(layer)
		board = draw(currentShape, layer);

		if (!moved)
		{
			layer = currentShape.drawOn(layer)
			currentShape = undefined

			let filterLayer = layer
				.filter(row => row.some(cell => cell == 0));
			score += [0, 100, 300, 500, 800][layer.length - filterLayer.length]
			while (filterLayer.length != layer.length)
			{
				filterLayer.unshift(new Array(10).fill(0))
				++lines;
			}
			layer = filterLayer
		}
		io.in(room.name).emit(`gameInfo:${room.name}`, board);
	}, 500)

	socket.on('leaveRoom', () => {
		console.log('test2');
		clearInterval(interval)
	})
}