var startTarget:Transform;
var stopTarget:Transform;
var credits:Transform;


var speed:float;
var tempSpeed:float;
var touched:boolean;
var touchPos:Vector3;
var ray:Ray;
var hit : RaycastHit;

var movePos:Vector3;
var dir:float;

function Awake()
{
	credits.position.y=startTarget.position.y;
	credits.gameObject.SetActiveRecursively(false);
	
	tempSpeed=speed;
	speed=0;
}

function StartScrolling()
{
	credits.position.y=startTarget.position.y;
	credits.gameObject.SetActiveRecursively(true);
	
	speed=tempSpeed;
}



function ProcessInput()
{
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonUp(0) )
	{
		if (touched)
		{
			touched=false;
			speed=tempSpeed;
		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		touched=true;
		touchPos=Input.mousePosition;
		ray = Camera.main.ScreenPointToRay(touchPos);
	}
	else 
	{
		if (touched)
		{
			speed=0;
			movePos= Input.mousePosition;
			
			dir=(movePos.y-touchPos.y)*10;

			var scrollSpeed:float=dir;
			scrollSpeed=Mathf.Clamp(scrollSpeed,-tempSpeed*15,tempSpeed*15);
			
			credits.position.y+=scrollSpeed*Time.smoothDeltaTime;
			
			touchPos= Input.mousePosition;
			
			
			
		}
		
	}
	
	#endif
	
	if ( Input.touchCount > 0 )
	{
		
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			speed=0;				
		}
		
		if ( touch.phase == TouchPhase.Stationary )
		{
			speed=0;
		}
		if ( touch.phase == TouchPhase.Moved )
		{
			if (touch.deltaTime>0)
			{
				var scrollSpeed1:float=touch.deltaPosition.y*10/touch.deltaTime;
				scrollSpeed1=Mathf.Clamp(scrollSpeed1,-tempSpeed*15,tempSpeed*15);
				credits.position.y+=scrollSpeed1*Time.smoothDeltaTime;
			}
			//myTransform.position.y+=scrollSpeed*Time.deltaTime;
		}
		
		if ( touch.phase == TouchPhase.Ended )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("release");
			speed=tempSpeed;
		}
	}
}

function Hide()
{
	credits.position.y=startTarget.position.y;
	credits.gameObject.SetActiveRecursively(false);
}

function Update () 
{
	if (credits.position.y<stopTarget.position.y)
	{
		credits.position.y+=speed*Time.deltaTime;
		ProcessInput();
	}
}