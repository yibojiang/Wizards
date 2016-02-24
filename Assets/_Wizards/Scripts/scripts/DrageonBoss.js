#pragma strict

enum DrageonState
{
	Awake, // Dragon Created, move to initial position.
	
}

var drageonState : DrageonState;

class DrageonLogic
{
	var targetPos : Vector3;
	var targetRotation : Vector3;
	
}

class DrageonMove
{
	var name : String;
	var depth : float;
	var hor : float;
	var vert : float;
	var destPos : Vector3;
	var destRot : Vector3;
	var destScale  :Vector3;
	var time : float;
	var easeType : iTween.EaseType;
	var delay : float;
	var oncomplete : String;
}

var colorAnimationNear : Color[];
var colorAnimationFar : Color[];

var particleMinSizeFar : float = 0.5;
var particleMinSizeClose : float = 2.0;
var particleMaxSizeFar : float = 1.0;
var particleMaxSizeClose : float = 4.0;
var leftLimitFar : float = -8.0;
var leftLimitClose : float = -2.0;
var rightLimitFar : float = 8.0;
var rightLimitClose : float = 2.0;
var upLimitFar : float = 12.0;
var upLimitClose : float = 9.0;
var downLimitFar : float = -5.0;
var downLimitClose : float = -3.0;
var closeLimit : float = -5.0;
var farLimit : float = 63.0;

var leftLimit : float;
var rightLimit : float;
var upLimit : float;
var downLimit : float;

var fadeCurrent : float;
var fadeTarget : float;

var finalTarget : Vector3;

var gravityForceMin : float = -0.5;
var gravityForceMax : float = -1.0;

var gravityTarget : float;
var gravityCurrent : float;



var drageonMoves : DrageonMove[];

/* BOSS BEHAVIOUR

1. Start from top of screen(off screen), small size
2. Swoop down, slight rotation then zoom a bit towards player, rotate in opposite direction.
3. Reach stable point, slight hover, slight rotation, maybe swooping left and right.
4. Launch Fireworks towards player (need special code for firework?)
5. Tap Sequence
	- 5 sequences, start short, maybe 3 points, have to hit all 3, 2nd appears after first is tapped.
		- If all are tapped, then drageon takes some damage.
		- Each sequence after that is slightly longer, slightly faster...
		- If player fails sequence, drageon launches bunch of fast fireworks towards player.
6. Do a bit more hovering, moving, then repeat tap sequence if still some more to go.
7. All tap sequences done, drageon defeated.

BASIC MOVE -> SWOOP LEFT AND RIGHT SLOWLY... 
*/

/* The gameObject this script is attached to handles POSITION
have seperate children gameobjects for rotation and scale

*/

var StartPos : Vector3;
var StartScale : Vector3;

var AttackPos : Vector3;
var AttackScale : Vector3;
var AttackTime : float = 4.0;
var AttackEaseType : iTween.EaseType;
var AttackScaleDelay : float = 1.0;

var AttackRotation : Vector3;
var AttackRotationDelay : float = 1.0;


var maxRotateAmount : Vector3;
var maxRotateSpeed : float = 1.0;

var maxHoverAmount : float = 4.0;
var maxHoverSpeed : float = 4.0;

var drageonMainBodyPE : ParticleEmitter;
var drageonMainBodyPA : ParticleAnimator;

var rotObject : GameObject;
var scaleObject : GameObject;

var particleTargetMinSize : float;
var particleTargetMaxSize : float;

private var ff : FireworkFactory;

private var em : ExplosionManager;

private var mm : MessageManager;

private var gm : GameManager;

private var am : AudioManager;

// Attack Parameters

class BossAttack
{
	var path : flightPath = flightPath.Straight;
	var visual : VisualEffect = VisualEffect.RandomColor;
	//var lifeTime : float = Random.Range(2.5, 4.5);
	var minLife : float = 1.5;
	var maxLife : float = 3.0;

	var startPos : Vector3;
	var endPos : Vector3 = Vector3( 0.0, -9.0, 0.0); 
}

var bossAttacks : BossAttack[];

// TAP PHASE
var currentSequence : int = 0; // Start with sequence 0

// Sequence 1
// 3 Tap Points, Long Delay, Slow fireworks

// Sequence 2
// 4 Tap Points, Medium Delay, Medium fireworks

// Sequence 3	
// 5 Tap Points, Short Delay, Fast fireworks

