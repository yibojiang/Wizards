var barrel:exSprite;
var barrelAnmiation:exSpriteAnimation;

var broom:exSprite;
var boardLight:exSprite;
var board:exSprite;
var barrelLight:exSprite;
var yummyLight:exSprite;
var broomtail:exSprite;
var pailDiner:exSprite;

var yummyLightToggle:float;

var bgmManager:BgmManager;

var panelController:PanelController;
var ray : Ray;
var hit : RaycastHit;

var dialogBox:DialogBox;
var pm:ProfileManager;

var achievementManager:AchievementManager;

var smoke : ParticleEmitter;

private var boardPosition:Vector3;
private var barrelPosition:Vector3;
private var broomPosition:Vector3;

private var barrelOpen:boolean=false;

private var lastRealTime:float;


function Awake()
{
	lastRealTime = Time.realtimeSinceStartup;
}

function Start()
{
	boardPosition=board.transform.position;
	barrelPosition=barrel.transform.position;
	broomPosition=broom.transform.position;
	
	board.transform.position.y=board.transform.position.y+20;
	barrel.transform.position.x=barrel.transform.position.x+20;
	broom.transform.position.y=broom.transform.position.y-20;
	
	this.gameObject.SetActiveRecursively(false);
	
	yummyLightToggle=1.5;
}


function Update () 
{
	
	var deltaTime:float=Time.realtimeSinceStartup - lastRealTime;
	lastRealTime=Time.realtimeSinceStartup;
			
	var random1:float=Random.Range(0.1,1.0);
	boardLight.color.a=random1;

	var random2:float=Random.Range(0.1,0.8);
	barrelLight.color.a=random2;
	
	var random3:float=Random.Range(0.0,1.0);
	broomtail.color.a=random3;
	
	var random4:float=Random.Range(0.0,1.0);
	pailDiner.color.a=random4;
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Delta" + deltaTime);
	smoke.Simulate(deltaTime);
	
	ProcessInput();
	
	if (yummyLightToggle>0)
	{
		yummyLightToggle-=deltaTime;
	}
	else 
	{
		if (yummyLight.gameObject.active)
		{
			yummyLight.gameObject.SetActiveRecursively(false);
		}
		else
		{
			yummyLight.gameObject.SetActiveRecursively(true);
		}
		
		yummyLightToggle=Random.Range(1.5,2.5);
	}
	
}


function AnimationOn()
{
	
	barrelAnmiation.SetFrame("barrel",1);
	barrelOpen=true;
	
	iTween.MoveBy(barrel.gameObject,iTween.Hash("time",1.2,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong,"ignoretimescale",true) );
	iTween.MoveBy(broom.gameObject,iTween.Hash("time",0.8,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong,"ignoretimescale",true) );
	
}

function AnimationOff()
{

	barrelAnmiation.SetFrame("barrel",0);
	barrelOpen=false;
	
	iTween.Stop(barrel.gameObject);
	iTween.Stop(broom.gameObject);
}

function Enter()
{
	this.gameObject.SetActiveRecursively(true);
	
	iTween.Stop(board.gameObject);
	iTween.Stop(barrel.gameObject);
	iTween.Stop(broom.gameObject);
	
	
	bgmManager.FadeInBGM(bgmManager.pauseMenuBGM,bgmManager.bgmVol);
	//TODO
	iTween.MoveTo(board.gameObject,iTween.Hash("position",boardPosition,"time",1,"easetype",iTween.EaseType.spring,"ignoretimescale",true) );
	iTween.MoveTo(barrel.gameObject,iTween.Hash("position",barrelPosition,"time",1.5,"x",-20,"easetype",iTween.EaseType.spring,"ignoretimescale",true) );
	iTween.MoveTo(broom.gameObject,iTween.Hash("position",broomPosition,"time",2,"y",20,"easetype",iTween.EaseType.spring,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","AnimationOn") );

}

function Leave()
{
	AnimationOff();
	bgmManager.FadeOutAndStopBGM(bgmManager.pauseMenuBGM);
	
	iTween.MoveTo(board.gameObject,iTween.Hash("time",1,"y",board.transform.position.y+20,"easetype",iTween.EaseType.spring,"ignoretimescale",true) );
	iTween.MoveTo(barrel.gameObject,iTween.Hash("time",1.5,"x",barrel.transform.position.x+20,"easetype",iTween.EaseType.spring,"ignoretimescale",true) );
	iTween.MoveTo(broom.gameObject,iTween.Hash("time",2,"y",broom.transform.position.y-20,"easetype",iTween.EaseType.spring,"ignoretimescale",true,"oncompleteTarget",this.gameObject,"oncomplete","Hide") );
}

function Hide()
{	
	this.gameObject.SetActiveRecursively(false);
}



function GameResume()
{
	Time.timeScale=1;
}

function ProcessInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(ray, hit, 1000.0) )
		{
		    if ( hit.transform.name == "PauseBarrel" )
		    {
		    	if (achievementManager!=null)
		    	{
		    		if (achievementManager.achievementArray[Achievement.Yummy_Yummy]==0)
					{
						achievementManager.UnlockAchievement(Achievement.Yummy_Yummy);
					}
		    	}
		    	
		    	
		    	if (barrelOpen)
		    	{
		    		barrelAnmiation.SetFrame("barrel",0);
		    	}
		    	else
		    	{
		    		barrelAnmiation.SetFrame("barrel",1);
		    	}
		    	barrelOpen=!barrelOpen;
		    	
		    }
		}
	}

	
}

function ResumeReleased()
{
	panelController.HidePausePanel("PauseMenuLeave");	
}

function Retry()
{
	panelController.HidePausePanel("Retry");	
	/*
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.8,"ignoretimescale",true));
	Application.backgroundLoadingPriority = ThreadPriority.Low;
	var async : AsyncOperation = Application.LoadLevelAsync ("Game");
	*/
}


function Downtown()
{
	
	panelController.HidePausePanel("Downtown");	
	/*
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.8,"ignoretimescale",true));
	pm.SetNextLevelToLoad("Submenu");
	Application.backgroundLoadingPriority = ThreadPriority.Low;
	var async : AsyncOperation = Application.LoadLevelAsync ("GameOver");
	*/
}

