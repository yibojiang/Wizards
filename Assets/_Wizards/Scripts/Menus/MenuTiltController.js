var cameraFixedPosition : Vector3 = Vector3.zero;

var xMoveScale : float = 1.0;
var yMoveScale : float = 1.0;

var scrollSpeed : float = 10.0;

var zoomedIn : boolean = false;
var doZoom : boolean = false;

//var zoomedPos : Vector3;
//var unZoomedPos : Vector3;
var velocity : Vector3 = Vector3(0.0,0.0,1.0);
var smoothTime : float = 2.0;

var introPos:Vector3;
var titlePos : Vector3 = Vector3(0.0, -75, 500);
var creditsPos : Vector3;
var menuPos : Vector3;
var optionsPos : Vector3;
var socialPos:Vector3;

var doMove : boolean = false;
var destPos : Vector3;
var currentPos : Vector3;

var camMoveSpeed : float = 10.0;
var myTimer : float = 0.0;
var lerpValue : float = 0.0;

var AccelerometerUpdateInterval : float = 1.0 / 60.0;
var LowPassKernelWidthInSeconds : float = 1.0;

private var LowPassFilterFactor : float = AccelerometerUpdateInterval / LowPassKernelWidthInSeconds; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;

var dir : Vector3;

var accelInput : Vector3;

var calibrationOffset : Vector3;

var tiltMoveScale : float = 50.0;

var menuState : MainMenuState;

var logo:GameObject;
var text_continue:GameObject;

var stars : GameObject;

var preludeButton : GameObject;
var creditsButton : GameObject;
var optionsButton : GameObject;

var easyButton : GameObject;
var mediumButton : GameObject;
var hardButton : GameObject;


var camNewPos : Vector3 = Vector3.zero;

var pm:ProfileManager;

var cam:CameraFade;

var bgmManager:BgmManager;

var playerName:String;
var TextPlayerName:exSpriteFont;

//var playHavenManager:PlayHavenManager;

var optionCallback:OptionCallback;

var ray:Ray;
var hit : RaycastHit;

var fairy:Fairy;

var userSign:UserSign;

var defalutUserName:String="";

private var firstLog:boolean=true;

var clipButton:GameObject;

var test:boolean=false;

var downTown:GameObject;

var credits:CreditsScrolling;

var am : AudioManager;

var easyScale : float = 1.0;
var medScale : float = 1.0;
var hardScale : float = 1.0;

var didLeaveApp : boolean = false;

var facebookClicked : boolean = false;
var twitterClicked : boolean = false;


enum MainMenuState
{
	Intro,
	Title,
	Main,
	Credits,
	Options,
	Social,
	DifficultySelect
}

function Awake()
{
	Time.timeScale=1.0;
	cameraFixedPosition = Vector3.zero;
	
	
	Camera.main.transform.position = introPos;
	currentPos = Camera.main.transform.position;
	menuState = MainMenuState.Intro;
	
	
	//playHavenManager=GameObject.Find("PlayHavenManager").GetComponent(PlayHavenManager);
	IntroToTitle();
	
	//fairy.callback=GotoForest;
	//fairy.targetPos=Vector3(-70,-38,295);
	
	fairy.callback=GotoOptions;
	fairy.targetPos = Vector3(22,-240,295);
	
	am = GameObject.Find("BgmManager").GetComponent(AudioManager) as AudioManager;
	
	
	
	
}


function SetPlayerName()
{
	
}

function SetupPlayerName()
{
	if (userSign.userlength==0 && menuState==MainMenuState.Title)
	{
		// playerName=GameCenterBinding.playerAlias();
		playerName="yibojiang";
		if (playerName.Length>7)
		{
			playerName=playerName.Substring(0,7);
		}
	}
}

function FailedToSetupName()
{

	if (pm.GetActiveProfileID()==0 && menuState==MainMenuState.Title)
	{
		playerName=defalutUserName;
	}

}