class Sequence
{
	var tapPointsActive : boolean[];
	var tapPointDelay : float = 1.2;
	var fireWorkLifeTime : float = 2.0;	
}

var tapSequences : Sequence[];

var tapPoints : BossTapPoint[]; // 5 tappoints attached to drageon. activated as necessary, according to tapPointsActive.

/* If player misses any of the tap points, then sequence stops and drageon flys around again for bit.
	If player completes tap sequence, drageon takes damage, flies around again, next time does next harder sequence.
	*/
	
/* Design tap point...so that it can support one or many taps...It sends a message to drageon boss if tap is successful

	Boss activates tap points, waits for success or fail signal.
	If failed, cancel tap sequence
	If success, and there are more taps in the sequence, activate next tap point
	If success and all have been tapped, then move to next sequence
*/

var tapped : boolean = false;
var tappedID : int = 0;

var pointsToTap : List.<int>;

var destroy : boolean = false;

function Awake()
{
	ff = GameObject.Find("FireworkFactory").GetComponent(FireworkFactory) as FireworkFactory;
	em = GameObject.Find("ExplosionManager").GetComponent(ExplosionManager) as ExplosionManager;
	mm = GameObject.Find("MessageManager").GetComponent(MessageManager) as MessageManager;
	am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
		
	if ( GameObject.Find("GameManager") != null)
 	{
 		gm = GameObject.Find("GameManager").GetComponent(GameManager) as GameManager;
 	}
	
	drageonState = DrageonState.Awake;
	drageonMainBodyPE.emit = false;
	transform.position = StartPos;
	scaleObject.transform.localScale = StartScale;
}

function Start()
{
	drageonMainBodyPE.emit = true;
	
	fadeCurrent = 0.0;
	gravityCurrent = gravityForceMax;
	
	MoveToAttackPosition();
}

function MoveToAttackPosition()
{
	yield WaitForSeconds(3.0);
	iTween.MoveTo(this.gameObject, iTween.Hash("position", AttackPos, "time", AttackTime, "easetype", AttackEaseType));
	iTween.ScaleTo(scaleObject, iTween.Hash("scale", AttackScale, "time", AttackTime, "easetype", AttackEaseType, "delay", AttackScaleDelay));
	iTween.RotateTo(rotObject, iTween.Hash("rotation", AttackRotation, "time", AttackTime, "easetype", AttackEaseType, "delay", AttackRotationDelay, "oncompletetarget", this.gameObject,"oncomplete", "Burst"));
}

#if UNITY_EDITOR
function Update ()
{
	if ( destroy )
	{
		DestroyBoss();
	}
}
#endif

function Burst()
{
	DoBurst();
	
	am.PlayDragonAppear();
	
	DoMove("SwoopRight");
}

function MiddleLevel()
{
	DoMove("MiddleLevel");
}

function DoMove(_move : String)
{
	var moveFound : boolean = false;
	
	for ( var i : int = 0; i < drageonMoves.length; ++i )
	{
		if ( drageonMoves[i].name == _move )
		{
			moveFound = true;
			if ( Wizards.Utils.DEBUG ) Debug.Log("Doing MOVE: " + _move);
			
			var actualDestPos : Vector3 = CreateActualDestPos(drageonMoves[i].depth, drageonMoves[i].hor, drageonMoves[i].vert);
			var actualScale : Vector3 = GetActualScale(drageonMoves[i].depth);
			
			DoItween(actualDestPos,
			actualScale,
			drageonMoves[i].destRot,
			drageonMoves[i].time,
			drageonMoves[i].easeType,
			drageonMoves[i].delay,
			drageonMoves[i].oncomplete);
		}	
	}
	
	if ( _move == "Burst")
	{
		Burst();
	}
	else if ( _move == "DoTapPhase" )
	{
		DoTapPhase();
	}
	else if ( moveFound == false )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("MOVE ( " + _move + ") NOT DEFINED - NO MOVE EXECUTED");
	}
}

function DoItween(_pos : Vector3, _scale : Vector3, _rot : Vector3 , _time : float, _ease : iTween.EaseType, _delay : float, _oncomplete : String)
{
	yield WaitForSeconds(_delay);
	iTween.MoveTo(this.gameObject, iTween.Hash("position", _pos, "time", _time, "easetype", _ease, "delay", _delay, "oncomplete", "NextMove", "oncompleteparams", _oncomplete));
	iTween.ScaleTo(scaleObject, iTween.Hash("scale", _scale, "time", _time, "easetype", _ease, "delay", _delay));
	iTween.RotateTo(rotObject, iTween.Hash("rotation", _rot, "time", _time, "easetype", _ease, "delay", _delay));
	
	// TODO add a check that prevents an itween from being sent if there is already active itween?
	// Just change the oncomplete function to trigger the CAN CALL ITWEEN FLAG to TRUE. (then call users oncomplete function)
	
	ResizeParticles(_delay, _time);
	
	FadeColour(_delay, _time);
	
	AdjustGravityForce(_delay, _time);
}

