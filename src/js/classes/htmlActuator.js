
export class HTMLActuator {

	constructor() {
		this.tileContainer    = window.find(".tile-container");
		this.scoreContainer   = window.find(".score-container .value");
		this.bestContainer    = window.find(".best-container .value");
		this.messageContainer = window.find(".game-message");

		this.score = 0;
	}
	
	actuate(grid, metadata) {
		var self = this;

		window.requestAnimationFrame(function() {
			self.clearContainer(self.tileContainer);

			grid.cells.forEach(function(column) {
				column.forEach(function(cell) {
					if (cell) {
						self.addTile(cell);
					}
				});
			});

			self.updateScore(metadata.score);
			self.updateBestScore(metadata.bestScore);

			if (metadata.terminated) {
				if (metadata.over) {
					self.message(false); // You lose
				} else if (metadata.won) {
					self.message(true); // You win!
				}
			}
		});
	}

	continueGame() {
		this.clearMessage();
	}

	clearContainer(container) {
		container.html("");
	}

	addTile(tile) {
		var self       = this;
		var wrapper   = document.createElement("div");
		var inner     = document.createElement("div");
		var position  = tile.previousPosition || { x: tile.x, y: tile.y };
		var positionClass = this.positionClass(position);
		// We can't use classlist because it somehow glitches when replacing classes
		var classes = ["tile", "tile-" + tile.value, positionClass];

		if (tile.value > 2048) classes.push("tile-super");

		this.applyClasses(wrapper, classes);

		inner.classList.add("tile-inner");
		inner.textContent = tile.value;

		if (tile.previousPosition) {
			// Make sure that the tile gets rendered in the previous position first
			window.requestAnimationFrame(function() {
				classes[2] = self.positionClass({ x: tile.x, y: tile.y });
				self.applyClasses(wrapper, classes); // Update the position
			});
		} else if (tile.mergedFrom) {
			classes.push("tile-merged");
			this.applyClasses(wrapper, classes);

			// Render the tiles that merged
			tile.mergedFrom.forEach(function(merged) {
				self.addTile(merged);
			});
		} else {
			classes.push("tile-new");
			this.applyClasses(wrapper, classes);
		}

		// Add the inner part of the tile to the wrapper
		wrapper.appendChild(inner);

		// Put the tile on the board
		this.tileContainer.append(wrapper);
	}

	applyClasses(element, classes) {
		element.setAttribute("class", classes.join(" "));
	}

	normalizePosition(position) {
		return { x: position.x + 1, y: position.y + 1 };
	}

	positionClass(position) {
		position = this.normalizePosition(position);
		return "tile-position-" + position.x + "-" + position.y;
	}

	updateScore(score) {
		this.clearContainer(this.scoreContainer);

		var difference = score - this.score;
		this.score = score;

		this.scoreContainer.text(this.score.toString());

		if (difference > 0) {
			var addition = document.createElement("div");
			addition.classList.add("score-addition");
			addition.textContent = "+" + difference;

			//this.scoreContainer.append(addition);
		}
	}

	updateBestScore(bestScore) {
		this.bestContainer.text(bestScore);
	}

	message(won) {
		var type    = won ? "game-won" : "game-over";
		var message = won ? "You win!" : "Game over!";

		this.messageContainer.addClass(type);
		this.messageContainer.find("p").text(message);
		
		// hide karaqu gamepad/joystick
		karaqu.joystick();
	}

	clearMessage() {
		// IE only takes one value to remove at a time.
		this.messageContainer.removeClass("game-won game-over");
	}

}
