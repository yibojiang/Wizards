var myTransform:Transform;
var speed:float;

var startTarget:Transform;
var stopTarget:Transform;

var UVbg:UVScroll;


var touched:boolean;
var touchPos:Vector3;
var ray:Ray;
var hit : RaycastHit;

var tempSpeed:float;

var pm:ProfileManager;


var cameraBG:GameObject;

var cameraFade:CameraFade;


var fadeTimer:float=5;

var secrectTimer:float=10;

var secrect:boolean;


var secrectEndingStart:boolean;

var secrectEndingStartPos:Vector3;
var secrectEndingTargetPos:Vector3;


var bgmManager:BgmManager;

var scrollingText:ScrollingText;


var dialogShow:boolean;


var movePos:Vector3;
var dir:float;

var doZoom : boolean = true;
var zoomDelay : float = 1.0;

var finalDialogDelay : float = 3.0;

var hasActivatedToBeContinuedText : boolean = false;

var toBeContinuedText : exSpriteFont;

function Awake()
{
	myTransform=this.transform;
	myTransform.position.y=startTarget.position.y;
	myTransform.position.z=800;
	cameraFade=this.GetComponent(CameraFade);
	
	tempSpeed=speed;
	
	toBeContinuedText.botColor.a = 0.0;
	toBeContinuedText.topColor.a = 0.0;
	
	//secrect=false;
}

function Start()
{
	#if UNITY_IPHONE
	//iPhoneSettings.screenCanDarken=false;
	Screen.sleepTimeout = 0.0f;
	#endif
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
		//PerformTap(ray);
	}
	else 
	{
		if (touched)
		{
			speed=0;
			movePos= Input.mousePosition;
			
			dir=(movePos.y-touchPos.y)*10;
			//if ( Wizards.Utils.DEBUG ) Debug.Log(dir);
			
			//dir=Mathf.Clamp(dir,-5,5);
			//if ( Wizards.Utils.DEBUG ) Debug.Log(dir);
			//this.transform.position.y+=dir;
			
			var scrollSpeed:float=dir;
			scrollSpeed=Mathf.Clamp(scrollSpeed,-tempSpeed*15,tempSpeed*15);
			
			myTransform.position.y-=scrollSpeed*Time.smoothDeltaTime;
			UVbg.scrollMaterial.mainTextureOffset.y-=0.01*scrollSpeed*Time.smoothDeltaTime*5/6;
		
			
			touchPos= Input.mousePosition;
			
			
			
		}
		
	}
	
	#endif
	
	if ( Input.touchCount > 0 )
	{
		
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			
			//ray = Camera.main.ScreenPointToRay(touchPos);
			
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
				myTransform.position.y-=scrollSpeed1*Time.smoothDeltaTime;
				UVbg.scrollMaterial.mainTextureOffset.y-=0.01*scrollSpeed1*Time.smoothDeltaTime*5/6;
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

function Update () {
	if (myTransform.position.y>stopTarget.position.y)
	{
		myTransform.position.y-=speed*Time.deltaTime;
		UVbg.scrollSpeedY=speed*5/6;
		//if ( Wizards.Utils.DEBUG ) Debug.Log(Time.time);
		
		ProcessInput();
	}
	else
	{
		
		UVbg.scrollSpeedY=0;
		
		if ( zoomDelay > 0.0 )
		{
			zoomDelay -= Time.deltaTime;
		}
		else
		{
			if ( doZoom)
			{
				Camera.main.fieldOfView -= Time.deltaTime * (35/15);
				
				if ( Camera.main.fieldOfView <= 35 )
				{
					doZoom = false;
				}
			}

		}
		
		if (fadeTimer>0)
		{
			fadeTimer-=Time.deltaTime;
			//ProcessInputSkip();
		}
		else
		{
			if (!secrect)
			{
				FadeToHideBG();
			}

		}
	}
	
	ProcessDialogInput();
	
	if (dialogShow && scrollingText.dialogOver) 
	{
		// TODO - show to be continued here
		if ( hasActivatedToBeContinuedText == false )
		{
			hasActivatedToBeContinuedText = true;
			ShowToBeContinuedText();
		}
		ProcessInputSkip();
	}
	
	if (secrect)
	{
		if (secrectTimer>0)
		{
			secrectTimer-=Time.deltaTime;
			ProcessInputSkip();
		}
		else
		{
			if (!secrectEndingStart)
			{
				FadeInToSecrectEnding();
			}
		}
	}
	
	if (myTransform.position.y>startTarget.position.y)
	{
		myTransform.position.y=startTarget.position.y;
	}
}

function ShowToBeContinuedText()
{
	yield WaitForSeconds(3.0);
	while ( toBeContinuedText.botColor.a < 1.0 )
	{
		toBeContinuedText.botColor.a += Time.deltaTime * 0.33;
		toBeContinuedText.topColor.a += Time.deltaTime * 0.33;
		
		yield;
	}
}

function FadeToHideBG()
{
	secrect=true;
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",2,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","HideBG") );
	
	bgmManager.FadeOutAndStopBGMEndCredits(bgmManager.menuBGM);
	bgmManager.FadeInBGM(bgmManager.secretBGM, 0.1, 4.0);
}

