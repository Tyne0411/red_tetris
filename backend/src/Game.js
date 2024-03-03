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

	addPlayer(username, client) {

function	sendGameData(socket, board, scores) {
	socket.emit(`gameInfo:${socket.room.name}`, {
		clientId: socket.id, // his socket id to identify it in frontend
		board, // contains the board of one player
		scores // contains score and lines
	});
}

		let newPlayer = new Player(this.io, username, bot, client, this);

		client.join(this.name);
		if (!bot)
			client.join(`${this.name}+human`);

		if (this.players.size == 0 || this.owner?.client.id === client.id)
			this.setOwner(newPlayer);

		this.players.get(client.id)?.clearListeners?.();
		this.players.set(client.id, newPlayer)
	}

	getPlayerList() {
		return [...this.players.values()]
	}

	removePlayer(client) {
		client.clearListeners();

		const currPlayer = this.players.get(client.id);
		
		this.players.delete(client.id);

		if (this?.owner?.client?.id === client.id)
			this.setOwner([...this.players.values()][0]);

		if (this.started && currPlayer?.score > 0 && !currPlayer?.isbot)
		{
			scoresDB.insertOne({
				username: currPlayer.username,
				score: currPlayer.score
			})
		}

		this.sendUsersList();

	}

	stopInterval() {
		clearInterval(this.interval);
	}

	makeIndestructibleLines(nbLines, senderPlayer) {
		if (nbLines > 0) {
			for (let [_, player] of this.players) {
				if (senderPlayer.client.id !== player.client.id) {
					player.addIndestructibleLine(nbLines);
				}
			}
		}
	)
}

export function launchGame(io, socket) {
	// console.log('lauchGame ', socket.username, socket.room);

	let gameover = false
	let currentShape;
	let i = 0;
	let layer = emptyBoard();
	let board = emptyBoard();

		if (nbGameover >= this.players.size - (isSolo ? 0 : 1)) {
			this.stopInterval();
			for (let [_, player] of this.players)
				player.client.removeAllListeners(`event:${this.name}`);

			let list = [];
			for (let { username, score } of this.gameOverList)
				list.unshift({ username, score });

			for (let [_, { username, score, gameover }] of this.players)
				if (!gameover)
					list.unshift({ username, score });

			this.setOwner(this.owner);

			this.io.in(this.name).emit(`endgame:${this.name}`, list);
		}
	}

	launch() {
		if (this.started)
			return ;

		this.started = true;
		let isSolo = (this.players.size === 1);

		for (let [i, player] of this.players)
		{
			let newShape = TETRIMINOS[i++ % TETRIMINOS.length]
				.constructShape()
			if (newShape.intersect(layer))
			{
				this.timeout = setTimeout(loop, 1000 / this.tick_per_secs);
				// this.tick_per_secs += 0.002;
			}
			currentShape = newShape
		}
		loop();
	}
}
