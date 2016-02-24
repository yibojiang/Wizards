var isLoading : boolean = false;
var loadProgress : float = 0.0;
//var loadingText : GUIText;
var loadCounter : int = 0;

var levelToLoad : String;

var loadDelayDuration : float = 2.0;
var loadDelayTimer : float = 0.0;

var pm : ProfileManager;

var testLoad : boolean = false;
var testLoadLevel : String;
var test:boolean=false;

var firstTimeLoad : boolean = false;

var tutorial : GameObject;

function Awake()
{
	GameObject.DontDestroyOnLoad(this.gameObject);
	Time.timeScale=1.0;
	//loadingText.material.color = Color.white;
	//loadingText.text = "";
}

function Start()
{
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	if ( test )
	{
		return;
	}
	
	if ( firstTimeLoad )
	{
		if ( PlayerPrefs.GetInt("FirstTimeInstalledGame", 0) == 0 )
		{
			tutorial.active = false;
			PlayerPrefs.SetInt("FirstTimeInstalledGame", 1);
		}
		
		SetupResolution();
		levelToLoad = "MainMenu"; 
	}
	else
	{
		DisplayScreenSize();
		levelToLoad = pm.GetNextLevelToLoad();
	}
	
	if (levelToLoad=="Submenu")
	{
		levelToLoad="GameOver";
	}
	//loadingText.text = "Loading";
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Loading levelToLoad");
	
	GC.Collect();
	Resources.UnloadUnusedAssets();
}


function Update()
{
	loadDelayTimer += Time.deltaTime;
	
	if ( loadDelayTimer > loadDelayDuration )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("beginloading @ :" + Time.time);
		//LoadLevel(levelToLoad, 0, "Loading " + levelToLoad);
		LoadLevel(levelToLoad, 0, "Loading");
	}
}

function SetupResolution()
{
	var scaleResolution : float = 1.0;
    
    var screenWidth : int = Screen.width;
    var screenHeight : int = Screen.height;
    
    if ( Wizards.Utils.DEBUG ) Debug.Log("RESOLUTION : " + Screen.currentResolution.width);
    if ( Wizards.Utils.DEBUG ) Debug.Log("SCREEN : (WxH) = " + screenWidth + " x " + screenHeight);
    
    if ( Wizards.Utils.DEBUG ) Debug.Log("iPhoneGeneration : " + UnityEngine.iOS.Device.generation);
       
    switch ( UnityEngine.iOS.Device.generation )
    {
    	case UnityEngine.iOS.DeviceGeneration.iPhone:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPhone3G:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPhone3GS:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPodTouch1Gen:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPodTouch2Gen:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPodTouch3Gen:	// 480p -> 1.0
    	case UnityEngine.iOS.DeviceGeneration.iPad2Gen: // 1024p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhone5: // 1136p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPodTouch5Gen: // 1136p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPadMini1Gen: // 1024p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhone5C: // 1136p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhone5S: // 1136p -> good power -> 1.0 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhoneUnknown: // 1.0 -> e.g. iPhone6
    	case UnityEngine.iOS.DeviceGeneration.iPodTouchUnknown: // 1.0 e.g. iPod6
    		scaleResolution = 1.0;
    	break;
    	
    	case UnityEngine.iOS.DeviceGeneration.iPodTouch4Gen: // 960p -> lowish power -> 0.5 scaled	
    	case UnityEngine.iOS.DeviceGeneration.iPad1Gen:	// 1024p -> low power -> 0.5 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhone4: // 960p -> medium power -> 0.5 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPhone4S: // 960p -> mediumish power -> 0.5 scaled
    	case UnityEngine.iOS.DeviceGeneration.iPad3Gen: // 2048p -> good power -> 0.5 scaled (because high res)
    	case UnityEngine.iOS.DeviceGeneration.iPad4Gen: // 2048p -> good power -> 0.5 scaled ( because high res ) 
    	case UnityEngine.iOS.DeviceGeneration.iPadUnknown: // 0.5...such as iPadAir, iPadMini3Gen,4Gen
    		scaleResolution = 0.5;
    	break;
    	
    	// Anything else...to be safe? 0.5 scale...
    	// what about iPhone6/iPod6...should be 1.0
    	default:
    		scaleResolution = 0.5;
    	break;
    }
    
    if ( Wizards.Utils.DEBUG ) Debug.Log ( "Scale Resolution By : " + scaleResolution);
    
    Screen.SetResolution(screenWidth * scaleResolution, screenHeight * scaleResolution, true, 60);
    
   DisplayScreenSize();
}

function DisplayScreenSize()
{
     if ( Wizards.Utils.DEBUG ) Debug.Log("Screen Width : " + Screen.width);
    if ( Wizards.Utils.DEBUG ) Debug.Log("Screen Height : " + Screen.height);
}

function LoadLevel(_level : String, _checkpoint : int, _message : String)
{
	if (isLoading)
	{
		return;
	}
	
	if ( test )
	{
		return;
	}
	
	var ao : AsyncOperation = Application.LoadLevelAsync(_level);

	isLoading = true;
	
	while(!ao.isDone)
	{
		loadProgress = ao.progress;
		loadCounter++;
		if ( loadCounter > 5 )
		{
			loadCounter = 0;
		}
		
		/*
		loadingText.text = _message;
		
		for ( var i = 0; i < loadCounter; ++i)
		{
			loadingText.text += ".";
		}
		*/
		yield;
	}		
	
	isLoading = false;
	
	AfterLevelLoaded();
}

function AfterLevelLoaded()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("finishedloading @ :" + Time.time);
	Destroy(this.gameObject);
}
