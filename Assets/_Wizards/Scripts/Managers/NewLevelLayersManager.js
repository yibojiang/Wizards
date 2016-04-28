private static var instance : NewLevelLayersManager;
 
public static function Instance() : NewLevelLayersManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<NewLevelLayersManager>();
    return instance;
}
private var layerManager:LayerManager;
private var pm:ProfileManager;
private var gm:GameManager;
private var sm:StageManager;
private var lm:LevelManager;
private var layerSL:LayerSaveAndLoad;
private var panelController:PanelController;
private var waitForNoFireworks = false;
private var ls:LevelSelector;
private var em : EventManager;

var ff:FireworkFactory;

var titleText:exSpriteFont;
var subTitleText:exSpriteFont;

var wizard : WizardControl;
var wizardBroom:WizardControl;
var totoAnimation:GameObject;

var fairy : GameObject;

var audienceBar:AudienceBar;
var bgmManager:BgmManager;
var am:AudioManager;
var currentStageIndex:int=0;
var wm:WizardLevelManager;


var stageIndex:int=0;

private var timerController:TimerController;

var catBoard:boolean=false;

var stageDuration:float[];


var scrollingText:ScrollingText;

var cam:CameraFade;

var canPauseFireWorks : boolean = false;
var canShowCatBoard : boolean = false;
var canScroll : boolean = false;
var canZoom : boolean = false;
var canScale : boolean = false;
var canShowTitleWithName : boolean = true;

function Awake()
{
	useGUILayout = false;
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager) as LayerManager;
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	gm=GameObject.Find("GameManager").GetComponent(GameManager) as GameManager;
	sm=GameObject.Find("StageManager").GetComponent(StageManager);
	layerSL=GameObject.Find("LayerSaveAndLoad").GetComponent(LayerSaveAndLoad) as LayerSaveAndLoad;
	
	em = GameObject.Find("EventManager").GetComponent(EventManager) as EventManager;

	panelController=GameObject.Find("PanelController").GetComponent(PanelController) as PanelController;
	bgmManager=GameObject.Find("AudioManager").GetComponent(BgmManager) as BgmManager;
	am=bgmManager.GetComponent(AudioManager);
	wizard=GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
	wizardBroom=GameObject.Find("WizardBroom").GetComponent(WizardControl);
	
	
	
	
	timerController=GameObject.Find("TimerController").GetComponent(TimerController);
	
	SetCheckPoint();
}

