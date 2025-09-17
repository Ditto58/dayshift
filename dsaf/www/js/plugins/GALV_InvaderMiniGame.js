//-----------------------------------------------------------------------------
//  Galv's Invader Mini Game - BETA
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_InvaderMiniGame.js
//-----------------------------------------------------------------------------
//  2016-08-10 - version 1.2 - Fixed issues with MV version 1.3
//  2016-07-09 - version 1.1 - Added settings for charge and bomb buttons
//  2016-06-15 - version 1.0 - Object 'collideItem' can add multiple items
//                           - 'collideItem' can now also remove 'pupModules'
//                           - Added 'gainItem' to phase start
//  2016-05-31 - version 0.9 - Added 'bomb' mechanic to damage all on-screen
//  2016-04-08 - version 0.8 - Enemies spawn on screen edge, not far offscreen
//                           - Added 'static' AI to use fixed horzSpeed
//                           - Added horizontal speed when Y limit reached
//                           - Added 'armor' to objects and modules
//                           - collideItem feature added to gain item pickups
//                           - collideItem can add temp modules during game
//                           - enabled player vertical movement
//                           - added charging weapons
//  2016-03-28 - version 0.7 - Added touch controls
//  2016-03-05 - version 0.6 - Bug fix: Player can now die on collision
//                           - Bug fix: Objects couldnt spawn without a module
//  2016-26-02 - version 0.5 - BETA release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------
// Possible Future Updates:
// - Special gun functions: freeze, damage over time, others?
// - Boundry damage - player can crash into screen edges
// - Make an app that helps people setup the mini game data more easily
// - Module/Ship player customization scenes
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_InvaderMiniGame = true;

