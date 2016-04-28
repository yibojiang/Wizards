// Basic Values
var lifeTime : float = 4;
var timeAlive : float = 0;
var startPos : Vector3;
var endPos : Vector3;
var velocity : Vector3;
var gravity : float = 9.8;
var tailLength : float = 0.0;

var loopPauseAngle : float = 80.0;
var loopUnPauseAngle : float = 220.0;

var fakeTime : float = 0.0;

// Special End Point ( For Chain Straight)
var actualEndPos : Vector3 = Vector3.zero;

var tail : ParticleEmitter;
var smoke:ParticleEmitter;
var subTail : ParticleEmitter;
var flare : GameObject;

var head : GameObject;
var headAnimation:exSpriteAnimation;

var myFlightPath : flightPath;
var pathHasBeenSet : boolean = false;

var isWaitingToExplode : boolean = false;

var doDestroy : boolean = false;

var saveTimeAlive : boolean = false;
var tAlive : float = 0.0;

// LOOP CONTROLS
var loopRotation : float = 0.0;
var loopDone : boolean = false;
var loopRadius : float = 1.0;
var loopDelta : float = 0.0;
var loopDirection : float = 0.0;

var loopMinSpeed : float = 0.5;
var loopMaxSpeed : float = 2.0;

var loopMinRadius : float = 0.5;
var loopMaxRadius : float = 1.0;

var oneLoopTimeStart : float = 2.0;
var oneLoopHasLooped : boolean = false;

var isOneLooping : boolean = false;

var negVelocityModifier : float = 1.0;

var circleFlyOffDegreesCompleted : float = 0.0;

// Bird/Spawner/Child flag
var isBird : boolean = false;
var useParentRanking : boolean = false; // introduced so birds can have same ranking as parent.

// Used internally as the final rating (poor, good, perfect) to trigger appropriate events.
var finalRating : int = 0;

// Repeat count for chaser firework
var repeat : int = 3;

// Prevents the firework from launching its payload more than once.
var hasLaunchedChain : boolean = false;


// Pusle control
private var pulseTimer : float = 0.0;
private var pulseGrow : float = 100.0;
private var pulseMax : float = 0.2;
private var pulseStartScale : float = 0.0;
private var pulseSpeed : float = 2.0;

// Emitter Controls
var emitterMaxFireworks : int = 5;
var emitterCurrentFireworks : int = 0;
var currentEmitterRotation : float = 0.0;
var emitterAngleGap : float = 45.0;
var emitterInterval : float = 1.0;
var emitterTimer : float = 0.0;

// Glitter Firework Payload Explosion
var glitter : GameObject;

// BUILDER FirewWork Controls
var originalBuilderPath : Vector3[];
var builderPath : Vector3[];
var currentPathPoint : int = 0;
var builderLerpValue : float = 0.0;
var builderSpeed : float = 1.0;
var builderStillMoving : boolean = true;

// Ring Spawn Control
private var spawnTravelDuration : float = 0.5;
private var spawnTravelTimer : float = 0.0;
var spawnRating : HitRanking;

// Links To various game manangers
//var dm : _DebugManager;
var am : AudioManager;
var mm : MessageManager;
var em : ExplosionManager;
var gm : GameManager;
var ff : FireworkFactory;
var ab : AudienceBar;
var lm : LevelManager;

// Feedback
var tapPoor : GameObject;
var tapGood : GameObject;
var tapPerfect : GameObject;
var enableTapFeedBack : boolean = false;

// Current
var currentVelocity : Vector3 = Vector3.zero;
var prevPosition : Vector3 = Vector3.zero;

// Audio
var audioSource:AudioSource;

// Multitouch Firework
var multiHitOn : boolean = false;
var hitcount : int = 0;
var hitsToKill : int = 5;
var multiHitScaleMultiplier : float = 1.0;
var multiHitIncreaseSizeRate : float = 0.8;

// Miss Animation
var doMissAnimation : boolean = false;
//var smokeFadeSpeed : float = 6.0;

var rainBowTrail : TrailRenderer;

// Explosion Effect
var visual : VisualEffect;

// Combo Timer Detection Optimisation
var canListenForComboTimer : boolean = false;
var hasReceivedExplodeMessage : boolean = false;

var newVel : Vector3 = Vector3.zero;

var isRandomColor : boolean = false;

//For emitter
var parentObject:GameObject;

var myTransform:Transform;

var mutipleTapCount:TapCount;

var timeLeft : float; 

var tutorialMode : boolean = false;
var tutMessage : FireworkTutorialMessage;

var lines:LineRenderer;

enum flightPath
{
	Bow, // 1 (Parabola)
	Straight, // 2
	Roller, // 3 (loop)
	Snake, // 4 (wavy)
	CircleFlyOff, // 5 (oneloop)
	ChainStraight, // 6 
	Spawner, // 7 (birds)
	GlitterRain, // 8
	RingBodySplitter, // 9 // This shoots fws simultaneously into a ring shape.
	Chaser, // 10
	Builder, // 11
	EmitterRndSlow, // 12 - This shoots fw's in random directions, lifetime 2.0 seconds.
	RingBodySpawn, // 13 - Dont use this normally...should be spawned by RingBodySplitter
	EmitterSpiralFast, // 14 - This shoots fw's in a spiral pattern with lifetime of 1 second
	EmitterSpiralMed, // 15 - This shoots fw's in a spiral pattern with lifetime 1.5 seconds.
	EmitterSpiralSlow, // 16 - This shoots fw's in a spiral pattern with lifetime 2 seconds.
	EmitterRndMed,    // 17 - lifetime 1.5, shorter delay between launch
	EmitterRndFast,   // 18 - lifetime 1.0, short delay between launch
	StarSpawn,
	HeartShape,
	StarShape,
	SmileShape,
	Horizontal,
	Vertical,
	SpiralShape,
	LoadingCircle,
	Cross,
	RotateHeartShape,
	RotateSpiralShape,
	MAX
}

private var circleVertexCount:int=31;
function Awake()
{
	am = GameObject.Find("AudioManager").GetComponent("AudioManager") as AudioManager;
	em = GameObject.Find("ExplosionManager").GetComponent("ExplosionManager") as ExplosionManager;
	mm = GameObject.Find("MessageManager").GetComponent("MessageManager") as MessageManager;
	gm = GameObject.Find("GameManager").GetComponent("GameManager") as GameManager;
	ff = GameObject.Find("FireworkFactory").GetComponent("FireworkFactory") as FireworkFactory;
	ab = GameObject.Find("AudienceBar").GetComponent("AudienceBar") as AudienceBar;
	if ( Application.loadedLevelName != "Tutorial" )
	{
		// lm = GameObject.Find("LevelManager").GetComponent("LevelManager") as LevelManager;
		lm=LevelManager.Instance();
	}
	
	audioSource=GetComponent(AudioSource);
	
	//headAnimation=head.GetComponent(exSpriteAnimation);
	
	pulseStartScale = head.transform.localScale.x;
	
	myTransform=this.transform;

	lines=gameObject.AddComponent.<LineRenderer>();
	lines.SetVertexCount(circleVertexCount);
	lines.useWorldSpace=false;
	lines.SetWidth(0.2,0.2);
	UpdateCircle(0);
	lines.material=Resources.Load.<Material>("Material/FireworkCircle");

}

function UpdateCircle( radius:float){
	var rad:float;
	var pos:Vector3;
	for (var i:int=0;i<circleVertexCount;i++){
		rad=2*Mathf.PI*i/(circleVertexCount-1);
		
		pos.x=radius*Mathf.Cos(rad);
		pos.y=radius*Mathf.Sin(rad);
		pos.z=0;
		lines.SetPosition(i, pos );
	}

	// rad=2*Mathf.PI

}

// function DoUpdateCircle(){

// 	while(){
// 		yield WaitForEndOfFrame()
// 	}

// }

function Start()
{

}