function AdjustGravityForce(_delay : float, _time : float)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("AdjustGravityForce");
	if ( Wizards.Utils.DEBUG ) Debug.Log("Delay : " + _delay);
	if ( Wizards.Utils.DEBUG ) Debug.Log("TIME : " + _time);
	yield WaitForSeconds(_delay);
	
	var lerpVal : float = 0.0;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("CURRENT Gravity: " + gravityCurrent);
	if ( Wizards.Utils.DEBUG ) Debug.Log("TARGET Gravity : " + gravityTarget);
	
	while ( lerpVal < 1.0 )
	{
    	drageonMainBodyPA.force.y = Mathf.Lerp(gravityCurrent, gravityTarget, lerpVal);;
    		
		lerpVal += Time.deltaTime * ( 1.0 / _time ) ;
		yield;
		
		if ( lerpVal >= 1.0 )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("GRAVITY LERP LOOP FINISHED");
			break;
		}	
	}
	
	gravityCurrent = gravityTarget;
}

function FadeColour(_delay : float, _time : float)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("FadeColourOfPARTICLES");
	if ( Wizards.Utils.DEBUG ) Debug.Log("Delay : " + _delay);
	if ( Wizards.Utils.DEBUG ) Debug.Log("TIME : " + _time);
	yield WaitForSeconds(_delay);
	
	var lerpVal : float = 0.0;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("FADE CURRENT : " + fadeCurrent);
	if ( Wizards.Utils.DEBUG ) Debug.Log("FADE TARGET : " + fadeTarget);
	
	while ( lerpVal < 1.0 )
	{
		var modifiedColors : Color[] = drageonMainBodyPA.colorAnimation;
		
    	for ( var i : int = 0; i < modifiedColors.length; ++i )
    	{
    		var actualVal : float =  fadeCurrent + ( lerpVal * ( fadeTarget - fadeCurrent) );
    		//if ( Wizards.Utils.DEBUG ) Debug.Log("ACTUAL COLOR VAL : " + actualVal);
    		modifiedColors[i] = Color.Lerp(colorAnimationNear[i], colorAnimationFar[i], actualVal);
    	}
    	
    	drageonMainBodyPA.colorAnimation = modifiedColors;
		
		
		lerpVal += Time.deltaTime * ( 1.0 / _time ) ;
		yield;
		
		if ( lerpVal >= 1.0 )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("COLOR LERP LOOP FINISHED");
			break;
		}	
	}
	
	fadeCurrent = fadeTarget;
}

function ResizeParticles(_delay : float, _time : float)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("ResizePARTICLES");
	if ( Wizards.Utils.DEBUG ) Debug.Log("Delay : " + _delay);
	if ( Wizards.Utils.DEBUG ) Debug.Log("TIME : " + _time);
	yield WaitForSeconds(_delay);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("REALTIME START : " + Time.realtimeSinceStartup);
	
	var startMin : float = drageonMainBodyPE.minSize;
	var startMax : float = drageonMainBodyPE.maxSize;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("StartMin : " + startMin);
	if ( Wizards.Utils.DEBUG ) Debug.Log("StartMax : " + startMax);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("TargetMin : " + particleTargetMinSize);
	if ( Wizards.Utils.DEBUG ) Debug.Log("TargetMax : " + particleTargetMaxSize);
	
	
	var lerpVal : float = 0.0;
	
	while ( drageonMainBodyPE.minSize != particleTargetMinSize || drageonMainBodyPE.maxSize != particleTargetMaxSize )
	{
		
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LERPVAL : " + lerpVal);
		drageonMainBodyPE.minSize = Mathf.Lerp(startMin, particleTargetMinSize, lerpVal);
		drageonMainBodyPE.maxSize = Mathf.Lerp(startMax, particleTargetMaxSize, lerpVal);
		
		lerpVal += Time.deltaTime * ( 1.0 / _time );
		yield;
		
		if ( lerpVal >= 1.0 )
		{
			drageonMainBodyPE.minSize = particleTargetMinSize;
			drageonMainBodyPE.maxSize = particleTargetMaxSize;
			if ( Wizards.Utils.DEBUG ) Debug.Log("LERP LOOP FINISHED");
			break;
		}	
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("REALTIME END : " + Time.realtimeSinceStartup);
}

