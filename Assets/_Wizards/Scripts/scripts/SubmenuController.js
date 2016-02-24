var left:GameObject;
var right:GameObject;
var goback:GameObject;

var ray : Ray;
var hit : RaycastHit;
var cameraFade:CameraFade;
var cam:GameCamera;
var path:PlayerPath;


var submenuState:SubmenuState;


var touched:boolean=false;
var touchPos:Vector3;
var moveSpeed : float;
var acceleration:float=0.0;

var pm:ProfileManager;

var mapPos:Vector3;
var statisticsPos:Vector3;
var achievementPos:Vector3;
var shopPos:Vector3;
var subMenuPos:Vector3;

var achievementTarget:GameObject;
var secrectTarget:GameObject;

var statistics:GameObject;

var statisticsInfo:exSpriteFont;

//Current
var missCount:int;
var poorCount:int;
var goodCount:int;
var perfectCount:int;
var maxCombo:int;
var maxChain:int;
var maxHeight:int;
var scoreCount:int;
var explosionCount:int;
var secrectCount:int;
var hatCount:int;
var wizardLevel:int;
var wizardRank:String;


var bgmManager:BgmManager;
var am:AudioManager;

var spider:GameObject;
var spiderline:exSprite;

var socrates:secrectDialog;
var socratehead:exSpriteAnimation;

var totalSecrets : int = 0;
var totalExplosions : int = 0;

enum SubmenuState
{
	None,
	Submenu,
	Achievement,
	Statistics,
	Shop,
	Secrect
}

function CaculateRank(_level:int):String
{
	return pm.GetRankName( _level-1);
}

//level>=0
function GetLevelScoreByLevel(_level:int):int
{
	return (Mathf.Log(_level+1,2)*10000);
}

function CaculateLevel(_exp:int):int
{
	var level=0;
	while (_exp>=GetLevelScoreByLevel(level) )
	{
		_exp-=GetLevelScoreByLevel(level);
		level++;
	}
	return (level-1);
}

function InitStatistics()
{
	//Current
	missCount=pm.GetRecord(Record.LifeTimeMiss);
	poorCount=pm.GetRecord(Record.LifeTimePoor);
	goodCount=pm.GetRecord(Record.LifeTimeGood);
	perfectCount=pm.GetRecord(Record.LifeTimePerfect);
	maxCombo=pm.GetRecord(Record.MaxCombo);
	maxChain=pm.GetRecord(Record.MaxChain);	
	maxHeight=pm.GetRecord(Record.MaxHeight);
	scoreCount=pm.GetRecord(Record.LifeTimeScore);
	
	explosionCount=0;
	secrectCount=0;
	hatCount=0;
	wizardLevel=CaculateLevel(scoreCount);
	wizardRank=CaculateRank(wizardLevel);
	
    if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Need to fix these counters...they are hardcoded");
	
	totalExplosions = FireworkExplosion.GetValues(FireworkExplosion).length;
	for (var i=0;i<totalExplosions;i++)
	{	
		if (pm.GetFireworkExplosion(i))
		{
			explosionCount++;		
		}
	}
	
	totalSecrets = Secrect.GetValues(Secrect).length;
	
	for (var j=0;j<totalSecrets;j++)
	{	
		if (pm.GetSecrect(j))
		{
			secrectCount++;		
		}
	}
	
	if ( Wizards.Utils.DEBUG == true ) Debug.LogWarning("Hardcoded level values here");
	for (var k=0;k<12;k++) // 12 -> This should be num stages
	{
		if (pm.GetLifeTimeHatCount(k))
		{
			hatCount++;
		}
	}

}

function Awake()
{
	this.gameObject.name = "Submenu";
	cam=GameObject.Find("TiltCamera").GetComponent(GameCamera);
	cameraFade=Camera.main.GetComponent(CameraFade);
	path=GameObject.Find("Map").GetComponent(PlayerPath);
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager);
	bgmManager=GameObject.Find("BgmManager").GetComponent(BgmManager);
	am=GameObject.Find("AudioManager").GetComponent(AudioManager);
}

