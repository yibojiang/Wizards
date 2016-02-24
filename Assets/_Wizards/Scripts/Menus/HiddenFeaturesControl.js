var leavesOne : ParticleEmitter;
var leavesTwo : ParticleEmitter;
var storm : ParticleEmitter;

var originalEmissionRate : float;
var increaseEmissionFactor : float = 20.0;

var doIncreaseLeaves : boolean = false;
var increaseLeavesTimer : float = 0.0;
var increaseLeavesDuration : float = 1.0;

var accelValues : float[];
var numValues : int = 5;
var index : int = 0;

var avgMagnitude : float = 0.0;
var minThreshold : float = 2.0;

var castles : GameObject[];
var castleToMove : GameObject;
var castleZPos : float = 0.0;

var moveSpeed : float = 10.0;

var canMoveCastle : boolean = false;

var achievementManager:AchievementManagerMainMenu;

function Awake()
{
	accelValues = new float[numValues];
}

function Start()
{
	originalEmissionRate = leavesOne.minEmission;
}

function Update ()
{
	if ( ActivateStorm() == true )
	{
		if (storm.minEmission < 50 )
		{
			storm.minEmission += Time.deltaTime * 10;
			storm.maxEmission += Time.deltaTime * 10;
		}
	}
	else
	{
		if ( storm.minEmission > 0 )
		{
			storm.minEmission -= Time.deltaTime * 10;
			storm.maxEmission -= Time.deltaTime * 10;
		}
		else
		{
			storm.minEmission = 0;
			storm.maxEmission = 0;
		}
	}
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log(storm.particles.Length);
	if (achievementManager!=null)
	{
		
		if (achievementManager.achievementArray[Achievement.Shake_the_Tree]==0)
		{
			if (storm.particleCount>=100)
			{
				achievementManager.UnlockAchievement(Achievement.Shake_the_Tree);
			}
		}
		
	}
	/*
	if ( AverageAcceleration() > minThreshold )
	{
		doIncreaseLeaves = true;
	}
	else
	{
		doIncreaseLeaves = false;
	}
	
	if ( doIncreaseLeaves == true )
	{
		leavesOne.minEmission = originalEmissionRate * increaseEmissionFactor * avgMagnitude;
		leavesOne.maxEmission = originalEmissionRate * increaseEmissionFactor * avgMagnitude;
		leavesTwo.minEmission = originalEmissionRate * increaseEmissionFactor * avgMagnitude;
		leavesTwo.maxEmission = originalEmissionRate * increaseEmissionFactor * avgMagnitude;
	}
	else
	{
		leavesOne.minEmission = originalEmissionRate;
		leavesOne.maxEmission = originalEmissionRate;
		leavesTwo.minEmission = originalEmissionRate;
		leavesTwo.maxEmission = originalEmissionRate;
	}
	*/
	//ProcessFloatingCastles();
}

function ProcessFloatingCastles()
{
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			var ray : Ray;
			var hit : RaycastHit;
			
			ray = Camera.main.ScreenPointToRay(touch.position);
			
			if ( Physics.Raycast(ray, hit, 1000) == true )
			{
				if ( hit.transform.tag == "FloatingCastle" )
				{
					canMoveCastle = true;
					castleToMove = hit.transform.gameObject;
					castleZPos = castleToMove.transform.position.z;
					
					var castleScript : FloatingCastle = castleToMove.GetComponent(FloatingCastle) as FloatingCastle;
					castleScript.CancelMove();
				}
			}
		}
		
		if ( touch.phase == TouchPhase.Moved && canMoveCastle == true )
		{
			if ( castleToMove != null )
			{
				var screenPos : Vector3 = touch.position;
				screenPos.z = Mathf.Abs(castleToMove.transform.position.z - Camera.main.transform.position.z);
				//if ( Wizards.Utils.DEBUG ) Debug.Log("ScreenPos: " + screenPos);
				//if ( Wizards.Utils.DEBUG ) Debug.Log("ZPos: " + castleZPos + "@" + Time.time);
				var worldPos : Vector3 = Camera.main.ScreenToWorldPoint(screenPos);
				//if ( Wizards.Utils.DEBUG ) Debug.Log("WorldPos : " + worldPos);
				
				
				var moveDirection : Vector3 = worldPos - castleToMove.transform.position;
				
				moveDirection.Normalize();
				
				castleToMove.transform.position += moveDirection * Time.deltaTime * moveSpeed;
				
				//castleToMove.transform.position = worldPos;
				castleToMove.transform.position.z = castleZPos;
				
				castleScript = castleToMove.GetComponent(FloatingCastle) as FloatingCastle;
				
				if ( castleToMove.transform.localPosition.x < castleScript.topLeftLimit.x )
				{
					castleToMove.transform.localPosition.x = castleScript.topLeftLimit.x;
				}
				
				if ( castleToMove.transform.localPosition.x > castleScript.lowerRightLimit.x )
				{
					castleToMove.transform.localPosition.x = castleScript.lowerRightLimit.x;
				}
				
				if ( castleToMove.transform.localPosition.y > castleScript.topLeftLimit.y )
				{
					castleToMove.transform.localPosition.y = castleScript.topLeftLimit.y;
				}
				
				if ( castleToMove.transform.localPosition.y < castleScript.lowerRightLimit.y )
				{
					castleToMove.transform.localPosition.y = castleScript.lowerRightLimit.y;
				}
			}
		}
		
		if ( touch.phase == TouchPhase.Ended && canMoveCastle == true)
		{
			castleScript = castleToMove.GetComponent(FloatingCastle) as FloatingCastle;
			castleScript.StartMove();
			canMoveCastle = false;
			castleToMove = null;
		}
	}
	/*
	else
	{
		canMoveCastle = false;
		castleToMove = null;
	}
	*/
}

function AverageAcceleration() : float
{
	accelValues[index] = Input.acceleration.magnitude;
	++index;
	
	if ( index >= numValues )
	{
		index = 0;
	}
	
	var sum : float = 0.0;
	
	for ( var i : int = 0; i < numValues; ++i )
	{
		sum += accelValues[i];
	}
	
	avgMagnitude = sum / numValues;
	
	return ( avgMagnitude );	
}

function ActivateStorm() : boolean
{
	if ( AverageAcceleration() > minThreshold )
	{
		
		return ( true );
	}
	else
	{
		return ( false );
	}
}
