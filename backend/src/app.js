// import { connect } from './mongodb.js'
import { Server } from "socket.io";
import { launchGame } from './game.js';

// import { gameRoom } from "./gameRoom.js"

// let db = await connect()
let rooms = new Map();

const io = new Server({
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

<<<<<<< HEAD
=======
function makeFuturePieces() {
	let Iterations = 32;
	let sequence = [];
	while (Iterations) {
		let tetriminos = [0, 1, 2, 3, 4, 5, 6]
		let currentIndex = tetriminos.length, randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {

			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// Swap two element with the random index
			[tetriminos[currentIndex], tetriminos[randomIndex]] = [tetriminos[randomIndex], tetriminos[currentIndex]];
		}
		// console.log('randomShuffle ->', tetriminos);
		sequence.push(...tetriminos);
		Iterations--;
	}
	return sequence
}

>>>>>>> 4414905 (reduce info others)
io.on("connection", (socket) => {

	// console.log("connection socket", socket.id)

<<<<<<< HEAD
	socket.on('joinRoom', (room) => {

		// Make sure user as an username
		if (room.user === null || room.user === undefined || room.user === '') {
			console.log('here');
=======
	// Init game for user
	socket.removeAllListeners('initgame')
	socket.on('initgame', (roomname) => {
		// console.log('test authorized', socket.room, roomname)
		if (roomname !== socket?.room?.name)
		{
			socket.emit(`notauthorized:${roomname}`)
			// console.log('notauthorized')
			return ;
		}
		// Launch game loop
		// console.log(socket.room, 'launchGame');
		launchGame(io, socket);
	})

	socket.on('joinRoom', (room) => {

		// Make sure user as an username
		if (room.user === undefined || room.user === '') {
			// console.log('here');
>>>>>>> 4414905 (reduce info others)
			return ;
		}
		socket.username = room.user;

		// console.log('joinRoom', room)

		if (!rooms.has(room.name))
		{
			rooms.set(room.name, {
				// name: room.name,
				gameMode: 'earth',
				seed: Math.random()
			})
		}
		socket.join(room.name);
		console.log(rooms.get(room.name))
		const sendUsersList = () => {
			let users = [...(io.sockets.adapter.rooms?.get?.(room.name) ?? [])]
					.map(id => io.sockets.sockets.get(id).username)

			io.in(room.name).emit(`join:${room.name}`, users);
		}

		sendUsersList()

		// Start the game on room
		socket.on(`start:${room.name}`, () => {
			io.in(room.name).emit(`start:${room.name}`);
		})

		// Change game mode
		socket.on(`gameMode:${room.name}`, (gameMode) => {
			let newGameMode = gameMode ?? rooms.get(room.name).gameMode
			console.log('newGameMode', newGameMode)
			rooms.get(room.name).gameMode = newGameMode
			io.in(room.name).emit(`gameMode:${room.name}`, newGameMode);
		})

		// Init game for user
		socket.removeAllListeners('initgame')
		socket.on('initgame', (roomname) => {
			console.log('test authorized', room.name, roomname)
			if (roomname !== room.name)
			{
				socket.emit(`notauthorized:${roomname}`)
				console.log('notauthorized')
				return ;
			}
<<<<<<< HEAD
			// Launch game loop
			console.log(room.name, 'launchGame');
			launchGame(io, room, rooms.get(room.name), socket);
=======
			sendRoomList(io);
		}

		room.addPlayer(username, client);

		sendRoomList(io);

		room.sendUsersList();

		client.on(`start:${roomname}`, () => {

			if (room.owner?.client?.id !== client.id)
				return ;

			io.in(roomname).emit(`start:${roomname}`);

			room.launch();
		});

		client.on(`restart:${roomname}`, () => {
			if (room.owner?.client?.id !== client.id)
				return ;
			io.in(roomname).emit(`restart:${roomname}`);

			for (let [_, player] of room.players)
				player.client.clearListeners();
			room.players = new Map();
			room.removeInterval();

			rooms.set(roomname, new Game(io, roomname, room.gameMode));
			room = rooms.get(roomname);

			room.addPlayer(username, client, () => {});
		});

		client.on(`gameMode:${roomname}`, (gameMode) => {
			let newGameMode = gameMode ?? room.gameMode;

			if (room.owner?.client?.id === client.id)
				room.gameMode = newGameMode;
			io.in(roomname).emit(`gameMode:${roomname}`, room.gameMode);
>>>>>>> b544993 (security)
		})

		// Disconnects
		socket.on('leaveRoom', () => {
			// console.log('leaveRoom1', room);
			socket.leave(room.name)
			sendUsersList()
		})
		socket.on('disconnect', sendUsersList)
	})

});

io.listen(4000);