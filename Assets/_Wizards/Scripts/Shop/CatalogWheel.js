var touched:boolean;
var touchPos:Vector3;
var ray:Ray;
var hit : RaycastHit;
var index:int;
var dir:float;
var movePos:Vector3;
var hitboxName:String;

var shelfRotateSpeed : float = 10.0;
//var tempIndexForShelfRotation : int;

var board:exSprite[];

var shelf:ShopShelf[];

var am:AudioManager;

var leftPos : float = -100.0;
var rightPos : float = 300.0;

var shelfSeperationScale : float = 0.8;

var processMouse : boolean = true;

var maxRotationSpeed : float = 50.0;
var wheelRotateScaleSpeed : float = 0.3;

var maxScale : float = 1.0;
var minScale : float = 0.4;

// Swipe Check

var checkForSwipe :  boolean = false;

var mouseStartSwipe : Vector3;
var swipeThreshold : float = 5.0;
var canSwipe : boolean = false;
var distanceSwiped : float = 0.0;

var mouseStartScroll : Vector3;
var scrollThreshold : float = 8.0;
var canScroll : boolean = true;
var distanceScrolled : float = 0.0;

var subMenu : SubmenuController;

var scaleMoveSpeed : float = 0.25;


function Awake()
{
	am=GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	SetInitialBoardPositions();
	UpdateBoard(false);
	UpdateBoardColours();
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		processMouse = false;
	}
	checkForSwipe = false;
	
	canScroll = false;
	canSwipe = false;
}

function Start()
{
	GetLinkToSubMenuControl();
	//transform.rotation.y = 0;
	transform.localEulerAngles.y = 0;
}

function GetLinkToSubMenuControl()
{
	if ( GameObject.Find("Submenu") != null )
	{
		subMenu = GameObject.Find("Submenu").GetComponent(SubmenuController) as SubmenuController;
	}
}

function SetInitialBoardPositions()
{
	var slotSpacing : float = 100.0;
	var currentSlot : float = -100.0;
	
	for ( var i : int = 0; i < 4; ++i )
	{
		shelf[i].transform.localPosition.x = currentSlot;
		currentSlot += slotSpacing;
	}
	
}

function Update () 
{
	if ( subMenu != null )
	{
		if ( subMenu.submenuState == SubmenuState.Shop )
		{
			ProcessInput();
		}
	}
	else
	{
		GetLinkToSubMenuControl();
	}
}

function ProcessInput()
{
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	ProcessMouse();
	RotateShelves();
	#endif
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		ProcessTouch();
		RotateShelves();
	}
}

function ProcessTouch()
{
	if ( Input.touchCount > 0 )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Executing Touch Code");
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			touchPos=touch.position;
			mouseStartScroll = touchPos;
			mouseStartSwipe = touchPos;
			ray = Camera.main.ScreenPointToRay(touchPos);
			PerformTap(ray);
			
			/* OLD
			touchPos = touch.position;
			ray = Camera.main.ScreenPointToRay(touchPos);
			PerformTap(ray);
			*/
		}
		
		if ( touch.phase == TouchPhase.Moved )
		{
			if ( touched )
			{
				movePos = touch.position;
				dir = (movePos.x - touchPos.x);
				
				this.transform.eulerAngles.y -= ( dir * scaleMoveSpeed ); // uses y axis because catalog wheel is rotated. (still x direction for shelves)
				touchPos = movePos;
				
				//RotateShelves();
				UpdateBoardColours();
			}
			else if ( checkForSwipe )
			{
				movePos = touch.position;
				
				if ( canScroll == false && canSwipe == false )
				{
					distanceScrolled =  Mathf.Abs(movePos.y - mouseStartScroll.y);
					
					if ( canScroll == false && canSwipe == false && distanceScrolled > scrollThreshold )
					{
						canScroll = true;
					}
					
					distanceSwiped = Mathf.Abs(movePos.x - mouseStartSwipe.x);
					
					if ( canScroll == false && canSwipe == false && distanceSwiped > swipeThreshold )
					{
						canSwipe = true;
					}
				}
				
				if ( canSwipe )
				{
					dir = ( movePos.x - touchPos.x );
					this.transform.eulerAngles.y -= ( dir * scaleMoveSpeed );
					touchPos = movePos;
				
					//RotateShelves();
					UpdateBoardColours();
				}
			}
			
			if (dir>0)
			{
				index=Mathf.RoundToInt(this.transform.eulerAngles.y/90);
			}
			else
			{
				index=Mathf.RoundToInt(this.transform.eulerAngles.y/90);
			}
			
			if ( index == 4 )
			{
				index = 0;
			}	
		}
		
		if ( touch.phase == TouchPhase.Ended )
		{
			if (touched || checkForSwipe)
			{
				if ( canSwipe == true || canScroll == true || touched == true )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("CATALOG WHEEL: TOUCH RELEASED : iTweening Board to final position");
					UpdateBoard(true);
					UpdateBoardColours();
					
					canSwipe = false;
					distanceSwiped = 0.0;
					
					canScroll = false;
					distanceScrolled = 0.0;
				}
				
				checkForSwipe = false;
				touched = false;
			}
		}
	}
}