var Galv = Galv || {};          // Galv's main object
Galv.INVADER = Galv.INVADER || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc A customizable top-down shooter minigame. Requires eventing, basic javascript knowledge & a lot of setup.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param -DEFAULT SETTINGS-
 * @desc 
 * @default
 *
 * @param HUD X Padding
 * @desc Distance between edge of screen and hull/shield bars
 * @default 4
 *
 * @param HUD Y Padding
 * @desc Distance between edge of screen and hull/shield bars
 * @default 0
 *
 * @param HUD H Animation
 * @desc Animation played on the hull HUD bar when shield is damaged
 * @default 0
 *
 * @param HUD S Animation
 * @desc Animation played on the shield HUD bar when shield is damaged
 * @default 0
 *
 * @param Resume Text
 * @desc The text command for resuming the game from pause menu
 * @default Resume
 *
 * @param Quit Text
 * @desc The text command for quitting the game from pause menu
 * @default Quit
 *
 * @param -- PLAYER --
 * @desc
 * @default
 *
 * @param Touch Edges
 * @desc Pixel width on either side of the screen that will move left/right when pressed.
 * @default 300
 *
 * @param Vertical Movement
 * @desc If the player can move freely vertically instead of being stuck to horizontal axis. true or false
 * @default false
 *
 * @param Vertical Block
 * @desc The amount of pixels on bottom and top of screen the player will stop at when moving vertically.
 * @default 50
 *
 * @param Charge Button
 * @desc The button used to hold down and charge charging weapons.
 * See help file for info.
 * @default shift
 *
 * @param Charge Shot
 * @desc toggle or hold - for weapons with the charge ability using
 * @default hold
 *
 * @param Bomb Button
 * @desc The button used to drop a bomb.
 * See help file for info.
 * @default control
 *
 * @param Bomb Graphic
 * @desc Bomb image name from /img/invader/ folder
 * @default bomb
 *
 * @param Bomb Damage
 * @desc Amount of HP damage bombs cause to all enemies on screen
 * @default 9999
 *
 * @param Bomb Anim
 * @desc The animation played on player when bomb goes off on screen
 * @default 0
 *
 * @param Starting Bombs
 * @desc The amount of bombs player starts with in each level
 * @default 0
 *
 * @param Max Bombs
 * @desc The max amount of bombs the player can pick and and hold during level
 * @default 3
 *
 * @param -- OBJECTS --
 * @desc Objects created without specifing a parameter will use the below defaults
 * @default
 *
 * @param Object Name
 * @desc Name of the object appearing in menu scenes
 * @default ????
 *
 * @param Object Desc
 * @desc Description of the object appearing in menu scenes
 * @default An unknown object
 *
 * @param Object Graphic
 * @desc Graphic spritesheet used from /img/invader/ folder
 * @default 
 *
 * @param Visible Modules
 * @desc true or false. If module graphics display on object or not.
 * @default false
 *
 * @param Object Frames
 * @desc Number of frames in an object spritesheet
 * Default: 4
 * @default 4
 *
 * @param Object FrameSpeed
 * @desc Speed frames display for the object (smaller is faster)
 * Default: 10
 * @default 10
 *
 * @param Object Hitbox
 * @desc Width,Height of the object's collision/hit box, centered on the object graphic
 * @default 90,60
 *
 * @param Object Hull Points
 * @desc Default hull points (hit points) the object has
 * @default 1
 *
 * @param Object Armor
 * @desc Reduce hull damage by the armor amount.
 * @default 0
 *
 * @param Object Shield Points
 * @desc Default shield 'hit points'
 * @default 0
 *
 * @param Object Score
 * @desc Default score earned by destroying object.
 * @default 10
 *
 * @param Object Move Speed
 * @desc Vertical,Horizonal move speed
 * @default 0.5,20
 *
 * @param Object Spawn X
 * @desc min,max - set object's x position to a random % of screen width
 * @default 0,100
 *
 * @param Object X Limit
 * @desc min,max - set object's min/max x it can move into to a random % of screen width. Dont use negatives.
 * @default 0,100
 *
 * @param Object Y Limit
 * @desc % of the screen height that the enemy will stop at or change behavior
 * Default 150 to make sure off screen
 * @default 150
 *
 * @param Object Y LimitSpeedY
 * @desc Progressive Y speed change when Y limit is reached and the maximum speed allowed.
 * @default 0,0
 *
 * @param Object Y LimitSpeedX
 * @desc Progressive X speed change when Y limit is reached and the maximum speed allowed.
 * @default 0,0
 *
 * @param Object Z
 * @desc The z priority level of the object
 * Default 5
 * @default 5
 *
 * @param Movement AI
 * @desc Leave blank for straight movement. Options are:
 * erratic,follow,custom
 * @default
 *
 * @param Object Hittable
 * @desc true or false - Can object be hit with shots?
 * Default true
 * @default true
 *
 * @param Hit Animation
 * @desc Animation ID for when object is hit by a projectile but not destroyed. A gun's 'contactAnim' will override this
 * @default 0
 *
 * @param Hit Shield Animation
 * @desc Animation ID for when object is hit by a projectile and shields take damage
 * @default 0
 *
 * @param Destroyed Animation
 * @desc Animation ID for when object is "destroyed"
 * @default 4
 *
 * @param Collision
 * @desc true or false. If object can collide with player or not
 * @default true
 *
 * @param Collide Damage HP
 * @desc Amount of hull damage the object causes to the other object on collision
 * @default 10
 *
 * @param Collide Damage SP
 * @desc Amount of shield damage the object causes to the other object on collision
 * @default 10
 *
 * @param Collide Ignore Shield
 * @desc Collision damage from this object will ignore shields and do hull damage directly
 * @default false
 *
 * @param Collide Animation
 * @desc Animation played on the player when collide with object.
 * @default 0
 *
 * @param -- MODULES --
 * @desc Modules created without specifing a parameter will use the below defaults
 * @default
 *
 * @param Module Name
 * @desc Name of the module appearing in menu scenes
 * @default Module
 *
 * @param Module Desc
 * @desc The description of the module appearing in menu scenes
 * @default An unidentified module
 *
 * @param Module Type
 * @desc Default "type" for modules is the most common - weapon
 * @default weapon
 *
 * @param Module Hit Animation
 * @desc Animation displayed on target when projectile from module hits it
 * @default 5
 *
 * @param Module Shoot SE
 * @desc Sound effect played when a weapon module fires a projectile
 * SE_Name,volume,pitch
 * @default Shot1,80,120
 *
 * @param Module Shield Damage
 * @desc Damage weapon projectile does to shield points
 * @default 1
 *
 * @param Module Hull Damage
 * @desc Damage weapon projectile does to hull points
 * @default 1
 *
 * @param Module Fire Rate
 * @desc random firing rate between between x,y 10ths/second (player shooting always uses lowest)
 * @default 1,2
 *
 * @param Module Bullet Speed
 * @desc How fast the projectiles fired from this module move
 * @default 10
 *
 * @param Module Bullet Graphic
 * @desc Graphic used for the projectile fired from this module
 * @default bullet0
 *
 * @param Module Bullet Z
 * @desc Z level bullet graphic is displayed at
 * @default 2
 *
 * @param -- PHASES --
 * @desc Phases created without specifing a parameter will use the below defaults
 * @default
 *
 * @param Phase Name
 * @desc Name of the phase (however not currently used anywhere)
 * @default New Phase
 *
 * @param Phase Image
 * @desc Image displayed when phase starts - lasts as long as phase start delay
 * @default
 *
 * @param Phase Start Animation
 * @desc Animation played on player when phase starts
 * @default 0
 *
 * @param Phase Length
 * @desc How many seconds the phase lasts until next phase begins
 * @default 15
 *
 * @param Phase Start Delay
 * @desc How many seconds phase start (and phase splash image display) lasts for
 * @default 3
 *
 * @param Phase End Delay
 * @desc How many seconds phase stays without spawning enemies before next phase begins
 * @default 3
 *
 * @param Phase Enemy Spawn Time
 * @desc Random between low,high seconds between each enemy spawning in this phase
 * @default 0.5,2
 *
 * @param Phase Enemy Spawn Type
 * @desc 0 = cycle through enemy list, 1 = random enemy from enemy list, 2 = cycle once then stop
 * @default 1
 *
 * @param Phase PUp Spawn Time
 * @desc Random between low,high seconds between each enemy spawning in this phase
 * @default 10,30
 *
 * @param Phase PUp Spawn Type
 * @desc 0 = cycle through PUp list, 1 = random PUp from PUp list, 2 = cycle once then stop
 * @default 1
 *
 * @param -- LEVELS --
 * @desc Levels built without specifing a parameter will use the below defaults
 * @default
 *
 * @param Level Begin Animation
 * @desc Animation played on player when level starts
 * @default 0
 *
 * @param Level Start Delay
 * @desc How many seconds level start (and level splash image display) lasts for
 * @default 2
 *
 * @param Level End Delay
 * @desc How many seconds level end (and win/lose image display) lasts for
 * @default 3
 *
 * @param Victory Image
 * @desc Image displayed when level starts - lasts as long as level start delay
 * @default headingWin
 *
 * @param Defeat Image
 * @desc Image displayed when player is defeated - lasts as long as level end delay
 * @default headingLose
 *
 * @param Victory ME
 * @desc ME played on victory
 * SE_Name,volume,pitch
 * @default Victory1,100,100 
 *
 * @param Defeat ME
 * @desc ME played on defeat
 * SE_Name,volume,pitch
 * @default Defeat1,100,100
 *
 * @help
 *   Galv's Invader Mini Game
 * ----------------------------------------------------------------------------
 * A top down shooter mini game. A big thanks to all my patreon supporters to
 * make this possible.
 *
 * Below is a description of how to set up and change the mini game during your
 * RPG gameplay. This is not a plugin for users new to RPG Maker MV as it
 * currently requires knowledge of eventing, script calls, database animations
 * and basic javascript.
 * 
 * Future plans include an Invader Mini Game Building App that will generate
 * the required script calls to set up their mini game more easily.
 *
 * ----------------------------------------------------------------------------
 *   HOW IT WORKS
 * ----------------------------------------------------------------------------
 * The mini game was created to allow for a lot of customization during the
 * game. This is a rundown that will try to explain how it works.
 *
 * CONTROLS
 * Left, Right, Up, Down and the default 'ok' button are the main controls.
 * If the mouse or a touch screen is used, autofire will activate and the left
 * and right movement will be controlled by pressing the left and right of the
 * screen as defined in the 'Touch Edges' plugin setting.
 *
 * The "Bomb Button" and "Charge Button" controls can be changed to any of the
 * following list. (This is default in RPG Maker)
 *
 *  KEY CODE   // Keys bound to
 * ------------------------------
 * 	tab        // tab
 * 	ok         // Z or enter or space
 * 	shift      // shift
 * 	control    // control or alt
 * 	escape     // X or esc or insert or numpad0
 * 	pageup     // Q or pageup
 * 	pagedown   // W or pagedown
 * 	left       // leftarrow or numpad4
 * 	up         // uparrow or numpad8
 * 	right      // rightarrow or numpad6
 * 	down       // downarrow or numpad2
 *
 *
 * REQUIRED
 * 1. a new folder in your project's files: /img/invader/
 * 2. image files for the HUD named as below:
 *    /img/invader/invaderHudHull1.png
 *    /img/invader/invaderHudHull2.png
 *    /img/invader/invaderHudShield1.png
 *    /img/invader/invaderHudShield2.png
 *    (included in the downloads on galvs-scripts.com)
 * 3. images for object, modules, layers, etc. depending on your setup.
 *    feel free to use images from the demo in your game or as guides to make
 *    your own graphics
 * 4. the desire to learn, willingness to experiment and patience to succeed
 *
 * THE BUILDING BLOCKS
 * A rundown of the base elements of the mini game is below:
 *
 * 1 - Game Objects
 * An "Object" in the mini game refers to: enemies, powerups and other hazards
 * that will appear physically while playing the mini game.
 * These objects can be configured to act like the different "things" in the
 * mini game by changing movement AI, graphics, hp, effects, modules, etc.
 *
 * 2 - Player
 * The "Player" is just a game object (exactly as above) but this object is
 * controlled by the player and does not use some of Game Object settings
 * such as movement AI (obviously!)
 *
 * 3 - Modules
 * A "Module" is something that can be equipped to and enhance Game Objects.
 * They can be things such as weapons, shields, engines, armor, etc. A game
 * object must have "slots" to equip modules to.
 * The player can have temporary modules added to it via object powerups.
 * These modules will disappear after the level is finished.
 *
 * 4 - Phases
 * A "Phase" refers to a portion of a mini game "Level". Each phase can have
 * different parameters telling it how long to last, what enemies and powerups
 * to spawn, music, background and more. Each "Level" can contain as many
 * phases as desired.
 *
 * 5 - Levels
 * Every time the player starts this mini game, they play a "Level" of it.
 * Level settings contain each level's name and phase data. This data is saved
 * for all levels of unique name once you create them and can be accessed or
 * changed during the game as required.
 * During a "Level", a player will challenge each "Phase" in order until every
 * phase in the level settings has been completed or the player is defeated.
 * Records of playing each level (score,wins,losses,kills,etc) are kept in the
 * level data which you can access with eventing.
 *
 * Each of the above elements are set up using SCRIPT event commands.
 * These elements are saved in $gameSystem.invader
 *
 * BOMBS
 * The plugin settings allow you to change some settings about bombs. This
 * feature was designed for the player to have limited use panic button that
 * can destroy or highly damage all enemies on screen.
 *
 * ----------------------------------------------------------------------------
 *   EDITABLE ATTRIBUTES
 * ----------------------------------------------------------------------------
 * Below is a list of attributes the mini games uses for each of the above.
 * Most of these were included in the plugin settings for you to assign default
 * values to them - which means during setup if you don't assign a value to
 * any of the below attributes, it will refer to the default instead.
 *
 *   GAME OBJECTS
 * ----------------------------------------------------------------------------
 * VAR NAME         TYPE        DESCRIPTION
 * id               Integer     Unique identifier
 * name             String      Name of object
 * description      String      Description of object
 * graphic          String      Graphic found in /img/invader/
 * frames           Integer     Number of frames/cells across in graphic sheet
 * rows             Integer     Number of rows in graphic sheet
 * frameSpeed       Integer     Time passed between frame animations
 * z                Integer     Z level of object (lower appears below)
 * visibleModules   Boolean     Draw equipped modules onto object - true/false
 *
 * movementAi       String      Designate type of AI. Can be one of:
 *                              '','follow','erratic','static','custom'
 * vertSpeed        Integer     Speed object moves vertically down the screen
 * horzspeed        Integer     Max speed object moves horizontally in follow
 *                              and erratic AI settings. Or set horizontal
 *                              movement in 'static' AI seting.
 * xStart           Array       [x,x] starts in random x between %'s of screen
 * xLimit           Array       [x,x] movement restricted between %'s of screen
 * yLimit           Integer     vertical movement stopped when at y% of screen
 * yLimitSpeedY     Array       [y,ymax] - when reaching yLimit, speed of
 *                              acceleration is changed by y (negative to
 *                              reverse direction) up to a max of ymax
 * yLimitSpeedX     Array       [x,xmax] - when reaching yLimit, speed of
 *                              horizontal movement is changed by x up to a max
                                of xmax
 *
 * hp               Integer     Maximum hull points
 * sp               Integer     Maximum shield points
 * armor            Integer     Hull damage taken is reduced by the armor value
 * hitbox           Object      {w:100,h:100} - width and height of hitbox
 * hittable         Boolean     Projectiles can hit object - true/false
 * hitAnim          Integer     Animation ID played when hit (if gun has none)
 * shieldAnim       Integer     Animation ID played when shields are hit
 * scoreMod         Integer     Score change when object is destroyed
 * countKill        Boolean     true or false if object counted as a kill
 * dieAnim          Integer     Animation ID played on object
 * dieItem          Array       [itemType,id] - to gain an item when shot
 * dieTrigger       String      Custom code to run when object dies. eg:
 *                              'this.endPhase();'
 *                              '$gameSwitches.setValue(1,true);'
 *
 * canCollide       Boolean     Player can collide with object - true/false
 * collideDie       Boolean     Object dies instantly on collide - true/false
 * collideAnim      Integer     Animation ID played on collidee
 * collideIgnoreS   Boolean     Collision ignores shields - true/false
 * collideDamageHp  Integer     Damage caused to hull when colliding
 * collideDamageSp  Integer     Damage caused to shields when colliding
 * collideHpMod     Integer     Heal hull points
 * collideSpMod     Integer     Heal shield points
 * collideItem      Array       [['itemType',id]] - gain an item on collision
 *                              itemType can be one of the following:
 *                              'armor','weapon','item','module','object',
 *                              'pupModule' or 'bomb'. If 'bomb' then the id
 *                              is actually number of bombs gained instead.
 *                              a negative id number will remove previous
 *                              pupModules (this ONLY works for pupModules)
 *                              multiple items can be gained, eg:
 *                              [[itemType,id],[itemType,id],[itemType,id]]
 *
 * slots            Object      Slots object controls equipping modules:
 * {
 *  id: {              Integer    Unique slot ID
 *    xy: [0,0],       Array      Location of module (0,0 is center)
 *    size: 2,         Integer    Max size of module that can fit here
 *    type: 'weapon',  String     What type of module can fit here
 *                                type can be 'object' for 'attaching'
 *    module: null     Integer    ID of module in the slot. null = none
 *                                if type has 'object' in it's name, this
 *                                becomes an object ID that is connected
 *                                to the slot. Connected objects move with
 *                                their parent object.
 *  },  
 * }
 *
 *
 *   GAME MODULES
 * ----------------------------------------------------------------------------
 * VAR NAME             TYPE        DESCRIPTION
 * id                   Integer     Unique identifier
 * name                 String      Name of module
 * description          String      Description of module
 * graphic              String      Graphic found in /img/invader/ this graphic
 *                                  will overlay the object it is equipped to
 *                                  and must be the same amount of frames/rows
 * xy                   Array       Location of module [0,0] is center. This
 *                                  will take priority over a slot's xy
 *
 * hp                   Integer     Hull point enhancement
 * sp                   Integer     Shield point enhancement
 * armor                Integer     Armor point enhancement
 * speed                Integer     Speed enhancement
 * energy               Integer     Energy requirement to equip to an object
 * size                 Integer     Size of module
 * type                 String      Type of module to use in slot restriction
 *                                  Below values apply to types that contain
 *                                  'weapon' in the typename
 *
 * shootAnim            Integer     Animation ID played on shooting object
 * hitAnim              Integer     Animation ID played on projectile when hit
 * contactAnim          Integer     Animation ID played on target that is hit
 * shootSE              Object      {name:'',pan:0,pitch:100,volume:100}
 *                                  if using chargeTime, this can be an array
 *                                  of 3 sounds for each charge step
 * damageSp             Integer     Damage caused to shields
 * damageHp             Integer     Damage caused to hull
 * ignoreS              Boolean     Projectile ignores shields - true/false
 * ignoreA              Boolean     Projectile ignores armor - true/false
 * fireRate             Array       [a,b] random shoot time between a and b
 * projectileSpeed      Integer     Speed projectile travels
 * projectileAngles     Array       List of angles. Module will fire as many
 *                                  projectiles as there are angles in array
 * projectileGraphic    String      Graphic found in /img/invader/
 * projectileZ          Integer     Z level of object (lower appears below)
 * projectileHitBox     Object      {w:100,h:100} width,height of proj hitbox
 * projectilePenetrate  Boolean     Projectile continues when hit true/false
 * projectileTick       Integer     For large projectiles. Amount of frames
 *                                  an object remains in a large projectile
 *                                  area before it repeats the damage.
 *
 * chargeTime           Integer     Frames a weapon can chargeup for. If this
 *                                  is > 0, weapon uses charge button instead
 *                                  of the normal shoot button. 60 frames/s
 *                                  The charge settings below only work if
 *                                  this is > 0 as well.
 * chargeRate           Array       [min,max,full] damange % of charge time
 *                                  min-max = 0-100%, full = >100%
 * chargeAnims          Array       [a,b,c] anims played during charge time
 *                                  a = 0-50%, b = 50-100%, c = >100%
 * chargeAnimDelay      Integer     Frames of delay between charge animations
 * chargeAngles         Array       [a,b,c] number of projectileAngles used
 *                                  a = 0-50%, b = 50-100%, c = >100%
 *
 * upgradeModule        Integer     The ID of a different module used for when
 *                                  obtaining this module weapon powerup when
 *                                  it has been picked up already. A module
 *                                  without this attribute can be obtained
 *                                  unlimted times. Make this 0 to only be
 *                                  be able to pick it up once in-game
 * 
 *
 * GAME PHASES
 * ----------------------------------------------------------------------------
 * VAR NAME      TYPE        DESCRIPTION
 * id            Integer     Unique identifier
 * splashImage   String      Graphic found in /img/invader/ for phase start
 * beginAnim     Integer     Animation ID played on player on phase start
 * gainItem      Array       [['itemType',id]] - to gain item on phase start
 *                           works like 'collideItem' for 'objects'
 * 
 * length        Integer     Second duration before phase ends
 * delayEnd      Integer     Second delay after phase ends
 * delayBegin    Integer     Second during phase start (SplashImage display)
 * 
 * enemyFreq     Array       [a,b] enemy spawn random seconds between a & b
 * enemies       Array       List of enemy ID's that can spawn in phase
 * eSpawnType    Integer     0 = spawn in array order, repeating the list
 *                           1 = spawn randomly from the list
 *                           2 = spawn in order but stop when list is empty
 * 
 * pupFreq       Array       [a,b] pups spawn random seconds between a & b
 * pups          Array       List of powerup ID's that can spawn in phase
 * pSpawnType    Integer     0 = spawn in array order, repeating the list
 *                           1 = spawn randomly from the list
 *                           2 = spawn in order but stop when list is empty
 * 
 * bgm           Object      {name:'',pan:0,pitch:100,volume:100}
 * bgmFade       Integer     Seconds bgm fades out at end of phase
 * bgs           Object      {name:'',pan:0,pitch:100,volume:100}
 * bgsFade       Integer     Seconds bgs fades out at end of phase
 * 
 * layers        Object      Object containing layer graphic data:
 *        {
 *            1: {                 // Layer ID
 *                 graphic: '',    // graphic from /img/invader/
 *                 opacity: 255,   // how transparent the layer is
 *                 xs: 0,          // speed layer moves horizontally
 *                 ys: 2,          // speed layer moves vertically
 *                 ox: 0.1,        // layer offset depending on player location
 *                 z: -10,         // z level of layer
 *                 fadeSpeed: 10   // Speed layer fades in (except phase 1)
 *               },
 *    };
 *
 * // Layers that are created remain from phase to phase unless you use the
 * // same layer ID in a new phase - then the previous layer will disappear
 * // after a while. It remains visible for a time so the new layer with same ID 
 * // can fade in over the old one.
 *
 *
 *
 * GAME LEVELS
 * ----------------------------------------------------------------------------
 * VAR NAME       TYPE        DESCRIPTION
 * id             Integer     Unique identifier
 * splashImage    String      Graphic found in /img/invader/ for level start
 * beginAnim      Integer     Animation ID played on player on level start
 *
 * victoryImage   String      Graphic found in /img/invader/ for victory
 * meVictory      Object      {name:'',pan:0,pitch:100,volume:100}
 * defeatImage    String      Graphic found in /img/invader/ for defeat
 * meDefeat       Object      {name:'',pan:0,pitch:100,volume:100}
 * 
 * delayEnd       Integer     Second delay after phase ends
 * delayBegin     Integer     Second during phase start
 * 
 * contMusic      Boolean     Continue playing music from map - true/false
 * 
 *
 * ----------------------------------------------------------------------------
 *
 *                             SCRIPT CALLS
 *
 * ----------------------------------------------------------------------------
 * These script calls are what control all aspects of your mini gameplay in
 * your project. One important thing to note is that RPGMaker MV's event
 * 'script' box only allows a limited number of lines - but it allows a lot of
 * text on one line. So these script calls can be done on one line - it might
 * be better to copy/paste into a text editor in order to read or write them
 * easier. 
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALL - CREATING GAME DATA
 * ----------------------------------------------------------------------------
 *
 *       Galv.INVADER.create('type',id,{parameters});
 *
 * ----------------------------------------------------------------------------
 * This script call is used to build modules, objects and phases.
 * 'type'      = 'object', 'module' or 'phase'
 * id          = unique identifier of the object, module or phase
 * parameters  = an object containing parameters (from the above lists)
 * ----------------------------------------------------------------------------
 * EXAMPLE MODULE:
 * Galv.INVADER.create('module',1,{
 *   type:'weapon',graphic:'module0',projectileGraphic:'bullet0',
 *   fireRate:[1,25],projectileSpeed:15
 * });
 *
 * EXAMPLE OBJECT:
 * Galv.INVADER.create('object',2,{
 *   hp:5,graphic:'enemy0',frames:4,hitbox:{w:90,h:80},dieAnim:10,
 *   xStart:[10,90],yStart:[0,0],z:4,dieTrigger:'this.endPhase()',
 *   slots: {
 *       0: {xy: [0,0], size: 2, type: 'weapon', module: 1}
 *       1: {xy: [0,0], size: 2, type: 'armor', module: 2}
 *   },
 * });
 *
 * EXAMPLE PHASE:
 * var p1 = {1:{graphic:'layer_ground2',opacity:255,xs:0,ys:1.5,ox:0,z:-30}};
 * Galv.INVADER.create('phase',0,{splashImage:'heading1',layers:p1,enemies:[2],
 * bgm: {name:'03_Endless_Battle',pitch:120,volume:90}
 * });
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALLS - CHANGING GAME DATA
 * ----------------------------------------------------------------------------
 *
 *        Galv.INVADER.change('type',id,{parameters});
 *
 * ----------------------------------------------------------------------------
 * This script call works exactly like the create function, but instead of 
 * creating a new one, it modifies ones that have already been created. This
 * will only modify parameters you assign and it will keep all others intact.
 * ----------------------------------------------------------------------------
 * 
 *       Galv.INVADER.changeSlot(objectId,slotId,{parameters});
 *
 * ----------------------------------------------------------------------------
 * This will modify the parameters of a slot of the specified object.
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALL - LEVEL SETUP
 * ----------------------------------------------------------------------------
 *
 *       Galv.INVADER.buildLevel(id,{params},[phaseIds]);
 *
 * ----------------------------------------------------------------------------
 * This script call is used to build levels.
 * id          = unique identifier of the level
 * parameters  = an object containing parameters (from the above LEVEL list)
 * phaseIds    = an array containing, in order, phases for the level
 * ----------------------------------------------------------------------------
 * EXAMPLE LEVEL:
 * Galv.INVADER.buildLevel(1,{splashImage:'heading0',beginAnim:1},[0,1,2,3,4]);
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   OTHER SCRIPT CALLS
 * ----------------------------------------------------------------------------
 *
 *   Galv.INVADER.run(id);    // Start the mini game on a pre-made level id
 *
 *   Galv.INVADER.equipModule(objId,slotId,moduleId); // equip module to object
 *
 *   Galv.INVADER.setPlayer(objId);             // Make an object id the player
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT TO USE IN VARIABLES OR CONDITIONAL BRANCHES
 * ----------------------------------------------------------------------------
 * In all the below examples, 'x' is the level Id number, to get the data for
 * that particular level that has been stored.
 *
 *   Galv.INVADER.record(x).result      returns "win" or "lose" depending on
 *                                      the last mini game play.
 *
 *   Galv.INVADER.record(x).time        returns last play time
 *   Galv.INVADER.record(x).bestTime    returns best play time for the level
 *   Galv.INVADER.record(x).score       returns last play score
 *   Galv.INVADER.record(x).highScore   returns best score for the level
 *   Galv.INVADER.record(x).wins        returns how many wins for the level
 *   Galv.INVADER.record(x).losses      returns how many losses for the level
 *   Galv.INVADER.record(x).kills       returns how many kills for last level
 *   Galv.INVADER.record(x).totalKills  returns how many total kills for level
 *
 * ----------------------------------------------------------------------------
 * CONDITIONAL BRANCH EXAMPLE:
 *   Galv.INVADER.record(1).result == "win"    // conditional branch check
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 * NOTES:
 * BestTime and highScore are only recorded when the players wins. If the
 * player loses, time and score will be recorded for you to use, but it will
 * not count toward the highScore or bestTime.
 * ----------------------------------------------------------------------------
 */
 
 


//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {
// GRAPHIC FOLDER
ImageManager.loadInvaderGraphic = function(filename, hue) {
    return this.loadBitmap('img/invader/', filename, hue, true);
};