function ActiveDowntown()
{
	if (pm. GetRecord(Record.PlayTimes)>0)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Showing Downtown sign");
		downTown.SetActiveRecursively(true);
		yield;
		iTween.ScaleTo(downTown, iTween.Hash("scale", Vector3(1.0, 1.0, 1.0), "time", 1.0, "easetype", iTween.EaseType.spring));
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Hiding Downtown sign");
		//downTown.SetActiveRecursively(false);
		HideDownTownSign();
	}
}

function HideDownTownSign()
{
	iTween.ScaleTo(downTown, iTween.Hash("scale", Vector3.zero, "time", 0.5, "easetype", iTween.EaseType.linear, "oncompletetarget", this.gameObject, "oncomplete", "HideSign"));
}

function HideSign()
{
	downTown.SetActiveRecursively(false);
}

function ActiveClipButton()
{
	if ( !pm.GetGameFinished() )
	{
		clipButton.SetActiveRecursively(false);
	}
	else
	{
		clipButton.SetActiveRecursively(true);
	}
	
	if (test)
	{
		clipButton.SetActiveRecursively(true);
	}
}

function LoginToGameCenter(_delay : float)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("LoginToGameCenter : delay = " + _delay);
	yield WaitForSeconds(_delay);
	// if (GameCenterBinding.isGameCenterAvailable())
	// {
	// 	GameCenterBinding.authenticateLocalPlayer();
	// }
}

function Start ()
{
	playerName=defalutUserName;
	
	//LoginToGameCenter();
	
	if (userSign.userlength==0)
	{
		firstLog=true;
		// if (GameCenterBinding.isGameCenterAvailable())
		// {
		// 	GameCenterManager.playerAuthenticated += SetupPlayerName;
		// 	GameCenterManager.playerFailedToAuthenticate+= FailedToSetupName;
		// }
		clipButton.SetActiveRecursively(false);
		HideDownTownSign();
	}
	else
	{
	    if ( Wizards.Utils.DEBUG ) Debug.LogWarning("MTC : START() : ACTIVE ID : " + pm.GetActiveProfileID());
		playerName=pm.GetActiveProfileName();
	    if ( Wizards.Utils.DEBUG ) Debug.LogWarning("MTC : START() : PLAYERNAME : " + playerName);
		TextPlayerName.text=playerName;
		
		userSign.UpdateDisplayName();
		ActiveClipButton();
		ActiveDowntown();
		//if ( Wizards.Utils.DEBUG ) Debug.Log(playerName);
	}
	
	
	
	bgmManager.FadeInBGM(bgmManager.menuBGM,bgmManager.bgmVol);
	QualitySettings.SetQualityLevel(QualityLevel.Simple);

	lowPassValue = Input.acceleration;
	//calibrationOffset = Input.acceleration * -1.0;
	calibrationOffset = Vector3(0.0, 0.5, 0.0);//Input.acceleration * -1.0;
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		tiltMoveScale *= 2;
	}
	
	
	creditsButton.transform.localScale=Vector3(0,0,0);
	optionsButton.transform.localScale=Vector3(0,0,0);
	preludeButton.transform.localScale=Vector3(0,0,0);
	
	easyButton.transform.localScale=Vector3(0,0,0);
	mediumButton.transform.localScale=Vector3(0,0,0);
	hardButton.transform.localScale=Vector3(0,0,0);
	
	
	//EtceteraBinding.askForReview(3,24, "Do you like Wizards?", "Please review the game if you do!", "https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?id=366238041&type=Prime31+Studios" );
	//EtceteraBinding.askForReview(1,0, "Do you like Wizards?", "Please review the game if you do!", "https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?id=366238041&type=Prime31+Studios" );
}



function LowPassFilterAccelerometer() : Vector3 {
	lowPassValue = Vector3.Lerp(lowPassValue, Input.acceleration, LowPassFilterFactor);
	return lowPassValue;
}

