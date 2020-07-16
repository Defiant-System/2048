
import { GameManager } from "./classes/gameManager";
import { HTMLActuator } from "./classes/htmlActuator";
import { LocalStorageManager } from "./classes/storeManager";


const g2048 = {
	init() {
		let state = window.settings.get("pgn");
		console.log(state);

		this.gameManager = new GameManager(4, HTMLActuator, LocalStorageManager, state);
	},
	dispatch(event) {
		let state;
		switch (event.type) {
			case "window.close":
				// state = this.gameManager.serialize();
				// window.settings("pgn", state);
				return false;
			case "window.keystroke":
				switch (event.char) {
					case "up":    this.gameManager.move(0); break;
					case "down":  this.gameManager.move(2); break;
					case "left":  this.gameManager.move(3); break;
					case "right": this.gameManager.move(1); break;
				}
				break;
			case "output-pgn":
				state = this.gameManager.serialize();
				console.log( JSON.stringify(state) );
				break;
			case "restart":
				this.gameManager.restart();
				break;
			case "keep-playing":
				this.gameManager.doKeepPlaying();
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = g2048;