// Random between 2 numbers
Galv.INVADER.rand = function(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Round a number
//Galv.INVADER.rnd
Galv.INVADER.rnd = function(number) {
	return Math.round(number * 10) / 10;
};


Galv.INVADER.isObject = function(string) {
	return string.match(/object/i);
}

Galv.INVADER.gainInvModule = function(module) {
	// For future code
};

Galv.INVADER.gainInvObject = function(module) {
	// For future code
};

// Cache all minigame graphics on scene start
Galv.INVADER.cacheAll = function() {
	Galv.INVADER.cached = [];
	var lvl = $gameSystem.invader.level[Galv.INVADER.currentLevel];
	
	Galv.INVADER.cacheAdd('invaderHudHull1');
	Galv.INVADER.cacheAdd('invaderHudHull2');
	Galv.INVADER.cacheAdd('invaderHudShield1');
	Galv.INVADER.cacheAdd('invaderHudShield2');
	Galv.INVADER.cacheAnim(Galv.INVADER.hudHanim);
	Galv.INVADER.cacheAnim(Galv.INVADER.hudSanim);
	Galv.INVADER.cacheAdd(Galv.INVADER.bombGraphic);
	
	// Player Ship
	Galv.INVADER.cacheAdd($gameSystem.invader.player.graphic);
	for (var m in $gameSystem.invader.player.slots) {
		// Player Modules
		if ($gameSystem.invader.player.slots[m].module) {
			var mId = $gameSystem.invader.player.slots[m].module;
			Galv.INVADER.cacheAdd($gameSystem.invader.module[mId].graphic);
			Galv.INVADER.cacheAdd($gameSystem.invader.module[mId].projectileGraphic);
			// Module Animations
			var m = $gameSystem.invader.module[mId];
			Galv.INVADER.cacheAnim(m.shootAnim);
			Galv.INVADER.cacheAnim(m.hitAnim);
			Galv.INVADER.cacheAnim(m.contactAnim);
			if (m.chargeAnims) {
				for (var i = 0; i < m.chargeAnims.length; i++) {
					Galv.INVADER.cacheAnim(m.chargeAnims[i]);
				};
			};
		};	
	};
	
	// Level Images
	Galv.INVADER.cacheAdd(lvl.splashImage);
	Galv.INVADER.cacheAdd(lvl.victoryImage);
	Galv.INVADER.cacheAdd(lvl.defeatImage);
	Galv.INVADER.cacheAnim(lvl.beginAnim);
	
	// Phase Images
	for (var i = 0; i < lvl.phases.length; i++) {
		var phase = $gameSystem.invader['phase'][lvl.phases[i]];
		Galv.INVADER.cacheAdd(phase.splashImage);
		Galv.INVADER.cacheAnim(phase.beginAnim);
		
		// Layers
		for (var l in phase.layers) {
			Galv.INVADER.cacheAdd(phase.layers[l].graphic);
		};
		
		// Objects (Enemies)
		for (var o = 0; o < phase.enemies.length; o++) {
			var obj = $gameSystem.invader.object[phase.enemies[o]];
			Galv.INVADER.cacheObject(obj);
		};
		
		// Objects (powerups/other)
		for (var p = 0; p < phase.pups.length; p++) {
			var obj = $gameSystem.invader.object[phase.pups[p]];
			Galv.INVADER.cacheObject(obj);
		};
	};
	
	// Load all images from cached list
	for (var i = 0; i < Galv.INVADER.cached.length; i++) {
		ImageManager.loadInvaderGraphic(Galv.INVADER.cached[i]);
	};
};

Galv.INVADER.cacheObject = function(obj) {
	if (!obj) return false;
	// Object Graphic
	Galv.INVADER.cacheAdd(obj.graphic);
	// Object Animations
	Galv.INVADER.cacheAnim(obj.collideAnim);
	Galv.INVADER.cacheAnim(obj.dieAnim);
	Galv.INVADER.cacheAnim(obj.hitAnim);
	Galv.INVADER.cacheAnim(obj.shieldAnim);
	
	// Modules
	for (var s in obj.slots) {
		if (obj.slots[s].module !== null) {
			if (Galv.INVADER.isObject(obj.slots[s].type)) {
				var o = $gameSystem.invader.object[obj.slots[s].module];
				Galv.INVADER.cacheObject(o);
			} else {
				var m = $gameSystem.invader.module[obj.slots[s].module];
				// Module Graphics
				Galv.INVADER.cacheAdd(m.graphic);
				if (m.projectileGraphic) Galv.INVADER.cacheAdd(m.projectileGraphic);
				// Module Animations
				Galv.INVADER.cacheAnim(m.shootAnim);
				Galv.INVADER.cacheAnim(m.hitAnim);
				Galv.INVADER.cacheAnim(m.contactAnim);
			};
		};
	};
};


Galv.INVADER.cacheAnim = function(a) {
	if (a > 0) {
		anim = $dataAnimations[a];
		var name1 = anim.animation1Name;
		var name2 = anim.animation2Name;
		var hue1 = anim.animation1Hue;
		var hue2 = anim.animation2Hue;
		ImageManager.loadAnimation(name1, hue1);
		ImageManager.loadAnimation(name2, hue2);
	};
};

Galv.INVADER.cacheAdd = function(string) {
	if (string && string != '' & !Galv.INVADER.cached.contains(string)) Galv.INVADER.cached.push(string);
};

//-----------------------------------------------------------------------------
// Create Game Objects
// type can be: object, module, player, phase

Galv.INVADER.create = function(type,id,data) {
	$gameSystem.invader[type][id] = new Galv.INVADER[type](id,data);
};

Galv.INVADER.setPlayer = function(id) {
	$gameSystem.invader['player'] = $gameSystem.invader['object'][id];
	Galv.INVADER.player = $gameSystem.invader['player']; 
};

//-----------------------------------------------------------------------------
// Change Game Objects
// Keeps the original setup but changes the parameters you include in data obj

Galv.INVADER.change = function(type,id,data) {
	if (!$gameSystem.invader[type][id]) {
		Galv.INVADER.create(type,id,data);
	} else {
		for(var v in data) {
			$gameSystem.invader[type][id][v] = data[v];
			$gameSystem.invader[type][id][v].needUpdate = true;
		};
	};
};

Galv.INVADER.equipModule = function(objectId,slotId,moduleId) {
	if (!$gameSystem.invader['object'][objectId].slots[slotId]) return false;
	$gameSystem.invader['object'][objectId].slots[slotId].module = moduleId;
};

Galv.INVADER.changeSlot = function(objectId,slotId,data) {
	if (!$gameSystem.invader['object'][objectId].slots[slotId]) {
		$gameSystem.invader['object'][objectId].slots[slotId] = {xy:[0,0],size:2,type:'weapon',module: null};
	};
	// TODO: Unequip module if module no longer fits in changed slot.
	for(var v in data) {
		$gameSystem.invader['object'][objectId].slots[slotId][v] = data[v];
	};
};


Galv.INVADER.changeLayer = function(phaseId,layerId,data) {
	if (!$gameSystem.invader['phase'][phaseId].layers[layerId]) {
		$gameSystem.invader['phase'][phaseId].layers[layerId] = {graphic:'',opacity:255,xs:0,ys:2,ox:0,z:-10,fadeSpeed:10}
	};
	for(var v in data) {
		$gameSystem.invader['phase'][phaseId].layers[layerId][v] = data[v];
	};
};


//-----------------------------------------------------------------------------
// Create Level
// Setting up a level. phaseArray is an array of phase ID's.

Galv.INVADER.buildLevel = function(id,data,phaseArray) {
	$gameSystem.invader.level[id] = new Galv.INVADER.level(id,data,phaseArray);
};

//-----------------------------------------------------------------------------
// Start MiniGame
// Start a mini game scene.

Galv.INVADER.run = function(level) {
	Galv.INVADER.bombs = Galv.INVADER.initBombs;
	Galv.INVADER.savedBgm = AudioManager.saveBgm();
	Galv.INVADER.savedBgs = AudioManager.saveBgs();
	$gameScreen._brightness = 0;
	Galv.INVADER.currentLevel = level;
	Galv.INVADER.player = $gameSystem.invader['player']; 
	SceneManager.push(Scene_Invaders);
	return false;
};


//-----------------------------------------------------------------------------
//                               GAME STUFF
//-----------------------------------------------------------------------------

Galv.INVADER.spawnedObjects = [];

Galv.INVADER.spawnObject = function(obj,remove) {
	if (obj) {
		if (remove) {
			var index = Galv.INVADER.spawnedObjects.indexOf(obj);
			Galv.INVADER.spawnedObjects.splice(index,1);
		} else {
			Galv.INVADER.spawnedObjects.push(obj);
		};
	};
};

Galv.INVADER.bombBtn = PluginManager.parameters('Galv_InvaderMiniGame')["Bomb Button"];
Galv.INVADER.chargeBtn = PluginManager.parameters('Galv_InvaderMiniGame')["Charge Button"];


Galv.INVADER.hudX = Number(PluginManager.parameters('Galv_InvaderMiniGame')["HUD X Padding"]);
Galv.INVADER.hudY = Number(PluginManager.parameters('Galv_InvaderMiniGame')["HUD Y Padding"]);
Galv.INVADER.touchEdge = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Touch Edges"]);

Galv.INVADER.hudHanim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["HUD H Animation"]);
Galv.INVADER.hudSanim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["HUD S Animation"]);
Galv.INVADER.txtResume = PluginManager.parameters('Galv_InvaderMiniGame')["Resume Text"];
Galv.INVADER.txtQuit = PluginManager.parameters('Galv_InvaderMiniGame')["Quit Text"];

Galv.INVADER.chargeHold = PluginManager.parameters('Galv_InvaderMiniGame')["Charge Shot"].toLowerCase() == 'hold' ? true : false;          // The charge type used, hold or toggle
Galv.INVADER.vertMovement = PluginManager.parameters('Galv_InvaderMiniGame')["Vertical Movement"].toLowerCase() == 'true' ? true : false;  
Galv.INVADER.vBlock = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Vertical Block"]);



Galv.INVADER.bombGraphic = PluginManager.parameters('Galv_InvaderMiniGame')["Bomb Graphic"];
Galv.INVADER.bombDamage = PluginManager.parameters('Galv_InvaderMiniGame')["Bomb Damage"];
Galv.INVADER.bombAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Bomb Anim"]);
Galv.INVADER.initBombs = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Starting Bombs"]);
Galv.INVADER.maxBombs = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Max Bombs"]);
Galv.INVADER.bombs = 0; // current number of bombs held


Galv.INVADER.changeBombs = function(amount) {
	Galv.INVADER.bombs = Math.min(Math.max(Galv.INVADER.bombs + amount,0),Galv.INVADER.maxBombs);
};



//-----------------------------------------------------------------------------


//                               GAME OBJECTS


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// OBJECT
//-----------------------------------------------------------------------------

Galv.INVADER.object = function(id,obj) {
	var temptxt = '';
    this.id = id;                        // Unique identifier of the object
	this.name = PluginManager.parameters('Galv_InvaderMiniGame')["Object Name"];                         // Name of the object
	this.description = PluginManager.parameters('Galv_InvaderMiniGame')["Object Desc"];                  // Text description of the object
    this.graphic = PluginManager.parameters('Galv_InvaderMiniGame')["Object Graphic"];                   // Image name from /img/invader/ folder
	this.visibleModules = PluginManager.parameters('Galv_InvaderMiniGame')["Visible Modules"].toLowerCase() == 'true' ? true : false;          // Show equip graphics on object
	this.frames = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Frames"]);             // Number of frames (cols) in graphic (4)
	this.rows = 3;                                                                                       // Number of columns in graphic (4)
	this.frameSpeed = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object FrameSpeed"]);     // delay between when frames change (10)
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object Hitbox"].split(",");
    this.hitbox = {w: temptxt[0], h: temptxt[1] || temptxt[0]};        									// Height/width of hitbox centered on object
	this.hittable = PluginManager.parameters('Galv_InvaderMiniGame')["Object Hittable"].toLowerCase() == 'true' ? true : false;          // If projectiles hit or pass through true/false
	
    this.hp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Hull Points"]);           // Hull Points until destroyed
    this.sp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Shield Points"]);         // Shield Points
	this.armor = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Armor"]);              // Reduce damage to hull by the armor amount

		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object Move Speed"].split(",");
    this.vertSpeed = Number(temptxt[0]);                  												// Speed travels vertical
    this.horzSpeed = Number(temptxt[1]);                 												// Speed travels horizontal
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object Spawn X"].split(",");
    this.xStart = [Number(temptxt[0]),Number(temptxt[1])];                                              // Spawn rand between [x,y]% screen width
    this.yLimit = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Y Limit"]);           // Stops when at this height% of screen
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object X Limit"].split(",");
    this.xLimit = [Number(temptxt[0]),Number(temptxt[1])];                                              // Stops when at this [left x,right x] width% of screen
	
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object Y LimitSpeedY"].split(",");
	this.yLimitSpeedY = [Number(temptxt[0]),Number(temptxt[1])];                                         // Increasing change in Y Speed when Y limit is reached and max speed
	
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Object Y LimitSpeedX"].split(",");
	this.yLimitSpeedX = [Number(temptxt[0]),Number(temptxt[1])];                                         // Increasing change in X Speed when Y limit is reached and max speed

	
	
    this.z = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Z"]);                      // Z level of object
   
    this.movementAi = PluginManager.parameters('Galv_InvaderMiniGame')["Movement AI"];					// Controls the objects movement update setting
	
	this.canCollide = PluginManager.parameters('Galv_InvaderMiniGame')["Collision"].toLowerCase() == 'true' ? true : false;   // if false, all collide options are void

	this.collideDie = false;    // Object dies when collided with, no matter collide damage taken
	this.collideAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Collide Animation"]);           // Animation played on other Colliding object during collision (for buff animation or special effect)
	this.collideIgnoreS = PluginManager.parameters('Galv_InvaderMiniGame')["Collide Ignore Shield"].toLowerCase() == 'true' ? true : false;              // Collision ignores shield? true or false
	this.collideDamageSp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Collide Damage SP"]);                // Damage player takes to shield on collision
	this.collideDamageHp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Collide Damage HP"]);                // Damage player takes to hull on collision
	this.collideHpMod = 0;    // Restore hit points on collide
	this.collideSpMod = 0;    // Restore shield points on collide
	this.collideItem = [];  // Add item to "gain item" list on collide

	this.scoreMod = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Object Score"]);                  // Score modification for destroying
	this.countKill = true;                 // count this object dying as a kill true or false
	this.dieItem = null;                   // Add item to "gain item" list
	this.dieTrigger = function() {};                 // Trigger end of phase or end game

    this.dieAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Destroyed Animation"]);               // Animation played when "die" (example, explosion)
	this.hitAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Hit Animation"]);                     // Animation played when just "hit" (example, ship flash) Guns can override this with contactAnim
	this.shieldAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Hit Shield Animation"]);           // Animation played when hit but only damages shield

    this.slots = {
		/*
         1: {
            xy: [0,0],                 // Location of weapon (0,0 is center)
            size: 2,                   // Max size of equips that can fit here
         	type: 'weapon',            // What type of equip can fit here.
            module: null               // ID of module in the slot. null = none
         },  
		 */
		  
    };
	this.needUpdate = true;
	// Overwrite with set variables:
	for(var v in obj) this[v] = obj[v];
};

//-----------------------------------------------------------------------------
// MODULE
//-----------------------------------------------------------------------------