function Update ()
{
	
	if ( doMove == true )
	{
		myTimer += Time.deltaTime * camMoveSpeed;
		
		lerpValue = Mathf.SmoothStep(0.0, 1.0, myTimer);
		
		if ( lerpValue >= 1.0 )
		{
			lerpValue = 1.0;
			doMove = false;
			//Camera.main.transform.position = Vector3.Lerp(currentPos, destPos, lerpValue);
			camNewPos = Vector3.Lerp(currentPos, destPos, lerpValue);
			currentPos = camNewPos;
			myTimer = 0.0;
			
			// Show Logo and tap to continue
			if ( menuState == MainMenuState.Title )
			{
				if ( pm.IsUsingTallScreen() )
				{
					iTween.MoveTo(logo,iTween.Hash("islocal",true,"y",2.867203,"easeType",iTween.EaseType.spring));
				}
				else
				{
					iTween.MoveTo(logo,iTween.Hash("islocal",true,"y",2.183434,"easeType",iTween.EaseType.spring));
				}
				
				text_continue.gameObject.SetActiveRecursively(true);
				//LoginToGameCenter(1.0); 
			}
			
			if ( menuState == MainMenuState.Main )
			{
				ShowMenuMushrooms(0.0);
				
				/*
				if (userSign.userlength==0 && firstLog)
				{
					firstLog=false;
					userSign.Show();
					userSign.playerName.text=playerName;
					userSign.doKeyBoard();
				}
				*/
			}
			
			if (menuState==MainMenuState.Options)
			{
				optionCallback.Init();
			}
			if ( menuState == MainMenuState.Credits )
			{
				credits.StartScrolling();
				//bgmManager.FadeBGM(bgmManager.menuBGM,BGM.Credits);
			}
			
		}
		else
		{
			camNewPos = Vector3.Lerp(currentPos, destPos, lerpValue);
		}
	}
	else
	{
		camNewPos = currentPos;
	}
	
	// Cam position adjustment for tilting
	if ( menuState != MainMenuState.Options ) // STOP TILTIN IF AT OPTIONS MENU
	{
		accelInput = LowPassFilterAccelerometer();
		dir = accelInput;
		dir += calibrationOffset;
		dir *= tiltMoveScale;
		dir.z = 0.0;
		dir.y = 0.0;
	
		camNewPos += dir;
	}
	
	//Camera.main.SendMessage("NewPosition", camNewPos); 
	
	
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			
			ray = Camera.main.ScreenPointToRay(touch.position);
			
			PerformTap(ray);
							
		}
		
	}
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonDown(0) )
	{	
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		PerformTap(ray);
	}
	#endif
	
}