function CreateActualDestPos(_depth : float, _hor : float, _vert : float) : Vector3
{
	particleTargetMinSize = particleMinSizeFar + ( ( 1 - _depth) * (particleMinSizeClose - particleMinSizeFar) );
	particleTargetMaxSize = particleMaxSizeFar + ( ( 1 - _depth) * (particleMaxSizeClose - particleMaxSizeFar) );
	
	fadeTarget = _depth;
	gravityTarget = gravityForceMin + ( ( 1 - _depth ) * ( gravityForceMax - gravityForceMin) );
	
	leftLimit = leftLimitClose - ( _depth * (leftLimitClose - leftLimitFar) );
	rightLimit = rightLimitClose - ( _depth * (rightLimitClose - rightLimitFar) );
	
	upLimit = upLimitClose - ( _depth * (upLimitClose - upLimitFar) );
	downLimit = downLimitClose - ( _depth * (downLimitClose - downLimitFar) );
		
	if ( Wizards.Utils.DEBUG ) Debug.Log("LEFT LIMIT : " + leftLimit);
	if ( Wizards.Utils.DEBUG ) Debug.Log("RIGHT LIMIT : " + rightLimit);
	if ( Wizards.Utils.DEBUG ) Debug.Log("UP LIMIT : " + upLimit);
	if ( Wizards.Utils.DEBUG ) Debug.Log("DOWN LIMIT : " + downLimit);
	if ( Wizards.Utils.DEBUG ) Debug.Log("CLOSE LIMIT : " + closeLimit);
	if ( Wizards.Utils.DEBUG ) Debug.Log("FAR LIMIT : " + farLimit);
	
	var actualXTarget : float = leftLimit + ( _hor * ( rightLimit - leftLimit ) );
	var actualYTarget : float = downLimit + ( _vert * ( upLimit - downLimit ) );
	var actualZTarget : float = closeLimit + ( _depth * ( farLimit - closeLimit ) );
	
	finalTarget = Vector3(actualXTarget, actualYTarget, actualZTarget);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("FINAL TARGET POS : " + finalTarget);
	return ( finalTarget );
}

function GetActualScale(_depth : float ) : Vector3
{
	var actualScale : float = 0.5 + ( ( 1 - _depth ) * 3.0 );
	if ( Wizards.Utils.DEBUG ) Debug.Log("ACTUAL SCALE : " + actualScale);
	return ( Vector3(actualScale, actualScale, 1.0) );
}


function NextMove(_move : String)
{
	if ( _move != "" )
	{
		DoAttack(_move);
		//DoMove(_move);
	}
}

function DoAttack(_nextMove : String)
{
	if ( _nextMove != "DoTapPhase" )
	{
		var attack : int = Random.Range(0, bossAttacks.length);
		
		var life : float = Random.Range(bossAttacks[attack].minLife, bossAttacks[attack].maxLife);
		
		life = tapSequences[currentSequence].fireWorkLifeTime;
		//ff.GetFirework(bossAttacks[attack].path, bossAttacks[attack].visual, transform.position, bossAttacks[attack].endPos, life);
		ff.GetFirework(bossAttacks[attack].path, bossAttacks[attack].visual, transform.position, bossAttacks[attack].endPos, life);
		
		//yield WaitForSeconds(lifeTime * 0.5);
	}
	
	DoMove(_nextMove);
}

function DoBurst()
{
	/*
	var previous : Vector3;
	previous = drageonMainBodyPE.rndVelocity;
	drageonMainBodyPE.rndVelocity.x = 10.0;
	drageonMainBodyPE.rndVelocity.y = 10.0;
	
	yield;
	
	drageonMainBodyPE.rndVelocity = previous;
	*/
	var vel : float = 5.0;
	var particles : Particle[] = drageonMainBodyPE.particles;
	
	for ( var i : int = 0; i < particles.length; ++i )
	{
		particles[i].velocity.x = Random.Range(-vel, vel);
		particles[i].velocity.y = Random.Range(-vel, vel);
		particles[i].size *= Random.Range(0.1, 4.0);
	}
	
	drageonMainBodyPE.particles = particles;
}