Galv.INVADER.module = function(id,obj) {
	this.id = id;                         														 // Unique ID of the equip piece
	this.name = PluginManager.parameters('Galv_InvaderMiniGame')["Module Name"];                 // Name of the module
	this.description = PluginManager.parameters('Galv_InvaderMiniGame')["Module Desc"];          // Text description of the equip
	this.graphic = '';                    														 // Image name from /img/invader/ folder
	this.energy = 0;                     														 // energy cost to Equip to a ship
	this.type = PluginManager.parameters('Galv_InvaderMiniGame')["Module Type"];                 // 'weapon', 'shield', 'armor', 'engine' etc. or special 'object'
	this.size = 0;                        														 // size of the equip piece
	this.hp = 0;                          														 // Hit Point bonus when equipped
	this.sp = 0;                          														 // Shield bonus when equipped
	this.armor = 0;                          													 // Armor bonus when equipped
	this.speed = 0;                       														 // Ship Speed Bonus when equipped
	
	this.upgradeModule = null;   // Used when "upgrading" and obtaining the same weapon in-game powerup.

	// for weapons
	if (obj.type.toLowerCase().contains('weapon')) {
		this.shootAnim = 0;                   																// Animation displayed on module that fires it
		this.hitAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Module Hit Animation"]);   	// Animation displayed on projectile when it hits
		this.contactAnim = 0;                																// Animation displayed on target it hits
			temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Module Shoot SE"].split(",");
		this.shootSE = {name: temptxt[0],pan: 0,pitch: Number(temptxt[2]),volume: Number(temptxt[1])};      // SE played on shot

		this.damageSp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Module Shield Damage"]);   // Damage to shield if hit
		this.damageHp = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Module Hull Damage"]);     // Damage to hull if hit
		this.ignoreS = false;  // Ignore shield and hit armor directly
		this.ignoreA = false;  // Ignore armor reduction
			temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Module Fire Rate"].split(",");
		this.fireRate = [Number(temptxt[0]),Number(temptxt[1])];                								// Fire rate between [x,y] 10ths/second
		this.projectileSpeed = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Module Bullet Speed"]); // Speed the projectile travels
		this.projectileAngles = [0];          																	// Array of angles for each shot fired (controls how many shots are fired)
		this.projectileGraphic = PluginManager.parameters('Galv_InvaderMiniGame')["Module Bullet Graphic"];     // Graphic used for projectile
		this.projectileZ = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Module Bullet Z"]);         // Z value the projectile is displayed at
		this.projectileHitBox = null;         // {w:200,h:200} - only used for large projectiles to save processing. (Halve these values for projectiles due to inconsistent code mistake)
		this.projectilePenetrate = false;         // If projectile penetrates instead of detonating/vanishing on hit. If true, projectile will continue to travel and damage each tick count
		this.projectileTick = 10;             // Only if projectile doesn't vanish - tick = frame count for how often damage is done while in projectile hit box.
		this.chargeTime = 0;  // determines if a charge weapon and how long weapon will charge for
		this.chargeRate = [0,100,200];   // min,max,overmax - % rate of the weapon's damage during the progress of the charge time.
		this.chargeAnims = [0,0,0];      // low,high,over - animations repeated when less than 50%, more than 50% and when reached max charge
		this.chargeAnimDelay = 30;       // frame delay in how often charge anims play
		this.chargeAngles = [1,3,3];     // 0-50%, 50-100%, >100% - the number of projectileAngles firing the charge weapon uses.
		this.chargeAmount = 0;
		this.chargeAnimCount = 0;
		this.upgradeModule = 0;
		this.rate = 1;                   // default damage rate, set to 1 to use the middle chargeRate %
	};
	
	this.needUpdate = true;
	for(var v in obj) this[v] = obj[v];
};

//-----------------------------------------------------------------------------
// PHASE
//-----------------------------------------------------------------------------

Galv.INVADER.phase = function(id,obj) {
	this.id = id;
	this.name = PluginManager.parameters('Galv_InvaderMiniGame')["Phase Name"];           	      // Name of phase - potential use in menus
	this.splashImage = PluginManager.parameters('Galv_InvaderMiniGame')["Phase Image"];     	      // Image displayed with name
	this.layers = {         		  // Layer graphics that make up background/fogs
		/*
			1: {                      // Layer ID
				 graphic: '',  // graphic from /img/invader/
				 opacity: 255,		  // how transparent the layer is
				 xs: 0,               // speed layer moves horizontally
				 ys: 2,               // speed layer moves vertically
				 ox: 0.1,             // layer offset depending on player location
				 z: -10,              // z level of layer
				 fadeSpeed: 10        // Speed layer fades in (first phase doesn't fade in)
			   },
			  */
	};

	//this.boundryDamage = 0;       // Amount of damage taken when hit boundry (bounce distance depends on momentum)
	this.length = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase Length"]);                  // Seconds that the phase lasts before phase ends (must have a limit)
	this.delayEnd = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase End Delay"]);             // After phase is complete, seconds delay
	this.delayBegin = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase Start Delay"]);         // second delay before phase starts
	
	this.beginAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase Start Animation"]);      // Animation played on player at the beginning of phase

		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Phase Enemy Spawn Time"].split(",");
	this.enemyFreq = [Number(temptxt[0]),Number(temptxt[1])];                                                // Enemies spawn every 0.5 to 2 seconds
	this.enemies = [];            // Array of enemy objects to spawn
	this.eSpawnType = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase Enemy Spawn Type"]);    // 0 = in array index order, 1 = random, 2 = Go through array list once then stop

		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Phase PUp Spawn Time"].split(",");
	this.pupFreq = [Number(temptxt[0]),Number(temptxt[1])];                                                  // powerup spawn every 5 to 25 seconds
	this.pups = [];                                                                                          // Array of powerups to spawn at random
	this.pSpawnType = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Phase PUp Spawn Type"]);      // 0 = in array index order, 1 = random, 2 = Go through array list once then stop
		
	this.bgm = null;                // Background music change on phase start
	this.bgmFade = null;            // Seconds BGM takes to fade at end of phase. Starts when delayEnd starts
	this.bgs = null;                // Background sound change on phase start
	this.bgsFade = null;            // Seconds BGS takes to fade at end of phase. Starts when delayEnd starts
	
	this.gainItem = [];  // Add item to "gain item" list on collide
	
	this.needUpdate = true;
	for(var v in obj) this[v] = obj[v];
};

//-----------------------------------------------------------------------------
// LEVEL
//-----------------------------------------------------------------------------

Galv.INVADER.level = function(id,obj,phaseArray) {
	this.id = id;
	this.name = 'Level ' + id;
	this.splashImage = '';               // Image displayed on level start
	this.victoryImage = PluginManager.parameters('Galv_InvaderMiniGame')["Victory Image"];              // Image displayed on victory
	this.defeatImage = PluginManager.parameters('Galv_InvaderMiniGame')["Defeat Image"];               // Image displayed on defeat
	this.beginAnim = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Level Begin Animation"]);                  // Animation played on player at the beginning
	this.beginFunction = null;           // For coders to add their own functionality after level splash image.
	
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Victory ME"].split(",");
	this.meVictory = {name: temptxt[0],pan: 0,pitch: Number(temptxt[2]),volume: Number(temptxt[1])};               // ME that plays when victorious
		temptxt = PluginManager.parameters('Galv_InvaderMiniGame')["Defeat ME"].split(",");
	this.meDefeat = {name: temptxt[0],pan: 0,pitch: Number(temptxt[2]),volume: Number(temptxt[1])};                // ME that plays when defeated
	this.phases = phaseArray || [];      // Array of phase objects
	this.delayEnd = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Level End Delay"]);                   // After level is complete, second delay that end image lasts for
	this.delayBegin = Number(PluginManager.parameters('Galv_InvaderMiniGame')["Level Start Delay"]);                 // delay before first phase starts
	this.contMusic = true;               // Continue saved music after scene
	this.records = {score:0,highScore:0,wins:0,losses:0,time:0,bestTime:0,kills:0,totalKills:0,result:"lose"};                   // Store records for level in this object. "result" is the last play of the level win or lost
	this.needUpdate = true;
	
	for(var v in obj) this[v] = obj[v];
};

Galv.INVADER.record = function(levelId) {
	return $gameSystem.invader.level[levelId].records;
};


// Saved Invader Data
Galv.INVADER.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.INVADER.Game_System_initialize.call(this);
	this.invader = {
		player: {},
		object: {},      // objectId: {},
		phase: {},       // phaseId: {},
		level: {},       // levelId: {},
		module: {},      // moduleId: {},	
	};
};

})();



//-----------------------------------------------------------------------------


//                               SCENE


//-----------------------------------------------------------------------------


function Scene_Invaders() {
    this.initialize.apply(this, arguments);
}

Scene_Invaders.prototype = Object.create(Scene_Base.prototype);
Scene_Invaders.prototype.constructor = Scene_Invaders;

Scene_Invaders.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	// Build Cache of all images
	Galv.INVADER.cacheAll();
	// Remember to remove and destroy cache on all these images when scene close
	this.createVars();
	$gameScreen.startFadeOut(60);
	this.createPhaseUpdater();
	this.createSpriteset();
	
};


Scene_Invaders.prototype.commandResume = function() {
	this._pause = false;
	this._pauseWindow.close();
	this._pauseWindow.deactivate();
};

Scene_Invaders.prototype.commandQuit = function() {
	this._pause = false;
	this._pauseWindow.close();
	this._pauseWindow.deactivate();
	this.doWinLose('lose');
};


Scene_Invaders.prototype.createHUD = function() {
	this.createWindowLayer();
	this._scoreWindow = new Window_InvaderScore();
    this.addWindow(this._scoreWindow);
	
	this._pauseWindow = new Window_InvaderPause();
	this._pauseWindow.setHandler('resume',  this.commandResume.bind(this));
    this._pauseWindow.setHandler('quit', this.commandQuit.bind(this));
    this.addWindow(this._pauseWindow);
	
	
	// HULL
	this._hudH1 = new Sprite();
	this._hudH1.bitmap = ImageManager.loadInvaderGraphic('invaderHudHull1');
	this._hudH1.y = Graphics.boxHeight - this._hudH1.bitmap.height - Galv.INVADER.hudY;
	this._hudH1.x = Galv.INVADER.hudX;
	this.addChild(this._hudH1);
	
	this._hudH2 = new Sprite_InvaderPlayerLife(this._hudH1.x,this._hudH1.y,'invaderHudHull2',0);
	this.addChild(this._hudH2);
	
	// SHIELD
	this._hudS1 = new Sprite();
	this._hudS1.bitmap = ImageManager.loadInvaderGraphic('invaderHudShield1');
	this._hudS1.y = Graphics.boxHeight - this._hudS1.bitmap.height - Galv.INVADER.hudY;
	this._hudS1.x = Graphics.boxWidth - this._hudS1.bitmap.width - Galv.INVADER.hudX;
	this.addChild(this._hudS1);
	
	this._hudS2 = new Sprite_InvaderPlayerLife(this._hudS1.x,this._hudS1.y,'invaderHudShield2',1);
	this.addChild(this._hudS2);
	
	// BOMBS
	this._hudBombs = new Sprite();
	this.refreshHudBombs();
	this.addChild(this._hudBombs);
	
};

Scene_Invaders.prototype.refreshHudBombs = function() {
	var bitmap = ImageManager.loadInvaderGraphic(Galv.INVADER.bombGraphic);
	var w = bitmap.width;
	var h = bitmap.height;
	this._hudBombs.bitmap = new Bitmap(w * Galv.INVADER.bombs,h);
	this._hudBombs.x = (Graphics.width / 2) - ((w * Galv.INVADER.bombs) / 2);
	this._hudBombs.y = 10;
	for (var i = 0; i < Galv.INVADER.bombs; i++) {
		this._hudBombs.bitmap.blt(bitmap, 0, 0, w, h, w * i, 0);
	};
};



Scene_Invaders.prototype.createPhaseUpdater = function() {
	// Set level start update
	this.updatePhase = function() {

		if (!this.waiting()) {
			if (this._wait === 0) {
				Galv.INVADER.player._animId = this._lvl.beginAnim;
				this._wait = -1;
			};
			this._splashSprite.opacity -= 10;
			
			if (this._splashSprite.opacity <= 0) {
				this.updatePhase = this._lvl.beginFunction || this.buildUpdatePhase(true);
			};
		} else {
			
			this._splashSprite.opacity += 10;	
		};
	};
};

Scene_Invaders.prototype.createVars = function() {
	Galv.INVADER.scene = this;
	Galv.INVADER.spawnedObjects = [];
	// Level
	this._level = Galv.INVADER.currentLevel;
	this._lvl = $gameSystem.invader.level[Galv.INVADER.currentLevel];
	this._lvl.records.score = 0;
	this._lvl.records.time = 0;
	this._lvl.records.kills = 0;
	this._lvlTimer = 0;
	
	// General
	this._wait = this._lvl.delayBegin * 60;
	this._audioTick = 0;

	// Player
	Galv.INVADER.lockPlayer = true;
	Galv.INVADER.invulPlayer = false;

	// Phase
	this._enemyLimit = null;
	this._phase = 0; // Store current phase index of phase array
	this._phaseTimer = 0;
	this._phaseData = [];
	var length = Object.keys(this._lvl.phases).length;
	for (var i = 0; i < length; i++) {
		this._phaseData.push($gameSystem.invader.phase[this._lvl.phases[i]]);
	};
	// Object containers
	this._pProjectiles = [];
	this._eProjectiles = [];
	this._enemies = [];
	
	// Music
	this.playPhaseBgms();
};




Scene_Invaders.prototype.createSpriteset = function() {
	this._spriteset = new Spriteset_Invaders();
	this._spriteset.setup();	
    this.addChild(this._spriteset);	
};

Scene_Invaders.prototype.createSplashSprite = function(splash) {
	if (!this._splashSprite) var add = true;
	this._splashSprite = this._splashSprite || new Sprite();
	
	if (splash == 'undefined' || splash == '') {
		var img = '';
	} else if (splash) {
		var img = splash;
	} else {
		var img = this._phaseData[this._phase] ? this._phaseData[this._phase].splashImage : '';
	};
	
	//var img = splash ? splash : this._phaseData[this._phase].splashImage;
	this._splashSprite.bitmap = ImageManager.loadInvaderGraphic(img);
	this._splashSprite.x = Graphics.boxWidth / 2;
	this._splashSprite.y = Graphics.boxHeight / 2;
	this._splashSprite.anchor.x = 0.5;
    this._splashSprite.anchor.y = 0.5;
	this._splashSprite.opacity = 0;
	if (add) this.addChild(this._splashSprite);	
};

Scene_Invaders.prototype.createPlayer = function() {
	Galv.INVADER.player = new Sprite_InvaderPlayer($gameSystem.invader.player);
	this._spriteset._sprites.addChild(Galv.INVADER.player);
};


//----------------------------------------------------------------------------
// Functionality

