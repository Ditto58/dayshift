//-----------------------------------------------------------------------------
//  Galv's Picture Animations
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_PictureAnims.js
//-----------------------------------------------------------------------------
//  2016-08-22 - Version 1.1 - fixed crash when transferring to another map
//  2016-08-17 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_PictureAnims = true;

var Galv = Galv || {};              // Galv's main object
Galv.PIC = Galv.PIC || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.0) Play database animations on pictures made with "Show Picture"
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param
 * @desc
 * @default
 *
 * @help
 *   Galv's Picture Animations
 * ----------------------------------------------------------------------------
 * This plugin allows you to play animation on pictures created with the
 * "Show Picture" event command. To do this, use a script call:
 *
 *    Galv.PIC.anim(picId,animId);   // picId = Picture number to play anim on
 *                                   // animId = animation id from the database
 * 
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.PIC.anim = function(picId,animId) {
	if ($gameScreen._pictures[picId]) $gameScreen._pictures[picId]._animationId = animId;
};

Galv.PIC.Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
Sprite_Picture.prototype.initialize = function(pictureId) {
	this._animationSprites = [];
	this._effectTarget = this;
	this._hiding = false;
    Galv.PIC.Sprite_Picture_initialize.call(this,pictureId);
};

Galv.PIC.Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;
Sprite_Picture.prototype.updateOther = function() {
	Galv.PIC.Sprite_Picture_updateOther.call(this);
	this.updateAnimation();
	this.updateVisibility();
	this.updateAnimationSprites();
};

Sprite_Picture.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
    	this._animationPlaying = false;
    }
};

Sprite_Picture.prototype.setupAnimation = function() {
    if ($gameScreen._pictures[this._pictureId]._animationId > 0) {
		this._animId = $gameScreen._pictures[this._pictureId]._animationId;
        var animation = $dataAnimations[this._animId];
        this.startAnimation(animation, false, 0);   
		$gameScreen._pictures[this._pictureId]._animationId = 0;
		this._animationPlaying = true;
    }
};

Sprite_Picture.prototype.startAnimation = function(animation, mirror, delay) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);
	sprite.opaque = true;
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
};

Sprite_Picture.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};

Sprite_Picture.prototype.updateAnimationSprites = function() {
    if (this._animationSprites.length > 0) {
        var sprites = this._animationSprites.clone();
        this._animationSprites = [];
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._animationSprites.push(sprite);
            } else {
                sprite.remove();
            }
        }
    }
};

Sprite_Picture.prototype.hide = function() {
    this._hiding = true;
};

Sprite_Picture.prototype.show = function() {
    this._hiding = false;
};

Sprite_Picture.prototype.updateVisibility = function() {
    this.visible = !this._hiding;
};

})();