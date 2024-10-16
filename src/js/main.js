
import { GameManager } from "./classes/gameManager";
import { HTMLActuator } from "./classes/htmlActuator";
import { LocalStorageManager } from "./classes/storeManager";

let saveSettings = true;

const g2048 = {
	init() {
		this.gameManager = new GameManager(4, HTMLActuator, LocalStorageManager);
		// show karaqu gamepad/joystick (at center bottom)
		karaqu.joystick({ theme: "light", center: "buttons" });
	},
	dispatch(event) {
		let Self = g2048,
			gameState;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				if (saveSettings) {
					// save settings before close
					gameState = Self.gameManager.serialize();
					Self.gameManager.storageManager.setGameState(gameState);
				}
				break;
			case "window.keydown":
				switch (event.char) {
					case "up":    Self.gameManager.move(0); break;
					case "down":  Self.gameManager.move(2); break;
					case "left":  Self.gameManager.move(3); break;
					case "right": Self.gameManager.move(1); break;
				}
				break;
			// karaqu joystick support
			case "gamepad.up":
				// reset swipe
				delete Self.stickSwipe;
				break;
			case "gamepad.down":
				switch (event.button) {
					case "b12": Self.gameManager.move(0); break;
					case "b13": Self.gameManager.move(2); break;
					case "b14": Self.gameManager.move(3); break;
					case "b15": Self.gameManager.move(1); break;
				}
				break;
			// swipe support
			case "swipe.up":    Self.gameManager.move(0); break;
			case "swipe.down":  Self.gameManager.move(2); break;
			case "swipe.left":  Self.gameManager.move(3); break;
			case "swipe.right": Self.gameManager.move(1); break;
			// case "swipe.angle": console.log(event); break;
			
			// custom events
			case "quit-no-save":
				saveSettings = false;
				window.close();
				break;
			case "output-pgn":
				gameState = Self.gameManager.serialize();
				console.log( JSON.stringify(gameState) );
				break;
			case "restart":
				Self.gameManager.restart();
				// show karaqu gamepad/joystick (at center bottom)
				karaqu.joystick({ center: "stick" });
				break;
			case "keep-playing":
				Self.gameManager.doKeepPlaying();
				// show karaqu gamepad/joystick (at center bottom)
				karaqu.joystick({ center: "stick" });
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = g2048;