function Start()
{
	// lm = GameObject.Find("LevelManager").GetComponent(LevelManager) as LevelManager;
	lm=LevelManager.Instance();

	gm.ShowChainCount();
	
	wizard.SetCharacterState(CharacterState.Stand);
	wizardBroom.SetCharacterState(CharacterState.Broom);
	catBoard=false;
	
	//TODO
	pm.SetLevelCheckPoint(0);
	currentStageIndex=0;
	stageIndex=0;
	LoadStage(currentStageIndex);
	
	//set the iphone screen dark false.
	//iPhoneSettings.screenCanDarken=false;
	//Screen.sleepTimeout = SleepTimeout.NeverSleep;
	
	layerManager.Pause();
	lm.PauseFireworks();
	wizard.freeze=true;
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage0);

	//crow
	SetDelayFunction(0,"PlayAudio", iTween.Hash("audio",am.audience[0],"volume",am.audienceVol)); // Added
	
	//Stage 0
	var timeToStage0:float=3;
	SetDelayFunction(timeToStage0,"ShowTitleWithName", iTween.Hash("title","Stage 0","subTitle","Proving Ground"));  // Added
	SetDelayFunction(2,"PlayInGameBGM"); // Added
	
	//Pause Fireworks
	SetDelayFunction(timeToStage0+stageDuration[0]-5,"PauseFireworks"); // Added
	

	//SetDelayFunction(60,"ShowCatBoardOnly");
	SetDelayFunction(timeToStage0+stageDuration[0],"ShowCatBoardOnly"); // Added
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage1);
	//Stage 1
	var timeToStage1:float=stageDuration[0]+10;
	SetDelayFunction(timeToStage1,"ShowTitleWithName",iTween.Hash("title","Stage 1","subTitle","And So It Begins...")); // Added
	
	
	
	//Pause Fireworks
	SetDelayFunction(timeToStage1+stageDuration[1]-5,"PauseFireworks"); // Added
	//SetDelayFunction(150,"ShowCatBoardOnly");
	SetDelayFunction(timeToStage1+stageDuration[1],"ShowCatBoardOnly");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage2);
	//Stage 2
	var timeToFly:float=timeToStage1+stageDuration[1]+10;
	
	var timeToStage2:float=timeToFly+5;
	SetDelayFunction(timeToStage2,"ShowTitle");
	
	//wizard on the ground.
	SetDelayFunction(timeToFly,"WizardOnTheGround");
	
	//background scale
	SetDelayFunction(timeToFly+0.3,"Scale",iTween.Hash("amount",0.5,"time",5));
	
	
	//background scroll.
	for (var i:int=1;i<=5;i++)
	{
		SetDelayFunction(timeToFly+i*0.1,"Scroll",iTween.Hash("speed",i*0.1));
	}
	
	//background scale resume
	SetDelayFunction(timeToFly+6,"ScaleResume",iTween.Hash("time",5));
	
	//wizard flies up.
	SetDelayFunction(timeToFly+6,"WizardFly");
	
	//Change BGM 359.
	SetDelayFunction(359,"ChangeBGM",iTween.Hash("bgm",BGM.AREA1));
	
	//crow TODO
	SetDelayFunction(timeToFly+6,"PlayAudio", iTween.Hash("audio",am.audience[0],"volume",am.audienceVol*5));
	
	var timeToScale:float=timeToFly+10.5;
	var randomScale:float;
	var scaleInterval=4;
	
	for (var j:int=0;j<10;j++)
	{
		randomScale=Random.Range(0.1,0.15);
		SetDelayFunction(timeToScale+scaleInterval*j*2,"Scale",iTween.Hash("amount",randomScale,"time",scaleInterval));
		SetDelayFunction(timeToScale+scaleInterval*(2*j+1),"ScaleResume",iTween.Hash("time",scaleInterval));
	}
	
	SetDelayFunction(timeToFly+100,"WizardToBackGround");
	SetDelayFunction(timeToFly+100,"SetScale",iTween.Hash("amount",1.4,"time",8));
	
	/*
	var timeToUpDown=timeToFly+116;
	
	for (var i2:int=0;i2<2;i2++)
	{
		SetDelayFunction(timeToUpDown+i2,"Scroll",iTween.Hash("speed",-0.5));
		SetDelayFunction(timeToUpDown+2+i2,"Scroll",iTween.Hash("speed",0.5));
		SetDelayFunction(timeToUpDown+4+i2,"Scroll",iTween.Hash("speed",-0.5));
		SetDelayFunction(timeToUpDown+6+i2,"Scroll",iTween.Hash("speed",0.5));
		SetDelayFunction(timeToUpDown+8+i2,"Scroll",iTween.Hash("speed",-0.5));
		SetDelayFunction(timeToUpDown+10+i2,"Scroll",iTween.Hash("speed",0.5));
		SetDelayFunction(timeToUpDown+12+i2,"Scroll",iTween.Hash("speed",-0.5));
		SetDelayFunction(timeToUpDown+14+i2,"Scroll",iTween.Hash("speed",0.5));
		SetDelayFunction(timeToUpDown+16+i2,"Scroll",iTween.Hash("speed",-0.5));
		SetDelayFunction(timeToUpDown+18+i2,"Scroll",iTween.Hash("speed",0.5));
	}
	*/
	
	SetDelayFunction(timeToStage2+stageDuration[2]-5,"PauseFireworks");
	
	//Show CatBoard and Load
	//SetDelayFunction(timeToFly+173,"ShowCatBoard");
	SetDelayFunction(timeToStage2+stageDuration[2],"ShowCatBoard");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage3);
	//Stage 3
	var timeToStage3:float=timeToStage2+stageDuration[2]+10;
	
	
	//scale resume
	SetDelayFunction(timeToStage3,"ScaleResume",iTween.Hash("time",8));
	
	
	SetDelayFunction(timeToStage3+9,"WizardBackToLayer");
	
	
	//start scroll 90 secs
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("This timer is not being triggered?");
	SetDelayFunction(timeToStage3,"Scroll",iTween.Hash("speed",3)); 
	
	//stop for 30 secs
	SetDelayFunction(timeToStage3+60,"Scroll",iTween.Hash("speed",0));
	
	//scroll again 30 secs
	SetDelayFunction(timeToStage3+90,"Scroll",iTween.Hash("speed",4));
	
	//stop for 30 secs
	SetDelayFunction(timeToStage3+stageDuration[3]-5,"PauseFireworks");
	
	//Show CatBoard and Load
	SetDelayFunction(timeToStage3+stageDuration[3],"ShowCatBoard");
	
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage4);
	//Stage 4
	//var timeToStage4:float=timeToStage3+135;
	var timeToStage4:float=timeToStage3+stageDuration[3]+10;
	
	SetDelayFunction(timeToStage4,"Scroll",iTween.Hash("speed",2));//(5 screens 150m)
	
	SetDelayFunction(timeToStage4+stageDuration[4]-5,"PauseFireworks");
	
	SetDelayFunction(timeToStage4+stageDuration[4],"ShowCatBoard");
	
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage5);
	//Stage 5  Area2
	//var timeToStage5:float=timeToStage4+135;
	var timeToStage5:float=timeToStage4+stageDuration[4]+10;
	
	SetDelayFunction(timeToStage5,"Scroll",iTween.Hash("speed",2));//(5 screens 150m)
	SetDelayFunction(timeToStage5,"ChangeBGM",iTween.Hash("bgm",BGM.AREA2));
	
	SetDelayFunction(timeToStage5+stageDuration[5]-5,"PauseFireworks");
	SetDelayFunction(timeToStage5+stageDuration[5],"ShowCatBoard");
	
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage6);
	//Stage 6
	var timeToStage6:float=timeToStage5+stageDuration[5]+10;
	SetDelayFunction(timeToStage6,"Scroll",iTween.Hash("speed",2));//(3 screens 90m)
	
	SetDelayFunction(timeToStage6+stageDuration[6]-5,"PauseFireworks");
	SetDelayFunction(timeToStage6+stageDuration[6],"ShowCatBoard");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage7);
	//Stage 7
	var timeToStage7:float=timeToStage6+stageDuration[6]+10;
	SetDelayFunction(timeToStage7,"Scroll",iTween.Hash("speed",2));//(3 screens 90m)
	
			
	for (var i3:int=0;i3<2;i3++)
	{
		SetDelayFunction(timeToStage7-5+i3,"Scroll",iTween.Hash("speed",i3*4));
	}
	
	SetDelayFunction(timeToStage7+stageDuration[7]-5,"PauseFireworks");
	SetDelayFunction(timeToStage7+stageDuration[7],"ShowCatBoard");
	
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage8);
	//Stage 8
	var timeToStage8:float=timeToStage7+stageDuration[7]+10;
	SetDelayFunction(timeToStage8,"ChangeBGM",iTween.Hash("bgm",BGM.AREA3));
	SetDelayFunction(timeToStage8,"WizardBackToLayer");
	
	for (var i1:int=0;i1<2;i1++)
	{
		SetDelayFunction(timeToStage8-22+i1,"Scroll",iTween.Hash("speed",1));
		SetDelayFunction(timeToStage8-20+i1,"Scroll",iTween.Hash("speed",-1));
		SetDelayFunction(timeToStage8-18+i1,"Scroll",iTween.Hash("speed",1));
		SetDelayFunction(timeToStage8-16+i1,"Scroll",iTween.Hash("speed",-1));
		SetDelayFunction(timeToStage8-14+i1,"Scroll",iTween.Hash("speed",1));
		SetDelayFunction(timeToStage8-12+i1,"Scroll",iTween.Hash("speed",-1));
		SetDelayFunction(timeToStage8-10+i1,"Scroll",iTween.Hash("speed",1));
		SetDelayFunction(timeToStage8-8+i1,"Scroll",iTween.Hash("speed",-1));
		SetDelayFunction(timeToStage8-6+i1,"Scroll",iTween.Hash("speed",1));
		SetDelayFunction(timeToStage8-4+i1,"Scroll",iTween.Hash("speed",-1));
	}
	SetDelayFunction(timeToStage8-2,"Scroll",iTween.Hash("speed",0));
	
	for (var k:int=0;k<5;k++)
	{
		SetDelayFunction(timeToStage8+k,"Scroll",iTween.Hash("speed",k*4));
	}
	
	SetDelayFunction(timeToStage8+5,"Scroll",iTween.Hash("speed",20));//(21 screens 630m)
	
	for (var l:int=0;l<5;l++)
	{
		SetDelayFunction(timeToStage8+30+l,"Scroll",iTween.Hash("speed",(5-l)*4));
	}
	
	
	SetDelayFunction(timeToStage8+stageDuration[8]-5,"PauseFireworks");
	SetDelayFunction(timeToStage8+stageDuration[8],"ShowCatBoard");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage9);
	//Stage 9
	var timeToStage9:float=timeToStage8+stageDuration[8]+10;
	SetDelayFunction(timeToStage9,"WizardBackToLayer");
	
	SetDelayFunction(timeToStage9,"Scroll",iTween.Hash("speed",2));//(19~20 screens 580m)
	SetDelayFunction(timeToStage9+stageDuration[9]-5,"PauseFireworks");
	SetDelayFunction(timeToStage9+stageDuration[9],"ShowCatBoard");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage10);
	//Stage 10
	var timeToStage10:float=timeToStage9+stageDuration[9]+10;
	SetDelayFunction(timeToStage10,"WizardBackToLayer");
	
	
	SetDelayFunction(timeToStage10,"Scroll",iTween.Hash("speed",1));//(2~3 screens 80m)
	//Pause Fireworks
	SetDelayFunction(timeToStage10+40,"Scroll",iTween.Hash("speed",0));
	SetDelayFunction(timeToStage10+stageDuration[10]-5,"PauseFireworks");
	SetDelayFunction(timeToStage10+stageDuration[10],"ShowCatBoardOnly");
	
	em.SetCurrentStageForLoadingEvents(EStage.Stage11);
	//Stage 11
	var timeToStage11:float=timeToStage10+stageDuration[10]+10;
	
	SetDelayFunction(timeToStage11,"GameFinished");
	
	
	SetDelayFunction(timeToStage11,"ChangeBGM",iTween.Hash("bgm",BGM.WIND));//chage to wind
	
	SetDelayFunction(timeToStage11,"Scroll",iTween.Hash("speed",1.5));
	SetDelayFunction(timeToStage11+15,"ShowTitleWithName",iTween.Hash("title","Final Stage","subTitle",""));
	
	SetDelayFunction(timeToStage11+20.1,"PauseFireworks");
	
	SetDelayFunction(timeToStage11+25,"ResumeFireworks");
	SetDelayFunction(timeToStage11+20,"ChangeBGM",iTween.Hash("bgm",BGM.FINAL));//chage to final stage bgm
	
	
	
	SetDelayFunction(timeToStage11,"SetFireworkZpos",iTween.Hash("Zpos",0));
	
	//2 mins later game finished
	//SetDelayFunction(timeToStage11+stageDuration[11],"FinalDialog");
	//SetDelayFunction(timeToStage11+stageDuration[11]+1,"GotoEndClip");
	
	//SetDelayFunction(10,"FinalDialog");
	//SetDelayFunction(10+2,"GotoEndClip");
	
}

