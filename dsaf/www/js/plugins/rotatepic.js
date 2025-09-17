Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed >= 0) {
        this._angle += this._rotationSpeed / 2;
    } else {
		this._angle -= this._rotationSpeed / -2;
	}
};