function PerformTap(_ray:Ray)
{
	if (userSign.keyboard!=null &&  !userSign.keyboard.done && userSign.keyboard.visible == true)
	{
		return;
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("MenuState:" + menuState);
	
	if (Physics.Raycast(_ray, hit, 1500.0) )
	{
       	if ( hit.transform.name == "fairy_cog" )
    	{
    		if (fairy.state==FairyState.Idle)
    		{
    			fairy.SetMoving();
    			fairy.callback();
    			

    			iTween.MoveTo(fairy.transform.parent.gameObject,iTween.Hash("time",2,"position",fairy.targetPos,"oncompletetarget",fairy.gameObject,"oncomplete","SetIdle","easeType",iTween.EaseType.easeInOutQuad));
    			
    			if ( menuState==MainMenuState.Main)
    			{
    				//fairy.callback=GotoForest;
    				fairy.callback=GotoOptions;
    				//fairy.targetPos=Vector3(-70,-38,295);
    				fairy.targetPos = Vector3(22,-240,295);
    				//fairy.targetPos = Vector3(26,11,295);
    				fairy.SetCog();
    			}
    			else if ( menuState==MainMenuState.Social)
    			{
    				fairy.callback=GotoMenu;
    				fairy.targetPos=Vector3(26,11,295);
    				fairy.SetBack(-90);
    			}
    			else if ( menuState==MainMenuState.Options)
    			{
    				fairy.callback=GotoMenu;
    				fairy.targetPos=Vector3(26,11,295);
    				fairy.SetBack(0);
    			}
    			else if ( menuState==MainMenuState.Credits)
    			{
    				fairy.callback=GotoMenu;
    				fairy.targetPos=Vector3(26,11,295);
    				fairy.SetBack(0);
    			}
    			else if ( menuState == MainMenuState.DifficultySelect)
    			{
    				//fairy.callback=GotoForest;
    				fairy.callback=GotoOptions;
    				//fairy.targetPos=Vector3(-70,-38,295);
    				fairy.targetPos = Vector3(22,-240,295);
    				//fairy.targetPos = Vector3(26,11,295);
    				fairy.SetCog();
    				
    			}
    			PlayRandomFairySound();
    			
    		}
	    }
	    
	    
	    if ( hit.transform.name == "_nextplayer" )
    	{
	    	userSign.GetNextProfile();
	    }
	    
	    if ( hit.transform.name == "_previousplayer" )
    	{
	    	userSign.GetPreviousProfile();
	    }
	    
	    
	    if ( hit.transform.name == "delete" )
    	{
	    	userSign.DeleteUser();
	    }
	    
	    if (hit.transform.name == "clipbutton")
	    {
	    	cam.FadeTo(this.gameObject,"GotoEndStory",1);
	    }
	    
	}
}

function PlayRandomFairySound()
{
	am.PlayFairySound();
}

function NewProfile()
{
	userSign.EnterNewProfile();
}

function EditProfile()
{
	userSign.EditProfile();
}

function ConfirmProfile()
{
	userSign.Confirm();
}

function CancelProfile()
{
	userSign.CancelUserEntry();
}

function DeleteProfile()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteProfile");
	userSign.DeleteUser();
}

function NextProfile()
{
	userSign.GetNextProfile();
}

function PreProfile()
{
	userSign.GetPreviousProfile();
}

function GotoCredits()
{
	
	if (!doMove)
	{
		doMove = true;
		destPos = creditsPos; // SWITCHED THIS TOO ITWEEN CONTROL FOR NOW - PAUL.
		//currentPos = creditsPos;
		menuState = MainMenuState.Credits;
		camMoveSpeed = 0.3;
		
		if (fairy.state==FairyState.Idle)
		{
			fairy.SetMoving();
			fairy.callback=GotoMenu;
			var targetPos=Vector3(26,1060,295);
			iTween.MoveTo(fairy.transform.parent.gameObject,iTween.Hash("time",2,"position",targetPos,"oncompletetarget",fairy.gameObject,"oncomplete","SetIdle","easeType",iTween.EaseType.easeInOutQuad));
	    	fairy.targetPos=Vector3(26,11,295);
	    	fairy.SetBack(-180);
	    }
		
	}
}

function GotoOptions()
{

	if (!doMove)
	{
		doMove = true;
		destPos = optionsPos;
		menuState = MainMenuState.Options;
		
		camMoveSpeed = 1;
		
		
		
		if (fairy.state==FairyState.Idle)
		{
			fairy.SetMoving();
			fairy.callback=GotoMenu;
			var targetPos=Vector3(22,-240,295);
			iTween.MoveTo(fairy.transform.parent.gameObject,iTween.Hash("time",2,"position",targetPos,"oncompletetarget",fairy.gameObject,"oncomplete","SetIdle","easeType",iTween.EaseType.easeInOutQuad));
	    	fairy.targetPos=Vector3(26,11,295);
	    	fairy.SetBack(0);
	    }
	}
}

function LateUpdate()
{
	cam.transform.position=camNewPos;
}