function GameFinished()
{
	//gm.gameFinished=true; // This is set when player gets to end of final level, and enables the end movie clip and credits.
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Game only finished if Drageon defeated?");
}


function GotoEndClip()
{
	cam.FadeTo(this.gameObject,"GotoEndStory",1); // Fades out camera to black, fades in and calls GotoEndOfStory after 1 seconds.
}

function GotoEndStory()
{
	pm.SetSkipMovieClip(false); // Dont skip movie
	pm.SetNextLevelToLoad("SecrectEnding"); // Set flag to Secret ending
	Application.LoadLevel("EndStory"); // But then load EndStory
}

function PlayAudio(_params:Hashtable)
{
	am.PlayOneShotAudioParams(_params);
}

function PlayAudio(_effect : AudioEffect, _volume : float )
{
	am.PlayAudioEffect(_effect, _volume);
}

// Sets the starting z position for all fireworks
function SetFireworkZpos(_params:Hashtable)
{
	var _Zpos:float=_params["Zpos"];
	ff.SetFireworkZpos(_Zpos);
}

function SetFireworkZpos(_Zpos : float)
{
	ff.SetFireworkZpos(_Zpos);
}

// Sets a timer for the specified function
function SetDelayFunction(_delay:float,_completeFunction:String)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SIMPLE - DO(" + _completeFunction + ") @ " + _delay + " seconds");
	//return;
	//iTween.MoveAdd(this.gameObject,iTween.Hash("x",0,"time",0,"oncompletetarget",this.gameObject,"oncomplete",_completeFunction,"delay",_delay));
	
	//em.AddEvent(_delay, _completeFunction, null);
	return;
	//timerController.AddTimer(_delay,this.gameObject,_completeFunction);
}