function ActivateTapPoint(_tapPointNum : int)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("ACTIVATE TAP POINT : " + _tapPointNum);
	
	//if ( _tapPointNum >= tapSequences[currentSequence].tapPointsActive.Length )
	if ( _tapPointNum == -1 )
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("All Points TAPPED!");
		// Sequence Successful!
		currentSequence++;
		
		if ( currentSequence == tapSequences.Length	)
		{
			DestroyBoss();
		}
		else
		{
			DamageBoss();
		}
	}
	else
	{
		if ( tapSequences[currentSequence].tapPointsActive[_tapPointNum] == true )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("Activating next tap point : " + _tapPointNum);
			tapPoints[_tapPointNum].SetTapPointActive(true);
			tapPoints[_tapPointNum].SetTapDelay(tapSequences[currentSequence].tapPointDelay);
		}
		else
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("This tap point not used for this sequence, trying next tap point : " + (_tapPointNum + 1) );
			ActivateTapPoint(_tapPointNum + 1);
		}
	}
}

function DoTapPhase()
{
	var numTapPoints : int = tapSequences[currentSequence].tapPointsActive.Length;
	
	var currentTapPoint : int = 0;
	
	var tapPointDelay : float = tapSequences[currentSequence].tapPointDelay;
	
	//ActivateTapPoint(0);
	StartTapPoints();
}

function StartTapPoints()
{
	pointsToTap = new List.<int>();
	
	for ( var i : int = 0; i < tapSequences[currentSequence].tapPointsActive.Length; ++i )
	{
		if ( tapSequences[currentSequence].tapPointsActive[i] == true )
		{
			pointsToTap.Add(i);
		}
	}
	
	var tapPoint : int = GetRandomTapPoint();
	
	if ( tapPoint == -1 )
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("NO TAP POINTS!");
	}
	
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Activating tap point : " + tapPoint);
	ActivateTapPoint(tapPoint);
}

function GetRandomTapPoint() : int
{
	var randomTapPoint : int = -1;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("pointsToTap Count: " + pointsToTap.Count);
	if ( pointsToTap.Count > 0 )
	{ 
		var selection : int = Random.Range(0, pointsToTap.Count);
		if ( Wizards.Utils.DEBUG ) Debug.Log("Selection : " + selection);
	
		randomTapPoint = pointsToTap[selection];
		//if ( Wizards.Utils.DEBUG ) Debug.Log("RandomTapPoint: " + randomTapPoint);
	
		pointsToTap.Remove(randomTapPoint);
	
		//if ( Wizards.Utils.DEBUG ) Debug.Log("REMOVE RETURN CODE : " + );
		//if ( Wizards.Utils.DEBUG ) Debug.Log("pointsToTapCount AFTER Removal : " + pointsToTap.Count);
	}
	
	return ( randomTapPoint );
}

function HitSuccess(_tapPointID : int)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("TapPoint HIT : " + _tapPointID);
	
	tapped = true;
	tappedID = _tapPointID;
	tapPoints[_tapPointID].SetTapPointActive(false);
	
	am.PlayDragonHit();
	
	//tapSequences[currentSequence].tapPointsActive[_tapPointID] = false;
	
	em.FireBossHitExplosion(tapPoints[_tapPointID].transform.position);
	
	mm.ShowMessage(FwMessageType.Perfect, tapPoints[_tapPointID].transform.position, 0 );
	
	ActivateTapPoint(GetRandomTapPoint());
}

function TapFailed(_tapPointID : int)
{
	tapPoints[_tapPointID].SetTapPointActive(false);
	
	mm.ShowMessage(FwMessageType.Miss, tapPoints[_tapPointID].transform.position, 0);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("TAP SEQUENCE FAILED");
	DoMove("SwoopRight");
}

function DestroyBoss()
{
	DoBurst();
	
	am.PlayDragonHit();
	am.PlayDragonAppear();

	//em.FireGlitterExp(GlitterType.Blue,transform.position);
	//em.FireGlitterExp(GlitterType.Orange,transform.position);
	
	//yield WaitForSeconds(1.0);
	gm.BossDestroyedResumeGame(3.0);
			
	em.DoCelebralationExplosion(30, 3.0);
	
	gm.WinGame();
	
	Destroy(this.gameObject, 1.5);
}

function DamageBoss()
{
	DoBurst();
	em.DoCelebralationExplosion(5, 0.5);
	DoMove("SwoopRight");
}