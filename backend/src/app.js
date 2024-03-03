// import { connect } from './mongodb.js'
import { Server } from "socket.io";
import { Game } from './Game.js';
import { connectMongo, scoresDB } from './mongodb.js';
import { Client } from './Client.js';
import http from 'http';
import https from 'https';
import fs from 'fs';

let rooms = new Map();

const server = process.env.HTTPS
	? https.createServer({
		key: fs.readFileSync(process.env.HTTPS_PRIVKEY),
		cert: fs.readFileSync(process.env.HTTPS_CERT)
	})
	: http.createServer();

const PORT = 4000;
server.listen(PORT, () => console.log(`listening on port ${PORT}`));

export const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET"]
	}
});

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

function start() {
	io.on("connection", (socket) => {
	
		socket.on('getRoomList', () => sendRoomList(socket));
	
		socket.on('getScoresList', (username) => sendScores(socket, username));
	
		socket.on('initgame', (roomname) => {
	
			let currRoom = rooms.get(roomname);
	
			if (currRoom == undefined || !currRoom.players.has(socket.id))
				socket.emit(`notauthorized:${roomname}`)
	
		});
	
		socket.on('joinRoom', ({
			user: username = '',
			name: roomname = '',
			bot = false
		}) => {
	
			if (!/^[a-z0-9_-]{1,16}$/i.test(username) || username === undefined)
			{
				socket.emit('userNameError', `username required`);
				return ;
			}
			if (!/^[a-z0-9_-]{1,16}$/i.test(roomname))
			{
				socket.emit('roomNameError', `invalid roomname`);
				return ;
			}
	
			if (!rooms.has(roomname))
				rooms.set(roomname, new Game(io, roomname, 'earth'));
	
			let room = rooms.get(roomname);
	
			if (room.started === true)
			{
				socket.emit('roomNameError', `${roomname} has already started`);
				return ;
			}
		
			let client = new Client(socket);
	
			const removePlayer = () => {
				room.removePlayer(client);
				if (room.players.size == 0)
				{
					room.stopInterval();
					rooms.delete(roomname);
				}
				sendRoomList(io);
			}
	
			room.addPlayer(username, bot, client);
	
			sendRoomList(io);
	
			room.sendUsersList();
	
			client.on(`start:${roomname}`, () => {
	
				if (room.owner?.client?.id !== client.id)
					return ;
	
				io.in(roomname).emit(`start:${roomname}`);
	
				room.launch();
				sendRoomList(io);
			});
	
			client.on(`restart:${roomname}`, () => {
				if (room.owner?.client?.id !== client.id)
					return ;
				io.in(roomname).emit(`restart:${roomname}`);
	
				for (let [_, player] of room.players)
					player.client.clearListeners();
				room.players = new Map();
				room.stopInterval();
	
				rooms.set(roomname, new Game(io, roomname, room.gameMode));
				room = rooms.get(roomname);
	
				room.addPlayer(username, bot, client);
			});
	
			client.on(`gameMode:${roomname}`, (gameMode) => {
				let newGameMode = gameMode ?? room.gameMode;
	
				if (room.owner?.client?.id === client.id)
					room.gameMode = newGameMode;
				io.in(roomname).emit(`gameMode:${roomname}`, room.gameMode);
			})
	
			// Disconnects
			client.on('leaveRoom', removePlayer);
			client.on('disconnect', removePlayer);
	
		})
	
	});
}