Scene_Invaders.prototype.buildUpdatePhase = function(init) {
	// Init Phase Vars
	if (!init) { // First phase is made during level start
		this._phase += 1;

		// If there's no more phases: Win the game!
		if (!this._phaseData[this._phase]) {
			//this.endGame();
			this.doWinLose('win');
			return function() {};
		};
		
		this._spriteset.createLayers(this._phase);
	};
	this._lvlTimer += this._phaseTimer;
	this._phaseTimer = 0;
	this._spawnTicker1 = 0;
	this._spawnTicker2 = 0;
	Galv.INVADER.lockPlayer = false;
	
	
	// Play/change musics
	this.playPhaseBgms();
	
	// Create Phase Splash Sprite
	this.createSplashSprite();
	
	// Play Phase Animation
	Galv.INVADER.player._animId = this._phaseData[this._phase].beginAnim;
	
	// Gain start phase item
	var phaseItems = this._phaseData[this._phase].gainItem;
	for (var i = 0; i < phaseItems.length; i++) {
		Galv.INVADER.player.gainItem(phaseItems[i]);
	};
	
	// Set Phase vars
	this._phaseLength = this._phaseData[this._phase].length * 60;
	this._phaseDelayBegin = this._phaseData[this._phase].delayBegin * 60;
	this._phaseDelayEnd = this._phaseData[this._phase].delayEnd * 60;
	this._enemyLimit = this._phaseData[this._phase].enemyLimit;
	this._spawnFreq1 = this._phaseData[this._phase].enemyFreq; // Array
	this._spawnTime1 = Galv.INVADER.rand(this._spawnFreq1[0] * 60,this._spawnFreq1[1] * 60);
	this._spawnFreq2 = this._phaseData[this._phase].pupFreq; // Array
	this._spawnTime2 = Galv.INVADER.rand(this._spawnFreq2[0] * 60,this._spawnFreq2[1] * 60);
	this._spawnIndex = [0,0];  // [enemy, pup]
	this._stopSpawning = [false,false];
	
	// Set the new phase update function
	return function() {
		// Do phase transition/image
		if (this._phaseTimer < this._phaseDelayBegin) {
			this._splashSprite.opacity += 10;
			
		} else if (this._phaseTimer >= this._phaseLength || this.endPhaseConditionsMet()){
			if (this._phaseTimer == this._phaseLength) {
				// fade bgm and bgs if setting is not null
				if (this._phaseData[this._phase].bgmFade) AudioManager.fadeOutBgm(this._phaseData[this._phase].bgmFade);
				if (this._phaseData[this._phase].bgsFade) AudioManager.fadeOutBgs(this._phaseData[this._phase].bgsFade);
				// set wait
				this._wait = this._phaseDelayEnd;
			};
			if (this.waiting()) {
				// Do nothing or prepare stuff
			} else {
				// Init Next Phase
				this.buildUpdatePhase();
			};
			
		} else {
			// Update Phase
			this._splashSprite.opacity -= 10;
			this._spawnTicker1 += 1;
			this._spawnTicker2 += 1;
			if (this._spawnTicker1 >= this._spawnTime1) {
				this.spawnEnemy();
				this._spawnTicker1 = 0;
				this._spawnTime1 = Galv.INVADER.rand(this._spawnFreq1[0] * 60,this._spawnFreq1[1] * 60);
			};
			if (this._spawnTicker2 >= this._spawnTime2) {
				this.spawnEnemy(1);
				this._spawnTicker2 = 0;
				this._spawnTime2 = Galv.INVADER.rand(this._spawnFreq2[0] * 60,this._spawnFreq2[1] * 60);
			};
		};
		
	};
	
	// Set end phase condition
	// Phase will always end on phase timer end. But it could end early for
};

Scene_Invaders.prototype.endPhaseConditionsMet = function() {
	return false;
};

Scene_Invaders.prototype.endGame = function() {
	$gameScreen.startFadeOut(60);
	this._phaseTimer = 0;
	this.updatePhase = this.updateTerminate; // update end sequence
};


Scene_Invaders.prototype.updateEnd = function() {	
	if (this.waiting()) {
		// Do phase transition/image
		this._splashSprite.opacity += 10;
	} else {		
		// Leave the scene
		this.endGame();
	};
};




Scene_Invaders.prototype.doWinLose = function(result) {
	this._wait = this._lvl.delayEnd * 60;
	Galv.INVADER.lockPlayer = true;
	Galv.INVADER.player.horzMomentum = 0;
	Galv.INVADER.player._row = 0;
	Galv.INVADER.invulPlayer = true;
	
	// Store Game Results
	this._lvl.records.result = result;
	this._lvl.records.time = Math.floor((this._lvlTimer + this._phaseTimer) / 60);
	this._lvl.records.totalKills += this._lvl.records.kills;
	
	
	// Set End Data
	switch (result) {
		case 'win':
			this._lvl.records.wins += 1;
			if (this._lvl.records.bestTime <= 0) {
				this._lvl.records.bestTime = this._lvl.records.time;
			} else {
				this._lvl.records.bestTime = Math.min(this._lvl.records.time,this._lvl.records.bestTime);
			};
			this._lvl.records.highScore = Math.max(this._lvl.records.score,this._lvl.records.highScore);
			// Play ME
			if (this._lvl.meVictory) {
				AudioManager.playMe(this._lvl.meVictory);
			};
			this.createSplashSprite(this._lvl.victoryImage);
			
			break;
		case 'lose':
			this._lvl.records.losses += 1;
			// Play ME
			if (this._lvl.meDefeat) {
				AudioManager.playMe(this._lvl.meDefeat);
			};
			this.createSplashSprite(this._lvl.defeatImage);

			break;
		default:
			//this.createSplashSprite('');
	};
	this.updatePhase = this.updateEnd;
};


Scene_Invaders.prototype.endPhase = function() {
	 this._phaseLength = this._phaseTimer;
};

Scene_Invaders.prototype.playPhaseBgms = function() {
	// Start Music/sound/bgs
	//AudioManager.playBgs({name: 'wind4',pan: 0,pitch: 120,volume: 60});
	if (this._phaseData[this._phase].bgm) {
		var bgm = this._phaseData[this._phase].bgm;
		if (!bgm.name) bgm.name = '';
		if (!bgm.pan) bgm.pan = 0;
		if (!bgm.pitch) bgm.pitch = 100;
		if (!bgm.volume) bgm.volume = 80;
		AudioManager.playBgm(bgm);
	};
	if (this._phaseData[this._phase].bgs) {
		var bgs = this._phaseData[this._phase].bgs;
		if (!bgs.name) bgs.name = '';
		if (!bgs.pan) bgs.pan = 0;
		if (!bgs.pitch) bgs.pitch = 100;
		if (!bgs.volume) bgs.volume = 80;
		AudioManager.playBgs(bgs);
	};
};


Scene_Invaders.prototype.updateTerminate = function() {
	if (this._splashSprite) this._splashSprite.opacity -= 20;
	if (this._phaseTimer == 60) {
		SceneManager.goto(Scene_Map);
		$gameScreen.startFadeIn(60);

		AudioManager.replayBgm(Galv.INVADER.savedBgm);
		AudioManager.replayBgs(Galv.INVADER.savedBgs);
	};
};

Scene_Invaders.prototype.spawnEnemy = function(type) {
	if (type === 1) {
		// Pup
		var spawnType = 'pSpawnType';
		var objs = 'pups';
		var sIndex = 1;
		if (this._stopSpawning[1]) return false;
	} else {
		// Enemy
		var spawnType = 'eSpawnType';
		var objs = 'enemies';
		var sIndex = 0;
		if (this._stopSpawning[0]) return false;
	};
	
	// If array empty - cancel
	if (this._phaseData[this._phase][objs].length <= 0) return false;
	
	// Get object ID depending on spawn type
	switch (this._phaseData[this._phase][spawnType]) {
		case 0: // In Order
			var objId = this._phaseData[this._phase][objs][this._spawnIndex[sIndex]];
			if (this._phaseData[this._phase][objs][this._spawnIndex[sIndex] + 1]) {
				this._spawnIndex[sIndex] += 1;
			} else {
				this._spawnIndex[sIndex] = 0;
			};
			break;
		case 1: // Random
			var objId = this._phaseData[this._phase][objs][Math.floor(Math.random() * this._phaseData[this._phase][objs].length)];
			break;
		case 2: // Spawn one of each in the list
			var objId = this._phaseData[this._phase][objs][this._spawnIndex[sIndex]];
			if (this._phaseData[this._phase][objs][this._spawnIndex[sIndex] + 1]) {
				this._spawnIndex[sIndex] += 1;
			} else {
				this._stopSpawning[sIndex] = true;
			};
			break;
		default:
			var objId = this._phaseData[this._phase][objs][0];
	};
	
	// Create Enemy
	var obj = $gameSystem.invader.object[objId];
	var p = new Sprite_InvaderObject(obj);
	this._enemies.push(p);
	this._spriteset._sprites.addChild(p);
	
	// Create 'attached' objects
	for (var s in obj.slots) {
		var isObj = Galv.INVADER.isObject(obj.slots[s].type);
		if (isObj && obj.slots[s].module !== null) {
			// Create attached sprite
			var objA = $gameSystem.invader.object[obj.slots[s].module];
			var pA = new Sprite_InvaderObject(objA);
			
			// Attach sprite to p object
			pA.attachTo(p,obj.slots[s].xy[0],obj.slots[s].xy[1]);
			pA.isAttached = true;
			this._enemies.push(pA);
			this._spriteset._sprites.addChild(pA);			
		};
	};
};


//----------------------------------------------------------------------------
// Update

Scene_Invaders.prototype.waiting = function() {
	if (this._wait > 0) {
		this._wait -= 1;
		return true;
	} else {
		return false;
	};
};

Scene_Invaders.prototype.update = function() {
	Scene_Base.prototype.update.call(this);
	if (ImageManager.isReady()) {
		//this.createSpriteset();
		this.createHUD();
		this.createSplashSprite(this._lvl.splashImage);
		this.createPlayer();
		$gameScreen.startFadeIn(60);
		this.update = this.gameUpdate;
	};
};

Scene_Invaders.prototype.gameUpdate = function() {
	if (this._pause) {
		this._windowLayer.update();
	} else {
		Scene_Base.prototype.update.call(this);
		this._phaseTimer += 1;
		$gameScreen.update();
		this.updatePhase();
		if (!Galv.INVADER.lockPlayer) this.updatePlayer();
		this.cleanSprites();
	};
};





Scene_Invaders.prototype.updatePlayer = function() {
	if (Input.isPressed('ok') || Galv.INVADER.player._autofire) this.playerShoot();
	if (Input.isTriggered('cancel')) {
		this._pause = true;
		this._pauseWindow.open();
		this._pauseWindow.activate();
	};
	this.updateChargeWeapons();
	if (Input.isTriggered(Galv.INVADER.bombBtn) && Galv.INVADER.bombs > 0) {
		this.doBomb();
	};
};

Scene_Invaders.prototype.updateChargeWeapons = function() {
	if (Input.isPressed(Galv.INVADER.chargeBtn) || Galv.INVADER.player._toggleCharge) {
		this.chargeWeapons();
	} else {
		this.dischargeWeapons();
	};
};


Scene_Invaders.prototype.chargeWeapons = function() {
	// Do charged weapon charging
	for (i = 0; i < Galv.INVADER.player.chargeGuns.length; i++) {
		this.chargeGun(Galv.INVADER.player,i);
	};
	Galv.INVADER.player.chargeReady = true;
};


Scene_Invaders.prototype.chargeGun = function(target,i) {
	var gun = target.chargeGuns[i];
	
	// If still on cooldown, don't do anything
	if (gun.cooldown > 0) {
		gun.cooldown -= 1;
		gun.chargeAmount = 0;
		return;
	};
	
	
	// Increase charge and animation delay values
	gun.chargeAmount += 1;
	gun.chargeAnimCount += 1;
	gun.rate = Math.min(this.chargePercent(gun),1.1);
	
	// Check/play anim and also set the gun's charge rate when doing so
	if (gun.chargeAnimCount >= gun.chargeAnimDelay) {	
		if (gun.rate < 0.5) {
			target._animId = gun.chargeAnims[0]; // play 0-50% charge anim
		} else if (gun.rate <= 1) {
			target._animId = gun.chargeAnims[1]; // play 50-100% charge anim
		} else {
			target._animId = gun.chargeAnims[2]; // play max charge anim
		};
		gun.chargeAnimCount = 0;
	};
};

Scene_Invaders.prototype.chargePercent = function(gun) {
	return gun.chargeAmount ? gun.chargeAmount / gun.chargeTime : 0;
};

Scene_Invaders.prototype.dischargeWeapons = function() {
	// If weapons charged...
	if (Galv.INVADER.player.chargeReady) {
		// chack and do all charge weapon shots.
		for (i = 0; i < Galv.INVADER.player.chargeGuns.length; i++) {
			var gun = Galv.INVADER.player.chargeGuns[i];
			var rate = gun.rate;
			
			if (gun.cooldown <= 0 && gun.rate > 0) {
				// DO CHARGE SHOT
				
				var sounds = [];
				
				// Get number of angles fired depending on charge amount.
				if (rate < 0.5) {
					var angleCount = gun.chargeAngles[0];
					var se = Array.isArray(gun.shootSE) ? gun.shootSE[0] : gun.shootSE;
				} else if (rate <= 1) {
					var angleCount = gun.chargeAngles[1];
					var se = Array.isArray(gun.shootSE) ? gun.shootSE[1] : gun.shootSE;
				} else { // overcharge
					var angleCount = gun.chargeAngles[2];
					var se = Array.isArray(gun.shootSE) ? gun.shootSE[2] : gun.shootSE;
				};
				angleCount = Math.min(gun.projectileAngles.length,angleCount);
				
				for (var s = 0; s < angleCount; s++) {
					var p = new Sprite_InvaderProjectile(i,s,Galv.INVADER.player,rate);
					this._pProjectiles.push(p);
					this._spriteset._sprites.addChild(p);
				};
				
				if (!sounds.contains(se.name)) {
					AudioManager.playSe(se);
					sounds.push(se.name);
				};
					
				// set cooldown
				Galv.INVADER.player.setCooldown(gun);
				gun.chargeAmount = 0;
				gun.rate = 0;
			};
			gun.chargeAmount = 0;
			gun.rate = 0;
		};
		Galv.INVADER.player.chargeReady = false;
	} else {
		// Do cooldowns for charge weapons
		for (var i = 0; i < Galv.INVADER.player.chargeGuns.length; i++) {
			if (Galv.INVADER.player.chargeGuns[i].cooldown > 0) Galv.INVADER.player.chargeGuns[i].cooldown -= 1;	
		};
	};
};


Scene_Invaders.prototype.doBomb = function(killAll) {
	Galv.INVADER.player._animId = Galv.INVADER.bombAnim;
	for (var i = 0; i < this._enemies.length; i++) {
		if (this._enemies[i].hp > 0 && this._enemies[i]._obj.hittable) {
			if (killAll) {
				// Destroy all
				this._enemies[i]._animId = this._enemies[i]._obj.dieAnim;
				this._enemies[i].update = this._enemies[i].updateDie;
			} else {
				// Damage all
				var bomb = {
					ignoreS: true,
					ignoreA: true,
					damageHp: Galv.INVADER.bombDamage,
					damageSp: 0,
					contactAnim: 0
				};
				this._enemies[i].doHit(bomb);
			};
		};
	};
	Galv.INVADER.changeBombs(-1);
	this.refreshHudBombs();
};


Scene_Invaders.prototype.playerShoot = function() {
	var sounds = [];
	for (var i = 0; i < Galv.INVADER.player.guns.length; i++) {
		if (Galv.INVADER.player.gunReady(Galv.INVADER.player.guns[i])) {
			Galv.INVADER.player.setCooldown(Galv.INVADER.player.guns[i]);

			for (var s = 0;s < Galv.INVADER.player.guns[i].projectileAngles.length;s++) {
				var p = new Sprite_InvaderProjectile(i,s,Galv.INVADER.player);
				this._pProjectiles.push(p);
				this._spriteset._sprites.addChild(p);
			};
			
			if (!sounds.contains(Galv.INVADER.player.guns[i].shootSE.name)) {
				AudioManager.playSe(Galv.INVADER.player.guns[i].shootSE);
				sounds.push(Galv.INVADER.player.guns[i].shootSE.name);
			};
		};
	};
};


//----------------------------------------------------------------------------
// Remove stuff