function GotoForest()
{
	//iTween.PunchScale(creditsButton,iTween.Hash("islocal",true,"time", 1.5,"x",1.25,"y",1.25,"z",1.25));
	if (!doMove)
	{
		doMove = true;
		destPos = socialPos;
		
		camMoveSpeed = 1;
		menuState=MainMenuState.Social;
		
		if (fairy.state==FairyState.Idle)
		{
			fairy.SetMoving();
			fairy.callback=GotoMenu;
			var targetPos=Vector3(-70,-38,295);
			iTween.MoveTo(fairy.transform.parent.gameObject,iTween.Hash("time",2,"position",targetPos,"oncompletetarget",fairy.gameObject,"oncomplete","SetIdle","easeType",iTween.EaseType.easeInOutQuad));
	    	fairy.targetPos=Vector3(26,11,295);
	    	fairy.SetBack(-90);
	    }
	}
}



function IntroToTitle()
{
	logo.transform.localPosition=Vector3(0,0,5);
	logo.transform.localScale=Vector3(0.45,0.45,0.45);
	text_continue.SetActiveRecursively(false);
	yield WaitForSeconds(2);
	if (!doMove)
	{
		doMove = true;
		destPos = titlePos;
		
		if ( pm.IsUsingTallScreen() )
		{
			iTween.MoveTo(logo,iTween.Hash("islocal",true,"time", 4,"x",-0.7,"y",2.867203,"z",5,"easeType",iTween.EaseType.easeInOutQuad,"oncompletetarget",this.gameObject,"oncomplete","ShowTitle"));
		}
		else
		{
			iTween.MoveTo(logo,iTween.Hash("islocal",true,"time", 4,"x",-0.7,"y",2.183434,"z",5,"easeType",iTween.EaseType.easeInOutQuad,"oncompletetarget",this.gameObject,"oncomplete","ShowTitle"));
		}
		
		iTween.ScaleTo(logo,iTween.Hash("islocal",true,"time", 4,"x",0.2911367,"y",0.2911367,"easeType",iTween.EaseType.easeInOutQuad));
		camMoveSpeed = 0.25;
	}
	
}

function ShowTitle()
{
	//Camera.main.transform.position = titlePos;
	menuState = MainMenuState.Title;
	text_continue.SetActiveRecursively(true);
	LoginToGameCenter(2.0);
	
}

function GotoMenu()
{
	if (!doMove)
	{
		
		if ( menuState == MainMenuState.Credits )
		{
		//	bgmManager.FadeBGM(bgmManager.menuBGM,BGM.MainMenuMain);
			credits.Hide();
		}
		if (menuState==MainMenuState.Options)
		{
			optionCallback.ApplySetting();
		}
		
		if (menuState == MainMenuState.DifficultySelect	)
		{   			
			if ( Wizards.Utils.DEBUG ) Debug.Log("Shake Fairy Here");
			fairy.Shake();
			//yield WaitForSeconds(1.0);
			HideDifficultyMushrooms(0.0);
			ShowMenuMushrooms(0.0);
		}
		
		
		if ( menuState != MainMenuState.DifficultySelect )
		{
			doMove = true;
			destPos = menuPos;
			iTween.MoveTo(logo,iTween.Hash("islocal",true,"time", 4,"y",5,"easeType",iTween.EaseType.spring));
		}
		
		menuState = MainMenuState.Main;
		text_continue.gameObject.SetActiveRecursively(false);
		
		camMoveSpeed = 0.5;
		
		
	}
}



function ChangeUser()
{
	if (userSign.userlength==0 && firstLog)
	{
		//firstLog=false;
		//userSign.Show();
		//userSign.SetupForFirstNameEntry();
	}
	else
	{		
		userSign.Show();
	}
}