function SetDelayFunction(_delay:float,_completeFunction:String,_params:Hashtable)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("COMPLEX Part A - DO(" + _completeFunction + ") @ " + _delay + " seconds");
	//if ( Wizards.Utils.DEBUG ) Debug.Log("COMPLEX Part B - OPTIONS:");
	
	//var optionNumber : int = 1;
	// for ( var param in _params)
	// {
	// 	if ( Wizards.Utils.DEBUG ) Debug.Log("Option " + optionNumber + ": " + param.GetType());
	// 	optionNumber++;
	// }
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetDelayFunction(params):: DO(" + _completeFunction + ") @ " + _delay);
	//return;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetDelayFunction(params):: PARAMS = " + _params.ToString());
	
	//em.AddEvent(_delay, _completeFunction, _params);
	return;
	//timerController.AddTimer(_delay,this.gameObject,_completeFunction,_params);
	//iTween.MoveAdd(this.gameObject,iTween.Hash("x",0,"time",0,"oncompletetarget",this.gameObject,"oncomplete",_completeFunction,"oncompleteparams",_params,"delay",_delay));
}

function PlayInGameBGM()
{
	bgmManager.inGameBGM.Play();
	wizard.freeze=false;
}

function ChangeBGM(_params:Hashtable)
{
	var _bgm:BGM=_params["bgm"];
	bgmManager.FadeBGM(bgmManager.inGameBGM,_bgm);
}

function ChangeBGM(_bgm : BGM)
{
	bgmManager.FadeBGM(bgmManager.inGameBGM,_bgm);
}

function FadeBGM()
{
	bgmManager.FadeOutAndStopBGM(bgmManager.inGameBGM);
}

// Attaches Wizards to background layer - currently set to happen in stage 2 when wizard flies
function WizardToBackGround()
{
	var bg=GameObject.Find("0BackgroundLayer");
	wizard.transform.parent=bg.transform;
	fairy.transform.parent = bg.transform;
}

// Attaches wizard Platform layer - Currently set to stages 3,8,9,10
function WizardBackToLayer()
{
	var bg=GameObject.Find("5PlatformLayer");
	wizard.transform.parent=bg.transform;
	fairy.transform.parent = bg.transform;
	
	iTween.ScaleTo(wizard.gameObject,iTween.Hash("x",0.77,"y",0.77,"time",8));
	
	iTween.MoveTo(wizard.gameObject,iTween.Hash("y",-10,"time",5,"oncompletetarget",this.gameObject));
	
	//iTween.ScaleTo(fairy.gameObject,iTween.Hash("x",0.77,"y",0.77,"time",8));
	
	//iTween.MoveTo(fairy.gameObject,iTween.Hash("y",-10,"time",5));
}

function WizardOnTheGround() // Currently set to happen during stage 2, at timetofly
{
	//var platform:GameObject=GameObject.FindGameObjectWithTag("Platform");
	var platform:GameObject=GameObject.Find("Stage0&1&2_Platform_18");
	
	wizard.transform.parent=platform.transform;
	fairy.transform.parent = platform.transform;
	wizardBroom.transform.parent=platform.transform;
	totoAnimation.transform.parent=platform.transform;
	iTween.MoveTo(fairy.gameObject,iTween.Hash("y",-20,"time",9, "delay", 2.0));
}