Scene_Invaders.prototype.cleanSprites = function() {
	// Work out a nicer way to use stored objects to only clean those required?
	
	// Enemy Objects
	if (Galv.INVADER.requireObjClean)  {
		for (var i = 0; i < this._enemies.length; i++) {
			if (!this._enemies[i] || !this._enemies[i].active) {
				if (!this._enemies[i].isAttached) { // dont destroy attached objects at this check
					for (var k = 0; k < this._enemies[i]._attachedKids.length; k++) {
						this._spriteset._sprites.removeChild(this._enemies[i]._attachedKids[k]);
					};
					this._spriteset._sprites.removeChild(this._enemies[i]);
					//this._enemies[i]._destroyCachedSprite();
					this._enemies[i] = null;     
					this._enemies.splice(i, 1);
					i--;
				};
			};
		};
		Galv.INVADER.requireObjClean = false;
	};
	
	// Player Projectiles
	if (Galv.INVADER.requireProjClean) {
		for (var i = 0; i < this._pProjectiles.length; i++) {
			if (!this._pProjectiles[i] || !this._pProjectiles[i].active) {
				this._spriteset._sprites.removeChild(this._pProjectiles[i]);  
				//this._pProjectiles[i]._destroyCachedSprite(); 
				this._pProjectiles[i] = null;    
				this._pProjectiles.splice(i, 1);
				i--;
			};
		};
		for (var i = 0; i < this._eProjectiles.length; i++) {
			if (!this._eProjectiles[i] || !this._eProjectiles[i].active) {  
				this._spriteset._sprites.removeChild(this._eProjectiles[i]);  
				//this._eProjectiles[i]._destroyCachedSprite(); 
				this._eProjectiles[i] = null;    
				this._eProjectiles.splice(i, 1);
				i--;
			};
		};
		Galv.INVADER.requireProjClean = false;
	};

	Scene_Invaders.prototype.terminate = function() {
		Scene_Base.prototype.terminate.call(this);
		Galv.INVADER.inWait = null;
		// Clear all data
		for (var i = 0; i < this._pProjectiles.length; i++) {
			this._pProjectiles[i].active = false;
		};
		for (var i = 0; i < this._eProjectiles.length; i++) {
			this._eProjectiles[i].active = false;
		};
		for (var i = 0; i < this._enemies.length; i++) {
			this._enemies[i].active = false;
		};

		this.cleanSprites();
		this._pProjectiles = null;
		this._eProjectiles = null;
		this._enemies = null;
		// Destroy from memory and cache
	};
		
};




//-----------------------------------------------------------------------------


//                               SPRITESET


//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// SPRITESET_INVADERS
//-----------------------------------------------------------------------------

function Spriteset_Invaders() {
    this.initialize.apply(this, arguments);
}

Spriteset_Invaders.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Invaders.prototype.constructor = Spriteset_Invaders;
Spriteset_Invaders.prototype.initialize = function() {Spriteset_Base.prototype.initialize.call(this)};

//-----------------------------------------------------------------------------
// CREATION

Spriteset_Invaders.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
	// Vars
	
	// Sprites container
	this._sprites = new Tilemap();
	this._baseSprite.addChild(this._sprites);
	
	// layers object
	this._layerSprites = this._layerSprites || {};  // phaseId: {layer,layer}

};

Spriteset_Invaders.prototype.createMapBack = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
	this._backgroundSprite.z = 9999;
    this._sprites.addChild(this._backgroundSprite);
};


Spriteset_Invaders.prototype.setup = function() {
	this._phaseData = Galv.INVADER.scene._phaseData;
	this._phase = 0;
	this.createLayers(0);
};

Spriteset_Invaders.prototype.createLayers = function(setPhase) {
	this._phase = setPhase;
	
	
	// Create layers for current phase:
	this._layerSprites[this._phase] = [];
	var oldPhase = this._phase - 2;

	for (var i in this._phaseData[this._phase].layers) {
		this._layerSprites[this._phase][i] = new Sprite_InvaderLayer(i,this._phaseData[this._phase].layers[i]);
		this._layerSprites[this._phase][i].opacity = this._phase > 0 ? 0 : this._phaseData[this._phase].layers[i].opacity;
		this._sprites.addChild(this._layerSprites[this._phase][i]);
		
		// Destroy layer from 2 phases ago of equal layer ID
		if (this._layerSprites[oldPhase] && this._layerSprites[oldPhase][i]) {
			this._sprites.removeChild(this._layerSprites[oldPhase][i]); 
			// Destroy from memory and cache
		};
	};
};

//-----------------------------------------------------------------------------


//                               SPRITES


//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
// SPRITE: LAYER
//-----------------------------------------------------------------------------


function Sprite_InvaderLayer() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderLayer.prototype = Object.create(TilingSprite.prototype);
Sprite_InvaderLayer.prototype.constructor = Sprite_InvaderLayer;

Sprite_InvaderLayer.prototype.initialize = function(index,obj) {
    TilingSprite.prototype.initialize.call(this);
	this.id = index;
	this.opacSpeed = obj.fadeSpeed || 5;
	this.layer = obj;
	this.slide = 0;
	this.currentGraphic = "";
    this.createBitmap();
	this.move(0, 0, Graphics.boxWidth, Graphics.boxHeight)
    this.update();
};

Sprite_InvaderLayer.prototype.createBitmap = function() {
	this.bitmap = ImageManager.loadInvaderGraphic(this.layer.graphic);
	this.z = this.layer.z;
};

// Update
Sprite_InvaderLayer.prototype.update = function() {
	TilingSprite.prototype.update.call(this);
	this.updatePosition();
};

// Update Position
Sprite_InvaderLayer.prototype.updatePosition = function() {
	this.z = this.layer.z;
	this.opacity = Math.min(this.opacity + this.opacSpeed,this.layer.opacity);
	this.slide += this.layer.xs;
	this.origin.x = -this.xOffset() - this.layer.xs - this.slide;
	this.origin.y -= this.layer.ys
};

Sprite_InvaderLayer.prototype.xOffset = function() {
	return ((Graphics.boxWidth / 2) - Galv.INVADER.player.x) * this.layer.ox;
};



//-----------------------------------------------------------------------------
// SPRITE: Object
//-----------------------------------------------------------------------------

function Sprite_InvaderObject() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderObject.prototype = Object.create(Sprite_Base.prototype);
Sprite_InvaderObject.prototype.constructor = Sprite_InvaderObject;

Sprite_InvaderObject.prototype.initialize = function(obj) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setObject(obj);
	this.setBitmap();
	this.initLocation();
	this.addToSpawnList();
};

Sprite_InvaderObject.prototype.initMembers = function() {
	this._pattern = 0;
	this._maxPattern = 0;
	this.tickSpeed = 0;
	this._row = 0;
	this._animId = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._obj = null;
	this.vertMomentum = 0;
	this.horzMomentum = 0;
	this.vertSpeed = 0;
	this.accel = 0;
	this.maxHorzSpeed = 0;
	this._ticker = 0;
	this.active = true;
	this.beingHit = false;
	this.updateMoveAi = function() {};
	this.pauseAi = 0;
	this._attachedKids = [];
};

Sprite_InvaderObject.prototype.setObject = function(obj) {
    this._obj = obj;
	this.hp = 0 + this._obj.hp;
	this.maxHp = this._obj.hp;
	this.sp = 0 + this._obj.sp;
	this.maxSp = this.sp;
	
	this.armor = this._obj.armor;
	
	this.z = this._obj.z;
	
	
	// Slots and Modules
	this.guns = [];
	this.chargeGuns = [];
	this.chargeReady = false;
	this.modules = [];
	this.slots = this._obj.slots;
	
	this.vertSpeedBonus = 0;
	this.maxHorzSpeedBonus = 0;
	
	for (var s in this.slots) {
		if (this.slots[s].module !== null) {
			
			var isObj = Galv.INVADER.isObject(this.slots[s].type);
			if (!isObj) {
				// If not an object, draw as module
				var module = Object.create(this.module(this.slots[s].module));
			
				module.xy = module.xy || this.slots[s].xy;
				module.slot = Number(s);

				if (Number.isInteger(module.id)) {
					// Add to gun array if it's a gun
					if (this.slots[s].type.toLowerCase().contains('weapon')) {
						module.cooldown = 0;
						if (module.chargeTime) {
							module.chargeAmount = 0;
							module.chargeAnimCount = 0;
							this.chargeGuns.push(module); // add as charge gun
						} else {
							this.guns.push(module); // add as normal gun
						};
					};
					this.modules.push(module);
					// Bonuses from module
					this.hp = this.hp + module.hp;
					this.maxHp = this.maxHp + module.hp;
					this.sp = this.sp + module.sp;
					this.maxSp = this.maxSp + module.sp;
					
					this.armor = this.armor + module.armor;
					this.vertSpeedBonus += module.speed;
					this.maxHorzSpeedBonus += module.speed;
					
				};
			//} else {
				// Code related to having attached object
			};
		};
	};
	
	// Movement
	this.setSpeeds();
	
	// Movement Limits:
	this.xLimit = [Math.round(Graphics.boxWidth * (this._obj.xLimit[0] * 0.01)), Math.round(Graphics.boxWidth * (this._obj.xLimit[1] * 0.01))];
	this.yLimit = Graphics.boxHeight * (this._obj.yLimit * 0.01);
	this.yLimitSpeedY = this._obj.yLimitSpeedY[0];
	this.yLimitMaxSpeedY = this._obj.yLimitSpeedY[1];
	this.yLimitSpeedX = this._obj.yLimitSpeedX[0];
	this.yLimitMaxSpeedX = this._obj.yLimitSpeedX[1];
	
	// Graphic animation
	this._maxPattern = this._obj.frames - 1;
	this.tickSpeed = this._obj.frameSpeed;
	this._rows = this._obj.rows;
	
	// Movement AI:
	this.setMoveAi();

	// Hitbox and collision
	this.hitbox = {x: this._obj.hitbox.w / 2,y: this._obj.hitbox.h / 2};
	this.colliding = !this._obj.canCollide;
};

Sprite_InvaderObject.prototype.setSpeeds = function() {
	this.accel = Math.round(((this._obj.horzSpeed + this.maxHorzSpeedBonus) / 100) * 10) / 10;
	this.vertSpeed = this._obj.vertSpeed + this.vertSpeedBonus;
	this.maxHorzSpeed = (this._obj.horzSpeed + this.maxHorzSpeedBonus) * 0.5;
	this.horzSpeed = this._obj.horzSpeed;
};


Sprite_InvaderObject.prototype.removeTempModule = function(mId) {
	
	if (this.tempPups.contains(mId)) {
		var module = Object.create(this.module(mId));
		
		// remove from tempPups array
		var index = this.tempPups.indexOf(mId);
		if (index > -1) {
    		this.tempPups.splice(index, 1);
		};
	
		// If module is a weapon, remove from guns
		if (module.type.toLowerCase().contains('weapon')) {
			if (module.chargeTime) {
				// remove from chargeGuns
				var gunIndex = -1;
				for (var i = 0; i < this.chargeGuns.length; i++) {
					if (this.chargeGuns[i].id == mId) gunIndex = i;
				};
				if (gunIndex > -1) {
					this.chargeGuns.splice(gunIndex, 1);
				};
			} else {
				// remove from guns
				var gunIndex = -1;
				for (var i = 0; i < this.guns.length; i++) {
					if (this.guns[i].id == mId) gunIndex = i;
				};
				if (gunIndex > -1) {
					this.guns.splice(gunIndex, 1);
				};
			};
		};
		
		var mIndex = -1;
		for (var i = 0; i < this.modules.length; i++) {
			if (this.modules[i].id == mId) mIndex = i;
		};
		// Remove module to modules list
		if (mIndex > -1) {
			this.modules.splice(index, 1);
		};
		
		// Bonuses from module
		this.hp = this.hp - module.hp;
		this.maxHp = this.maxHp - module.hp;
		this.sp = this.sp - module.sp;
		this.maxSp = this.maxSp - module.sp;
		this.armor = this.armor - module.armor;
		this.vertSpeedBonus -= module.speed;
		this.maxHorzSpeedBonus -= module.speed;
		// Reset speed
		this.setSpeeds();
	};
};


Sprite_InvaderObject.prototype.gainTempModule = function(mId) {
	if (this.module(mId).upgradeModule != null) {
		// If module has an upgrade, check if it already exists in temp powerups
		var check = false;
		while (!check) {
			// If module pup already obtained
			if (this.tempPups.contains(mId)) {
				// if upgrade exists, set new module to check
				if (this.module(mId).upgradeModule) {
					mId = this.module(mId).upgradeModule;
				} else {
				// if no upgrade exists - no powerup to get!
					module = null;
					check = true;
				};
			} else {
			// If module pup not obtained
				var module = Object.create(this.module(mId));
				check = true;
			};
		};
	} else {
		// Normal powerup pickup
		var module = Object.create(this.module(mId));
	};
	
	if (!module) return false;
	
	// Add module to temp powerup list
	this.tempPups.push(mId);
	
	// If module is a weapon, add to guns
	if (module.type.toLowerCase().contains('weapon')) {
		module.cooldown = 0;
		module.xy = module.xy || [0,0];
		if (module.chargeTime) {
			this.chargeGuns.push(module); // add as charge gun
		} else {
			this.guns.push(module); // add as normal gun
		};
	};
	
	// Add module to modules list
	this.modules.push(module);
	// Bonuses from module
	this.hp = this.hp + module.hp;
	this.maxHp = this.maxHp + module.hp;
	this.sp = this.sp + module.sp;
	this.maxSp = this.maxSp + module.sp;
	this.armor = this.armor + module.armor;
	this.vertSpeedBonus += module.speed;
	this.maxHorzSpeedBonus += module.speed;
	// Reset speed
	this.setSpeeds();
	// Reset Cooldowns
	for (var i = 0; i < this.guns.length; i++) {
		this.guns[i].cooldown = 0;
	};
};


Sprite_InvaderObject.prototype.setMoveAi = function() {
	//	erratic,diagleft,diagright,custom
	switch (this._obj.movementAi.toLowerCase()) {
		case 'erratic':
			this.updateMoveAi = this.moveAiErratic;
			break;
		case 'follow':
			this.updateMoveAi = this.moveAiFollow;
			break;
		case 'static':
			this.updateMoveAi = this.moveAiStatic;
			break;
		case 'custom':
			this.updateMovaAi = this.moveAiCustom;
			break;
			
	};
};

Sprite_InvaderObject.prototype.initLocation = function() {
	this.x = Galv.INVADER.rand(Graphics.boxWidth * (this._obj.xStart[0] * 0.01),Graphics.boxWidth * (this._obj.xStart[1] * 0.01));
	this.y = -(this.patternHeight() * 0.5);
	this.offScreenY = {top: -(this.patternHeight() * 2), bot: Graphics.boxHeight + this.patternHeight() * 2};
	this.offScreenX = {left: -(this.patternWidth() * 2), right: Graphics.boxWidth + this.patternWidth() * 2};
};

Sprite_InvaderObject.prototype.module = function(id) {
	return $gameSystem.invader.module[id];
};

Sprite_InvaderObject.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateFrame();
	this.updateMovement();
    this.updatePosition();
    this.updateAnimation();
	this.updateFireRate();
	this.checkCollide();
};

Sprite_InvaderObject.prototype.updateFireRate = function() {
	for (var i = 0; i < this.guns.length; i++) {
		if (this.guns[i].cooldown > 0) {
			this.guns[i].cooldown -= 1;
		} else {
			this.shoot();
		};
	};
};

Sprite_InvaderObject.prototype.gunReady = function(gun) {
	return gun.cooldown <= 0;
};

Sprite_InvaderObject.prototype.setCooldown = function(gun) {
	gun.cooldown = Galv.INVADER.rand(gun.fireRate[0],gun.fireRate[1]) * 6;
};

Sprite_InvaderObject.prototype.shoot = function() {
	var sounds = [];
	for (var i = 0; i < this.guns.length; i++) {
		if (this.gunReady(this.guns[i])) {
			this.setCooldown(this.guns[i]);

			if (this.y < 0) return;
			for (var s = 0;s < this.guns[i].projectileAngles.length;s++) {
				var p = new Sprite_InvaderProjectileEnemy(i,s,this);
				Galv.INVADER.scene._eProjectiles.push(p);
				Galv.INVADER.scene._spriteset._sprites.addChild(p);
			};
			
			if (!sounds.contains(this.guns[i].shootSE.name)) {
				AudioManager.playSe(this.guns[i].shootSE);
				sounds.push(this.guns[i].shootSE.name);
			};
		};
	};
};