function Start()
{
	InitStatistics();
	left.transform.localPosition.x=-50;
	right.transform.localPosition.x=50;
	goback.transform.localPosition.x=10;
	achievementTarget.transform.position.y=205;
	
	statistics.transform.position.x=-60;
	//statistics.transform.localScale.x=0;
	//statistics.transform.localScale.y=0;
}


function GotoSubMenu()
{
	submenuState=SubmenuState.Submenu;
	iTween.MoveTo(left,iTween.Hash("isLocal",true,"x",-15,"y",0,"z",0,"time",1,"delay",0.2,"easeType",iTween.EaseType.easeInOutQuad));
	iTween.MoveTo(right,iTween.Hash("isLocal",true,"x",17,"y",-20,"z",80,"time",1,"easeType",iTween.EaseType.easeInOutQuad));
}

function LeaveSubmenu()
{
	iTween.MoveTo(left,iTween.Hash("isLocal",true,"x",-50,"y",0,"z",0,"time",1.5,"easeType",iTween.EaseType.easeInOutQuad));
	iTween.MoveTo(right,iTween.Hash("isLocal",true,"x",50,"y",-20,"z",80,"time",1.5,"easeType",iTween.EaseType.easeInOutQuad));
}

function GotoStatistics()
{
	if (submenuState==SubmenuState.Submenu)
	{
		am.magicButton.Play();
		submenuState=SubmenuState.Statistics;
		LeaveSubmenu();
		
		ShowStatistics();
		iTween.MoveTo(statistics,iTween.Hash("x",0,"time",1.8,"easeType",iTween.EaseType.easeInOutQuad));
		iTween.MoveTo(cameraFade.gameObject,iTween.Hash("islocal",true,"time",1.8,"z",150,"easeType",iTween.EaseType.easeInOutQuad));
		iTween.MoveTo(goback,iTween.Hash("isLocal",true,"x",-29,"y",-35,"z",-20,"time",1.0,"delay",0.8,"easeType",iTween.EaseType.easeInOutQuad));
	}
}

function ShowStatistics()
{
	statisticsInfo.text="wizard level                         lv."+wizardLevel+"\n"+
						"wizard rank                         "+wizardRank+"\n"+
						"total perfect                       "+perfectCount+"\n"+
						"total good                            "+goodCount+"\n"+
						"total poor                            "+poorCount+"\n"+
						"total miss                            "+missCount+"\n"+
						"max height                            "+maxHeight+"\n"+
						"max combo                           "+maxCombo+"\n"+
						"max chain                             "+maxChain+"\n"+
						"total score                         "+scoreCount+"\n"+
						"explosion unlocked         " + explosionCount + "/" + totalExplosions + "\n"+
						"secrets collected          " + secrectCount + "/" + totalSecrets + "\n";

}

function LeaveStatistics()
{
	am.magicButton.Play();
	iTween.MoveTo(statistics,iTween.Hash("x",-60,"time",1.2,"easeType",iTween.EaseType.easeInOutQuad));
	//iTween.MoveAdd(cam.gameObject,iTween.Hash("time",1.2,"z",-150));
	iTween.MoveTo(cameraFade.gameObject,iTween.Hash("islocal",true,"time",1.2,"z",0,"easeType",iTween.EaseType.easeInOutQuad));
	iTween.MoveTo(goback,iTween.Hash("isLocal",true,"x",10,"y",-35,"z",-20,"time",1.0,"easeType",iTween.EaseType.easeInOutQuad));
	GotoSubMenu();
}

function GotoMap()
{
	if (submenuState==SubmenuState.Submenu)
	{
		am.magicButton.Play();
		submenuState=SubmenuState.None;
		
		
		
		if (path.currentScene=="Submenu")
		{
			iTween.MoveTo(cam.gameObject,iTween.Hash("time",2,"y",path.path[path.targetPointIndex].transform.position.y,"oncompletetarget",cam.gameObject,"oncomplete","ShowButton","easeType",iTween.EaseType.easeInOutQuad));	
		}
		else if (path.currentScene=="GameOver")
		{
			path.hatDisplay.ShowHatCount();
			iTween.MoveTo(cam.gameObject,iTween.Hash("time",2,"y",path.path[path.targetPointIndex].transform.position.y,"oncompletetarget",cam.gameObject,"oncomplete","ShowButtonAndResult","easeType",iTween.EaseType.easeInOutQuad));	
		}
	}
}

