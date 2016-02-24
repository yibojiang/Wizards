var path:exSprite[];
var curPointIndex:int;
var targetPointIndex:int;
var maxPointIndex:int;

var cam:GameCamera;

var interval:float;
var further :GameObject;
var cameraFade:CameraFade;
var ray : Ray;
var hit : RaycastHit;
private var stage:int;
var downtownTarget:GameObject;
var pm:ProfileManager;
var submenuLoaded:boolean;
var submenuController:SubmenuController;
var subMenu:GameObject;

var shadow:exSprite;

var mapStartPos:Vector3;
var submenuControllerObj:GameObject;
var bgmManager:BgmManager;


var currentScene:String;

var mapTarget:GameObject;
var touched:boolean=false;
var touchPos:Vector3;

var test:boolean=false;
var testScene:DowntownScene;

var copperhat:GameObject;
var silverhat:GameObject;
var goldhat:GameObject;

private var mapStage:int=1;
var hats:int[];

var achievementManager:AchievementManagerMainMenu;

var mapMarker : GameObject;
var markerMoveTime : float = 0.33;
var mapMarkerMoveType : iTween.EaseType;
var camMoveTime : float = 2.0;
var camOffset : int = 3;
var markerOffset : int = 2;

var hatDisplay : HatCountDisplay;

private var sDM : StageDescriptionMaster;

enum DowntownScene
{
	Downtown,
	GameOver
}

function InitHat()
{
	hats=new int[12];
	for (var i:int=0;i<12;i++)
	{
		hats[i]=pm.GetLifeTimeHatCount(i);
	}
	
	if (achievementManager!=null)
	{
		if (achievementManager.achievementArray[Achievement.True_Wizard]==0)
		{
			CheckForAcheivement();
		}
	}
}

//GOLDEN HAT FOR EACH STAGE.
function CheckForAcheivement()
{
	
	for (var i:int=0;i<12;i++)
	{
		if (hats[i]!=3 && hats[i]!=6) // FIXED - was OR, now AND.
		{
			return;
		}
	}
	
	achievementManager.UnlockAchievement(Achievement.True_Wizard);
}

function Awake()
{
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		test = false;
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("PlayerPath : AWAKE");
	hatDisplay = GameObject.Find("HatCount").GetComponent(HatCountDisplay) as HatCountDisplay;
	sDM = GameObject.Find("StageDescriptionMaster").GetComponent(StageDescriptionMaster) as StageDescriptionMaster;
	GameResume();
	submenuLoaded=false;
	
	
	
	mapStage=0;
}



function GameResume()
{
	Time.timeScale=1.0;
}