Sprite_InvaderObject.prototype.setBitmap = function() {
	this.bitmap = ImageManager.loadInvaderGraphic(this._obj.graphic);
	this.updateFrame();
	this._id = this._obj.id;

	var tempSprite = new Sprite();
	var xo = 0;
	var yo = 0;

	if (this._obj.visibleModules) {
		for (var i = 0; i < this.modules.length; i++) {
			
			var isObj = Galv.INVADER.isObject(this.modules[i].type);
			
			if (this.modules[i].graphic && !isObj) {
				tempSprite.bitmap =  ImageManager.loadInvaderGraphic(this.modules[i].graphic);
				xo = this.modules[i].xy[0];
				yo = this.modules[i].xy[1];
				this.bitmap.blt(tempSprite.bitmap, 0, 0, this.bitmap.width, this.bitmap.height, xo, yo);
			};
		};
	};
};


//------------------------------------------------------------------------------------------
// MOVEMENT AI

Sprite_InvaderObject.prototype.moveAiFollow = function() {
	if (this.x < Galv.INVADER.player.x) {
		if (this.x < Galv.INVADER.player.x - Galv.INVADER.player.hitbox.x) {
			this.press = 6;
		} else if (this.horzMomentum > 10) {
			this.press = 4;
		} else {
			this.press = 0;
		};
	} else if (this.x > Galv.INVADER.player.x) {
		if (this.x > Galv.INVADER.player.x + Galv.INVADER.player.hitbox.x) {
			this.press = 4;
		} else if (this.horzMomentum < -10) {
			this.press = 6;
		} else {
			this.press = 0;
		};
	} else {
		this.press = 0;
	};
	
	this.moveAiMomentum();
};


Sprite_InvaderObject.prototype.attachTo = function(motherObject,slotX,slotY) {
	this._mother = motherObject;
	this._motherSlotX = slotX;
	this._motherSlotY = slotY;
	this.updateMoveAi = this.moveAiAttached;
	this.xLimit = this._mother.xLimit;
	this.yLimit = this._mother.yLimit;
	this._mother._attachedKids.push(this);
};

Sprite_InvaderObject.prototype.moveAiAttached = function() {
	this.x = this._mother.x + this._motherSlotX;
	this.y = this._mother.y + this._motherSlotY;
};

Sprite_InvaderObject.prototype.moveAiStatic = function() {
	if (this.horzSpeed > 0) {
		this.press = 6;
	} else if (this.horzSpeed < 0) {
		this.press = 4;
	};
	this.moveAiMomentum();
};

Sprite_InvaderObject.prototype.moveAiErratic = function() {
	if (this.pauseAi > 0) {
		this.pauseAi -= 1;
	} else {
		// Randomize movement
		var r = Math.random() * 100 + 1;
		if (r < 30 || this.opacity <= 0) {
			// Chill out at current x location for a random time
			this.press = 0;
			this.pauseAi = Math.random() * 100 + 50;
		} else {
			
			var minX = this.xLimit[0];
			var maxX = this.xLimit[1];
			var midX = ((this.xLimit[1] - this.xLimit[0]) / 2) + this.xLimit[0];
			
			if (this.x < midX) {
				this.press = 6;
			} else if (this.x > midX) {
				this.press = 4;	
			} else {
				this.press = 0;	
			};
			
			// Randomize pause time
			this.pauseAi = Math.random() * 20 + 5;
		};	
	};
	this.moveAiMomentum();
};


Sprite_InvaderObject.prototype.moveAiMomentum = function() {
	if (this.press === 4) {
		this.horzMomentum = this.horzMomentum <= -this.maxHorzSpeed ? this.horzMomentum : this.horzMomentum - this.accel;
		this._row = Math.min(1,this._rows - 1);
	 } else if (this.press === 6) {
		this.horzMomentum = this.horzMomentum >= this.maxHorzSpeed ? this.horzMomentum : this.horzMomentum + this.accel;
		this._row = Math.min(2,this._rows - 1);
	 } else {
		this._row = 0;
		if (this.horzMomentum > 0) {
			this.horzMomentum = Galv.INVADER.rnd(this.horzMomentum) - 0.1;
		} else if (this.horzMomentum < -0) {
			this.horzMomentum = Galv.INVADER.rnd(this.horzMomentum) + 0.1;
		};
	};
};

//------------------------------------------------------------------------------------------
// Update

Sprite_InvaderObject.prototype.updateFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = this._pattern * pw;
    var sy = this._row * ph;
	this.setFrame(sx, sy, pw, ph);
	
	this._ticker += 1;
	if (this._ticker >= this.tickSpeed) {
		this._pattern = this._pattern == this._maxPattern ? 0 : this._pattern + 1;
		this._ticker = 0;
	};
};
Sprite_InvaderObject.prototype.patternWidth = function() {return this.bitmap.width / this._obj.frames};
Sprite_InvaderObject.prototype.patternHeight = function() {return this.bitmap.height / this._rows};



Sprite_InvaderObject.prototype.updateMotion = function() {
	this.updateMoveAi();
	this.x = this.x + this.horzMomentum;
};

Sprite_InvaderObject.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
       this._animationPlaying = false;
    }
};

Sprite_InvaderObject.prototype.setupAnimation = function() {
    if (this._animId > 0) {
        var animation = $dataAnimations[this._animId];
        this.startAnimation(animation, false, 0);
        
		this._animId = 0;
		this._animationPlaying = true;
    }
};

Sprite_InvaderObject.prototype.updatePosition = function() {
	if (this.x + this.horzMomentum < this.xLimit[0]) {
		this.x = this.xLimit[0];
		this.horzMomentum = 0;
		this.press = 0;
	} else if (this.x + this.horzMomentum > this.xLimit[1]) {
		this.x = this.xLimit[1];
		this.horzMomentum = 0;
		this.press = 0;
	} else {
    	this.updateMotion();
	};
};

Sprite_InvaderObject.prototype.updateMovement = function() {
	// Vertical Movement
	this.updateVertMovement();
	
	if (this.horzMomentum < 0) {
		this._row = Math.min(1,this._rows - 1);
	} else if (this.horzMomentum > 0) {
		this._row = Math.min(2,this._rows - 1);
	} else {
		this._row = 0;
	};

	// CLEANUP
	if (this.y < this.offScreenY.top || this.y > this.offScreenY.bot || this.x < this.offScreenX.left || this.x > this.offScreenX.right) {
		this.active = false;
		Galv.INVADER.requireObjClean = true;
	};
};

Sprite_InvaderObject.prototype.updateVertMovement = function() {
	if (this.y < this.yLimit) {
		this.y += this.vertSpeed;
	} else {
		this.updateVertMovement = this.updatePostVertMovement;
	};
};

Sprite_InvaderObject.prototype.updatePostVertMovement = function() {
	if (this.yLimitSpeedY < 0) {
		this.vertSpeed = Math.max(this.vertSpeed + this.yLimitSpeedY,this.yLimitMaxSpeedY);
		this.y += this.vertSpeed;
	} else if (this.yLimitSpeedY > 0) {
		this.vertSpeed = Math.min(this.vertSpeed + this.yLimitSpeedY,this.yLimitMaxSpeedY);
		this.y += this.vertSpeed;
	};
	
	
	if (this.yLimitSpeedX < 0) {
		this.horzMomentum = Math.max(this.horzMomentum + this.yLimitSpeedX,this.yLimitMaxSpeedX);
	} else if (this.yLimitSpeedX > 0) {
		this.horzMomentum = Math.min(this.horzMomentum + this.yLimitSpeedX,this.yLimitMaxSpeedX);
	};
}

//----------------------------------------------------------------
// Update contact

Sprite_InvaderObject.prototype.checkHit = function(x,y,gun) {
	if (this._obj.hittable && this.opacity > 0) {
		if (y > this.y - this.hitbox.y && y < this.y + this.hitbox.y && x > this.x - this.hitbox.x && x < this.x + this.hitbox.x) { //&& !this.colliding) {
			this.doHit(gun);
			return true;
		} else {
			return false;	
		};
	} else {
		return false;	
	};
};

Sprite_InvaderObject.prototype.checkHitWide = function(x,y,gun,rate) {
	var gunH = gun.projectileHitBox.h;
	var gunW = gun.projectileHitBox.w;
	if (rate) {
		gunH = gunH * rate;
		gunW = gunW * rate;
	};
	
	if (this._obj.hittable && this.opacity > 0) {
		if (y + gunH > this.y - this.hitbox.y && y - gunH < this.y + this.hitbox.y && x + gunW > this.x - this.hitbox.x && x - gunW < this.x + this.hitbox.x) {
			this.doHit(gun,rate);
			return true;
		} else {
			return false;	
		};
	} else {
		return false;	
	};
};


Sprite_InvaderObject.prototype.doHit = function(gun,rate) {
	var shield = this.sp;
	this.doDamage(gun,rate); // Take Damage

	// If HIT
	if (shield > 0 && !gun.ignoreS && this._obj.shieldAnim > 0) {
		this._animId = this._obj.shieldAnim;
	} else if (this.hp > 0) { 
		this._animId = gun.contactAnim > 0 ? gun.contactAnim : this._obj.hitAnim;
	} else {
		this.destroyed();
	};
};


Sprite_InvaderObject.prototype.doDamage = function(source,rate) {
	var rate = rate != null ? rate : 1;
	
	var chargeRate = source.chargeRate || null;
	
	if (this.sp > 0 && !source.ignoreS) {
		var dmg = this.getDmgRate(source.damageSp,rate,chargeRate);
		this.sp = Math.max(this.sp - dmg,0);
	} else {
		var dmg = this.getDmgRate(source.damageHp,rate,chargeRate);
		if (source.ignoreA) {
			var damage = Math.max(dmg,0);
		} else {
			var damage = Math.max(dmg - this.armor,0);
		};
		this.hp = Math.max(this.hp - damage,0);
	};
	/*
	// Special function for gun
	if (gun.special) {
		
	};
	*/
};

Sprite_InvaderObject.prototype.getDmgRate = function(damage,rate,chargeRate) {
	if (chargeRate) {
		// chargerate: [min,max,overmax];
		var percent = ((chargeRate[1] - chargeRate[0]) * rate + chargeRate[0]) * 0.01;
		if (percent > 1) { // Overcharge Damage
			damage = damage * (chargeRate[2] * 0.01);
		} else { // percent of damage
			damage = damage * percent;
		};
	};
	
	return Galv.INVADER.rnd(damage * rate);
};

Sprite_InvaderObject.prototype.restore = function(hp,sp) {
	this.hp = Math.min(this.hp + hp,this.maxHp);
	this.sp = Math.min(this.sp + sp,this.maxSp);
	if (hp > 0) Galv.INVADER.scene._hudH2.getHit(0);
	if (sp > 0) Galv.INVADER.scene._hudS2.getHit(1);
};

Sprite_InvaderObject.prototype.checkCollide = function() {
	if (this.isColliding()) {
		if (Galv.INVADER.player.x + Galv.INVADER.player.hitbox.x > this.x - this.hitbox.x && Galv.INVADER.player.x - Galv.INVADER.player.hitbox.x < this.x + this.hitbox.x && Galv.INVADER.player.opacity > 0) {
			this.colliding = true;
			this.collideWithPlayer();
		};
	};
};


if (Galv.INVADER.vertMovement) {
	Sprite_InvaderObject.prototype.isColliding = function() {
		return !this.colliding && this.opacity > 0 && this.y > Galv.INVADER.player.y - Galv.INVADER.player.hitbox.y && this.y < Galv.INVADER.player.y + Galv.INVADER.player.hitbox.y;
	};
} else {
		Sprite_InvaderObject.prototype.isColliding = function() {
		return this.y > Galv.INVADER.player.topY && this.y < Galv.INVADER.player.botY && !this.colliding && this.opacity > 0;
	};
};


Sprite_InvaderObject.prototype.collideWithPlayer = function() {
	// Do collide damage to player
	var c = {
		damageSp: this._obj.collideDamageSp,
		damageHp: this._obj.collideDamageHp,
		ignoreS: this._obj.collideIgnoreS,
		die: this._obj.collideDie
	};

	Galv.INVADER.player.doDamage(c);
	Galv.INVADER.player._animId = this._obj.collideAnim;

	// Powerup
	Galv.INVADER.player.restore(this._obj.collideHpMod,this._obj.collideSpMod);
	
	// Item
	for (var i = 0; i < this._obj.collideItem.length; i++) {
		this.gainItem(this._obj.collideItem[i]);
	};
	

	// Do collide damage to self (from player)
	var pc = {
		damageSp: Galv.INVADER.player._obj.collideDamageSp,
		damageHp: Galv.INVADER.player._obj.collideDamageHp,
		ignoreS: Galv.INVADER.player._obj.collideIgnoreS
	};
	this.doDamage(pc);
	
	// CHECK STATUS
	if (this.hp <= 0 || c.die) {
		this.destroyed();
	};
	
	// CHECK PLAYER
	if (Galv.INVADER.player.hp <= 0) {
		Galv.INVADER.player.destroyed();	
	}
};

Sprite_InvaderObject.prototype.gainItem = function(itemArray) {
	if (!itemArray) return;
	var itemType = itemArray[0].toLowerCase();
	var itemId = itemArray[1];
	var amount = 1;
	var item = null;
	
	switch (itemType) {
		case 'item':
      		item = $dataItems[itemId];
			break;
		case 'weapon':
			item = $dataWeapons[itemId];
			break;
		case 'armor':
			item = $dataArmors[itemId];
			break;
		case 'module':
			var module = itemId;
			break;
		case 'object':
			var object = itemId;
			break;
		case 'pupmodule':
			var pup = Math.abs(itemId);
			if (itemId < 0) var amount = -1;
			if (itemArray[2]) module = itemId;  // if true in array, keep module to equip later.
			break;
		case 'bomb':
			Galv.INVADER.changeBombs(itemId);
			if (SceneManager._scene.constructor.name == 'Scene_Invaders') SceneManager._scene.refreshHudBombs();
			break;
    }
	if (item) $gameParty.gainItem(item,amount);
	if (module) Galv.INVADER.gainInvModule(module,amount);
	if (object) Galv.INVADER.gainInvObject(object,amount);
	if (pup) {
		if (amount > 0) {
			Galv.INVADER.player.gainTempModule(pup);
		} else {
			Galv.INVADER.player.removeTempModule(pup);
		};
	};
};


Sprite_InvaderObject.prototype.destroyed = function() {
	this._animId = this._obj.dieAnim;
	this.doDieTrigger();
	
	Galv.INVADER.scene._lvl.records.score += this._obj.scoreMod;
	if (this._obj.countKill) Galv.INVADER.scene._lvl.records.kills += 1;
	Galv.INVADER.scene._scoreWindow.refresh(Galv.INVADER.scene._lvl.records.score);
	// destroy all kids
	for (var i = 0; i < this._attachedKids.length; i++) {
		if (this._attachedKids[i].hp > 0 ) this._attachedKids[i].destroyed();
	};
	this.update = this.updateDie;
};

// Die Triggers
Sprite_InvaderObject.prototype.doDieTrigger = function() {
	eval(this._obj.dieTrigger);
};

// Trigger - end phase
Sprite_InvaderObject.prototype.endPhase = function() {
	Galv.INVADER.scene.endPhase()
};

Sprite_InvaderObject.prototype.addToSpawnList = function() {
	Galv.INVADER.spawnObject(this);
};

Sprite_InvaderObject.prototype.updateDie = function() {
    Sprite_Base.prototype.update.call(this);
	this.opacity = 0;
	this.updateMovement();
    this.updatePosition();
    this.updateAnimation();
};



