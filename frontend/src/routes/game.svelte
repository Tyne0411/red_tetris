<script>
	import { user, socket } from "$lib/user";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { TETRIMINOS } from "$lib/Shape.js";
	import Room from "./room.svelte";

	let roomname = ''
	// let usersBoard = map('socket.id', 'board');
	let gameover = false
	let currentShape
	let i = 0
	let shapes = []

	function getBoard(shapes) {
		let board = new Array(20)
			.fill()
			.map(() => new Array(10).fill(0))
		for (let shape of shapes)
			board = shape.drawOn(board)
		return (board)
	}

	function makeShadow(currentShape) {
		let copy = currentShape.clone()
		copy.colorid = 8
		while (copy.tick(layer)) ;
		return copy;
	}
	function draw(currentShape, layer) {
		let board;
		let shadow = makeShadow(currentShape);

	let nextShape = {
		shape: []
	};

	function initGame() {
		socket.emit('initgame', roomname)
	}

	function endGame(playerList) {
		endPlayerList = playerList;
		isEndGame = true;
	}

	onMount(() => {
		if (!(roomname = location.hash.slice(1).toLowerCase()))
			goto('/rooms')

		initGame()
		socket.on(`gameInfo:${roomname}`, (data) => {
			if (data === 'gameover') {
				gameover = true;
				return ;
			}
			else {
				console.log(`gameInfo:${roomname}| serverClientId =`, data.clientId
				,'& frontClientId =', socket.id);
				if (data.clientId === socket.id)
					board = data.board;
				else {

				}
			}
		});

		return () => {
			socket.emit('leaveRoom')
		}
	})
</script>

<style>
	main {
		overflow: hidden;
		width: 100%;
		height: 100%;
		background: #0c0c11;
		padding: 20px;
		display: flex;
		gap: 20px;
		justify-content: center;
	}
	.container {
		width: min(90vw, 90vh / 2);
		position: relative;
		height: fit-content;
	}
	.board {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 4px;
		overflow: hidden;
		transition: .4s;
	}
	.gameover + .board {
		filter: brightness(.5) saturate(.8) blur(6px);
	}
	.row {
		display: flex;
		gap: 4px;
	}
	.cell {
		flex: 1;
		aspect-ratio: 1/1;
		border-radius: 7%;
		transition: .1s;
		background: var(--color);
		--shadow-color: #0d0d1716;
		--shadow: inset 0 0 0 5px var(--shadow-color), inset -5px -5px var(--shadow-color);
		box-shadow: var(--shadow), 0 0 6px var(--color);
	}
	.cell-0 { --color: #3f3f3f; }
	.cell-1 { --color: #8fcdee; }
	.cell-2 { --color: #5555ef; }
	.cell-3 { --color: #e58e36; }
	.cell-4 { --color: #ebe648; }
	.cell-5 { --color: #73e852; }
	.cell-6 { --color: #dc60ea; }
	.cell-7 { --color: #ef4a58; }
	.cell-8 { --color: #929393ae; }
	.cell-0, .cell-8 {
		--shadow-color: #0d0d171e;
		box-shadow: var(--shadow); 
	}
	.cell-0 { --color: #3f3f3f; }

	@keyframes popin {
		0% { transform: scale(0) }
	}
	.gameover {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		gap: 20px;
		z-index: 999;
		animation: .5s popin forwards;
	}
	@keyframes grow {
		to {
			height: 2.5em;
			opacity: 1;
		}
	}
	.gameover-score {
		overflow: hidden;
		height: 0;
		opacity: 0;
		animation: .3s .5s grow ease-out forwards;
	}
	@keyframes fade {
		to {
			opacity: 1;
		}
	}
	aside {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.small-board {
		display: flex;
		aspect-ratio: 1/2;
		background: var(--back-1);
	}
	.small-board > div {
		background: var(--grey-back-1);
		flex: 1;
	}
	.small-gameover {
		filter: brightness(.3) saturate(.6);
	}

	.others {
		max-width: 15vw;
		overflow-y: auto;
		padding-right: 10px;
	}
	.others > div {
		width: 100%;
	}
	.self {
		max-width: 30vw;
	}
	.next-piece {
		width: 4rem;
	}
</style>

<svelte:window
	on:keydown={e => socket.emit(`event:${roomname}`, e.key)}
/>

<Listener
	on="notauthorized:{roomname}"
	handler={() => {
		// console.log('notauthorized');
		goto('/rooms')
	}}
/>
<Listener
	on="connect"
	handler={initGame}
/>
<Listener
	on="gameInfo:{roomname}"
	handler={(data) => {
		
		if (data.clientId === socket.id)
		{
			if (data.gameover)
				gameover = true
			else {
				board = data.board;
				score = data.scores.score;
				lines = data.scores.lines;
				nextShape = data.nextShape;
			}
		}
		else {
			if (data.gameover)
				usersBoard.set(data.clientId, {
					...usersBoard.get(data.clientId),
					gameover: true,
				})
			else
			{
				usersBoard.set(data.clientId, {
					username: data.username,
					heights: data.heights,
					scores: data.scores
				});
			}
			usersBoard = usersBoard
		}
	}}
/>

<main>
	<aside class="others">
		{#each [...usersBoard.entries()] as [_, { username, heights, scores, gameover }]}
			<div>
				{username}<br>
				{scores.score}
				<div class="small-board {gameover ? 'small-gameover' : ''}">
					{#each heights as height}
						<div style="height: {height / 20 * 100}%;"></div>
					{/each}
				</div>
			</div>	
		{/each}
	</aside>
	<div class="container">
		{#if gameover}
			<div class="gameover">
				<h2>GAMEOVER</h2>
				<div class="gameover-score">
					SCORE<br>
					{score}
				</div>
			</div>
		{/if}

		<div class="board">
			{#each board as row}
				<div class="row">
					{#each row as cell}
						<div class="cell cell-{cell}"></div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<aside>
		<h1>{roomname}</h1>
		<h2>{$user}</h2>
		<div>
			HIGH SCORE<br>
			0<br>
			SCORE<br>
			{score}<br>
			LEVEL<br>
			{level}<br>
			LINES<br>
			{lines}<br>
			<br />
			<div class="board next-piece">
				{#each nextShape.shape as row}
					<div class="row">
						{#each row as cell}
							<div class="cell cell-{cell ? nextShape.colorid : 0}"></div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<button
			class="red-button"
			on:click={() => goto(`/rooms`)}
		>LEAVE</button>
	</aside>
</main>