function MoreGames()
{
	#if UNITY_IPHONE
	
	#if ENABLE_ETCETERA
	EtceteraBinding.showWebPage("http://176.32.86.204/moregames/portrait",false);
	#endif
	
	#endif
	//PlayhavenBinding.contentRequest( 56, "more_games" );
	
	//playHavenManager.OpenNotification();
	//GetComponent(PlayHavenContentRequester).Request();
	//if ( Wizards.Utils.DEBUG ) Debug.Log("PlayHavenContentRequester!");
}

function GotoGame()
{
	//iTween.PunchScale(preludeButton,iTween.Hash("islocal",true,"time", 1.5,"x",1.25,"y",1.25,"z",1.25));
	//pm.SetNextLevelToLoad("Game");
	//Application.LoadLevel("LevelLoader");
	
	GotoGameUserCheck();
}

function GotoDifficultySelect()
{
	if ( menuState == MainMenuState.DifficultySelect )
	{
		return;
	}
	
	fairy.callback=GotoMenu;
    fairy.targetPos=Vector3(26,11,295);
    fairy.SetBack(90);
    
	menuState = MainMenuState.DifficultySelect;
	// Shrink the existing mushrooms
	HideMenuMushrooms(0.1);
	// Grow the difficulty select mushrooms
	ShowDifficultyMushrooms(0.0);
	// Do the following after user selects a level
	//GotoGame();
}

function SelectEasyDifficulty()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("EASY");

	pm.SetDifficultyLevel(EDifficulty.Easy);
	GotoGame();
}

function SelectMediumDifficulty()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("MED");

	pm.SetDifficultyLevel(EDifficulty.Medium);
	GotoGame();
}

function SelectHardDifficulty()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("HARD");

	pm.SetDifficultyLevel(EDifficulty.Hard);
	GotoGame();
}

function GotoGameUserCheck()
{
	if (userSign.userlength==0 && firstLog)
	{
		firstLog=false;
		userSign.Show();
		userSign.SetupForFirstNameEntry();
		//userSign.playerName.text=playerName;
		if ( Wizards.Utils.DEBUG ) Debug.Log("Showing Keyboard");
		userSign.doKeyBoard();
		
		#if UNITY_IPHONE
		if ( Application.platform == RuntimePlatform.IPhonePlayer )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("I am running");
			while ( userSign.keyboard == null )
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("Wait for not null");
				yield;
			}
			
			if ( Wizards.Utils.DEBUG ) Debug.Log("Wait for keyboard done or dismissed");
			
			var kbFinished : boolean = false;
			var cancelled : boolean = false;
			var done : boolean = false;
			
			while ( !kbFinished )
			{
				if ( userSign.keyboard == null )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("KEYBOARD IS NULL");
					kbFinished = true;
					break;
				}
				
				if ( userSign.keyboard.wasCanceled )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("KEYBOARD CANCELLED");
					kbFinished = true;
					cancelled = true;
				}
				
				if ( userSign.keyboard.done == true )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("KEYBOARD DONE");
					kbFinished = true;
					done = true;
				}
				
				if ( userSign.keyboard.visible == false )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("KEYBOARD NOT VISIBLE ANYMORE!");
					kbFinished = true;
				}
				
				if ( userSign.keyboard.active == false )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("KEYBOARD NOT ACTIVE ANYMORE!");
					kbFinished = true;
				}
				
				yield;
			}
			
			// OLD ROUTINE
			//while ( userSign.keyboard.done == false )
			//{
			//		yield;
			//}
			// END OLD ROUTINE
			
			if ( done )
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("KB Closed and NOT CANCELED : Loading first game");
				cam.FadeTo(this.gameObject,"LoadGame",1);
			}
			else
			{
				firstLog=true;
			}
		}
		#endif
		
		#if UNITY_EDITOR || UNITY_STANDALONE_OSX || UNITY_STANDALONE_WIN
		if ( Wizards.Utils.DEBUG ) Debug.Log("I am running");
		//while ( userSign.keyboardDone == null )
		//{
		//	if ( Wizards.Utils.DEBUG ) Debug.Log("Non-Iphone - Wait for not null");
		//	yield;
		//}
		
		
		//while ( userSign.keyboardDone == false )
		//{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Non-Iphone - Wait for Done");
		//	yield;
		//}
		
		
		//if ( ! cancelled )
		//{
		
		userSign.CreateProfile();
		userSign.enterNewProfile = false;
		userSign.FirstTimePlayCleanUpFunction();
		
		yield WaitForSeconds(1.0);

		cam.FadeTo(this.gameObject,"LoadGame",1);
		//}
		
		#endif
	}
	else
	{

		cam.FadeTo(this.gameObject,"LoadGame",1);
	}
}
function Submenu()
{
	pm.SetNextLevelToLoad("Submenu");
	//Application.LoadLevel("GameOver");
	Application.LoadLevel("LevelLoader");
}