//-----------------------------------------------------------------------------
// SPRITE: Player
//-----------------------------------------------------------------------------

function Sprite_InvaderPlayer() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderPlayer.prototype = Object.create(Sprite_InvaderObject.prototype);
Sprite_InvaderPlayer.prototype.constructor = Sprite_InvaderPlayer;

Sprite_InvaderPlayer.prototype.initialize = function(obj) {
	this.vBlock = Graphics.boxHeight - Galv.INVADER.vBlock;
	this.tempPups = [];
	this.toggleTimer = 0;
    Sprite_InvaderObject.prototype.initialize.call(this,obj);
};

Sprite_InvaderPlayer.prototype.initLocation = function() {
	this.x = Graphics.boxWidth * 0.5;
	this.y = Graphics.boxHeight * 0.9;
	this.topY = this.y - this.hitbox.y;
	this.botY = this.y + this.hitbox.y;
};

Sprite_InvaderPlayer.prototype.update = function() {
    Sprite_InvaderObject.prototype.update.call(this);
};

Sprite_InvaderPlayer.prototype.updateMovement = function() {
	if (Galv.INVADER.lockPlayer) return;
	 
	 // TOUCH CONTROLS
	 if (TouchInput.isPressed()) { 
		if (TouchInput.x < Galv.INVADER.touchEdge) {
			var left = true;
			this._autofire = true;
		} else if (TouchInput.x > Graphics.boxWidth - Galv.INVADER.touchEdge) {
			var right = true;
			this._autofire = true;
		} else if (TouchInput.y < 80) {
			// BOMB!
			if (Galv.INVADER.bombs > 0 && !this.bombTriggered) {
				SceneManager._scene.doBomb();
				this.bombTriggered = true;
			};
		} else {
			// charge weapon
			if (this.toggleTimer <= 0) {
				this._toggleCharge = !this._toggleCharge;
				this.toggleTimer = 30;
			};
			this._autofire = true;
		};
		this.toggleTimer -= 1;
	} else {
		this.bombTriggered = false;
		var left = Input.isPressed('left') && !Input.isPressed('right');
		var right = Input.isPressed('right') && !Input.isPressed('left');
		if (left || right) {
			this._autofire = false;
			this._toggleCharge = false;
		};
	};
	
	 // LEFT AND RIGHT MOVEMENT
	 if (left) {
		this.horzMomentum = this.horzMomentum <= -this.maxHorzSpeed ? this.horzMomentum : this.horzMomentum - this.accel;
		this._row = Math.min(1,this._rows - 1);
	 } else if (right) {
		this.horzMomentum = this.horzMomentum >= this.maxHorzSpeed ? this.horzMomentum : this.horzMomentum + this.accel;
		this._row = Math.min(2,this._rows - 1);
	 } else {
		this._row = 0;
		if (this.horzMomentum > 0) {
			this.horzMomentum = Galv.INVADER.rnd(this.horzMomentum) - 0.1;
		} else if (this.horzMomentum < -0) {
			this.horzMomentum = Galv.INVADER.rnd(this.horzMomentum) + 0.1;
		};
	 };
	 
	 this.updateVertical();
};

if (Galv.INVADER.vertMovement) {
	Sprite_InvaderPlayer.prototype.updateVertical = function() {
		if (this.y + this.vertMomentum < Galv.INVADER.vBlock) {
			this.y = Galv.INVADER.vBlock;
			this.vertMomentum = 0;
			this.press = 0;
		} else if (this.y + this.vertMomentum > this.vBlock) {
			this.y = this.vBlock;
			this.vertMomentum = 0;
			this.press = 0;
		} else {
			// UP AND DOWN MOVEMENT
			 if (Input.isPressed('up') && !Input.isPressed('down')) {
				this.vertMomentum = this.vertMomentum <= -this.maxHorzSpeed ? this.vertMomentum : this.vertMomentum - this.accel;
			 } else if (Input.isPressed('down') && !Input.isPressed('up')) {
				this.vertMomentum = this.vertMomentum >= this.maxHorzSpeed ? this.vertMomentum : this.vertMomentum + this.accel;
			 } else {
				if (this.vertMomentum > 0) {
					this.vertMomentum = Galv.INVADER.rnd(this.vertMomentum) - 0.1;
				} else if (this.vertMomentum < -0) {
					this.vertMomentum = Galv.INVADER.rnd(this.vertMomentum) + 0.1;
				};
			 };
			 this.y = this.y + this.vertMomentum;
		};
	};
} else {
	Sprite_InvaderPlayer.prototype.updateVertical = function() {
		
	};
};

Sprite_InvaderPlayer.prototype.updateMotion = function() {
	this.x = this.x + this.horzMomentum;
};

Sprite_InvaderPlayer.prototype.checkCollide = function() { // Objects check for collision, not for player
};

Sprite_InvaderPlayer.prototype.addToSpawnList = function() {};

// Player uses minimum gun speed
Sprite_InvaderPlayer.prototype.setCooldown = function(gun) {
	gun.cooldown = gun.fireRate[0] * 6;  
};

Sprite_InvaderPlayer.prototype.updateFireRate = function() {
	for (var i = 0; i < this.guns.length; i++) {
		if (this.guns[i].cooldown > 0) this.guns[i].cooldown -= 1;
	};
};

Sprite_InvaderPlayer.prototype.destroyed = function() {
	Sprite_InvaderObject.prototype.destroyed.call(this);
	Galv.INVADER.scene.doWinLose('lose');
};


Sprite_InvaderPlayer.prototype.doDamage = function(source) {
	if (Galv.INVADER.invulPlayer) return false;
	
	if (this.sp > 0 && !source.ignoreS) {
		var doSAnim = true;
	} else {
		var doHAnim = true;
	};
	Sprite_InvaderObject.prototype.doDamage.call(this,source);
	Galv.INVADER.scene._hudS2.getHit(1,doSAnim);
	Galv.INVADER.scene._hudH2.getHit(0,doHAnim);
};

//-----------------------------------------------------------------------------
// SPRITE: Projectile
//-----------------------------------------------------------------------------

function Sprite_InvaderProjectile() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderProjectile.prototype = Object.create(Sprite_Base.prototype);
Sprite_InvaderProjectile.prototype.constructor = Sprite_InvaderProjectile;

Sprite_InvaderProjectile.prototype.initialize = function(gunId,angleId,object,rate) {
    Sprite_Base.prototype.initialize.call(this);
	this.ship = object;

	this._obj = rate ? this.ship.chargeGuns[gunId] : this.ship.guns[gunId];
	var angle = this._obj.projectileAngles[angleId] + 90;
	this.rotation = (angle - 90) * Math.PI / 180;
	this.active = true;
	this._animId = 0;
	this._damageTimer = 0;
	if (object == Galv.INVADER.player) {
		this.xMove = -this._obj.projectileSpeed * Math.cos(angle * Math.PI / 180);
		this.yMove = -this._obj.projectileSpeed * Math.sin(angle * Math.PI / 180);
	} else {
		this.xMove = this._obj.projectileSpeed * Math.cos(angle * Math.PI / 180);
		this.yMove = this._obj.projectileSpeed * Math.sin(angle * Math.PI / 180);
	};
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	if (this._obj.projectileHitBox) {
		// If using wide projectiles, update different checker
		this.updateHit = this.updateWideHit;
		
	};
	this.rate = rate ? Math.max(rate,0.2) : 1;
	this.scale.x = this.rate;
	this.scale.y = this.rate;
	this.setBitmap();
};

Sprite_InvaderProjectile.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	this.updateMove();
	this.updateHit();
	this.updateAnimation();
};

Sprite_InvaderProjectile.prototype.setBitmap = function() {
	this.x = this.ship.x + this._obj.xy[0];
	this.y = this.ship.y + this._obj.xy[1];
	
	this.z = this._obj.projectileZ;
	this.bitmap = ImageManager.loadInvaderGraphic(this._obj.projectileGraphic);
	this._id = this._obj.id;
	
	this.offScreenY = {top: -(this.bitmap.height * 2), bot: Graphics.boxHeight + (this.bitmap.height * 2)};
	this.offScreenX = {left: -(this.bitmap.width * 2), right: Graphics.boxWidth + (this.bitmap.width * 2)};
};

Sprite_InvaderProjectile.prototype.updateMove = function() {
	if (this.active) {
		this.y += this.yMove;
		this.x += this.xMove;
	};
	
	if (this.y < this.offScreenY.top || this.y > this.offScreenY.bot || this.x < this.offScreenX.left || this.x > this.offScreenX.right) {
		this.active = false;
		Galv.INVADER.requireProjClean = true;
	};
};

Sprite_InvaderProjectile.prototype.updateHit = function() {
	if (this.opacity > 0 && this._damageTimer <= 0) {
		for (var i = 0; i < Galv.INVADER.spawnedObjects.length;i++) {
			if (Galv.INVADER.spawnedObjects[i].checkHit(this.x,this.y,this._obj)) {
				// Play animation of hit
				this.doHitResult();
			};
		};
	} else {
		this._damageTimer = this._damageTimer - 1;
	};
};

Sprite_InvaderProjectile.prototype.updateWideHit = function() {	
	if (this.opacity > 0 && this._damageTimer <= 0) {
		for (var i = 0; i < Galv.INVADER.spawnedObjects.length;i++) {
			if (Galv.INVADER.spawnedObjects[i].checkHitWide(this.x,this.y,this._obj,this.rate)) {
				// Play animation of hit
				this.doHitResult();
			};
		};
	} else {
		this._damageTimer = this._damageTimer - 1;	
	};
};


Sprite_InvaderProjectile.prototype.doHitResult = function() {
	this._animId = this._obj.hitAnim;
	if (!this._obj.projectilePenetrate) {
		this.opacity = 0;
		this.update = this.destroy;
	} else {
		this._damageTimer = this._obj.projectileTick;
	};
};


Sprite_InvaderProjectile.prototype.destroy = function() {
	Sprite_Base.prototype.update.call(this);
	this.updateAnimation();

	if (!this._animationPlaying) {
		this.active = false;
		Galv.INVADER.requireProjClean = true;
	};
};

// UPDATE

Sprite_InvaderProjectile.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
       this._animationPlaying = false;
    }
};


Sprite_InvaderProjectile.prototype.setupAnimation = function() {
    if (this._animId > 0) {
        var animation = $dataAnimations[this._animId];
        this.startAnimation(animation, false, 0);
        
		this._animId = 0;
		this._animationPlaying = true;
    }
};



//-----------------------------------------------------------------------------
// SPRITE: Projectile FOR ENEMY
//-----------------------------------------------------------------------------

function Sprite_InvaderProjectileEnemy() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderProjectileEnemy.prototype = Object.create(Sprite_InvaderProjectile.prototype);
Sprite_InvaderProjectileEnemy.prototype.constructor = Sprite_InvaderProjectileEnemy;

Sprite_InvaderProjectileEnemy.prototype.initialize = function(gunId,angleId,object) {
	Sprite_InvaderProjectile.prototype.initialize.call(this,gunId,angleId,object);
	var angle = this.ship.guns[gunId].projectileAngles[angleId] + 270;
	this.rotation = (angle - 90) * Math.PI / 180;
};


Sprite_InvaderProjectileEnemy.prototype.updateHit = function() {
	if (this.opacity > 0 && this._damageTimer <= 0) {
		if (Galv.INVADER.player.checkHit(this.x,this.y,this._obj)) {
			// Play animation of hit
			this.doHitResult();
		};
	} else {
		this._damageTimer = this._damageTimer - 1;
	};
};

Sprite_InvaderProjectileEnemy.prototype.updateWideHit = function() {
	
	if (this.opacity > 0 && this._damageTimer <= 0) {
		if (Galv.INVADER.player.checkHitWide(this.x,this.y,this._obj)) {
			// Play animation of hit
			this.doHitResult();
		};
	} else {
		this._damageTimer = this._damageTimer - 1;	
	};
};




//-----------------------------------------------------------------------------
// Window_InvaderScore
//-----------------------------------------------------------------------------

function Window_InvaderScore() {
    this.initialize.apply(this, arguments);
}

Window_InvaderScore.prototype = Object.create(Window_Base.prototype);
Window_InvaderScore.prototype.constructor = Window_InvaderScore;

Window_InvaderScore.prototype.initialize = function() {
	var height = this.fittingHeight(1);
	var y = Graphics.boxHeight - height;
    Window_Base.prototype.initialize.call(this, 0, y, Graphics.boxWidth, height);
	this.opacity = 0;
	this.refresh();
};

Window_InvaderScore.prototype.standardPadding = function() {return 0;};

Window_InvaderScore.prototype.refresh = function(score) {
	var score = score || 0;
	this.contents.clear();
	this.drawText(score, 0, 0, this.contents.width, "center");
};


//-----------------------------------------------------------------------------
// Sprite_InvaderPlayerLife
//-----------------------------------------------------------------------------


function Sprite_InvaderPlayerLife() {
    this.initialize.apply(this, arguments);
}

Sprite_InvaderPlayerLife.prototype = Object.create(Sprite_Base.prototype);
Sprite_InvaderPlayerLife.prototype.constructor = Sprite_InvaderPlayerLife;

Sprite_InvaderPlayerLife.prototype.initialize = function(x,y,graphic,bar) {
    Sprite_Base.prototype.initialize.call(this);
	this.x = x;
	this.y = y;
	this.bitmap = ImageManager.loadInvaderGraphic(graphic);
	this._animId = 0;
	if (bar == 1 && Galv.INVADER.player.sp <= 0) this.opacity = 0;
};

Sprite_InvaderPlayerLife.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	this.updateAnimation();
};

Sprite_InvaderPlayerLife.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
       this._animationPlaying = false;
    }
};


Sprite_InvaderPlayerLife.prototype.setupAnimation = function() {
    if (this._animId > 0) {
        var animation = $dataAnimations[this._animId];
        this.startAnimation(animation, false, 0);   
		this._animId = 0;
		this._animationPlaying = true;
    }
};


Sprite_InvaderPlayerLife.prototype.getHit = function(bar,doAnim) {
	if (bar == 0) { // Hull
		// Change Bar for HP
		var rate = Galv.INVADER.player.hp / Galv.INVADER.player.maxHp;
		var w = this.bitmap.width * rate;
		var dif = this.bitmap.width - w;
		this.setFrame(dif, 0, w, this.bitmap.height);
		this.x = dif + Galv.INVADER.hudX;
		if (doAnim) this.doAnim(bar);
	} else { // Shield
		// Change Bar for SP
		var rate = Galv.INVADER.player.sp / Galv.INVADER.player.maxSp;
		var w = this.bitmap.width * rate;
		this.setFrame(0, 0, w, this.bitmap.height);
		if (doAnim) this.doAnim(bar);
	};
};
	
Sprite_InvaderPlayerLife.prototype.doAnim = function(bar) {
	if (bar == 0) { // Hull
		this._animId = Galv.INVADER.hudHanim;
	} else {
		this._animId = Galv.INVADER.hudSanim;
	};
};




//-----------------------------------------------------------------------------
// Window_InvaderPause
//

function Window_InvaderPause() {
    this.initialize.apply(this, arguments);
}

Window_InvaderPause.prototype = Object.create(Window_Command.prototype);
Window_InvaderPause.prototype.constructor = Window_InvaderPause;

Window_InvaderPause.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
};

Window_InvaderPause.prototype.windowWidth = function() {
    return 240;
};

Window_InvaderPause.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};

Window_InvaderPause.prototype.makeCommandList = function() {
    this.addCommand(Galv.INVADER.txtResume,   'resume');
    this.addCommand(Galv.INVADER.txtQuit, 'quit');
};

Window_InvaderPause.prototype.processOk = function() {
    Window_Command.prototype.processOk.call(this);
};