// Attaches wizards to castle layer, sets character to be on broom, scales wizard object.
function WizardFly() // happens in stage 2 at timetofly + 6, then calls Wizard fly up
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(Time.time+"called");
	var castle02:GameObject=GameObject.Find( "3CastleLayer02");
	wizard.transform.parent=castle02.transform;
	fairy.transform.parent=castle02.transform;
	wizard.SetCharacterState(CharacterState.OnBroom);

	
	iTween.ScaleTo(wizard.gameObject,iTween.Hash("x",0.77,"y",0.77,"time",8));
	iTween.ScaleTo(fairy.gameObject,iTween.Hash("x",0.77,"y",0.77,"time",2));
	
	wizard.tiltOn=false;
	iTween.MoveTo(wizard.gameObject,iTween.Hash("y",-10,"time",5,"oncompletetarget",this.gameObject,"oncomplete","WizardFlyUp"));
	iTween.MoveTo(fairy.gameObject,iTween.Hash("y",-7,"time",5));
	
}

//Destroys toto animations, destroy wizard broom,turns tilt on
function WizardFlyUp()
{
	Destroy(totoAnimation);
	Destroy(wizardBroom.gameObject);
	wizard.tiltOn=true;
	
}

// Zooms in/out
function Scale(_params:Hashtable)
{
	var _amount:float=_params["amount"];
	layerManager.Scale( layerManager.tiltLayers[LayerType.Castle02].transform.localScale.x + _amount  , _params["time"]  );
	
}

function Scale(_amount : float, _time : float )
{
	//while ( canScale == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Scale(): Waiting for canScale");
	//	yield;
	//}
	layerManager.Scale( layerManager.tiltLayers[LayerType.Castle02].transform.localScale.x + _amount  , _time  );
}

// Sets the scale
function SetScale(_params:Hashtable)
{
	var _amount:float=_params["amount"];
	layerManager.Scale( _amount , _params["time"]  );
}

function SetScale(_amount : float, _time : float )
{
	//while ( canScale == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("SetScale(): Waiting for canScale");
	//	yield;
	//}
	layerManager.Scale( _amount , _time);
}

// Sets scale to normal (1)
function ScaleResume(_params:Hashtable)
{
	var _time=_params["time"];
	layerManager.ScaleResume(_time);
}

function ScaleResume( _time : float )
{
	//while ( canScale == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("ScaleResume(): Waiting for canScale");
	//	yield;
	//}
	layerManager.ScaleResume(_time);
}

// Loads the graphics and background objects for the stage 
// Called by Start, ShowCatBoard, and Update function( when certain height has been reached)
function LoadStage(_index:int)
{
    if ( Wizards.Utils.DEBUG ) Debug.LogWarning("LOADING STAGE : " + _index);
	
	layerManager.DestroyLayersOutOfScreen();//Destory old stages assets
	Resources.UnloadUnusedAssets();//unload resource
	
	//Load LayerImage
	for (var i:int=0;i<sm.stageInfo[_index].layerImageInfo.length;i++)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Generating Layer Image: " + sm.stageInfo[_index].layerImageInfo[i].name );
		layerManager.GenerateLayer(sm.stageInfo[_index].layerImageInfo[i]);
	}
	
	//Load LayerObject
	for (var j:int=0;j<sm.stageInfo[_index].layerObjInfo.length;j++)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Generating Layer Object: " + sm.stageInfo[_index].layerObjInfo[j].prefabName );
		layerManager.GenerateLayerObject(sm.stageInfo[_index].layerObjInfo[j]);
	}
	
	for (var k:int=0;k<sm.stageInfo[_index].layerInfo.length;k++)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Applying Layer to LayerManager: " +  sm.stageInfo[_index].layerInfo[k].layerType);
		layerManager.SetLayer(sm.stageInfo[_index].layerInfo[k].layerType,sm.stageInfo[_index].layerInfo[k].scrollSpeed,sm.stageInfo[_index].layerInfo[k].tiltValue);
	}

	//can load next level data
}

// Only used for Stage 0, Stage 1, and Stage 11 (Title text comes from params)
function ShowTitleWithName(_params:Hashtable)
{
	if ( Wizards.Utils.DEBUG ) Debug.LogError("Dont call me?");
	titleText.gameObject.SetActiveRecursively(true);
	subTitleText.gameObject.SetActiveRecursively(true);
	titleText.text=_params["title"];
	subTitleText.text=_params["subTitle"];
	
	titleText.GetComponent(FadeFont).FadeIn(1,0);
	titleText.GetComponent(FadeFont).FadeOut(1,4);
	
	subTitleText.GetComponent(FadeFont).FadeIn(1,1.5);
	subTitleText.GetComponent(FadeFont).FadeOut(1,4);
	
	
	subTitleText.transform.localScale.x=1;
	subTitleText.transform.localScale.y=1;
	iTween.ScaleFrom(subTitleText.gameObject,iTween.Hash("time",0.4,"x",2,"y",0,"easetype",iTween.EaseType.easeInOutQuad,"delay",1.5) );
	
	yield WaitForSeconds(5);
	
	titleText.gameObject.SetActiveRecursively(false);
	subTitleText.gameObject.SetActiveRecursively(false);
	
	wizard.freeze=false;
	ResumeFireworks();
	pm.ResetLevelStats(); // Does what it says.
	gm.Reset(); // EMpty function, does nothing
	audienceBar.Show();
	audienceBar.isLock=false; // Enables the health drop (unless testmode is set on audience bar)
	catBoard=false; // Nothing found in File Search that references this so far.
	gm.ShowChainCount(); // Enables showing chain count
	
	//canScroll = true;
	//canZoom = true;
	//canScale = true;
	if ( Wizards.Utils.DEBUG ) Debug.Log("Level Should Resume Here");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("This is where the level resumes. There is no link here to resume scrolling");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Which makes scrolling completely independent of the fireworks firing, and");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("only dependent on the Timers that trigger the Scroll() function");
}