function ActivateTutorialMode()
{
	tutorialMode = true;
	var tut : GameObject = mm.GetFireworkTutorialMessage();
	
	tut.transform.parent = this.transform;
	
	tut.transform.localPosition = Vector3(-3.0, 0.0,0.0);
	tutMessage = tut.GetComponent(FireworkTutorialMessage) as FireworkTutorialMessage;
}

function ProcessTutorialMode()
{
	//UpdateTutorialPosition();
	var perfectTime : float = 0.5;
	timeLeft= lifeTime - timeAlive;
	if ( timeLeft < perfectTime )
	{
		tutMessage.SetTutorialRating(2);
	}
	else if ( timeLeft >= 0.5 && timeLeft < (perfectTime + (lifeTime - perfectTime)*0.15 )  )
	{
		tutMessage.SetTutorialRating(1);
	}
	else
	{
		tutMessage.SetTutorialRating(0);
	}
	
	/*
	var adjustedTimeAlive = timeAlive - 0.5;
	switch ( myFlightPath )
	{
		case flightPath.Straight:
			tutMessage.transform.position = startPos + (velocity * adjustedTimeAlive);
		break;
		
		case flightPath.Bow:
			tutMessage.transform.position.x = startPos.x + (velocity.x * adjustedTimeAlive);
			tutMessage.transform.position.y = startPos.y + velocity.y * adjustedTimeAlive - ( 0.5 * gravity * adjustedTimeAlive * adjustedTimeAlive );
		break;
	}
	*/
	
}

function UpdateTutorialPosition()
{
	var myParticles : Particle[] = tail.particles;
	
	if ( myParticles != null && myParticles.Length	> 0 )
	{
		var lowestEnergy : float = 10.0;
		
		var lowestIndex : int = 0;
		
		for ( var i : int = 0; i < myParticles.length; ++i )
		{
			if ( myParticles[i].energy < lowestEnergy )
			{
				lowestIndex = i;
				lowestEnergy = myParticles[i].energy;
			}
		}
		
		tutMessage.transform.position = myParticles[lowestIndex].position;
		tutMessage.transform.position.x -= 3.0;
	}
}	

function GetFireworkType() : flightPath
{
	return ( myFlightPath );
}

function SetLifeTime(_lifeTime : float)
{
	lifeTime = _lifeTime;
}

function SetType(_type : flightPath)
{
	pathHasBeenSet = true;
	var random:int;
	myFlightPath = _type;
		
	switch ( _type )
	{
		case flightPath.Straight:
		case flightPath.Horizontal:
		case flightPath.LoadingCircle:
			random=Random.Range(1,10);
			if (random<=5)
			{
				audioSource.clip=am.fireworkLaunch[1];
			}
			else
			{
				audioSource.clip=am.fireworkLaunch[11];
			}		
		break;
			
		case flightPath.Bow:
			
			
				
			if ( endPos.y < startPos.y )
			{
				//gravity = Vector3(0.0, 9.8, 0.0);
				
				gravity=-9.8;
			}
			else
			{
				//gravity = Vector3(0.0, -9.8, 0.0);
				
				gravity=9.8;
			}
			
			velocity = ( (endPos - startPos) - (0.5 * Vector3(0,-gravity,0) * (lifeTime * lifeTime)) ) / lifeTime;
						

		
			
			random=Random.Range(1,20);
			if (random<=5)
			{
				audioSource.clip=am.fireworkLaunch[9];
			}
			else if (random>5 && random<=10)
			{
				audioSource.clip=am.fireworkLaunch[10];
			}
			else if (random>10 && random<=15)
			{
				audioSource.clip=am.fireworkLaunch[11];
			}
			else  
			{
				audioSource.clip=am.fireworkLaunch[12];
			}
		break;
			
		case flightPath.Roller:
			audioSource.clip=am.fireworkLaunch[3];
			SetupRollerLoop(2.0);
		break;
		
		case flightPath.CircleFlyOff:
			audioSource.clip=am.fireworkLaunch[4];//TODO
			SetupCircleFlyOffLoop(2.0);
			oneLoopTimeStart = lifeTime * 0.33;
			yield WaitForSeconds(1.0);
		break;
		
		case flightPath.ChainStraight:
			audioSource.clip=am.fireworkLaunch[1];
			repeat = 3;		
		break;
		
		case flightPath.Chaser:
			random=Random.Range(1,10);
			if (random<=5)
			{
				audioSource.clip=am.fireworkLaunch[5];
			}
			else 
			{
				audioSource.clip=am.fireworkLaunch[6];
			}
			repeat = 5;
		break;
		
		case flightPath.Spawner:
			audioSource.clip=am.fireworkLaunch[1];//not sure
		break;
		
		case flightPath.EmitterRndSlow:
		case flightPath.EmitterSpiralFast:
		case flightPath.EmitterSpiralSlow:
		case flightPath.EmitterSpiralMed:
		case flightPath.EmitterRndMed:
		case flightPath.EmitterRndFast:
			random=Random.Range(1,10);
			if (random<=5)
			{
				audioSource.clip=am.fireworkLaunch[8];
			}
			else
			{
				audioSource.clip=am.fireworkLaunch[5];
			}
		break;
		
		case flightPath.Snake:
			audioSource.clip=am.fireworkLaunch[2];
			SetupSnakeLoop(1.5);
		break;
		
		case flightPath.GlitterRain:
			audioSource.clip=am.fireworkLaunch[6];
		break;
		
		case flightPath.RingBodySplitter:
			audioSource.clip=am.fireworkLaunch[7];
		break;
		
		case flightPath.Builder:
			repeat = 5;
			audioSource.clip=am.fireworkLaunch[1];//not sure
		break;
		
		case flightPath.RingBodySpawn:
			audioSource.clip=am.fireworkLaunch[1];//not sure
		break;
		case flightPath.StarSpawn:
			audioSource.clip=am.fireworkLaunch[1];//not sure
		break;
	}
	
	var randomVol:float=Random.Range(0.4,0.7);
	var randomPitch:float=Random.Range(0.3,1.1);
	var randomPitchOffset=Random.Range(-0.05,0.05);

	if (audioSource!=null)
	{
		//audioSource.volume=0;
		audioSource.volume=randomVol*am.fwVol;
		audioSource.pitch=randomPitch;
		audioSource.Play();
	}
}

function WaitForPlaySound(_time:float,_volume:float)
{
	yield WaitForSeconds(_time);
	audioSource.volume=_volume;
	audioSource.Play();
}

function SetVelocity(_x : float, _y : float)
{
	velocity = Vector3(_x, _y, 0.0);
} 

function SetPosition(_x : int, _y : int)
{
	transform.position = PixelToWorld(_x, _y);
	startPos = transform.position;
}

function SetRepeat(_repeat : int )
{
	repeat = _repeat;
}

function SetupSnakeLoop(_speed : float)
{
	loopRadius = 2.0;
	loopDelta = (2.0 * Mathf.PI / ( lifeTime * 0.5)); // loop speed needs to based on velocity as well...
			
	if ( Random.value < 0.5 )
	{
		loopDirection = -1.0;
	}
	else
	{
		loopDirection = 1.0;
	}
}


function SetupCircleFlyOffLoop(_speed : float)
{
	loopRadius = 2.0;
	loopDelta = (2.0 * Mathf.PI / ( lifeTime * 0.5)); // loop speed needs to based on velocity as well...
			
	if ( Random.value < 0.5 )
	{
		loopDirection = -1.0;
	}
	else
	{
		loopDirection = 1.0;
	}
}

function SetupRollerLoop(_speed : float)
{
	loopRadius = 3.0;
	loopDelta =  _speed;
			
	if ( Random.value < 0.5 )
	{
		loopDirection = -1.0;
	}
	else
	{
		loopDirection = 1.0;
	}
}

function ClearParticles()
{
	var pEs = this.gameObject.GetComponentsInChildren(ParticleEmitter);
	
	for ( var pe : ParticleEmitter in pEs )
	{
		pe.ClearParticles();
		pe.Simulate(1.0);
		pe.particles = null;
		pe.useWorldSpace=true;
	}	
}