function Start()
{
	InitHat();
	var totalHeight:float=30*37;
	var travelHeight:float;
	bgmManager.FadeInBGM(bgmManager.menuBGM,bgmManager.bgmVol);
	cam.HideButton();
	cam.HideResult();
	
	if (test)
	{
		if (testScene==DowntownScene.GameOver)
		{
			currentScene="GameOver";
		}
		else
		{
			currentScene="Submenu";
		}
	}
	else
	{
		if (pm.GetNextLevelToLoad()=="GameOver")
		{
			currentScene="GameOver";
			
		}
		else if (pm.GetNextLevelToLoad()=="Submenu")
		{
			currentScene="Submenu";
		}
	}
	
	
	var maxHeight:int;
	if (currentScene=="GameOver")
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("SCENE = GAMEOVER");
		travelHeight=pm.GetRecord(Record.GameHeight);
		if ( Wizards.Utils.DEBUG ) Debug.Log("TRAVEL HEIGHT = GAMEHEIGHT: " + travelHeight);
	    //For Debuging
	    //travelHeight=180;
	    //travelHeight=totalHeight;
	   	//pm.SetRecord(Record.MaxHeight,180);
	   	maxHeight=pm.GetRecord(Record.MaxHeight);
	   	if ( Wizards.Utils.DEBUG ) Debug.Log("MAX HEIGHT : " + maxHeight);
	   	if ( maxHeight == 0 )
	   	{
	   		maxHeight = travelHeight;
	   		pm.SetRecord(Record.MaxHeight, maxHeight);
	   		if ( Wizards.Utils.DEBUG ) Debug.Log("MAX HEIGHT ADJUSTED: " + maxHeight);
	   	}
	   		   	
	   	maxPointIndex= Mathf.Clamp( (maxHeight/totalHeight)*(path.Length -1),0, path.Length -1);
	   	if ( Wizards.Utils.DEBUG ) Debug.Log("maxPointIndex : " + maxPointIndex);
	   	
	   	
	   	// Cheat
	   	//travelHeight=pm.GetRecord(Record.MaxHeight); 
	   	//if ( Wizards.Utils.DEBUG ) Debug.Log("TRAVEL HEIGHT = MAXHEIGHT: " + travelHeight);
	   	
	    targetPointIndex= Mathf.Clamp( (travelHeight/totalHeight)*(path.Length -1),0, path.Length -1);
	    if ( Wizards.Utils.DEBUG ) Debug.Log("targetPointIndex : " + targetPointIndex);
	    
	    if (targetPointIndex>maxPointIndex)
	    {
	    	maxPointIndex=targetPointIndex;
	    	if ( Wizards.Utils.DEBUG ) Debug.Log("targetPointIndex > maxPointIndex: " + maxPointIndex);
	    }
		
		if ( Wizards.Utils.DEBUG ) Debug.Log("INITIATE MOVETOTARGETPOINT");
		if ( Wizards.Utils.DEBUG ) Debug.Log("targetPointIndex : " + targetPointIndex);
		MoveToTargetPoint(targetPointIndex);
		stage=0;

		cam.transform.position.y=275.7809;
		cam.transform.position.x=0;
	}
	else if (currentScene=="Submenu")
	{
		
		if ( Wizards.Utils.DEBUG ) Debug.Log("SCENE = SUBMENU");
		//InitMapMarker();
		ShowHats();
		yield WaitForSeconds(0.5);
		travelHeight=pm.GetRecord(Record.MaxHeight); 
		if ( Wizards.Utils.DEBUG ) Debug.Log("travelHeight=pm.GetRecord(Record.MaxHeight) : " + travelHeight);
		targetPointIndex= Mathf.Clamp( (travelHeight/totalHeight)*path.Length -1,0, path.Length -1);
		if ( Wizards.Utils.DEBUG ) Debug.Log("totalHeight : " + totalHeight);
		if ( Wizards.Utils.DEBUG ) Debug.Log("targetPointIndex : " + targetPointIndex);
		
		//pm.SetRecord(Record.MaxHeight,180);
		maxHeight=pm.GetRecord(Record.MaxHeight);
		if ( Wizards.Utils.DEBUG ) Debug.Log("maxHeight : " + maxHeight);
	   	maxPointIndex= Mathf.Clamp( (maxHeight/totalHeight)*path.Length -1,0, path.Length -1);
	   	if ( Wizards.Utils.DEBUG ) Debug.Log("maxPointIndex : " + maxPointIndex);
		
		
		cam.transform.position.y=-17;
		cam.transform.position.x=0;
		
		LoadSubMenu();
		
		shadow.GetComponent.<Renderer>().enabled=false;
		
		yield WaitForSeconds(1);
		submenuController.GotoSubMenu();
		submenuController.submenuState=SubmenuState.Submenu;
	}
	
}

function LoadSubMenu()
{
	var subM : GameObject = GameObject.Find("Submenu");
	
	if ( subM == null )
	{
		subMenu=Resources.Load("Prefab/SubMenu");
		submenuControllerObj=Instantiate(subMenu,Vector3(0,0,-300),Quaternion.identity);
	}
	else
	{
		submenuControllerObj = subM;
	}
	
	submenuControllerObj.name="Submenu";
	submenuController=submenuControllerObj.GetComponent(SubmenuController);
		
	submenuLoaded=true;
}