function GotoSubmenu()
{
	cam.FadeTo(this.gameObject,"Submenu",1);
	
}

function LoadGame()
{
	if (pm.doPlayTutorial())
	{
		pm.SetNextLevelToLoad("Tutorial");
		Application.LoadLevel("LevelLoader");
	}
	else
	{
		pm.SetShowTips(true);
		pm.SetNextLevelToLoad("Game");
		Application.LoadLevel("LevelLoader");
	}
}

function GotoTitle()
{
	if (!doMove)
	{
		doMove = true;
		destPos = titlePos;
		menuState = MainMenuState.Title;
		
		// Hide Logo and tap to continue
		//iTween.MoveTo(logo,iTween.Hash("islocal",true,"time", 4,"y",4,"easeType",iTween.EaseType.spring));
		//iTween.MoveTo(text_continue,iTween.Hash("islocal",true,"time", 4,"y",-4,"easeType",iTween.EaseType.spring));
		camMoveSpeed = 0.5;
		
		HideDifficultyMushrooms(0.0);
		HideMenuMushrooms(0.0);
	}
	
}

function HideMenuMushrooms(_delay : float)
{
	yield WaitForSeconds(_delay);
	iTween.Stop(creditsButton);
	iTween.Stop(optionsButton);
	iTween.Stop(preludeButton);
	yield;
	iTween.ScaleTo(creditsButton,iTween.Hash("islocal",true,"time", 0.5,"delay", 0.0,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(optionsButton,iTween.Hash("islocal",true,"time", 0.5,"delay", 0.1,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(preludeButton,iTween.Hash("islocal",true,"time", 0.5,"delay", 0.2,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
}

function ShowMenuMushrooms(_delay : float)
{
	yield WaitForSeconds(_delay);
	iTween.Stop(creditsButton);
	iTween.Stop(optionsButton);
	iTween.Stop(preludeButton);
	yield;
	iTween.ScaleTo(creditsButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.0,"x",1,"y",1,"z",1,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(optionsButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.2,"x",1,"y",1,"z",1,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(preludeButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.4,"x",1,"y",1,"z",1,"easeType",iTween.EaseType.spring));

}

function ShowDifficultyMushrooms(_delay : float)
{
	yield WaitForSeconds(_delay);

	iTween.Stop(easyButton);
	iTween.Stop(mediumButton);
	iTween.Stop(hardButton);
	iTween.ScaleTo(easyButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.6,"x",easyScale,"y",easyScale,"z",easyScale,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(mediumButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.3,"x",medScale,"y",medScale,"z",medScale,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(hardButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.5,"x",hardScale,"y",hardScale,"z",hardScale,"easeType",iTween.EaseType.spring));
}

function HideDifficultyMushrooms(_delay : float)
{
	yield WaitForSeconds(_delay);
	iTween.Stop(easyButton);
	iTween.Stop(mediumButton);
	iTween.Stop(hardButton);
	iTween.ScaleTo(easyButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.0,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(mediumButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.1,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(hardButton,iTween.Hash("islocal",true,"time", 0.5, "delay", 0.2,"x",0,"y",0,"z",0,"easeType",iTween.EaseType.spring));
}


function GetMenuState() : MainMenuState
{
	return ( menuState );
}

function FacebookButtonPressed()
{
	GotoFacebook();
}

function GotoFacebook()
{

	#if UNITY_IPHONE
	
	if (facebookClicked )
	{
		return;
	}
	
	facebookClicked = true;
	
	
	#if ENABLE_ETCETERA
	EtceteraBinding.showWebPage("https://www.facebook.com/wizardsTMC",true);
	#else
	
	
	var startTime : float = 0.0;

    startTime = Time.timeSinceLevelLoad;

     //open the facebook app
     
     didLeaveApp = false;

	// if ( EtceteraBinding.applicationCanOpenUrl("fb://profile/455200504548857") )
	// {
 //    	if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING FACEBOOK VIA NATIVE");
 //    	Application.OpenURL("fb://profile/455200504548857");
 //    }
 //    else
 //    {
 //    	//fail. Open safari.
 //        if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING FACEBOOK VIA SAFARI");

 //    	Application.OpenURL("https://www.facebook.com/wizardsTMC");        
 //    }
        
    //yield WaitForSeconds(1.0);

    //if ( didLeaveApp == false)
	//{

    	//fail. Open safari.
      //  if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING FACEBOOK VIA SAFARI");

    	//Application.OpenURL("https://www.facebook.com/wizardsTMC");

	//}
	
	didLeaveApp = false;
	facebookClicked = false;

	#endif
		
	#endif
}

function TwitterButtonPressed()
{
	GotoTwitter();
}

function GotoTwitter()
{
	#if UNITY_IPHONE
	
	if (twitterClicked )
	{
		return;
	}
	
	twitterClicked = true;
	
	#if ENABLE_ETCETERA
	EtceteraBinding.showWebPage("https://twitter.com/wizards_io",true);
	#else
	
	var startTime : float = 0.0;

    startTime = Time.timeSinceLevelLoad;

     //open the facebook app
     
     didLeaveApp = false;

    
 //    if ( EtceteraBinding.applicationCanOpenUrl("twitter:///user?screen_name=wizards_io") )
	// {
 //    	if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING TWITTER VIA NATIVE");
    
 //    	Application.OpenURL("twitter:///user?screen_name=wizards_io");
	// }
	// else
	// {
	//    if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING TWITTER VIA SAFARI");
 //    	Application.OpenURL("https://twitter.com/wizards_io");
	// }
	
	//yield WaitForSeconds(1.0);
	
    //if (didLeaveApp == false)
	//{

    	//fail. Open safari.
	   // if ( Wizards.Utils.DEBUG ) Debug.Log("OPENING TWITTER VIA SAFARI");
    	//Application.OpenURL("https://twitter.com/wizards_io");

	//}
	
	didLeaveApp = false;
	
	twitterClicked = false;

	#endif
	
	#endif
}

function OnApplicationPause(_isPaused : boolean)
{
	if ( _isPaused )
	{
		didLeaveApp = true;
	}
}

function GotoEndStory()
{
	pm.SetSkipMovieClip(true);
	
	/*
	pm.SetNextLevelToLoad("MainMenu");
	Application.LoadLevel("EndStory");
	*/
	
	pm.SetNextLevelToLoad("EndStory");
	Application.LoadLevel("LevelLoader");
}

function AskForReview()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("call");
	#if UNITY_IPHONE
	
	//#if ENABLE_ETCETERA
	// EtceteraBinding.askForReview( "Enjoying the Concert?", "Then please rate Wizards - The Magical Concert and help keep it alive with future updates and other Magical Surprises. Thanks", "668251075" );
	//#endif
	
	//Application.OpenURL("http://itunes.apple.com/app/id668251075");
	
	#endif

	//pm.SetNextLevelToLoad("SecrectEnding");
	//Application.LoadLevel("LevelLoader");
}