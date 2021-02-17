
export class LocalStorageManager {
	constructor() {
		this.bestScoreKey = "bestScore";
		this.gameStateKey = "gameState";
		this.storage = window.settings;
	}
	getBestScore() {
		return this.storage.getItem(this.bestScoreKey) || 0;
	}
	setBestScore(score) {
		this.storage.setItem(this.bestScoreKey, score);
	}
	getGameState() {
		let gameState = this.storage.getItem(this.gameStateKey);
		return gameState || null;
	}
	setGameState(gameState) {
		this.storage.setItem(this.gameStateKey, gameState);
	}
	clearGameState() {
		this.storage.removeItem(this.gameStateKey);
	}
}
