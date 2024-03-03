import { writable } from "svelte/store";
import { browser } from "$app/env";
import { io } from "socket.io-client";
import { goto } from "$app/navigation";

export let user = writable();
export let connected = writable(true);
export let socket;

if (browser)
{
	user.subscribe(username => {
<<<<<<< HEAD
		console.log(username);
		if (username === undefined || username === '') {
			console.log(location)
			if (location.pathname !== '/')
				goto('/');
			return ;
		}
=======
		// console.log(username);
>>>>>>> 4414905 (reduce info others)
		localStorage.setItem('user', username)
	});
	user.set(localStorage.getItem('user') ?? '')

	socket = io(`http://${location.hostname}:4000`)
	socket.on("connect", () => connected.set(true))
	socket.on("connect_error", () => connected.set(false));
	socket.on("disconnect", () => connected.set(false));
}