function Update ()
{
	if ( doDestroy == true )
	{
		//Reset();
		//this.gameObject.SetActiveRecursively(false);
		Destroy(this.gameObject);
		return;
	}
	
	// Turn off PANNING - Not effective at the moment - Probably using up resources
	/*
	var panValue : float = (this.transform.position.x/10) * 0.5 * Mathf.PI;
	audioSource.pan = Mathf.Sin(panValue);
	*/
			
	if  ( doMissAnimation == true )
	{	
		//DoPulse();
		ProcessMissAnimation();
		return; // This is needed so the rest of the fw code does not execute and cause problems...
	}
	
	// If the path hasnt been set, this firework probably hasn't been setup properly by the firework
	// manager -> this could just be a test firework that has been dropped into the scene...or
	// some other problem has occured.
	if ( pathHasBeenSet == false )
	{	
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("AutoSettingPath" + transform.name);
		var path : int = -1;
		
		while ( path < 0 || path == 7 )
		{
			path = Random.Range(0,9);
		}
	
		SetType(path);
	}
	
	// REDUCE THE TAILLENGTH OVER TIME.
	ProcessTailLength();
	
	// If the firework HAS NOT been tapped/triggered to explode...
	if ( isWaitingToExplode == false )
	{
		var circleRadius=(1.0-timeAlive/lifeTime)*10;
		var circleCol:Color=Color.white;
		circleCol=Color.Lerp(Color.red,Color.green, timeAlive/lifeTime );
		circleCol.a=timeAlive/lifeTime ;
		
		UpdateCircle(circleRadius);

		lines.SetColors(circleCol,circleCol);
		
		timeAlive += Time.deltaTime;
		
		
		if (gm.autoTap)
		{
			var perfectTime : float = 0.5; // seconds
			if (myFlightPath==flightPath.StarSpawn)
			{
				perfectTime=7;
			}
			else
			{
				perfectTime=0.5;
			}
			
			if (lifeTime - timeAlive<perfectTime)
			{
				//Explode();
				ExplodeNoDelay();
					
			}
		}
		
		// Move the firework as required.
		ProcessPath();

		// Checks if the firework has been missed by the player, either time limit, or has gone off screen.
		CheckForMiss();
		
		if ( tutorialMode )
		{
			ProcessTutorialMode();
		}
	}
	else // The firework has been triggered to explode (isWaitingToExplode == true ) (usually from player tapping it)
	{
		
		DoPulse(); // Scale the size of the star head up and down.
		
		// CHAIN STRAIGHT, CHASER, BUILDER
		if ( (myFlightPath == flightPath.ChainStraight ||
			 myFlightPath == flightPath.Chaser ||
			 myFlightPath == flightPath.Builder) &&
			 hasLaunchedChain == false)
		{
			// Create next chain at this point...
			if ( repeat > 1 )
			{

				
				if ( myFlightPath == flightPath.ChainStraight ) // CHAIN STRAIGHT LOGIC
				{
					//dm.LaunchChain(transform.position, velocity, repeat - 1);
					LaunchChain(transform.position, velocity, repeat - 1);
					RealExplode(0.0);

				}
				else // CHASER & BUILDER LOGIC
				{
					var destAngle : float = Random.Range(0.0, 359.0);
					//if ( Wizards.Utils.DEBUG ) Debug.Log("destAngleStart: " + destAngle);
					
					var angleIncrease : float = Random.Range(110.0, 110.0);
										
					if ( Random.value < 0.5 )
					{
						angleIncrease *= -1.0;
					}
					
					//if ( Wizards.Utils.DEBUG ) Debug.Log("angleIncrease: " + angleIncrease);
					
					var foundPos : boolean = false;
					var safetyCheck : int = 0;
					
					var maxSafetyChecks : int = 100;
					
					var minDistance : float = Random.Range(10,17.0);
					minDistance = 14.0;
					//if ( Wizards.Utils.DEBUG ) Debug.Log("MinDist: " + minDistance);
					
					var dest : Vector3 = Vector3.zero;
					dest.z = transform.position.z;
					
					// Choose new position
					while ( foundPos == false && safetyCheck < maxSafetyChecks )
					{
						dest.x = transform.position.x + (minDistance * Mathf.Sin(Mathf.Deg2Rad * destAngle));
						dest.y = transform.position.y + (minDistance * Mathf.Cos(Mathf.Deg2Rad * destAngle));
						//if ( Wizards.Utils.DEBUG ) Debug.Log("Dest:" + dest);
						
						if ( dest.x < 9.0 && dest.x > -9.0 &&
							 dest.y > -5.0 && dest.y < 14.0 )
						{
							foundPos = true;
						}
						else
						{
							destAngle += angleIncrease;
							//if ( Wizards.Utils.DEBUG ) Debug.Log("currAngle: " + destAngle);
						}
						
						++safetyCheck;
					}					
					
					//if ( Wizards.Utils.DEBUG ) Debug.Log("SafetyCheck: " + safetyCheck + "@" + Time.time);
					
					if ( safetyCheck >= maxSafetyChecks )
					{
						dest.x = Random.Range(-9.0, 9.0);
						dest.y = Random.Range(-5.0, 14.0);
					}
					//dm.LaunchChaser(transform.position, newVel, repeat - 1);
					
					if ( myFlightPath == flightPath.Chaser )
					{
						LaunchChaser(transform.position, dest, repeat - 1);
					}
					else
					{
						LaunchBuilder(transform.position, dest, repeat - 1);		
					}
				}
			}
			
			if ( myFlightPath == flightPath.Chaser || myFlightPath == flightPath.ChainStraight)
			{
				RealExplode(0);
			}
			
			hasLaunchedChain = true;
		}
		else if ( myFlightPath == flightPath.Spawner && hasLaunchedChain == false) // SPAWNER LOGIC (BIRDS)
		{
			var num:int=0;
			var maxNum:int=3;
			var rotateDeg:float=Random.Range(0.0,180.0);
			var addDeg:float=100.0;
			var addPos:Vector3;
			var targetPos:Vector3;
			
			var randomLife:float;
			var randomLifeMin : float = 1.6;//1.2;
			var randomLifeMax : float = 2.2;//1.8;
			var randomIncrease : float = -0.2;
			

			var flightDistanceMin : float = 12.0;//8.5;
			var flightDistanceMax : float = 16.0;//12.5
			var flightDistance : float = Random.Range(flightDistanceMin, flightDistanceMax);
			
			flightDistance = 16.0;
			
			var leftLimit : float = -9.5;
			var rightLimit : float = 9.5;
			var upLimit : float = 14.5;
			var downLimit : float = -10.0;
			
			am.PlayBirdLaunch();
						
			var safety : int = 0;
			
			while (num<maxNum && safety < 100)
			{
				
				addPos.x=flightDistance*Mathf.Cos(Mathf.Deg2Rad *rotateDeg);
				addPos.y=flightDistance*Mathf.Sin(Mathf.Deg2Rad *rotateDeg);
				targetPos=transform.position+addPos;
				if (targetPos.x<rightLimit && targetPos.x>leftLimit && targetPos.y<upLimit && targetPos.y>downLimit)
				{
					num++;
					randomLife=Random.Range(randomLifeMin,randomLifeMax);
					LaunchBird(transform.position, targetPos, randomLife, spawnRating);
					
					randomLifeMin += randomIncrease;
					randomLifeMax += randomIncrease;
					//if ( Wizards.Utils.DEBUG ) Debug.Log(targetPos);
					//flightDistance = Random.Range(flightDistanceMin, flightDistanceMax);
					flightDistance -= 2.0;
				}
				rotateDeg+=addDeg;
				safety++;
				if ( safety % 10 == 0 )
				{
					flightDistance -= 1.0;
				    if ( Wizards.Utils.DEBUG ) Debug.Log("SafetyCheckTrigggered : " + safety);
				    if ( Wizards.Utils.DEBUG ) Debug.Log("Flight reduced " + flightDistance);
				}
			}
		    if ( Wizards.Utils.DEBUG ) Debug.Log("Safety : " + safety);
			
			RealExplode(0);
			hasLaunchedChain = true;	
		}
		else if ( myFlightPath == flightPath.EmitterRndSlow && hasLaunchedChain == false) // EMITTER - RANDOM CIRCLE
		{
			
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval )
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					var radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					
					LaunchEmitter(transform.position, newVel, 2.0);
				
					currentEmitterRotation += Random.Range(90.0, 180.0);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.EmitterRndMed && hasLaunchedChain == false) // EMITTER - RANDOM CIRCLE
		{
			
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval * 0.5)
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					//dm.LaunchBird(transform.position, newVel, 3.0);
					LaunchEmitter(transform.position, newVel, 1.5);
				
					currentEmitterRotation += Random.Range(90.0, 180.0);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.EmitterRndFast && hasLaunchedChain == false) // EMITTER - RANDOM CIRCLE
		{
			
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval * 0.25)
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					//dm.LaunchBird(transform.position, newVel, 3.0);
					LaunchEmitter(transform.position, newVel, 1.0);
				
					currentEmitterRotation += Random.Range(90.0, 180.0);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.EmitterSpiralFast && hasLaunchedChain == false) // EMITTER
		{
			
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval * 0.33 )
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					//dm.LaunchBird(transform.position, newVel, 3.0);
					LaunchEmitter(transform.position, newVel, 1.0);
				
					//currentEmitterRotation += Random.Range(90.0, 180.0);
					currentEmitterRotation += (360.0 / emitterMaxFireworks);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.EmitterSpiralMed && hasLaunchedChain == false) // EMITTER
		{
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval * 0.66 )
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					//dm.LaunchBird(transform.position, newVel, 3.0);
					LaunchEmitter(transform.position, newVel, 1.5);
				
					//currentEmitterRotation += Random.Range(90.0, 180.0);
					currentEmitterRotation += (360.0 / emitterMaxFireworks);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.EmitterSpiralSlow && hasLaunchedChain == false) // EMITTER
		{
			
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				// Emit some fireworks then die
				emitterTimer += Time.deltaTime;
			
				if ( emitterTimer > emitterInterval )
				{
					emitterTimer = 0.0;
				
					// Emit one firework
					
					radius = 8.0;
				
					newVel.x = radius * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = radius * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
				
					
					LaunchEmitter(transform.position, newVel, 2.0);
				
					//currentEmitterRotation += Random.Range(90.0, 180.0);
					currentEmitterRotation += (360.0 / emitterMaxFireworks);
					emitterCurrentFireworks += 1;
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.RingBodySplitter )
		{
			emitterMaxFireworks=8;
			if ( emitterCurrentFireworks < emitterMaxFireworks )
			{
				while ( emitterCurrentFireworks < emitterMaxFireworks )
				{
					emitterAngleGap=360.0/emitterMaxFireworks;
					
					var speed : float = 10.0; 
			
					newVel.x = speed * Mathf.Cos(Mathf.Deg2Rad * currentEmitterRotation);
					newVel.y = speed * Mathf.Sin(Mathf.Deg2Rad * currentEmitterRotation);
			
					//dm.LaunchRingSpawn(transform.position, newVel, 3.0, spawnRating);
					LaunchRingSpawn(transform.position, newVel, 3.0, spawnRating);
					
					currentEmitterRotation += emitterAngleGap;
					emitterCurrentFireworks += 1;
					
					
				}
			}
			else
			{
				RealExplode(0);
				hasLaunchedChain = true;
			}
		}
		else if ( myFlightPath == flightPath.RotateHeartShape )
		{
			var heartLife0:float =12;
			var obj0:GameObject=GenerateParent(transform.position,heartLife0+5);
			
			
			iTween.RotateAdd(obj0.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			
			LaunchStarSpawn(transform.position, Vector3( 8.5,2.5,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 7.5,6.5,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 3,8,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 0,5.6,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( -3,8,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( -7.5,6.5,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( -8.5,2.5,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( -6,-1,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( -3,-3,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 0,-6,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 3,-3,0), heartLife0, spawnRating,obj0);
		
			LaunchStarSpawn(transform.position, Vector3( 6,-1,0), heartLife0, spawnRating,obj0);
				
			
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if ( myFlightPath == flightPath.HeartShape )
		{
			var heartLife:float =12;
			var obj:GameObject=GenerateParent(transform.position,heartLife+5);
			
			//iTween.RotateAdd(obj.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*Random.Range(-1,2),"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			//iTween.RotateAdd(obj.gameObject,iTween.Hash("time",3,"z",360*rotateDir,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			
			LaunchStarSpawn(transform.position, Vector3( 8.5,2.5,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 7.5,6.5,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 3,8,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 0,5.6,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( -3,8,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( -7.5,6.5,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( -8.5,2.5,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( -6,-1,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( -3,-3,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 0,-6,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 3,-3,0), heartLife, spawnRating,obj);
		
			LaunchStarSpawn(transform.position, Vector3( 6,-1,0), heartLife, spawnRating,obj);
				
			
			
			RealExplode(0);
			//EmitterExplode(heartLife+5);
			hasLaunchedChain = true;
			
		}
		else if (myFlightPath == flightPath.StarShape)
		{
			var starLife:float =12;
			var starObj:GameObject=GenerateParent(transform.position,starLife+5);
			
			//iTween.RotateAdd(starObj.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*Random.Range(-1,2),"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			//iTween.RotateAdd(obj.gameObject,iTween.Hash("time",3,"z",360*rotateDir,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			
			LaunchStarSpawn(transform.position, Vector3( 0,7.5,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( -2.7,3,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( -7.6,1.7,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( -4,-2,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( -4.3,-6.5,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( -0,-4.7,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( 2.7,3,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( 7.6,1.7,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( 4,-2,0), starLife, spawnRating,starObj);
		
			LaunchStarSpawn(transform.position, Vector3( 4.3,-6.5,0), starLife, spawnRating,starObj);
				
			
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath == flightPath.SmileShape)
		{
			var smileLife:float=12;
			var smileObj:GameObject=GenerateParent(transform.position,smileLife+5);
			//iTween.RotateAdd(smileObj.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*Random.Range(-1,2),"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			LaunchStarSpawn(transform.position, Vector3( -3,4,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( 3,4,0), smileLife, spawnRating,smileObj);
			//LaunchStarSpawn(transform.position, Vector3( -7,0,0), smileLife, spawnRating,smileObj);
			//LaunchStarSpawn(transform.position, Vector3( 7,0,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( -5,-1.5,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( 5,-1.5,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( -3.5,-3,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( 3.5,-3,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( -2,-4,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( 2,-4,0), smileLife, spawnRating,smileObj);
			LaunchStarSpawn(transform.position, Vector3( 0,-4.3,0), smileLife, spawnRating,smileObj);
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath == flightPath.Horizontal)
		{
			var horizontalLife:float=12;
			//var horizontalObj:GameObject=GenerateParent(transform.position,horizontalLife+5);
			
			//var xPos:int=(Mathf.Floor( myTransform.position.x/3)+Mathf.Ceil(myTransform.position.x/3))/2;
			for (var i:int=-3;i<=3;i++)
			{
				LaunchStarSpawn(myTransform.position, Vector3( i*2.8-myTransform.position.x,0,0), horizontalLife, spawnRating,null);
			}
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath == flightPath.Vertical)
		{
			var verticalLife:float=12;
			//var verticalObj:GameObject=GenerateParent(transform.position,verticalLife+5);
			for (var j:int=-3;j<=3;j++)
			{
				LaunchStarSpawn(myTransform.position, Vector3( 0,j*3.2-myTransform.position.y,0), verticalLife, spawnRating,null);
			}
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath==flightPath.Cross)
		{
			var crossLife=12;
			for (var k:int=-3;k<=3;k++)
			{
				LaunchStarSpawn(myTransform.position, Vector3( 0,k*3.2-myTransform.position.y,0), crossLife, spawnRating,null);
				LaunchStarSpawn(myTransform.position, Vector3( k*2.8-myTransform.position.x,0,0), crossLife, spawnRating,null);
			}
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath==flightPath.RotateSpiralShape)
		{
			var spiralLife:float=12;
			var spiralObj:GameObject=GenerateParent(transform.position,spiralLife+5);
			iTween.RotateAdd(spiralObj.gameObject,iTween.Hash("time",Random.Range(12,20),"z",-360,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			//init Deg
			var rotateDeg0:float=-90;
			var addDeg0:float=90;
			var dir1:Vector2=Vector2(-1,0);
			var radius0:float=1;
			while (rotateDeg0<=660)
			{
				dir1.x=radius0*Mathf.Cos(Mathf.Deg2Rad*rotateDeg0 );
				dir1.y=radius0*Mathf.Sin(Mathf.Deg2Rad*rotateDeg0 );
		
				
				LaunchStarSpawn(myTransform.position, Vector3( dir1.x,dir1.y,0), spiralLife, spawnRating,spiralObj);
				
				radius0+=0.4;
				rotateDeg0+=addDeg0;
				addDeg0*=0.9;
			}
			
			RealExplode(0);
			hasLaunchedChain = true;
		
		}
		else if (myFlightPath==flightPath.SpiralShape)
		{
			spiralLife=12;
			spiralObj=GenerateParent(transform.position,spiralLife+5);
			//iTween.RotateAdd(spiralObj.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*Random.Range(-1,2),"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			//init Deg
			rotateDeg0=-90;
			addDeg0=90;
			dir1=Vector2(-1,0);
			radius0=1;
			while (rotateDeg0<=660)
			{
				dir1.x=radius0*Mathf.Cos(Mathf.Deg2Rad*rotateDeg0 );
				dir1.y=radius0*Mathf.Sin(Mathf.Deg2Rad*rotateDeg0 );
		
				
				LaunchStarSpawn(myTransform.position, Vector3( dir1.x,dir1.y,0), spiralLife, spawnRating,spiralObj);
				
				radius0+=0.4;
				rotateDeg0+=addDeg0;
				addDeg0*=0.9;
			}
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if (myFlightPath==flightPath.LoadingCircle)
		{
			var circleLife:float=12;
			var circleObj0:GameObject=GenerateParent(transform.position,circleLife+5);
			var circleObj1:GameObject=GenerateParent(transform.position,circleLife+5);
			var rotateDir:int=-1;
			iTween.RotateAdd(circleObj0.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*rotateDir,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			iTween.RotateAdd(circleObj1.gameObject,iTween.Hash("time",Random.Range(12,20),"z",360*(-rotateDir),"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );
			var dir2:Vector2=Vector2(-1,0);
			for (var circle0=0;circle0<360;circle0+=60)
			{
				dir2.x=4*Mathf.Cos(Mathf.Deg2Rad*circle0 );
				dir2.y=4*Mathf.Sin(Mathf.Deg2Rad*circle0 );
				LaunchStarSpawn(myTransform.position, Vector3( dir2.x,dir2.y,0), circleLife, spawnRating,circleObj0);
			}
			for (var circle1=0;circle1<360;circle1+=40)
			{
				dir2.x=6*Mathf.Cos(Mathf.Deg2Rad*circle1 );
				dir2.y=6*Mathf.Sin(Mathf.Deg2Rad*circle1 );
				LaunchStarSpawn(myTransform.position, Vector3( dir2.x,dir2.y,0), circleLife, spawnRating,circleObj1);
			}
			
			RealExplode(0);
			hasLaunchedChain = true;
		}
		else if ( myFlightPath == flightPath.GlitterRain )
		{
	
			canListenForComboTimer = true;
			if ( hasReceivedExplodeMessage == true || gm.timeToExplode)
			{
				
				GlitterRainExplosion();
			}
			
			
		}
		else if ( myFlightPath == flightPath.Straight && isBird == true )
		{
			RealExplode(0);
		}
		else
		{
			canListenForComboTimer = true;
			
			if (gm.timeToExplode)
			{
				RealExplode(0.5);
				//RealExplode(gm.explodeDelay);
			}
			
			/*
			if ( hasReceivedExplodeMessage == true)
			{
				RealExplode();
			}
			*/
		}
	}
}

function GlitterRainExplosion()
{
	DoFadeAnimation();
	am.PlayGlitterRain();
	if ( multiHitOn == true )
	{
		if ( hitcount >= hitsToKill )
		{
			em.DoNormalExplosion(ExplosionType.Glitter, transform.position );
			
			var excessHits : int = hitcount - hitsToKill;
			
			for ( var t : int = 0; t < excessHits; t++)
			{
				em.DoNormalExplosion(ExplosionType.Glitter, transform.position );
			}
		}
		else
		{
			em.DoNormalExplosion(ExplosionType.Poor, transform.position );
		}
	}
	else
	{
		em.DoNormalExplosion(ExplosionType.Glitter, transform.position );
	}
}

function GenerateParent(_pos:Vector3,_lifeTime:float):GameObject
{
	var obj:GameObject=Instantiate(parentObject,_pos,Quaternion.identity);
	var script:ParentObject=obj.GetComponent(ParentObject);
	script.lifeTime=_lifeTime;
	return obj;
}

function ComboTimerExpired()
{
	if ( canListenForComboTimer == true && hasReceivedExplodeMessage == false)
	{
		hasReceivedExplodeMessage = true;
	}
}

function ProcessMissAnimation()
{
	// This function fades the smoke trails over time so that when the firework is actually
	// destroyed, the smoke tail doesn't POP off the screen.
	
	
	/*
	smoke.particleEmitter.maxEnergy	-= Time.deltaTime * smokeFadeSpeed;
	smoke.particleEmitter.minEnergy -= Time.deltaTime * smokeFadeSpeed;
	
	subTail.particleEmitter.maxEnergy -= Time.deltaTime * smokeFadeSpeed;
	subTail.particleEmitter.minEnergy -= Time.deltaTime * smokeFadeSpeed;
	*/
	
	
	if ( smoke.particleCount <= 0 )
	{
		doDestroy = true;
	}
	
	
}

function ProcessTailLength()
{
	// Reduce length of fuse tail
	tailLength = lifeTime - timeAlive - 0.5+0.25;

	

	if (tailLength<=0)
	{
		tail.ClearParticles();
	}
	
	if (rainBowTrail!=null)
	{
		rainBowTrail.time=tailLength;
	}
	
	if ( tail != null )
	{
		/*
		if ( myFlightPath == flightPath.Builder )
		{
			tailLength = (1.0 - builderLerpValue) * 3.0;	
		}
		*/
		
		var tailModLength : float = 1.0;
		// Special Length Adjustment for CircleFlyOff
		if ( loopDone == true && myFlightPath == flightPath.CircleFlyOff)
		{
			tailModLength = 0.8;
		}
		
		tail.minEnergy = tailLength * 0.33 * tailModLength;
		tail.maxEnergy = tailLength * 0.33 * tailModLength;
	}
}

function CheckForMiss()
{
	// Check if the fireworks lifetime is up or if it has gone off screen...	
	if ( timeAlive > lifeTime  ||
		 transform.position.y > 17.0 ||
		 transform.position.x < -12 ||
		 transform.position.x > 12)
	{
		if ( myFlightPath == flightPath.EmitterRndSlow ||
		     myFlightPath == flightPath.EmitterSpiralFast ||
		     myFlightPath == flightPath.EmitterSpiralMed ||
		     myFlightPath == flightPath.EmitterSpiralSlow ||
		     myFlightPath == flightPath.EmitterRndMed ||
		     myFlightPath == flightPath.EmitterRndFast ||
		     myFlightPath == flightPath.Chaser ||
		     myFlightPath == flightPath.Builder)
		{
			// Basically, if the firework types above have been missed, usually they have a long delay set in the
			// level editor because they take longer for the person to play, because they spawn multiple fireworks.
			// So, if we are not in the tutorial level, we need to tell the level manager to immediately start
			// the next level of fireworks.
			if ( Application.loadedLevelName != "Tutorial" )
			{
				lm.SkipToNextFireWorkLevel();
			}
		}
		
		// If the firework is NOT a bow shape, then it does a MISS because it is out of screen or at end of lifetime.
		if ( myFlightPath != flightPath.Bow	)
		{
			DoMiss();
		}
		else // THIS IS A BOW FIREWORK -> IT DOES NOT do a MISS if it is out of screen, only if end of lifetime.
		{
			if ( timeAlive > lifeTime ) // The bow only misses if it meets its lifetime limit. This will let the bow fly off screen and come back on.
			{
				DoMiss();
			}
		}
	}
}

function DoPulse()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(Time.time);
	pulseTimer += 0.01 * pulseGrow * pulseSpeed * Time.deltaTime;
	
	if ( pulseTimer > (pulseStartScale + pulseMax) )
	{
		pulseGrow *= -1.0;
		pulseTimer = ( pulseStartScale + pulseMax);
	}
	
	if ( pulseTimer < (pulseStartScale - pulseMax) )
	{
		pulseGrow *= -1.0;
		pulseTimer = ( pulseStartScale - pulseMax);
	}
	
	head.transform.localScale = Vector3(1,1,1) * (pulseTimer) * multiHitScaleMultiplier;
}	

function IsWaitingToExplode() : boolean
{
	return ( isWaitingToExplode );
}

function Explode()
{
	lines.enabled=false;
	if ( multiHitOn	)
	{
		if (headAnimation!=null)
		{
			var random:int=Random.Range(0,4);
			headAnimation.Play("RainBowStarHead");
			headAnimation.SetFrame("RainBowStarHead",random);
			headAnimation.Pause();
			
			
		}
		
		hitcount += 1;
		
		mutipleTapCount.SetCount(hitcount);
		
		gm.IncreaseChainCount();
		
		// Animate the head...
		multiHitScaleMultiplier += multiHitIncreaseSizeRate;
		

		am.PlayMultiTap(hitcount);
	
	}
	
	if ( isWaitingToExplode == false )
	{
		if ( !multiHitOn	)
		{
			//Destroy(this.GetComponent(SphereCollider));
			//gameObject.layer = 2;
		}
		Destroy(audioSource);
		
		tail.emit=false;
		
		
		
		//if ( Wizards.Utils.DEBUG ) Debug.Log(timeLeft);
		
		ReportRank();
		isWaitingToExplode = true;
	}
	
	if ( tutorialMode )
	{
		RemoveTutorialMessage(0.0);
	}	
	
	
}


function ReportRank()
{
	timeLeft= lifeTime - timeAlive;
	if ( myFlightPath == flightPath.RingBodySpawn || myFlightPath == flightPath.StarSpawn || useParentRanking)
		{
			if ( spawnRating == HitRanking.Perfect )
			{
				mm.ShowMessage(FwMessageType.Perfect, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Perfect, myFlightPath, myTransform.position);
				finalRating = 0;
				spawnRating = HitRanking.Perfect;
			}
			else if ( spawnRating == HitRanking.Good)
			{
				mm.ShowMessage(FwMessageType.Good, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Good, myFlightPath, myTransform.position);
				finalRating = 1;
				spawnRating = HitRanking.Good;
			}
			else
			{
				mm.ShowMessage(FwMessageType.Poor, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Poor, myFlightPath, myTransform.position);
				spawnRating = HitRanking.Poor;
				finalRating = 2;
				DoFadeAnimation();
			}
			
		}
		else
		{
			var perfectTime : float = 0.5; // seconds
			
			if ( timeLeft < perfectTime )
			{
				mm.ShowMessage(FwMessageType.Perfect, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Perfect, myFlightPath, myTransform.position);
				finalRating = 0;
				spawnRating = HitRanking.Perfect;
				
				
				/*
				if ( enableTapFeedBack )
				{
					Instantiate(tapPerfect, myTransform.position, Quaternion.identity);
				}
				*/
			}
			else if ( timeLeft >= 0.5 && timeLeft < (perfectTime + (lifeTime - perfectTime)*0.15 )  )
			{
				mm.ShowMessage(FwMessageType.Good, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Good, myFlightPath, myTransform.position);
				finalRating = 1;
				spawnRating = HitRanking.Good;
				/*
				if ( enableTapFeedBack )
				{
					Instantiate(tapGood, myTransform.position, Quaternion.identity);
				}
				*/
			}
			else
			{
				mm.ShowMessage(FwMessageType.Poor, myTransform.position , gm.GetChainCount());
				gm.ReportHit(HitRanking.Poor, myFlightPath, myTransform.position);
				spawnRating = HitRanking.Poor;
				finalRating = 2;
				RealExplode(0);
				DoFadeAnimation();
				/*
				if ( enableTapFeedBack )
				{
					Instantiate(tapPoor, myTransform.position, Quaternion.identity);
				}
				*/
			}
		}
}



function ExplodeNoDelay()
{	
	if ((spawnTravelTimer < spawnTravelDuration) && (myFlightPath==flightPath.RingBodySpawn || myFlightPath==flightPath.StarSpawn) )
	{
		return;
	}
	
	if (timeAlive<0.4*lifeTime && (myFlightPath==flightPath.Chaser || myFlightPath==flightPath.ChainStraight ||  myFlightPath==flightPath.Builder ||  isBird) )
	{
		return;
	}
	
	
	if (doMissAnimation)
	{
		return;
	}
	
	
	if (!multiHitOn && (myFlightPath==flightPath.Straight || myFlightPath==flightPath.Bow || myFlightPath==flightPath.RingBodySpawn || myFlightPath==flightPath.StarSpawn || myFlightPath==flightPath.CircleFlyOff || myFlightPath==flightPath.Roller || myFlightPath==flightPath.Snake ||myFlightPath==flightPath.GlitterRain))
	{
		
		if (myFlightPath==flightPath.GlitterRain)
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("");
			GlitterRainExplosion();
			return;
		}
	
		
		if (!isWaitingToExplode)
		{
			ReportRank();
		}
		

		ShowExplosion(finalRating);
		
			
		
		doMissAnimation = true;//prevent the RealExplode called again!
		DoFadeAnimation();
		if ( tutorialMode )
		{
			RemoveTutorialMessage(0.0);
		}	
	}
	else 
	{
		/*
		if (myFlightPath==flightPath.GlitterRain)
		{
			isWaitingToExplode=true;
		}
		*/
		
		Explode();
	}

}

function ExplodePefect()
{
	if (doMissAnimation)
	{
		return;
	}
	var randomDelay:float=Random.Range(0.1,0.5);
	doMissAnimation = true;//prevent the RealExplode called again!
	yield WaitForSeconds(randomDelay);
	DoFadeAnimation();
	
	//audioSource.volume=0;
	
	gm.ReportHit(HitRanking.Perfect, myFlightPath, myTransform.position);
	
	em.DoNormalExplosion(ExplosionType.Perfect, myTransform.position ,visual);
}

function RemoveTutorialMessage(_delay : float)
{
	yield WaitForSeconds(_delay);
	if ( tutMessage != null )
	{
		Destroy(tutMessage.gameObject);
		tutMessage = null;
	}
}

function RealExplode(_delay:float)
{
	//print ( finalRating);
	
	
	
	if (doMissAnimation)
	{
		return;
	}
	if ( !multiHitOn)
	{
		//var randomDelay:float=Random.Range(0.0,0.5);
		var randomDelay:float=Random.Range(0.0,_delay);
		doMissAnimation = true;//prevent the RealExplode called again!
		
		if ( tutorialMode )
		{
			RemoveTutorialMessage(randomDelay);
		}
		
		yield WaitForSeconds(randomDelay);
		
		DoFadeAnimation();
		
		ShowExplosion(finalRating);
	}
	else if (multiHitOn) 
	{
		DoFadeAnimation();
		if (hitcount >= hitsToKill)
		{
			em.DoCircleExplosion(myTransform.position,hitcount/2);
		}
		else
		{
			am.PlayAudio(SoundEffect.Poor);			
			em.DoNormalExplosion(ExplosionType.Poor, myTransform.position );
		}
		
		if ( tutorialMode )
		{
			RemoveTutorialMessage(0.0);
		}		
	}
	
	
}

function ShowExplosion(_finalRating: int)
{
	switch ( _finalRating )
	{
		case 0:
			if ( ab.GetApprovalPercentage() > 0.9 && Random.value < em.chanceOfSFW )
			{
				em.DoNormalExplosion(ExplosionType.Special, myTransform.position ,visual);
			}
			else
			{
				em.DoNormalExplosion(ExplosionType.Perfect, myTransform.position ,visual);
			}
			break;
		case 1:
			em.DoNormalExplosion(ExplosionType.Good, myTransform.position ,visual);
			break;
		case 2:
			em.DoNormalExplosion(ExplosionType.Poor, myTransform.position ,visual);
			break;
	}
}


function GetParticleCount() : int
{
	var Emitters = gameObject.GetComponentsInChildren(ParticleEmitter);
	
	var count : int = 0;
	
	for ( var emitter in Emitters )
	{
		count += emitter.GetComponent.<ParticleEmitter>().particleCount;
	}
	
	return ( count );
}

function ProcessPath()
{
	// Debug.Log(timeAlive);
	// currentVelocity used to update angle of head object to face in the direction it
	// is moving. This variable is accessed from another script.
	currentVelocity = myTransform.position - prevPosition;
	prevPosition = myTransform.position;
	
	switch ( myFlightPath )
	{
		case flightPath.Straight:
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.Bow:

			myTransform.position.x = startPos.x + (velocity.x * timeAlive);
			myTransform.position.y = startPos.y + velocity.y * timeAlive - ( 0.5 * gravity * timeAlive * timeAlive );
		break;
		
		case flightPath.Roller:
			ProcessPathRoller();
		break;
		
		case flightPath.CircleFlyOff:
			ProcessPathCircleFlyOff();
		break;
		
		case flightPath.ChainStraight:
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.Chaser:
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.Spawner:
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.EmitterRndSlow:
		case flightPath.EmitterSpiralFast:
		case flightPath.EmitterSpiralSlow:
		case flightPath.EmitterSpiralMed:
		case flightPath.EmitterRndMed:
		case flightPath.EmitterRndFast:	
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.Snake:
			myTransform.position.y = startPos.y + (velocity.y * timeAlive);
			myTransform.position.x = startPos.x + (velocity.x * timeAlive) + (loopRadius * Mathf.Sin(loopDirection * loopDelta * timeAlive));
		break;
		
		case flightPath.Builder:
			myTransform.position = startPos + (velocity * timeAlive);
			//ProcessPathBuilder();
		break;
		
		case flightPath.RingBodySplitter:
		case flightPath.HeartShape:
		case flightPath.RotateHeartShape:
		case flightPath.StarShape:
		case flightPath.SmileShape:
		case flightPath.Horizontal:
		case flightPath.Vertical:	
		case flightPath.SpiralShape:
		case flightPath.LoadingCircle:
		case flightPath.Cross:
		case flightPath.RotateSpiralShape:
			myTransform.position = startPos + (velocity * timeAlive);
		break;
		
		case flightPath.GlitterRain:
			myTransform.position = startPos + (velocity * timeAlive);
			
		break;
		
		case flightPath.RingBodySpawn:
			spawnTravelTimer += Time.deltaTime;
			
			if ( spawnTravelTimer < spawnTravelDuration	)
			{
				myTransform.position = startPos + (velocity * timeAlive);	
			}
		break;
		case flightPath.StarSpawn:
			spawnTravelTimer += Time.deltaTime;
			//spawnTravelTimer += Time.deltaTime;
			//if ( spawnTravelTimer < spawnTravelDuration	)
			//{
			//	myTransform.position += (endPos- myTransform.position) *Time.deltaTime*5;
			//}
			
		break;
	}
	
}


function ProcessPathRoller()
{
	
	var loopAngle : float = (loopDirection * loopDelta);
	/*		
	var angleInDeg : float = loopAngle * Mathf.Rad2Deg;
	
	angleInDeg = (angleInDeg % 360) * loopDirection;			
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("AngleinDeg = " + angleInDeg + ":@ " + Time.time);
	
	var loopAngleCos : float = Mathf.Cos(loopAngle);
	var loopAngleSin : float = Mathf.Sin(loopAngle);
	
	if ( angleInDeg > loopPauseAngle && angleInDeg < loopUnPauseAngle )
	{
		// DoNothing
	}
	else
	{
		fakeTime = timeAlive;
	}
	*/
	loopRotation += loopDelta * Time.deltaTime * loopDirection;
	
	myTransform.position.x = startPos.x + (velocity.x * timeAlive) + Mathf.Sin(loopRadius * loopAngle * loopRotation);
	myTransform.position.y = startPos.y + (velocity.y * timeAlive) + Mathf.Cos(loopRadius * loopAngle * loopRotation);		
}

function ProcessPathCircleFlyOff()
{
	var loopDuration : float = ((2.0 * Mathf.PI / loopDelta) * 0.5) + oneLoopTimeStart; // 0.5 = 1 loop, 1.0 = 2 loops
	//print(loopDuration);
	if ( timeAlive > loopDuration )
	{
		loopDone = true;
	}
	
	var loopLimit : float = lifeTime * 0.5;
	//var loopLimit : float = 1.01 + (lifeTime * 0.5);
	if ( circleFlyOffDegreesCompleted >= loopLimit || circleFlyOffDegreesCompleted <= -loopLimit )
	{
		loopDone = true;
	}
	
	if ( (timeAlive < oneLoopTimeStart && loopDone == false) || loopDone == true ) // if we are not looping...
	{
		if ( saveTimeAlive == true ) // if the loop has already been completed.
		{
			//timeAlive = tAlive + (0.5 * (1 / velocity.y)) ;
			timeAlive = tAlive + ( velocity.y * 0.0075);
			saveTimeAlive = false;
		}
		
		if ( loopDone == false )
		{
			myTransform.position = startPos + (velocity * timeAlive);
		}
		else
		{
			//velocity *= 1.01;
			timeAlive *= 1.005; // Makes the firework speed up after it has completed its loop.
			myTransform.position = startPos + (velocity * timeAlive);
		}
	}
	else
	{
		timeAlive -= Time.deltaTime; // Stop the life time from increasing...
		
		if( saveTimeAlive == false )
		{
			tAlive = timeAlive;
			saveTimeAlive = true;
			
			if ( velocity.y > 0 )
			{
				negVelocityModifier = 1.0;
				if ( loopDirection < 0 )
				{
					loopRotation = 180.0;
				}
				else
				{
					loopRotation = 0.0;
				}
			}
			else
			{
				negVelocityModifier = -1.0;
				if ( loopDirection < 0 )
				{
					loopRotation = 180.0;
				}
				else
				{
					loopRotation = 0.0;
				}
			}
		}
		
		var addAngleAmount : float = loopDelta * Time.deltaTime * 0.33 * loopDirection * negVelocityModifier;
		loopRotation += addAngleAmount;
		//if ( Wizards.Utils.DEBUG ) Debug.Log("rotationAmount:" + (loopDirection * loopDelta * loopRotation));
	
		circleFlyOffDegreesCompleted += addAngleAmount; // keep track of how far we have rotated
		
		myTransform.position.x = startPos.x + (velocity.x * tAlive) - (loopRadius * loopDirection) + (loopRadius * loopDirection * Mathf.Cos(loopDirection * loopDelta * loopRotation));
		myTransform.position.y = startPos.y + (velocity.y * tAlive) + (loopRadius * Mathf.Sin(loopDirection * loopDelta * loopRotation));
	}
}

/*
function ProcessPathBuilder()
{
	builderLerpValue += builderSpeed * Time.deltaTime;
	
	if ( builderLerpValue > 1.5 )
	{
		DoMiss();
	}
	
	myTransform.position = Vector3.Lerp(builderPath[currentPathPoint], builderPath[currentPathPoint+1], builderLerpValue);
}
*/

function SetBuilderPath(_path : Vector3[])
{
	builderPath = _path;
}

function SetBuilderPathPosition(_position : int)
{
	currentPathPoint = _position;
}

function DoMiss()
{
	// Show miss graphic
	am.PlayAudio(SoundEffect.Miss);
	
	mm.ShowMessage(FwMessageType.Miss, myTransform.position, 0);
	gm.ReportMiss();
	//this.gameObject.SetActiveRecursively(false);
	DoFadeAnimation();
	
	if ( tutorialMode )
	{
		RemoveTutorialMessage(0.0);
	}		
	
	// Deduct Audience Bar
	
	
}

function DoFadeAnimation()
{
	smoke.emit=false;
	subTail.emit=false;
	
	doMissAnimation = true;
	gameObject.layer = 2;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("CALLING FADE ANIMATION -> THIS TURNS OFF HIT DETECTION FOR FW, are you sure you want this?");
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FADE-> THIS FW is : " + gameObject.name);
	
	//Destroy(head);
	//Destroy(tail);
	//Destroy(flare);
	head.gameObject.SetActiveRecursively(false);
	tail.gameObject.SetActiveRecursively(false);
	flare.gameObject.SetActiveRecursively(false);
	
}

function PixelToWorld(_x : int, _y : int) : Vector3
{
	var pos : Vector3 = scaledRect.Position(_x, _y);
	pos.z = 10;
	return ( Camera.main.ScreenToWorldPoint(pos) );
}

function LaunchEmitter(_startPosition : Vector3, _endPosition : Vector3, _lifeSpan : float)
{
	var aFirework : GameObject = ff.GetFirework(flightPath.Straight, GetVisualEffect(visual), _startPosition, _endPosition, _lifeSpan);
	
	// function GetFirework(_flightPath : flightPath, _visual : VisualEffect, _startPosition : Vector3, _endPosition : Vector3, _lifeSpan : float)
	//aFirework = Instantiate(bird, _position, Quaternion.identity);
	//aFirework.name = "fw_straight";

	var script : fw_main = aFirework.GetComponent(fw_main);
	script.isBird = true;
	script.audioSource.Stop();
	script.audioSource.clip=am.fireworkLaunch[1];
	script.audioSource.Play();
}

function LaunchBird(_startPosition : Vector3, _endPosition : Vector3, _lifeSpan : float, _rank : HitRanking)
{
	var aFirework : GameObject = ff.GetFirework(flightPath.Straight, VisualEffect.Phoenix, _startPosition, _endPosition, _lifeSpan);
	
	var script : fw_main = aFirework.GetComponent(fw_main);
	script.isBird = true;
	script.useParentRanking = true;
	script.spawnRating = _rank;
}

function GetRandomColor():VisualEffect
{
	var randomColor:int=Random.Range(0,5);
	if (randomColor==0)
	{
		return VisualEffect.Star;
	}
	else if (randomColor==1)
	{
		return VisualEffect.RedStar;
	}
	else if (randomColor==2)
	{
		return VisualEffect.GreenStar;
	}
	else if (randomColor==3)
	{
		return VisualEffect.PurpleStar;
	}
	else if (randomColor==4)
	{
		return VisualEffect.OrangeStar;
	}
	else
	{
		return VisualEffect.Star;
	}
}


function LaunchStarSpawn(_position : Vector3, _targetPosition : Vector3, _lifeTime : float, _rank : HitRanking,_parent:GameObject)
{
	
	//var aFirework:GameObject = ff.GetFirework(flightPath.Straight,GetVisualEffect(visual), _position, _position+_targetPosition, 5);
	var aFirework:GameObject = ff.GetFirework(flightPath.StarSpawn,GetVisualEffect(visual), _position, _position+_targetPosition, _lifeTime);
	if (_parent!=null)
	{
		aFirework.transform.parent=_parent.transform;
	}
	var script : fw_main = aFirework.GetComponent(fw_main);
	
	script.spawnRating = _rank;
	script.audioSource.Stop();
	script.audioSource.clip=am.fireworkLaunch[8];
	script.audioSource.volume=0.1*am.fwVol;
	script.audioSource.Play();
	
	iTween.MoveTo(aFirework.gameObject,iTween.Hash("x",_position.x+_targetPosition.x,"y",_position.y+_targetPosition.y,"z",_position.z,"time",spawnTravelDuration,"easeType",iTween.EaseType.easeInQuad));
	//iTween.MoveTo(aFirework.gameObject,iTween.Hash("islocal",true,"x",_targetPosition.x,"y",_targetPosition.y,"z",0,"time",spawnTravelDuration));
	//iTween.MoveTo(aFirework.gameObject,Vector3(_position.x+_targetPosition.x,_position.y+_targetPosition.y,_position.z),spawnTravelDuration);
	var delay:float=Random.Range(_lifeTime-2,_lifeTime-1);
	var dropRandom:float=Random.Range(0.8,1.0);
	//iTween.MoveTo(aFirework.gameObject,iTween.Hash("islocal",true,"y",-30,"z",0,"time",dropRandom,"delay",delay,"easeType",iTween.EaseType.easeInQuad,"oncompletetarget",aFirework.gameObject,"oncomplete","DoMiss"));
	iTween.MoveTo(aFirework.gameObject,iTween.Hash("islocal",true,"y",-30,"z",0,"time",dropRandom,"delay",delay,"easeType",iTween.EaseType.easeInQuad));
	
}

function LaunchRingSpawn(_position : Vector3, _velocity : Vector3, _lifeTime : float, _rank : HitRanking)
{
	var aFirework:GameObject;
	
	aFirework = ff.GetFirework(flightPath.RingBodySpawn, GetVisualEffect(visual), _position, _position, _lifeTime);

	var script : fw_main = aFirework.GetComponent(fw_main);
	
	script.velocity = _velocity;
	script.spawnRating = _rank;
	script.audioSource.Stop();
	script.audioSource.clip=am.fireworkLaunch[8];
	script.audioSource.volume=0.1*am.fwVol;
	script.audioSource.Play();
	
}
//TODO: Link To DebugManager
function LaunchChain(_position : Vector3, _velocity : Vector3, _repeat : int)
{
	var aFirework : GameObject = ff.GetFirework(flightPath.ChainStraight, GetVisualEffect(visual), _position, _position + velocity, lifeTime);
	var script : fw_main = aFirework.GetComponent(fw_main);
		
	script.actualEndPos = actualEndPos;
	
	script.SetRepeat(_repeat);
	
}

function LaunchChaser(_startPos : Vector3, _endPos : Vector3, _repeat : int)
{
	//aFirework = aFirework = ff.GetFirework(flightPath.Chaser, VisualEffect.Normal, _position);
	
	//_velocity *= Random.Range(1.1, 1.5);
	lifeTime *= Random.Range(0.85, 0.85);
	
	if ( lifeTime < 1.0 )
	{
		lifeTime = 1.0;
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log("LifeTime: " + lifeTime);
	
	var aFirework : GameObject = ff.GetFirework(flightPath.Chaser, GetVisualEffect(visual), _startPos, _endPos, lifeTime);
	var script : fw_main = aFirework.GetComponent(fw_main);

	script.SetRepeat(_repeat);
}

function LaunchBuilder(_startPos : Vector3, _endPos : Vector3, _repeat : int)
{
	//aFirework = aFirework = ff.GetFirework(flightPath.Chaser, VisualEffect.Normal, _position);
	
	//_velocity *= Random.Range(1.1, 1.5);
	lifeTime *= Random.Range(0.85, 0.85);
	
	if ( lifeTime < 1.0 )
	{
		lifeTime = 1.0;
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log("LifeTime: " + lifeTime);
	
	var aFirework : GameObject = ff.GetFirework(flightPath.Builder, GetVisualEffect(visual), _startPos, _endPos, lifeTime);
	var script : fw_main = aFirework.GetComponent(fw_main);

	script.SetRepeat(_repeat);
}

function GetVisualEffect(_visual : VisualEffect) : VisualEffect
{
	if ( isRandomColor == true )
	{
		return ( VisualEffect.RandomColor );
	}
	else
	{
		return (_visual);
	}
	
}