function GotoAchievement()
{
	if (submenuState==SubmenuState.Submenu)
	{
		am.magicButton.Play();
		submenuState=SubmenuState.Achievement;
		//iTween.MoveTo(cam.gameObject,iTween.Hash("time",1,"y",70,"easeType",iTween.EaseType.easeInOutQuad));
		//cam.ShowStatistics();
		cam.SetTarget(achievementTarget);
		cam.ShowDowntownButton();
	}
}

function LeaveAchievement()
{
	submenuState=SubmenuState.Submenu;
	iTween.MoveTo(cam.gameObject,iTween.Hash("time",1,"y",-17,"easeType",iTween.EaseType.easeInOutQuad));
	cam.SetTarget(null);
	cam.HideDowntownButton();
}

function GotoSecrect()
{
	if (submenuState==SubmenuState.Submenu)
	{
		am.magicButton.Play();
		submenuState=SubmenuState.Secrect;
		//iTween.MoveTo(cam.gameObject,iTween.Hash("time",1.5,"y",-110,"easeType",iTween.EaseType.easeInOutQuad));
		secrectTarget.transform.position.y=-150;
		cam.SetTarget(secrectTarget);
		
		secrectTarget.transform.position.y=-150;
		spider.transform.position.y=secrectTarget.transform.position.y-25;
		socratehead.transform.position.y=secrectTarget.transform.position.y-25;
		
		
		socrates.Say("Welcome to my Underground World. My name is Socrates, nice to meet you !");
		iTween.MoveTo(socratehead.gameObject,iTween.Hash("time",2,"y",secrectTarget.transform.position.y-25,"easeType",iTween.EaseType.easeInOutQuad));
	}
}

function LeaveSecrect()
{
	am.magicButton.Play();
	submenuState=SubmenuState.Submenu;
	iTween.MoveTo(cam.gameObject,iTween.Hash("time",1,"y",-17,"easeType",iTween.EaseType.easeInOutQuad));
	cam.SetTarget(null);
	
	//secrectTarget.transform.position.y=-150;
	//spider.transform.position.y=secrectTarget.transform.position.y-25;
	//socratehead.transform.position.y=secrectTarget.transform.position.y-25;
	
	socrates.Hide();
}

function Update () 
{
	//ProcessInput();
	if (submenuState==SubmenuState.Achievement)
	{
		ProcessScroll();
	}
	else if (submenuState==SubmenuState.Secrect)
	{
		ProcessSecrectScroll();
	}
}

function MainmenuHit()
{
	am.magicButton.Play();
	cameraFade.FadeTo(this.gameObject,"MainMenu",1.5);
}

function MainMenu()
{
	//Application.LoadLevel("MainMenu");
	pm.SetNextLevelToLoad("MainMenu");
	Application.LoadLevel("LevelLoader");
}

function GotoShopHit()
{
	cameraFade.FadeTo(this.gameObject,"GotoShop");
}

function GotoShop()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTOSHOP");
	if (submenuState==SubmenuState.Submenu)
	{
		cameraFade.gameObject.transform.position=shopPos;
		bgmManager.FadeBGM(bgmManager.menuBGM,BGM.Shop);
		submenuState = SubmenuState.Shop;
		
		var random:int=Random.Range(0,5);
		
		if ( pm.IsFirstTimeInShop() == true) // Calling this will set the shop visited flag to true automatically.
		{
			random = 3;
		}
		am.PlayOneShotAudio(am.jesterVoice[random],am.voiceVol);
	}
}

function RetryHit()
{
	cameraFade.FadeTo(this.gameObject,"Retry");
}

function Retry()
{
	pm.SetNextLevelToLoad("Game");
	Application.LoadLevel("LevelLoader");
}

function ResetAchievement()
{
	pm.ResetLifeTimeStats();
	var achievementbanner:Component[];
	achievementbanner=this.gameObject.GetComponentsInChildren(AchievementBanner);
	for (var a:AchievementBanner in achievementbanner)
	{
		a.Reset();
	}
}

function PerformTap(_ray:Ray)
{
	if (Physics.Raycast(_ray, hit, 1500.0) )
	{
       	if ( hit.transform.name == "spiderbody" )
    	{
    		touched=false;
    		LeaveSecrect();
    	}
    }
}