function ProcessMouse()
{
	if  (processMouse )
	{
		if ( Input.GetMouseButtonUp(0) )
		{
			if (touched || checkForSwipe)
			{
				if ( canSwipe == true || canScroll == true || touched == true )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("CATALOG WHEEL: MOUSE RELEASED : iTweening Board to final position");
					UpdateBoard(true);
					UpdateBoardColours();
					
					canSwipe = false;
					distanceSwiped = 0.0;
					
					canScroll = false;
					distanceScrolled = 0.0;
				}
				checkForSwipe = false;
				touched = false;
			}
		}
		else if ( Input.GetMouseButtonDown(0) )
		{
			touchPos=Input.mousePosition;
			mouseStartScroll = touchPos;
			mouseStartSwipe = touchPos;
			ray = Camera.main.ScreenPointToRay(touchPos);
			PerformTap(ray);
		}
		else 
		{
			if ( touched )
			{
				movePos = Input.mousePosition;
				dir = (movePos.x - touchPos.x);
				
				this.transform.eulerAngles.y -= ( dir * scaleMoveSpeed ); // uses y axis because catalog wheel is rotated. (still x direction for shelves)
				touchPos = movePos;
				
				//RotateShelves();
				UpdateBoardColours();
			}
			else if ( checkForSwipe )
			{
				movePos = Input.mousePosition;
				
				if ( canScroll == false && canSwipe == false )
				{
					distanceScrolled =  Mathf.Abs(movePos.y - mouseStartScroll.y);
					
					if ( canScroll == false && canSwipe == false && distanceScrolled > scrollThreshold )
					{
						canScroll = true;
					}
					
					distanceSwiped = Mathf.Abs(movePos.x - mouseStartSwipe.x);
					
					if ( canScroll == false && canSwipe == false && distanceSwiped > swipeThreshold )
					{
						canSwipe = true;
					}
				}
				
				if ( canSwipe )
				{
					dir = ( movePos.x - touchPos.x );
					this.transform.eulerAngles.y -= ( dir * scaleMoveSpeed );
					touchPos = movePos;
				
					//RotateShelves();
					UpdateBoardColours();
				}
			}
			
			if (dir>0)
			{
				index=Mathf.RoundToInt(this.transform.eulerAngles.y/90);
			}
			else
			{
				index=Mathf.RoundToInt(this.transform.eulerAngles.y/90);
			}
			
			if ( index == 4 )
			{
				index = 0;
			}	
		}
	}
}





function RotateShelves()
{
	var lerpValue : float = transform.localEulerAngles.y / 360.0;
	lerpValue = 1 - lerpValue;
	
	var shiftedLerp : float = lerpValue + 0.25;
	
	var left : float = leftPos * shelfSeperationScale;
	var right : float = rightPos * shelfSeperationScale;
	
	for ( var i : int = 0; i < 4; ++i)
	{	
		if ( shiftedLerp > 1.0 )
		{
			shiftedLerp -= 1.0;
		}
		
		var scaleLerpVal : float = ( board[i].gameObject.transform.position.z + 30) / 30.0;
		
		var boardScale : float = Mathf.Lerp(maxScale, minScale, scaleLerpVal);

		shelf[i].gameObject.transform.localPosition.x = Mathf.Lerp(left, right, shiftedLerp);
		board[i].gameObject.transform.localScale = Vector3(boardScale, boardScale, boardScale);
	
		shiftedLerp += 0.25;
		if ( shiftedLerp > 1.0 )
		{
			shiftedLerp -= 1.0;
		}
	}
}

function UpdateBoard(_playSound : boolean)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Updating Board");
	if ( _playSound	&& canSwipe ) // Only play if the player swiped left right, this is the swipe sound.
	{
		am.PlayOneShotAudio(am.shopboard[2],am.FXVol);
	}
	
	iTween.RotateTo(this.gameObject,iTween.Hash("islocal",true,"y",index*90,"time",0.5,"easeType",iTween.EaseType.spring));

	iTween.MoveTo(shelf[index].gameObject,iTween.Hash("islocal",true,"x",0,"time",0.5,"easeType",iTween.EaseType.spring));
}

function UpdateBoardColours()
{
	var hsb:HSBColor;
	
	for (var i:int=0;i<4;i++)
	{
		if (i!=index)
		{
			hsb=HSBColor.FromColor(board[i].color);
			hsb.b=0.5;
			board[i].color=HSBColor.ToColor(hsb);
		}
	}
	
	hsb=HSBColor.FromColor(board[index].color);
	hsb.b=1;
	board[index].color=HSBColor.ToColor(hsb);
}


function PerformTap(_ray:Ray)
{
	if (Physics.Raycast(_ray, hit, 1500.0) )
	{
		if ( hit.transform.name == hitboxName  )
    	{
			touched = true;
	    }
	    else
	    {
	    	checkForSwipe = true;
	    }
	    
	    //if ( hit.transform.name == "WandBox" )
	    //{
	    
	    //}
	    
	}
}