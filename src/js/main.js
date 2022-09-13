
import { GameManager } from "./classes/gameManager";
import { HTMLActuator } from "./classes/htmlActuator";
import { LocalStorageManager } from "./classes/storeManager";

let saveSettings = true;

const g2048 = {
	init() {
		this.gameManager = new GameManager(4, HTMLActuator, LocalStorageManager);
	},
	dispatch(event) {
		let gameState;
		switch (event.type) {
			case "window.close":
				if (saveSettings) {
					// save settings before close
					gameState = this.gameManager.serialize();
					this.gameManager.storageManager.setGameState(gameState);
				}
				break;
			case "window.keystroke":
				switch (event.char) {
					case "up":    this.gameManager.move(0); break;
					case "down":  this.gameManager.move(2); break;
					case "left":  this.gameManager.move(3); break;
					case "right": this.gameManager.move(1); break;
				}
				break;
			case "quit-no-save":
				saveSettings = false;
				window.close();
				break;
			case "output-pgn":
				gameState = this.gameManager.serialize();
				console.log( JSON.stringify(gameState) );
				break;
			case "restart":
				this.gameManager.restart();
				break;
			case "keep-playing":
				this.gameManager.doKeepPlaying();
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = g2048;