function ProcessSecrectScroll()
{
	secrectTarget.transform.position.y=Mathf.Clamp(secrectTarget.transform.position.y,-340,-150);
	
	
	
	spiderline.scale.y=-spider.transform.localPosition.y*0.5-54.5;
	
	//socrates.transform.position.y=secrectTarget.transform.position.y-30;
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		
		if ( touch.phase == TouchPhase.Began )
		{
			
			touchPos=touch.position;
			touched=true;
			
			ray = Camera.main.ScreenPointToRay(touch.position);
			
			PerformTap(ray);
			
			if (socrates.showing)
			{
				socrates.Hide();
			}
		}
		
		if ( touch.phase == TouchPhase.Moved && touched)
		{
			var screenPos:Vector3= touch.position;
			 
			
			secrectTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			/*
			if (touch.deltaTime>0)
			{
				secrectTarget.transform.position.y-=touch.deltaPosition.y/touch.deltaTime*Time.deltaTime;
			}
			*/
			touchPos= touch.position;
			
		}
		
		if ( touch.phase == TouchPhase.Ended && touched)
		{
			touched=false;
			iTween.Stop(spider.gameObject);
			
			iTween.MoveTo(spider.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-25,"easeType",iTween.EaseType.spring));
			iTween.MoveTo(socratehead.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-25,"easeType",iTween.EaseType.easeInOutQuad));
			//iTween.MoveTo(socrates.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-20,"easeType",iTween.EaseType.easeInOutQuad));
			
		}
	}
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonUp(0) )
	{
		if (touched)
		{
			touched=false;
			iTween.Stop(spider.gameObject);
			
			iTween.MoveTo(spider.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-25,"easeType",iTween.EaseType.spring));
			iTween.MoveTo(socratehead.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-25,"easeType",iTween.EaseType.easeInOutQuad));
			//iTween.MoveTo(socrates.gameObject,iTween.Hash("time",1,"y",secrectTarget.transform.position.y-20,"easeType",iTween.EaseType.easeInOutQuad));
		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		touched=true;
		touchPos=Input.mousePosition;
		
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		PerformTap(ray);
		
		if (socrates.showing)
		{
			socrates.Hide();
		}
		
	}
	else 
	{
		if (touched)
		{
			screenPos=Input.mousePosition;
			secrectTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			touchPos= Input.mousePosition;

		
		}
		
	}
	#endif
}

function ProcessScroll()
{
	
	achievementTarget.transform.position.y=Mathf.Clamp(achievementTarget.transform.position.y,60,205);
	
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		
		if ( touch.phase == TouchPhase.Began )
		{
			
			touchPos=touch.position;
			touched=true;
		}
		
		if ( touch.phase == TouchPhase.Moved && touched)
		{
			var screenPos:Vector3= touch.position;
			/*
			if (touch.deltaTime>0)
			{
				achievementTarget.transform.position.y-=touch.deltaPosition.y/touch.deltaTime*Time.deltaTime;
			}
			*/
			achievementTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			touchPos= touch.position;
			
		}
		
		if ( touch.phase == TouchPhase.Ended && touched)
		{
			touched=false;
		}
	}
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonUp(0) )
	{
		if (touched)
		{
			touched=false;
			
		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		touched=true;
		touchPos=Input.mousePosition;
		
	}
	else 
	{
		if (touched)
		{
			screenPos=Input.mousePosition;
			achievementTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			touchPos= Input.mousePosition;

		
		}
		
	}
	#endif
}

function GotoGameCenter()
{
	// if (GameCenterBinding.isGameCenterAvailable())
	// {
	// 	if (GameCenterBinding.isPlayerAuthenticated())
	// 	{	
	// 		GameCenterBinding.showLeaderboardWithTimeScope(GameCenterLeaderboardTimeScope.Week);
	// 	}
		
	// 	//upload achievements
	// 	for (var i:int=0;i<17;i++)
	// 	{
	// 		if (pm.GetAchievement(i)!=0)
	// 		{
	// 			GameCenterBinding.reportAchievement(""+i,100);
	// 		}
	// 	}
	// }
}