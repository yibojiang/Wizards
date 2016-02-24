var fw_blue_star : GameObject;
var fw_green_star : GameObject;
var fw_orange_star : GameObject;
var fw_red_star : GameObject;
var fw_purple_star : GameObject;


var fw_skull : GameObject;
var fw_torus : GameObject;
var fw_butterfly : GameObject;
var fw_phoenix : GameObject;
var fw_multistar : GameObject;



var blueStarPool : GameObject[];
var greenStarPool : GameObject[];
var orangeStarPool : GameObject[];
var redStarPool : GameObject[];
var purpleStarPool : GameObject[];


var skullPool : GameObject[];
var torusPool : GameObject[];
var phoenixPool : GameObject[];
var butterflyPool: GameObject[];
var multistarPool : GameObject[];

var numFireworks : int = 5;

var fireworkCount : int = 0;

var testCounter : int = 0;

var fwPrefab:GameObject[];


var Zpos:float;

var tutorialMode : boolean = false;
var numLaunchesToShowTutorial : int = 0;

enum VisualEffect
{
	Star,
	Torus,
	Skull,
	Phoenix,
	ButterFly,
	MultiStar,
	GreenStar,
	OrangeStar,
	PurpleStar,
	RedStar,
	Bomb,
	RandomColor,
	
}


function Awake()
{
	

}
function Start()
{
	//InitFireworks();
	Zpos=31;
}

function InitFireworks()
{
	blueStarPool=InitPool( fw_blue_star, numFireworks);
	greenStarPool=InitPool( fw_green_star, numFireworks);
	orangeStarPool=InitPool( fw_orange_star, numFireworks);
	redStarPool=InitPool( fw_red_star, numFireworks);
	purpleStarPool=InitPool( fw_purple_star, numFireworks);
	
	skullPool=InitPool( fw_skull, numFireworks);
	torusPool=InitPool( fw_torus, numFireworks);
	phoenixPool=InitPool(fw_phoenix, numFireworks);
	butterflyPool=InitPool(fw_butterfly, numFireworks);
	multistarPool=InitPool(fw_multistar, numFireworks);
}

function InitPool( _fwObject : GameObject, _numFireWorks : int):GameObject[]
{
	var fireWork : GameObject;
	
	var pool:GameObject[];
	pool = new GameObject[_numFireWorks];
		
	for ( var i : int = 0; i < _numFireWorks ; i += 1 )
	{
		fireWork = Instantiate(_fwObject, transform.position, Quaternion.identity);
		
		fireWork.SetActiveRecursively(false);
				
		pool[i] = fireWork;
	}
	return pool;
}

function GetFromNew(_visual : VisualEffect) : GameObject
{
	var fw:GameObject;
	fw=Instantiate(fwPrefab[_visual],Vector3(0,0,0),Quaternion.identity);
	return fw;
}


function GetFromPool(_visual : VisualEffect) : GameObject
{
	var fwPool : GameObject[];
	
	//_visual = testCounter;
	//testCounter += 1;
	
	switch ( _visual )
	{
		case VisualEffect.Star:
			fwPool = blueStarPool;
			break;
		
		case VisualEffect.Skull:
			fwPool = skullPool;
			break;
		
		case VisualEffect.ButterFly:
			fwPool = butterflyPool;
			break;
		
		case VisualEffect.Torus:
			fwPool = torusPool;
			break;
		
		case VisualEffect.Phoenix:
			fwPool = phoenixPool;
			break;
			
		case VisualEffect.MultiStar:	
			fwPool = multistarPool;
			break;
		
		case VisualEffect.GreenStar:
			fwPool = greenStarPool;
			break;
		case VisualEffect.OrangeStar:
			fwPool = orangeStarPool;
			break;
		case VisualEffect.PurpleStar:
			fwPool = purpleStarPool;
			break;
		case VisualEffect.RedStar:
			fwPool = redStarPool;
			break;
		
	
	}
	
	if ( testCounter == 5 )
	{
		testCounter = 0;
	}
		
	
	
	for ( fw in fwPool )
	{
		if ( fw.active == false )
		{
			var script:fw_main= fw.GetComponent(fw_main);
			script.visual=_visual;
			return ( fw );
			
		}
	}
	// TODO - Increase Pool size.
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Ran out of fireworks - returning default");
	return ( fwPool[0] );
	
	//return ( null );
}


function GetFirework(_flightPath : flightPath, _visual : VisualEffect, _startPosition : Vector3, _endPosition : Vector3, _lifeSpan : float,_delay:float)
{
	yield WaitForSeconds(_delay);
	GetFirework(_flightPath,_visual,_startPosition,_endPosition,_lifeSpan);
	
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

function GetFirework(_flightPath : flightPath, _visual : VisualEffect, _startPosition : Vector3, _endPosition : Vector3, _lifeSpan : float) : GameObject
{
	//var fireWork = Instantiate(fw_normal, _startPosition, Quaternion.identity);
	var fireWork : GameObject;
	if ( _visual == VisualEffect.RandomColor )
	{
		//fireWork = GetFromPool(  GetRandomColor());
		fireWork = GetFromNew(  GetRandomColor());
		
	}
	else 
	{
		//fireWork= GetFromPool(  _visual);
		fireWork= GetFromNew(  _visual);
	}
	
	if ( fireWork != null )
	{
		var script : fw_main = fireWork.GetComponent("fw_main") as fw_main;
		_startPosition.z =Zpos;
		
		fireWork.transform.position = _startPosition;
		
		if ( _visual == VisualEffect.RandomColor )
		{
			script.isRandomColor = true;
		}
		
		script.startPos = _startPosition;
		script.endPos = _endPosition;
		
		script.actualEndPos = _endPosition;
		script.prevPosition = _startPosition;
		
		var velocity : Vector3 = _endPosition - _startPosition;
		velocity.Normalize();
		velocity *= (Vector3.Distance(_startPosition, _endPosition) / _lifeSpan);		
		script.SetLifeTime(_lifeSpan);
		
		fireworkCount++;
		
		script.SetVelocity(velocity.x, velocity.y);
		script.SetType(_flightPath);
		
		if ( tutorialMode )
		{
			script.ActivateTutorialMode();
			
			numLaunchesToShowTutorial -= 1;
			
			if ( numLaunchesToShowTutorial <= 0 )
			{
				DeactivateTutorial();
			}
		}
		
		return ( fireWork );
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("No Fireworks left");
	}
	
	return ( null );
}

function SetFireworkZpos(_Zpos:float)
{
	Zpos=_Zpos;
}

function ActivateTutorial(_numLaunches : int)
{
	if ( _numLaunches > 0 )
	{
		if ( tutorialMode == true ) // If we are already running in tutorial mode...
		{
			if ( numLaunchesToShowTutorial < _numLaunches ) // top up number of launches if less than requested.
			{
				numLaunchesToShowTutorial = _numLaunches;
			}
		}
		else
		{
			tutorialMode = true;
			numLaunchesToShowTutorial = _numLaunches;
		}
	}
}

function DeactivateTutorial()
{
	tutorialMode = false;
	numLaunchesToShowTutorial = 0;
}