function FadeInToSecrectEnding()
{
	//bgmManager.FadeOutAndStopBGMEndCredits(bgmManager.secretBGM);
	secrectEndingStart=true;
	myTransform.position=secrectEndingStartPos;
	if ( pm.IsUsingTallScreen() )
	{
		Camera.main.fieldOfView = 72.0;
	}
	else
	{
		Camera.main.fieldOfView = 60.0;
	}
	HideBG();
	iTween.CameraFadeTo(iTween.Hash("amount",0,"time",2,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","SecrectEnding") );
}

function SecrectEnding()
{
	iTween.MoveTo(this.gameObject,iTween.Hash("time", 8,"position",secrectEndingTargetPos,"easeType",iTween.EaseType.easeInOutQuad,"oncompletetarget",this.gameObject,"oncomplete","ShowDialogWithDelay"));
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SecrectEnding!");
}

function ShowDialogWithDelay()
{
	while ( finalDialogDelay > 0.0 )
	{
		finalDialogDelay -= Time.deltaTime;
		yield;
	}
	
	ShowDialog();
}

function ShowDialog()
{

	dialogShow=true;
	var normalDialog=new Dialog[4];
	for (var i:int=0;i<normalDialog.Length;i++)
	{
		normalDialog[i]=new Dialog();
	}
	normalDialog[0].character=Character.Broom;
	normalDialog[0].face=Face.Normal;
	normalDialog[0].text="We are too late... HE must have freed Graveloft !!\nLook at the Castle, the City...!!!!";
	normalDialog[1].character=Character.Javi;
	normalDialog[1].face=Face.Normal;
	normalDialog[1].text="This damn Roachtail, HE must be close by !\nWe have to hurry, ...this time he won't escape !\n";
	normalDialog[2].character=Character.Javi;
	normalDialog[2].face=Face.Normal;
	normalDialog[2].text="This time MARDUROK will pay for all HE has Done.";
	normalDialog[3].character=Character.Javi;
	normalDialog[3].face=Face.Normal;
	normalDialog[3].text="HE WILL !!!!!!";



	
	scrollingText.SetDialog(normalDialog,0,3);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("ShowDialog");
}

function HideBG()
{
	cameraBG.SetActiveRecursively(false);
}

function ProcessDialogInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		var ray:Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		if (Physics.Raycast(ray, hit, 100.0) )
		{    
			if ( hit.transform.tag == "SpeechBubble")
			{
				scrollingText.pressed=true;
			}
			
		}
	}
}

function ProcessInputSkip()
{

	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonDown(0) )
	{
		MainmenuHit();
	}
	#endif
	
	if ( Input.touchCount > 0 )
	{
		
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			MainmenuHit();
		}
		
	}
	
	
}

function MainmenuHit()
{
	cameraFade.FadeTo(this.gameObject,"MainMenu",1.5);
}

function MainMenu()
{
	//Application.LoadLevel("MainMenu");
	pm.SetNextLevelToLoad("GameOver");
	Application.LoadLevel("GameOver");
}