// Only used for Stage 0, Stage 1, and Stage 11 (Title text comes from params)
function ShowTitleWithName(_title : String, _subTitle : String)
{
	//if ( canShowTitleWithName == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for canShowTitleWithName");
	//	yield;
	//}
	titleText.gameObject.SetActiveRecursively(true);
	subTitleText.gameObject.SetActiveRecursively(true);
	titleText.text = _title;
	subTitleText.text= _subTitle;
	
	titleText.GetComponent(FadeFont).FadeIn(1,0);
	titleText.GetComponent(FadeFont).FadeOut(1,4);
	
	subTitleText.GetComponent(FadeFont).FadeIn(1,1.5);
	subTitleText.GetComponent(FadeFont).FadeOut(1,4);
	
	
	subTitleText.transform.localScale.x=1;
	subTitleText.transform.localScale.y=1;
	iTween.ScaleFrom(subTitleText.gameObject,iTween.Hash("time",0.4,"x",2,"y",0,"easetype",iTween.EaseType.easeInOutQuad,"delay",1.5) );
	
	yield WaitForSeconds(5);
	
	titleText.gameObject.SetActiveRecursively(false);
	subTitleText.gameObject.SetActiveRecursively(false);
	
	wizard.freeze=false;
	
	if ( em.currentStage != EStage.Stage11 )
	{
		ResumeFireworks();
	}
	pm.ResetLevelStats(); // Does what it says.
	gm.Reset(); // EMpty function, does nothing
	audienceBar.Show();
	audienceBar.StageCompleteRestoreHealthBonus(1.0);
	audienceBar.isLock=false; // Enables the health drop (unless testmode is set on audience bar)
	catBoard=false; // Nothing found in File Search that references this so far.
	gm.ShowChainCount(); // Enables showing chain count
	
	//canShowTitleWithName = false;
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Level Should Resume Here");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("This is where the level resumes. There is no link here to resume scrolling");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Which makes scrolling completely independent of the fireworks firing, and");
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("only dependent on the Timers that trigger the Scroll() function");
}

function ResumeFireworks()
{
	lm.ResumeFireworks();

}

function CanPauseFireWorks()
{
	canPauseFireWorks = true;
}

function CanShowCatBoard()
{
	canShowCatBoard = true;
}

function CanScroll()
{
	canScroll = true;
}

function CanZoom()
{
	canZoom = true;
}	

function PauseFireworks()
{
	if ( em.currentStage != EStage.Stage11 )
	{
		em.PauseGameTimer();
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("PAUSE FIREWORKS callED!");
	while ( canPauseFireWorks == false )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for can pause fireworks");
		yield;
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Pausing Fireworks!!!");
	lm.PauseFireworks();
	
	while ( lm.NumFireWorksOnScreen() > 0 )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("NUM FW ON SCREEN: " + lm.NumFireWorksOnScreen());
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for no fireworks on screen");
		yield;
	}
		
	em.ResumeGameTimer();
	
	 
	//if ( Wizards.Utils.DEBUG ) Debug.Log("can show catboard = true");
	//canShowCatBoard = true;
}

function PauseFireworksNoDelay()
{
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("PAUSE FIREWORKS callED!");
	

	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Pausing Fireworks NO DELAY!!!");
	lm.PauseFireworks();

}




// Called Always after ShowCatBoard (Stages 2-9) (Title text, comes from stageInfo)
function ShowTitle()
{
	titleText.gameObject.SetActiveRecursively(true);
	subTitleText.gameObject.SetActiveRecursively(true);
	titleText.text=sm.stageInfo[currentStageIndex].title;
	subTitleText.text=sm.stageInfo[currentStageIndex].subTitle;
	
	titleText.GetComponent(FadeFont).FadeIn(1,0);
	titleText.GetComponent(FadeFont).FadeOut(1,4);
	
	subTitleText.GetComponent(FadeFont).FadeIn(1,1.5);
	subTitleText.GetComponent(FadeFont).FadeOut(1,4);
	
	subTitleText.transform.localScale.x=1;
	subTitleText.transform.localScale.y=1;
	iTween.ScaleFrom(subTitleText.gameObject,iTween.Hash("time",0.4,"x",2,"y",0,"easetype",iTween.EaseType.easeInOutQuad,"delay",1.5) );
	
	yield WaitForSeconds(5);
	
	titleText.gameObject.SetActiveRecursively(false);
	subTitleText.gameObject.SetActiveRecursively(false);
	
	wizard.freeze=false;
	ResumeFireworks();
	pm.ResetLevelStats();
	//gm.Reset();
	audienceBar.Show();
	audienceBar.StageCompleteRestoreHealthBonus(1.0);
	audienceBar.isLock=false;
	catBoard=false;
	gm.ShowChainCount();
	
	//canScroll = true;
	//canZoom = true;
	//canScale = true;
	
	///if ( Wizards.Utils.DEBUG ) Debug.LogWarning("This is where the level resumes. There is no link here to resume scrolling");
	///.LogWarning("Which makes scrolling completely independent of the fireworks firing, and");
	//.LogWarning("only dependent on the Timers that trigger the Scroll() function");
}

