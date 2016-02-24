var menuControl : MenuTiltController;

private var blinkTimer : float = 0.0;

var blinkDuration : float = 0.5;

var blinkEnabled : boolean = false;

var touchStartTime : float = 0.0;
var touchEndTime : float = 0.0;
var touchId : int = 0;

private var pm : ProfileManager;

function Awake()
{
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	if ( pm != null )
	{
		if ( pm.IsUsingTallScreen() )
		{
			transform.localPosition.y = -3.240952;
		}
	}
}

function Update ()
{
	if ( blinkEnabled == true )
	{ 
		blinkTimer += Time.deltaTime;
	
		if ( blinkTimer > blinkDuration )
		{
			//GetComponent(exSprite). = 0.0;//Mathf.Abs(GetComponent(exSprite).color.a - 0.5);
			GetComponent.<Renderer>().enabled = !GetComponent.<Renderer>().enabled;
			blinkTimer = 0.0;
		}
	}
		
	if ( menuControl.GetMenuState() == MainMenuState.Title )
	{
		/*
		if ( Input.GetMouseButtonUp(0) == true)
		{
			menuControl.GotoMenu();
		}
		*/
		if (Input.GetMouseButtonDown( 0 ))
		{
			menuControl.GotoMenu();
		}
		
		if ( Input.touchCount > 0 )
		{
			var touch : Touch = Input.GetTouch(0);
			
			if ( touch.phase == TouchPhase.Began )			
			{
				touchStartTime = Time.time;
			}
			
			if ( touch.phase == TouchPhase.Ended )
			{
				touchEndTime = Time.time;
				
				var totalTime : float = touchEndTime - touchStartTime;
				
				if ( totalTime < 0.3 )
				{
					menuControl.GotoMenu();
				}
			}
		}
	}
}