function ShowHats()
{
	var stageIndex=1;
	
	hatDisplay.SetNumHats(0);
	//hatDisplay.ShowHatCount();
	
	for (var i:int=0;i<path.Length;i++)
	{
		if (path[i].gameObject.name=="CheckPoint")
		{
			stageIndex++;
			var hatObj:GameObject;
			
			if ( Wizards.Utils.DEBUG ) Debug.Log("STAGEINDEX : " + stageIndex);
			if ( Wizards.Utils.DEBUG ) Debug.Log("HATCOUNT = " + hats[stageIndex]);
			
			if ( hats[stageIndex] == 6 )
			{
				sDM.ApplyStageAward(stageIndex, 3 );
			}
			else
			{
				sDM.ApplyStageAward(stageIndex, hats[stageIndex] );
			}
			if (hats[stageIndex]==0)
			{
				
				path[i].color.r=1.0;
				path[i].color.g=1.0;
				path[i].color.b=0.0;
				
			}
			else if (hats[stageIndex]==1)
			{
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(copperhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(1);
			}
			else if (hats[stageIndex]==2)
			{
				
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(silverhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(2);
			}
			else if (hats[stageIndex]==3)
			{
				if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Normally should not be called, unless testing");
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(goldhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(3);
			}
			else if (hats[stageIndex]==4)
			{
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(copperhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
			}
			else if (hats[stageIndex]==5)
			{
				if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Normally should not be called, unless testing");
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(silverhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
			}
			else if (hats[stageIndex]==6)
			{
				path[i].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(goldhat,path[i].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
				hatDisplay.AddNumHats(3);
			}
		}
		
	}
	
}

function Update () 
{	
	
	ProcessInput();
	
	
	ProcessScroll();
	

}

function InitMapMarker()
{
	for (var i:int=0;i<path.length;i++)
	{
		if (path[i].gameObject.name!="CheckPoint")
		{
			path[i].transform.localScale.x=0;
			path[i].transform.localScale.y=0;
		}
	}
}	

function MoveToTargetPoint(_index:int)
{
	InitMapMarker();
	cam.SetTargetEx(mapMarker, camMoveTime, iTween.EaseType.linear);
	//cam.transform.position.y = mapMarker.transform.position.y;
	//_index=path.Length-2;
	hatDisplay.SetNumHats(0);
	hatDisplay.ShowHatCount();
	while (curPointIndex<_index)
	{
		//yield WaitForSeconds(interval);
		
		// Update Path
		if (path[curPointIndex].gameObject.name=="CheckPoint")
		{

			Instantiate(further,path[curPointIndex].transform.position,Quaternion.identity);
			
			mapStage++;
			var hatObj:GameObject;
			if ( Wizards.Utils.DEBUG ) Debug.Log("MapStage:" + mapStage);
			if ( Wizards.Utils.DEBUG ) Debug.Log("Hats:" + hats[mapStage]);
			
			//hats[mapStage] = 2;
			
			if ( hats[mapStage] == 6 )
			{
				sDM.ApplyStageAward(mapStage + 1, 3 );
			}
			else
			{
				sDM.ApplyStageAward(mapStage + 1, hats[mapStage] );
			}
			if (hats[mapStage]==0)
			{
				
				path[curPointIndex].color.r=1.0;
				path[curPointIndex].color.g=1.0;
				path[curPointIndex].color.b=0.0;
				
				
				//hatObj=Instantiate(goldhat ,path[curPointIndex].transform.position,Quaternion.identity);
				
				//hatObj=Instantiate(copperhat,path[curPointIndex].transform.position,Quaternion.identity);
				//hatObj.GetComponent(Hat).ShowWings();
				//path[curPointIndex].gameObject.renderer.enabled=false;
				//hatObj=Instantiate(silverhat,path[curPointIndex].transform.position,Quaternion.identity);
				//hatObj.GetComponent(Hat).HideWings();
			}
			else if (hats[mapStage]==1)
			{
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(copperhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(1);
			}
			else if (hats[mapStage]==2)
			{
				
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(silverhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(2);
			}
			else if (hats[mapStage]==3)
			{
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(goldhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).HideWings();
				hatDisplay.AddNumHats(3);
			}
			else if (hats[mapStage]==4)
			{
				if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Normally should not be called, unless testing");
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(copperhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
			}
			else if (hats[mapStage]==5)
			{
				if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Normally should not be called, unless testing");
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(silverhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
			}
			else if (hats[mapStage]==6)
			{
				
				path[curPointIndex].gameObject.GetComponent.<Renderer>().enabled=false;
				hatObj=Instantiate(goldhat,path[curPointIndex].transform.position,Quaternion.identity);
				hatObj.GetComponent(Hat).ShowWings();
				hatDisplay.AddNumHats(3);
			}
			
			
			// Move the map marker
			if ( curPointIndex + markerOffset >= path.Length )
			{
				markerOffset = 0;
			}
			else
			{
				MoveMapMarker(path[curPointIndex + markerOffset].gameObject.transform.position, markerMoveTime);
			}
			// Move the camera
			//cam.SetTargetEx(path[curPointIndex + camOffset].gameObject, camMoveTime, iTween.EaseType.linear);
			
			
			curPointIndex++;
			//yield WaitForSeconds(interval*5);
			//yield WaitForSeconds(interval);
		}
		else
		{
			if ( curPointIndex + markerOffset >= path.Length )
			{
				markerOffset = 0;
			}
			else
			{
				MoveMapMarker(path[curPointIndex + markerOffset].gameObject.transform.position, markerMoveTime);
			}
			//cam.SetTargetEx(path[curPointIndex + camOffset].gameObject, camMoveTime, iTween.EaseType.linear);
			
			iTween.ScaleTo(path[curPointIndex].gameObject,iTween.Hash("x",0.3,"y",0.3,"easeType",iTween.EaseType.spring));
			curPointIndex++;	
		}
		
		if ( curPointIndex < path.Length - 1 )
		{
			while (  Mathf.Approximately(cam.transform.position.y, path[curPointIndex+1].transform.position.y) == false)
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("CAM: " + cam.transform.position + ", Target: " + path[curPointIndex].transform.position);
				//if ( Wizards.Utils.DEBUG ) Debug.Log(Vector3.Equals(cam.transform.position, cam.targetEx.transform.position));
				yield;// WaitForEndOfFrame;
			}
		}
		
	}

	iTween.MoveTo(shadow.gameObject,iTween.Hash("islocal",true,"y",20,"time",5));

	ShowHats();
	cam.ShowResult();
	
	cam.GetStageDetailSprites();

	#if UNITY_IPHONE
	//TODO
	
	//#if ENABLE_ETCETERA
	// EtceteraBinding.askForReview(5,24, "Enjoying the Concert?", "Then please rate Wizards - The Magical Concert and help keep it alive with future updates and other Magical Surprises. Thanks", "668251075" );
	//#endif
	
	#endif
}

function MoveMapMarker(_position : Vector3, _time : float )
{
	// Move the map marker
	var movePos : Vector3 = _position;
	movePos.z -= 10.0;
	iTween.MoveTo(mapMarker, iTween.Hash("position", movePos, "time", _time, "easetype", mapMarkerMoveType));
	
}

function SkipMap()
{

}



function ProcessInput()
{
	
	if ( Input.GetMouseButtonDown(0) )
	{
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (stage==0)
		{
			
			interval=0;
			stage=1;
			
		}
		else if (stage==1)
		{
			cam.resultShowInterval=0;
		}
		
	}
}

function DowntownHit()
{

	cam.HideFace();
	cam.resultShowInterval=0;
	cam.HideButton();
	cam.HideResult();
	cam.HideDowntownButton();
	cam.SetTarget(null);
	hatDisplay.HideHatCount();
	
	if (!submenuLoaded	)
	{
		LoadSubMenu();
		
		iTween.MoveTo(cam.gameObject,iTween.Hash("time",2,"y",-17,"easeType",iTween.EaseType.easeInOutQuad,"oncompletetarget",submenuControllerObj,"oncomplete","GotoSubMenu"));
		submenuController.submenuState=SubmenuState.Submenu;
	}
	else
	{
		//iTween.MoveTo(cam.gameObject,iTween.Hash("time",2,"y",-17,"easeType",iTween.EaseType.easeInOutQuad));
		if (submenuControllerObj!=null)
		{
			iTween.MoveTo(cam.gameObject,iTween.Hash("time",2,"y",-17,"easeType",iTween.EaseType.easeInOutQuad,"oncompletetarget",submenuControllerObj,"oncomplete","GotoSubMenu"));
		}
		submenuController.submenuState=SubmenuState.Submenu;
		
		

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


function ProcessScroll()
{
	
	mapTarget.transform.position.y=Mathf.Clamp(mapTarget.transform.position.y,275.7809,path[maxPointIndex].transform.position.y);
	
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		
		if ( touch.phase == TouchPhase.Began )
		{
			
			touchPos=touch.position;
			touched=true;
			cam.FadeOutResults();
		}
		
		if ( touch.phase == TouchPhase.Moved && touched)
		{
			var screenPos:Vector3= touch.position;
			 
			
			mapTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			touchPos= touch.position;
			
		}
		
		if ( touch.phase == TouchPhase.Ended && touched)
		{
			touched=false;
			cam.FadeInResults();
		}
	}
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( Input.GetMouseButtonUp(0) )
	{
		if (touched)
		{
			touched=false;
			cam.FadeInResults();
			
		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		touched=true;
		touchPos=Input.mousePosition;
		cam.FadeOutResults();
		
	}
	else 
	{
		if (touched)
		{
			screenPos=Input.mousePosition;
			mapTarget.transform.position.y-=(screenPos.y - touchPos.y)*10*Time.deltaTime;
			touchPos= Input.mousePosition;

		
		}
		
	}
	#endif
	
	
}