// Just shows the catboard, no level load triggered, no title shown, Stage 0, 1, 10
function ShowCatBoardOnly()
{
	//while ( canShowCatBoard == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for can show catboard");
	//	yield;
	//}
	//canScroll = false;
	//canZoom = false;
	//canScale = false;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Showing Catboard");
	gm.HideChainCount();
	catBoard=true;
	SetCheckPoint();
	
	lm.PauseFireworks();
	wizard.freeze=true;
	audienceBar.Hide();
	audienceBar.isLock=true;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("About to show ratings notice");
	panelController.ShowRatingsNotice();
	//if ( Wizards.Utils.DEBUG ) Debug.Log("About to yield for 10 seconds");
	yield WaitForSeconds(10);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Finished yielding");
	stageIndex++;
	
	HideCatBoard();
	
		
	canPauseFireWorks = false;
	//canShowCatBoard = false;
	
	//yield WaitForSeconds(10.0);
	//canShowTitleWithName = true;
	//ShowTitle();
	
	em.NextStage();
}

// Shows the catboard, and then loads the next stage and shows title for next stage. Stages 2-9 used.
function ShowCatBoard()
{
	//while ( canShowCatBoard == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for can show catboard");
	//	yield;
	//}
	
	//canScroll = false;
	//canZoom = false;
	//canScale = false;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Showing Catboard");
	gm.HideChainCount();
	
	catBoard=true;
	SetCheckPoint();
	
	lm.PauseFireworks();
	wizard.freeze=true;
	audienceBar.Hide();
	audienceBar.isLock=true;
	panelController.ShowRatingsNotice();
	yield WaitForSeconds(9);
	currentStageIndex++;
	LoadStage(currentStageIndex);
	yield WaitForSeconds(1);
	stageIndex++;
	HideCatBoard();
	ShowTitle();
	
	canPauseFireWorks = false;
	//canShowCatBoard = false;

	
	em.NextStage();
	
	//Scroll(iTween.Hash("speed",0.5));//test
}

function HideCatBoard()
{
	panelController.HideRatingsNotice();
	//em.shiftTime = false;
}

function SetCheckPoint()
{
	//TODO: SET CHECKPOINT*********************//
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetCheckPoint...");

	pm.SetLevelCheckPoint(stageIndex);
	//pm.SetWizardLevel( wm.curLevel);
	//pm.SetLifeTimeScore(pm.GetLifeTimeScore()+pm.GetGameScore());
	pm.SaveAllRecord();
	PlayerPrefs.Save();
	
}
// Set the scroll speed, 0 == no scroll.
function Scroll(_params:Hashtable)
{
	//while ( canScroll == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for can Scroll");
	//	yield;
	//}
	
	var _speed:float;
	_speed=_params["speed"];
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Scroll() : Speed = " + _speed + "@ time " + lm.masterTimer);
	layerManager.Play(_speed);
	
	//canScroll = false;
}

function Scroll(_speed : float )
{
	//while ( canScroll == false )
	//{
	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Waiting for can Scroll");
	//	yield;
	//}
	
	layerManager.Play(_speed);
	
	//canScroll = false;
}


function FinalDialog()
{
	// TODO : Final Dialog - If beat boss and if dont beat boss!
	var normalDialog=new Dialog[2];
	for (var i:int=0;i<normalDialog.Length;i++)
	{
		normalDialog[i]=new Dialog();
	}
	normalDialog[0].character=Character.Javi;
	normalDialog[0].face=Face.Sad;
	normalDialog[0].text="Oh noooooo..\nnot again! Master definitely will kick our pepos now.";
	normalDialog[1].character=Character.Toto;
	normalDialog[1].face=Face.Normal;
	normalDialog[1].text="Miaowwww... for sure he will.\nHmm... strange. Where is he? He should be all over us by now !";
	
	
	scrollingText.SetDialog(normalDialog,0,1);
}

function FailDialog()
{
	var normalDialog=new Dialog[1];
	for (var i:int=0;i<normalDialog.Length;i++)
	{
		normalDialog[i]=new Dialog();
	}
	normalDialog[0].character=Character.Narratage;
	normalDialog[0].face=Face.Sad;
	normalDialog[0].text="You failed me...";
		
	scrollingText.SetDialog(normalDialog,0,0, true);
}

function DialogFinished() : boolean
{ 
	return ( scrollingText.dialogOver );
}


function ProcessInput()
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
				//if ( Wizards.Utils.DEBUG ) Debug.Log("hit");
			}
		 }
	}
}

function Update () 
{
	ProcessInput();
	pm.SetTempRecord(Record.GameHeight,layerManager.GetTravelHeight() );
	/*
	if (waitForNoFireworks)
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogError("Don't think this is in use anymore?");
		if ( lm.NumFireWorksOnScreen() == 0 )
		{
			waitForNoFireworks=false;
			ShowCatBoard();
		}
	}
	*/
	
	if (layerManager.initYSpeed>0) // SCROLLING LEVEL?
	{
		// currentStageIndex == current level/stage
		// travelHeight = Current height travelled
		// initYSpeed = seems to be initial and/or current level speed.
		// sm.stageInfo[currentStageIndex].endHeight = End height of current stage. (Both endheight and startheight are the same?
		//	( ( currentHeight - scrollSpeed - ( levelEndHeight - 3 ) ) * ( currentHeight - ( levelEndHeight - 3 ) ) < 0 )
		
		 // E.G., If scrolling level:
		 // ( ( 75 - 1 - (120 - 3 ) ) * ( 75 - ( 120 - 3 ) ) < 0 )
		 // ( ( 74 - ( 117 ) ) * ( 75 - 117 ) ) < 0 )
		 // ( ( 
		var levelHeightCheck : float = (layerManager.GetTravelHeight() - layerManager.initYSpeed - (sm.stageInfo[currentStageIndex].endHeight-3)  ) *
									   (layerManager.GetTravelHeight() - (sm.stageInfo[currentStageIndex].endHeight-3) );
		//if ( Wizards.Utils.DEBUG ) Debug.Log("YSPEED > 0 :: Level Height Check : " + levelHeightCheck);
		
		if ( levelHeightCheck <0 )
		{
			if (currentStageIndex<sm.stageInfo.length-1)
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("Calling LayerManager.Pause()");
				layerManager.Pause();
				
				//lm.PauseFireworks();
				//waitForNoFireworks=true;

				
			}
			else
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("Also Calling LayerManager.Pause()");
				layerManager.Pause();
			}
		}
	}
	else if (layerManager.initYSpeed<0)//TODO
	{
	
		levelHeightCheck = (layerManager.GetTravelHeight() - layerManager.initYSpeed - (sm.stageInfo[currentStageIndex].startHeight+3) )*
		 				   (layerManager.GetTravelHeight() - (sm.stageInfo[currentStageIndex].startHeight+3) );
		if ( Wizards.Utils.DEBUG ) Debug.Log("YSPEED < 0 :: Level Height Check : " + levelHeightCheck);
		if ( levelHeightCheck < 0 )
		{
			if (currentStageIndex>=1)
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("StageIndex >= 1");
				if ( Wizards.Utils.DEBUG ) Debug.Log("Calling LayerManager.Pause() AND REDUCING STAGE INDEX BY 1 THEN LOADING STAGE INDEX-Perhaps for backwards scrolling?");
				layerManager.Pause();
				currentStageIndex--;
				LoadStage(currentStageIndex);
			}
			else
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("StageIndex < 1");
				if ( Wizards.Utils.DEBUG ) Debug.Log("Calling LayerManager.Pause()");
				layerManager.Pause();
			}
		}
	}
	
	// Testing for loading stages
	if ( Input.GetKeyDown(KeyCode.L) )
	{
		LoadStage(8);	
	}
	
	if ( Input.GetKeyDown(KeyCode.K) )
	{
		LoadStage(4);	
	}

	
}

function LoadStageDirect(_stage : int )
{
	var levelToLoad : int = _stage; // 8 is actually level 10(or 9)? ...last level... 0 and 1 = on the ground / 2-10 = flying / 11 = boss battle / TOTAL 12 levels 
	
	// Need to unload current levels! (should happen in LoadStage!!)
	layerManager.Pause();
	
	var baseHeight : float = sm.stageInfo[levelToLoad - 1].startHeight;
	
    if ( Wizards.Utils.DEBUG ) Debug.Log("BASE HEIGHT : " + baseHeight);
	
	layerManager.DestroyAllLayers();
	
	for ( var i : int = 0; i < layerManager.tiltLayers.Length; ++i )
	{
		layerManager.tiltLayers[i].travelHeight = (baseHeight * layerManager.tiltLayers[i].scrollSpeed); // TODO - Multiply other layers by this value, but scale by scrollspeed of layer!!! :)
	}
	
	LoadStage(levelToLoad);
	
	// TODO : For stage 2 and above, wizard needs to fly
}

//************************************ OLD CODE ****************************************
/*
function  OnGUI()
{


	if ( GUI.Button(Rect(10,80,80,50), "Resume") )
	{
		layerManager.ScaleResume(0.5);
	}
	
	if ( GUI.Button(Rect(10,140,80,50), "Zoom In") )
	{
		layerManager.Scale(layerManager.castleLayer01.transform.localScale.x+0.2,0.5);
	}
	
	if ( GUI.Button(Rect(10,200,80,50), "Zoom Out") )
	{
		layerManager.Scale(layerManager.castleLayer01.transform.localScale.x-0.2,0.5);
	}
	
	if ( GUI.Button(Rect(220,80,80,50), "Resume") )
	{
		layerManager.MoveResume(0.5);
	}
	
	if ( GUI.Button(Rect(220,140,80,50), "Move Left") )
	{
		layerManager.Move(500,0.5);
	}
	
	if ( GUI.Button(Rect(220,200,80,50), "Move Right") )
	{
		layerManager.Move(-500,0.5);
	}


}
*/
