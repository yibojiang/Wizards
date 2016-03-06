private static var instance : ProfileManager;
 
public static function Instance() : ProfileManager
{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<ProfileManager>();
    return instance;
}

var rankArray:String[];
var achievementArray:AchievementInfo[];
var secrectArray:SecrectInfo[];
var wm:WizardLevelManager;

var easyDifficultyFileName : String = "easylevel.xml";
var mediumDifficultyFileName : String = "mediumlevel.xml";
var hardDifficultyFileName : String = "hardlevel.xml";

var testHats : boolean = false;

var testDifficulty : boolean = false;
var testDifficultyLevel : EDifficulty;

var screenChecked : boolean = false;
var usingTallScreen : boolean = false;

enum EDifficulty
{
	INVALID,
	Easy,
	Medium,
	Hard,
	MAX
}

class AchievementInfo
{
	var title:String;
	var type:Achievement;
	var description:String;
}

class SecrectInfo
{
	var title:String;
	var type:Secrect;
	var description:String;
}

enum WandMask
{
	Tap=1,//00001
	Explode=2,//00010
	Swipe=4,//00100
	Combo=8,//01000
	Starcoin=16//10000
}

enum WandCombo
{
	Tap=1,//00001
	Tap_Explode=3,//00011
	Swipe_Explode=6,//00110
	Tap_Swipe_Explode=7,//00111
	Tap_Starcoin_Combo=25//11001
}

enum ItemMask
{
	Heart=1,//00001
	Fairy=2//00010
}

enum Secrect
{
	Sword=0,//sword
	Green_Dino=1,//dinosaur
	One_Tap_Hero=2,//one tap hero
	Shield_of_Light=3,//
	Manpfi=4,//
	Alfons_the_Pig=5,//pig
	Quack=6,
	Munchy=7,//cake
	Daring_Knight=8,//dragon
	Gryzors_Harpsichord_the_3rd=9,
	Mr_Frog=10,//mr.frog
	Fire_Leo=11,
	Horse_and_Katz=12
}

enum Achievement
{
	Appreciated,//0 - DONE
	By_Bubbledots_Beard,//1 - DONE
	No_stone_unturned,//2 - DONE
	Big_Spender,//3 
	True_Wizard,//4 - DONE
	Firework_Lover,//5 - DONE
	Not_Bad,//6 - DONE
	Not_bad_at_all,//7 - DONE
	Natural_Talent,//8 - DONE
	Super_Detonator,//9 - DONE
	Shake_the_Tree,//10 - DONE
	Yummy_Yummy,//11 - DONE
	Sherlock,//12 - DONE
	Small_Talker,//13 - DONE
	Perfect_Round,//14 - DONE
	Super_Combo_Master,//15 - DONE ( >= 17 )
	No_Escape//16 - DONE
	
}

enum StarcoinsPack
{
	Small,//0
	Normal,//1
	Large//2
}

enum StarcoinsPackState
{
	Unavailable,//0
	Available,//1
	Exchanged//2
}

enum FireworkExplosion
{
	FWsBurst01=0,
	FWsBurst02=1,
	FWsBurst03=2,
	FWsBurst04=3,
	FWsBurst05=4,
	FWsBurst06=5,
	FWsBurst07=6,
	FWsBurst08=7,
	FWsBurst09=8,
	FWsBurst10=9,
	FWsBurst11=10,
	FWsBurst12=11,
	FWsBurst13=12
	
}

enum ShopItemState
{
	Available,//0
	UnAvailable,//1
	SoldOut,//2
	// Do we need an equipped state here? For SPECIAL ITEMS that can be purchased and not used yet?
}

enum Record
{
	LevelScore,//0
	LevelPoor,//1
	LevelGood,//2
	LevelPerfect,//3
	LevelMiss,//4
	GameScore,//5
	GamePoor,//6
	GameGood,//7
	GamePerfect,//8
	GameMiss,//9
	GameMaxCombo,//10
	GameMaxChain,//11
	GameHeight,//12
	
	LifeTimeScore,//13
	LifeTimePoor,//14
	LifeTimeGood,//15
	LifeTimePerfect,//16
	LifeTimeMiss,//17
	
	MaxHeight,//18
	MaxCombo,//19
	MaxChain,//20
	
	BestScore,//21
	StarCoins,//22
	
	PlayTimes,//23
	
	// Per Stage Records
	LevelScoreBest,//24
	LevelPoorBest,//25
	LevelGoodBest,//26
	LevelPerfectBest,//27
	LevelMissBest//28
	
	// Per Game Records - ???
	
	
	
}


var tempRecord:int[];



function SaveAllRecord()
{
	for (var i:int=0;i<tempRecord.length;i++)
	{
		SetRecord(i,GetTempRecord(i));
	}
	PlayerPrefs.Save();
	
}

function SetTempRecord(_record:Record,_value:int)
{
	tempRecord[_record]=_value;
}

function GetTempRecord(_record:Record):int
{
	return tempRecord[_record];
}

function SetLevelRecord(_levelNum : int, _record : Record, _value : int)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Setting LEVEL " + _levelNum + " Record : " + _record + " = " + _value);
	PlayerPrefs.SetInt(GetActiveKey() + ":" + _levelNum + ":" + _record, _value) ;
}

function GetLevelRecord(_levelNum : int, _record:Record)
{
	var Value : int = PlayerPrefs.GetInt(GetActiveKey() + ":" + _levelNum + ":" + _record, 0);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Getting LEVEL " + _levelNum + " Record : " + _record + " = " + Value);
	return ( Value );
}

function GetRecord(_record:Record)
{
	var Value : int = PlayerPrefs.GetInt(GetActiveKey()+"" +_record,0);
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Getting Record : " + _record + " = " + Value);
	return ( Value );
}

function SetRecord(_record:Record,_value:int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Record : " + _record + " = " + _value);
	PlayerPrefs.SetInt(GetActiveKey()+"" +_record, _value) ;
}

function Awake()
{
	DetectScreenAspect();
	
	if ( Application.platform != RuntimePlatform.IPhonePlayer &&
		 Application.platform != RuntimePlatform.Android )
	{
		Wizards.Utils.DEBUG = true;	 
	}
	else
	{
	    //if ( Wizards.Utils.DEBUG ) Debug.LogWarning("DEBUG MODE FORCED ON!");
		Wizards.Utils.DEBUG = false;
	}
	Application.runInBackground = false;
	
	#if !UNITY_EDITOR
	Application.targetFrameRate = 60.0;
	#else
	Application.targetFrameRate = -1.0;
	#endif
	
	//SetRecord(Record.StarCoins,0);
	
	InitRank();
	InitAchievement();
	InitSecrect();
	InitTempRecord();
	
	
	if ( testDifficulty )
	{	
		SetDifficultyLevel(testDifficultyLevel);
	}
	
	//PrintHatInfo();
	
	PlayerPrefs.Save();
	
	// if ( Application.loadedLevelName == "Game" )
	// {
	// 	Countly.Instance.SendDataToServer = false;
	// }
	// else 
	// {
	// 	Countly.Instance.SendDataToServer = true;
	// }
}

function IsUsingTallScreen() : boolean
{
	if ( !screenChecked )
	{
		DetectScreenAspect();
	}
	
	return ( usingTallScreen );
}

function DetectScreenAspect()
{
	var widthOverHeight : float = (Screen.width*1.0)/Screen.height;
	var heightOverWidth : float = (Screen.height*1.0)/Screen.width;
	
	widthOverHeight = Math.Round(widthOverHeight, 2);
	heightOverWidth = Math.Round(heightOverWidth, 2);
	
    if ( Wizards.Utils.DEBUG ) Debug.Log("WidthOverHeight = " + widthOverHeight);
    if ( Wizards.Utils.DEBUG ) Debug.Log("HeightOverWidth = " + heightOverWidth);
	
	var iPhone5AspectA : float = 1136.0/640.0;
	iPhone5AspectA = Math.Round(iPhone5AspectA, 2);
    if ( Wizards.Utils.DEBUG ) Debug.Log("iPhone5AspectA = " + iPhone5AspectA);

	
	var iPhone5AspectB : float = 640.0/1136.0;
    if ( Wizards.Utils.DEBUG ) Debug.Log("iPhone5AspectB= " + iPhone5AspectB);
	
	
    if(  widthOverHeight == 1.5 || heightOverWidth == 1.5 ) 
    {
        //legacy iPhone aspect ratio - no change required
        if ( Wizards.Utils.DEBUG ) Debug.LogWarning("iPhone Legacy Aspect Ratio");
        //Camera.main.orthographicSize = 15;

    }
    else if ((Mathf.Abs(heightOverWidth - iPhone5AspectA) <= 0.1) || (Mathf.Abs(widthOverHeight - iPhone5AspectA) <= 0.1))
    {
        //iPhone5 aspect ratio
        if ( Wizards.Utils.DEBUG ) Debug.LogWarning("iPhone 5 Aspect Ratio");
        
        usingTallScreen = true;
        
        if ( Camera.main.orthographic == true )
        {
        	Camera.main.orthographicSize = 17.5;
        }
        else
        {
        	Camera.main.fieldOfView = 72.0;
        	//Screen.SetResolution(320,480,true,60);
        	if ( Application.loadedLevelName == "Game" )
        	{
        		Camera.main.fieldOfView = 72.0;
        	}
        	
        	if ( Application.loadedLevelName == "GameOver" )
        	{
        		Camera.main.fieldOfView = 12.0;
        	}
        	
        	if ( Application.loadedLevelName == "DragonHeadApproach" )
        	{
        		Camera.main.fieldOfView = 60.0;
        	}
        }
        
        // IF IN-GAME
        if ( Application.loadedLevelName == "Game" ||
        	 Application.loadedLevelName == "Tutorial")
        {
	        // Move GUI
	        
	        // PAUSE BUTTON // STARCOIN COUNTER
	        GameObject.Find("LowerGUI").transform.position = Vector3(0.0, -2.5, 0.0);
	         
	        GameObject.Find("UpperGUI").transform.position = Vector3(0.0, 2.5, 0.0);
	        
	        // HITS
	    	//GameObject.Find("Text_Hits").transform.postion = Vector3();
	    	
	        // SCORE
	       // GameObject.Find("Text_Score").transform.postion = Vector3();
	        
	        // AUDIENCE BAR
	        
	        // CHAIN COUNT
		}

    }
    else
    {
        //iPad aspect ratio - no change required - maybe could adjust gui, move buttons slightly out?
        if ( Wizards.Utils.DEBUG ) Debug.LogWarning("iPad Aspect Ratio");
    }
   	     
    screenChecked = true;
}

function InitTempRecord()
{
	tempRecord=new int[25];
	SetTempRecord(Record.LifeTimeScore, GetRecord(Record.LifeTimeScore) );
	SetTempRecord(Record.LifeTimeMiss, GetRecord(Record.LifeTimeMiss) );
	SetTempRecord(Record.LifeTimePoor, GetRecord(Record.LifeTimePoor) );
	SetTempRecord(Record.LifeTimeGood, GetRecord(Record.LifeTimeGood) );
	SetTempRecord(Record.LifeTimePerfect, GetRecord(Record.LifeTimePerfect) );
	SetTempRecord(Record.StarCoins, GetRecord(Record.StarCoins) );
	SetTempRecord(Record.MaxChain, GetRecord(Record.MaxChain) );
	SetTempRecord(Record.MaxCombo, GetRecord(Record.MaxCombo) );
	SetTempRecord(Record.MaxHeight, GetRecord(Record.MaxHeight) );
	SetTempRecord(Record.PlayTimes, GetRecord(Record.PlayTimes) );
	SetTempRecord(Record.BestScore, GetRecord(Record.BestScore) );
}

function Start()
{
	
}

/*
function PrintHatInfo()
{
	var numStages : int = 12;
	//testHats = false;
	
	for ( var i : int = 0; i < numStages; ++i)
	{
		var hatCount = GetLifeTimeHatCount(i);
		
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Stage " + i + " : HatCount = " + hatCount);
		
		if (testHats )
		{
			SetLifeTimeHatCount(i, 6);
			
			if ( i == 2 )
			{
				SetLifeTimeHatCount(i, 6);
			}
		}
	}
}
*/

//------------Achievement---------------
function InitAchievement()
{
	achievementArray=new AchievementInfo[20];
	
	for (var i:int=0;i<achievementArray.length;i++)
	{
		achievementArray[i]=new AchievementInfo();
		achievementArray[i].type=i;
	}
	
	achievementArray[Achievement.Appreciated].title="Appreciated";
	achievementArray[Achievement.Appreciated].description="Finish the tutorial.";//DONE
	
	achievementArray[Achievement.By_Bubbledots_Beard].title="By Bubbledots Beard";
	achievementArray[Achievement.By_Bubbledots_Beard].description="Finish all the stages.";//DONE
	
	achievementArray[Achievement.No_stone_unturned].title="No stone unturned";
	achievementArray[Achievement.No_stone_unturned].description="Collect all secrets.";//DONE
	
	achievementArray[Achievement.Big_Spender].title="Big Spender";
	achievementArray[Achievement.Big_Spender].description="Buy all items in Wesleys shop.";//DONE
	
	achievementArray[Achievement.True_Wizard].title="True Wizard";
	achievementArray[Achievement.True_Wizard].description="Get all the golden hats.";//DONE
	
	achievementArray[Achievement.Firework_Lover].title="Firework Lover";
	achievementArray[Achievement.Firework_Lover].description="Unlock all explosions.";//DONE
	
	achievementArray[Achievement.Not_Bad].title="Not Bad";
	achievementArray[Achievement.Not_Bad].description="Get 10 Perfects in a Row.";//DONE
	
	achievementArray[Achievement.Not_bad_at_all].title="Not bad at all!";
	achievementArray[Achievement.Not_bad_at_all].description="Get 40 Perfects in a Row.";//DONE
	
	achievementArray[Achievement.Natural_Talent].title="Natural Talent";
	achievementArray[Achievement.Natural_Talent].description="First Firework in Game, Perfect.";//DONE
	
	achievementArray[Achievement.Super_Detonator].title="Super Detonator";
	achievementArray[Achievement.Super_Detonator].description="Tap 1000 Fireworks in a game.";//DONE
	
	achievementArray[Achievement.Shake_the_Tree].title="Shake the tree";
	achievementArray[Achievement.Shake_the_Tree].description="Find the tree and release the leaves.";//DONO
	
	achievementArray[Achievement.Yummy_Yummy].title="Yummy Yummy";
	achievementArray[Achievement.Yummy_Yummy].description="Have Dinner at Paul's Diner.";//DONE
	
	achievementArray[Achievement.Sherlock].title="Sherlock";
	achievementArray[Achievement.Sherlock].description="Find the hidden Traitor.";//DONE
	
	achievementArray[Achievement.Small_Talker].title="Small Talker";
	achievementArray[Achievement.Small_Talker].description="Talk to the Jester and listen to his story.";//TODO
	
	achievementArray[Achievement.Perfect_Round].title="Perfect Round";
	achievementArray[Achievement.Perfect_Round].description="All FW Perfect in stage 10.";//DONE
	
	achievementArray[Achievement.Super_Combo_Master].title="Super Combo Master";
	achievementArray[Achievement.Super_Combo_Master].description="Get a Super Combo.";//DONE
	
	achievementArray[Achievement.No_Escape].title="No Escape";
	achievementArray[Achievement.No_Escape].description="Build 200 chain.";//DONE
}

function SetAchievement(_achievement:Achievement,_value:int)
{
	// This code will give each player seperate achievements, but only one game
	// center one.
	PlayerPrefs.SetInt(GetActiveKey() +"Achievement"+ _achievement, _value) ;
	
	
	//PlayerPrefs.SetInt("Achievement"+ _achievement, _value) ; // Yibo
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("ACHIEVEMENT CODE : " + _achievement);
	// GameCenterBinding.reportAchievement(""+_achievement,100);
}

function ResetAchievement()
{
	for (var i:int=0;i<achievementArray.Length;i++)
	{
		SetAchievement(i,0);
	}
	// GameCenterBinding.resetAchievements();
}

function GetAchievement(_achievement:Achievement):int
{
	// This code will give each player seperate achievements, but only one game
	// center one.
	return PlayerPrefs.GetInt(GetActiveKey() +"Achievement"+ _achievement,0);
	
	//return PlayerPrefs.GetInt("Achievement"+ _achievement,0); // Yibo's code
}

//------------Firework-----------------
function AllFireWorksAreUnlocked() : boolean
{
	var AllUnlocked : boolean = true;
	
	for ( var i : int = 0; i < 13; ++i )
	{
		if ( GetFireworkExplosion(i) == 0 )
		{
			AllUnlocked = false;
			break;
		}
	}
	
	return ( AllUnlocked );
}

function SetFireworkExplosion(_explosion:FireworkExplosion,_value:int)
{
	PlayerPrefs.SetInt(GetActiveKey() +"FireworkExplosion"+ _explosion, _value) ;
}

function GetFireworkExplosion(_explosion:FireworkExplosion):int
{
	return PlayerPrefs.GetInt(GetActiveKey() +"FireworkExplosion"+ _explosion,0);
}

function SetFireworkExplosionEnable(_explosion:FireworkExplosion,_value:int)
{
	PlayerPrefs.SetInt(GetActiveKey() +"FireworkExplosionEnable"+ _explosion, _value) ;
}

function GetFireworkExplosionEnable(_explosion:FireworkExplosion):int
{
	return PlayerPrefs.GetInt(GetActiveKey() +"FireworkExplosionEnable"+ _explosion,0);
}

function ResetFireworkExplosion()
{
	for (var i:int=0;i<10;i++)
	{
		SetFireworkExplosion(i,0);
	}
}
//------------Secrect-------------
function InitSecrect()
{
	secrectArray=new SecrectInfo[13];
	for (var i:int=0;i<secrectArray.length;i++)
	{
		secrectArray[i]=new SecrectInfo();
		secrectArray[i].type=i;
	}
	
	
	secrectArray[Secrect.Sword].title="Racull";
	secrectArray[Secrect.Sword].description="The Sword of the Legendary Hero Locomalito.\nFeared by every Drageon alive..and Dead !";
	
	secrectArray[Secrect.Green_Dino].title="Godzi";
	secrectArray[Secrect.Green_Dino].description="Godzi is Javies favorite toy!\nHe can trample on Cities and Soldiers alike..so adorable,isn’t he ?";
	
	secrectArray[Secrect.One_Tap_Hero].title="One Tap Hero";
	secrectArray[Secrect.One_Tap_Hero].description="You Tap him once,and he saves the Day! A real Hero from another Gamemansion....just one tap away!";
	
	secrectArray[Secrect.Shield_of_Light].title="Shield of Light";
	secrectArray[Secrect.Shield_of_Light].description="Thought lost in ages,but seems you just found it again.\nThe Shield of Light,that protected Bo in his final Battle,before he disappeared !\nWonder what happened to him ? Hm....";
	
	secrectArray[Secrect.Manpfi].title="Manpfi";
	secrectArray[Secrect.Manpfi].description="Hm...so delicious !! Pauls Manpfis are the best !\nCan I have it ?";
	
	secrectArray[Secrect.Alfons_the_Pig].title="Alfons the Pig";
	secrectArray[Secrect.Alfons_the_Pig].description="Alfons is Masters favorite little piggy pet.\nI heard he was once abused in a students magical experiment.\nPoor thingy,wonder who did that to him !";
	
	secrectArray[Secrect.Quack].title="Quack";
	secrectArray[Secrect.Quack].description="Toto's little rubber Duck.\nYou can't take a bath without it !";
	
	secrectArray[Secrect.Munchy].title="Pauls Special";
	secrectArray[Secrect.Munchy].description="Legendary yummy Munchy...one of a kind,and so delicious..you wanna eat them forever !\nThanks Pauly.";

	secrectArray[Secrect.Daring_Knight].title="Daring Knight";
	secrectArray[Secrect.Daring_Knight].description="An action figure of a daring knight! Another of Javies favorite toys. Seems they are all over the place!";
	
	secrectArray[Secrect.Gryzors_Harpsichord_the_3rd].title="Gryzors Harpsichord the 3rd";
	secrectArray[Secrect.Gryzors_Harpsichord_the_3rd].description="Build by the Musical Master him self,the third of his Generation.\nWe just wish he would be here to play it for us.";
	
	secrectArray[Secrect.Mr_Frog].title="Mr.Frog";
	secrectArray[Secrect.Mr_Frog].description="A Brave little Soldier from another place..he was feared by his tongue,\nas he could draw as fast as lightning.";

	secrectArray[Secrect.Fire_Leo].title="Fire Leo";
	secrectArray[Secrect.Fire_Leo].description="A little toy,that can fly through Sky and Space and fights evil forces.\nMister B. just loves this toy,we should say it's his Childhood Hero !\nHe wishes he could be just like him,a force of thunder in the Sky !";
	
	secrectArray[Secrect.Horse_and_Katz].title="Katz & Horse";
	secrectArray[Secrect.Horse_and_Katz].description="A Horse that Loves his Katz,\nor a Katz who loves her Horse.\nThe Legendary Lovers of Ancient times...even Gryzor wrote a Symphony about them.";
	
	
}

function SetSecrect(_secrect:Secrect,_value:int)
{
	PlayerPrefs.SetInt(GetActiveKey() +"Secrect"+ _secrect, _value) ;
}

function ResetSecrect()
{
	for (var i:int=0;i<secrectArray.Length;i++)
	{
		SetSecrect(i,0);
	}
}

function GetSecrect(_secrect:Secrect):int
{
	return PlayerPrefs.GetInt(GetActiveKey() +"Secrect"+ _secrect,0);
}


function OnApplicationPause()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("App Paused");
	PlayerPrefs.Save();
}

function OnApplicationQuit()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("App Paused");
	PlayerPrefs.Save();
}

//------------- PERMANENT LEVEL STATS --------------------
function GetActiveKey() : String
{
	var activeKey : String = "" + GetActiveProfileID() + ":";
	//Debug.Log("GetActiveKey : " + activeKey);
	return ( activeKey );
}

function GetKey(_id : int) : String
{
	var key : String = "" + _id + ":";
    //if ( Wizards.Utils.DEBUG ) Debug.Log("GetKey : " + key);
	return (  key );
}

function ProfileEnabled(_id:int):boolean
{
	
	var enabled:int= PlayerPrefs.GetInt(""+_id+"Enabled", 0) ;
	
    if ( Wizards.Utils.DEBUG ) Debug.Log("ProfileEnabled (" + _id + " : " + enabled);
	
	if (enabled==0)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function SetProfileEnabled(_id:int,_state:int)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("Set Profile Enabled  : " + _id + " : " + _state);
	PlayerPrefs.SetInt(""+_id+"Enabled", _state);
}

function GetActiveProfileID() : int
{
	var result : int = 0;
	result = PlayerPrefs.GetInt("ActiveProfile", 0);
	//Debug.Log("Active Profile ID : " + result);
	
	return ( result );
}

function SetActiveProfileID(_ID: int)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetActiveProfileID : " + _ID);
	
	PlayerPrefs.SetInt("ActiveProfile", _ID);
}

function GetNumProfiles() : int
{
	var numProfiles : int = PlayerPrefs.GetInt("ProfileCount", 0);
    if ( Wizards.Utils.DEBUG ) Debug.Log("GetNumProfiles : " + numProfiles);
	return ( numProfiles );
}

function SetNumProfiles(_numProfiles : int)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetNumProfiles : " + _numProfiles);
	
	PlayerPrefs.SetInt("ProfileCount", _numProfiles) ;
}

function CreateProfile(_name : String):int
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("Create Profile : " + _name);
	
	var numProfiles : int = GetNumProfiles();
	
	numProfiles += 1;
	SetNumProfiles(numProfiles);
	
	SetProfileEnabled(numProfiles,1);
	SetupProfile(numProfiles,_name);
	
	return numProfiles;
	
}

function SetupProfile(_id:int,_name : String)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetupProfile : " + _id + " : " + _name);
	PlayerPrefs.SetString(GetKey(_id)+ "Name", _name);
}


function SetActiveProfileName(_name : String)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("Set ACtive Profile Name : " + _name);
	PlayerPrefs.SetString(GetActiveKey() + "Name", _name);
}
// 


function GetActiveProfileName() : String
{
	var activeProfileName : String = GetProfileName(GetActiveProfileID());
    if ( Wizards.Utils.DEBUG ) Debug.Log("GetActiveProfileNamme : " + activeProfileName);
	return activeProfileName;
	//return PlayerPrefs.GetString(GetActiveKey() + "Name", "Richard");
}

function GetProfileName(_id : int) : String
{
	var profileName : String = PlayerPrefs.GetString(GetKey(_id) + "Name", "Javie");
    if ( Wizards.Utils.DEBUG ) Debug.Log("GetProfileName(" + _id + ") : " + profileName);
	return (  profileName );
}

// StarCoins
function GetStarCoinsCount() : int
{
	return ( PlayerPrefs.GetInt(GetActiveKey() + "StarCoins", 0) );
}

function SetStarCoinsCount(_count : int)
{
	PlayerPrefs.SetInt(GetActiveKey() + "StarCoins", _count);
}

//Record hat count.
function SetLifeTimeHatCount(_stage:int,_count)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetLifeTimeHatCount() : Stage " + _stage + " : No. Hats = " + _count);
	PlayerPrefs.SetInt(GetActiveKey()+"Stage"+_stage+"LifeTimeHatCount",_count);
}

function GetLifeTimeHatCount(_stage:int)
{
	var hatCount = PlayerPrefs.GetInt(GetActiveKey() + "Stage"+_stage+"LifeTimeHatCount",0);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("GetLifeTimeHatCount() : Stage " + _stage + " : No. Hats = " + hatCount);
	return ( hatCount );
}

function InitRank()
{
	rankArray=new String[31];
	rankArray[0]="BM Master";
	rankArray[1]="Popi";
	rankArray[2]="Drageon Food";
	rankArray[3]="Popi Pot";
	rankArray[4]="Roachtail";
	rankArray[5]="Slompy";
	rankArray[6]="Dinosaurs Pepo";
	rankArray[7]="Apprentice";
	rankArray[8]="Honks Nose";
	rankArray[9]="Popi Pot Cleaner";
	rankArray[10]="Mr.Higgins";
	rankArray[11]="Meroptian Dog";
	rankArray[12]="Crom Worshipper";
	rankArray[13]="Dear Lumpy";
	rankArray[14]="Broom Test Driver";
	rankArray[15]="Sir Arthur's Underpants";
	rankArray[16]="Dirk the Daring";
	rankArray[17]="2D Freedom Figther";
	rankArray[18]="Hydorah Battle Hero";
	rankArray[19]="BM Survivor";
	rankArray[20]="Sir Graveloft Humped";
	rankArray[21]="3rd Class Wizard";
	rankArray[22]="Simon Belmondo";
	rankArray[23]="2nd Class Wizard";
	rankArray[24]="Lamenza";
	rankArray[25]="1st Class Wizard";
	rankArray[26]="Golden Broom Holder";
	rankArray[27]="Tap Master";
	rankArray[28]="Master Wizard";
	rankArray[29]="Master Sorcerer";
	rankArray[30]="Wizards Lover";

}

function GetRankName(_rank:int):String
{
	_rank=Mathf.Clamp(_rank,0,30);
	return rankArray[_rank];
	
}
//*-------------------INCREASE COUNT----------------------------
function IncrementScore(_score : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Incrementing SCORE BY : " + _score);
	SetTempRecord(Record.LevelScore,GetTempRecord(Record.LevelScore)+_score);
	SetTempRecord(Record.GameScore,GetTempRecord(Record.GameScore)+_score);
	SetTempRecord(Record.LifeTimeScore,GetTempRecord(Record.LifeTimeScore)+_score);
	
	if (wm!=null)
	{
		wm.CheckLevelUp(GetTempRecord(Record.LifeTimeScore));
	}
}

function IncrementPoorCount()
{
	SetTempRecord(Record.LevelPoor,GetTempRecord(Record.LevelPoor) +1);
	SetTempRecord(Record.GamePoor,GetTempRecord(Record.GamePoor) +1);
	SetTempRecord(Record.LifeTimePoor,GetTempRecord(Record.LifeTimePoor) +1);
}

function IncrementGoodCount()
{
	SetTempRecord(Record.LevelGood,GetTempRecord(Record.LevelGood) +1);
	SetTempRecord(Record.GameGood,GetTempRecord(Record.GameGood) +1);
	SetTempRecord(Record.LifeTimeGood,GetTempRecord(Record.LifeTimeGood) +1);
}


function IncrementPerfectCount()
{
	SetTempRecord(Record.LevelPerfect,GetTempRecord(Record.LevelPerfect) +1);
	SetTempRecord(Record.GamePerfect,GetTempRecord(Record.GamePerfect) +1);
	SetTempRecord(Record.LifeTimePerfect,GetTempRecord(Record.LifeTimePerfect) +1);
}

function IncrementMissCount()
{
	SetTempRecord(Record.LevelMiss,GetTempRecord(Record.LevelMiss) +1);
	SetTempRecord(Record.GameMiss,GetTempRecord(Record.GameMiss) +1);
	SetTempRecord(Record.LifeTimeMiss,GetTempRecord(Record.LifeTimeMiss) +1);
	
}

function IncrementStarCoins(_count : int)
{
	SetTempRecord(Record.StarCoins,GetTempRecord(Record.StarCoins) +_count);
}

function IncrementRealStarcoins(_count : int)
{
	SetRecord(Record.StarCoins,GetRecord(Record.StarCoins) +_count);
}

function DecrementStarCoins(_count : int)
{
	SetRecord(Record.StarCoins,GetRecord(Record.StarCoins)-_count);
	
	if (GetRecord(Record.StarCoins)< 0 )
	{
		SetRecord(Record.StarCoins,0);
	}
}


//--------------- Reset Records -------------------
//TODO
function ResetLevelStats()
{
	SetTempRecord(Record.LevelScore,0);
	SetTempRecord(Record.LevelPoor,0);
	SetTempRecord(Record.LevelGood,0);
	SetTempRecord(Record.LevelPerfect,0);
	SetTempRecord(Record.LevelMiss,0);
	PlayerPrefs.Save();
}

//TODO
function ResetGameStats()
{
	SetTempRecord(Record.GameScore,0);
	SetTempRecord(Record.GamePoor,0);
	SetTempRecord(Record.GameGood,0);
	SetTempRecord(Record.GamePerfect,0);
	SetTempRecord(Record.GameMiss,0);
	PlayerPrefs.Save();
}

function ResetLifeTimeStats()
{
	SetRecord(Record.LifeTimeScore,0);
	SetRecord(Record.LifeTimePoor,0);
	SetRecord(Record.LifeTimeGood,0);
	SetRecord(Record.LifeTimePerfect,0);
	SetRecord(Record.LifeTimeMiss,0);
	SetRecord(Record.MaxHeight,0);
	SetRecord(Record.MaxChain,0);
	SetRecord(Record.MaxCombo,0);
	SetRecord(Record.BestScore,0);
	SetRecord(Record.StarCoins,0);
	SetRecord(Record.PlayTimes,0);
	//TODO
	//Set Broom & Wand Level & Shop Items
	ResetFireworkExplosion();
	ResetAchievement();
	ResetSecrect();
	//TODO:Reset Hats

	PlayerPrefs.Save();

}

function ResetAll()
{
	//PlayerPrefs.DeleteAll();
	ResetLifeTimeStats();
}

//Set CheckPoint
function SetLevelCheckPoint(_level:int)
{
	PlayerPrefs.SetInt(GetActiveKey()+"LevelCheckPoint",_level);
}

function GetLevelCheckPoint():float
{
	return PlayerPrefs.GetInt(GetActiveKey() + "LevelCheckPoint",0);
}

// -------------- AUDIO OPTIONS ----------------------------

// This is the gain applied to all sounds...
// This value must be between 0.0 (no sound) and 1.0 (max gain).
// Each sound source volume is multiplied by this value to give
// the final volume of each sound.
function SetSFXVolume(_volume : float)
{
	PlayerPrefs.SetFloat( "SFXVolume", _volume);
}

function GetSFXVolume() : float
{
	return ( PlayerPrefs.GetFloat( "SFXVolume", 1.0) );
}

function SetMusicVolume(_volume : float)
{
	PlayerPrefs.SetFloat("MusicVolume", _volume);
}

function GetMusicVolume() : float
{
	return ( PlayerPrefs.GetFloat( "MusicVolume", 1.0) );
}

// -------------- PLAY TUTORIAL OPTION ---------------------

// If this function returns true, then play the tutorial for the
// player.
// Internally - a value of 0 means the game should show the tutorial
// to the player. a value of 1(or actually any other value, but we will use 1)
// means dont play the tutorial, go straight
// to the game.

function doPlayTutorial() : boolean
{
	var playTutorial : int = 0;
	
	playTutorial = PlayerPrefs.GetInt(GetActiveKey() + "PlayTutorial", 0 );
	
	if ( playTutorial == 0 )
	{
		return ( true );
	}
	else
	{
		return ( false );
	}
}

function SetPlayTutorial(_playTutorial : boolean)
{
	if ( _playTutorial )
	{
		PlayerPrefs.SetInt(GetActiveKey() + "PlayTutorial", 0); // Tutorial will play next start of game. 
	}
	else
	{
		PlayerPrefs.SetInt(GetActiveKey() + "PlayTutorial", 1); // Tutorial will not play next start of game.
	}
}	

function GetGameFinished():boolean
{
	var gameFinised : int = 0;
	
	gameFinised = PlayerPrefs.GetInt(GetActiveKey() + "GameFinished", 0 );
	
	if ( gameFinised == 0 )
	{
		return false;
	}
	else
	{
		return true;
	}
}

function SetGameFinished(_finished:boolean)
{
	if (_finished)
	{
		PlayerPrefs.SetInt(GetActiveKey()+"GameFinished", 1);
	}
	else
	{
		PlayerPrefs.SetInt(GetActiveKey()+"GameFinished", 0);
	}
	
}

function SetVibration(_vibration:boolean)
{
	if ( _vibration )
	{
		PlayerPrefs.SetInt(GetActiveKey() + "Vibration", 0); // TURN ON VIBRATION
	}
	else
	{
		PlayerPrefs.SetInt(GetActiveKey() + "Vibration", 1); 
	}
}

function GetVibration():boolean
{
	var vibration : int = 0;
	
	vibration = PlayerPrefs.GetInt(GetActiveKey() + "Vibration", 0 );
	
	if ( vibration == 0 )
	{
		return ( true );
	}
	else
	{
		return ( false );
	}
}

function SetBroomLevel(_level : int)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("PM: SetBroomLevel() : " + _level);
	PlayerPrefs.SetInt(GetActiveKey() + "BroomLevel", _level);
}

function GetBroomLevel() : int
{
	var broomLevel : int = PlayerPrefs.GetInt(GetActiveKey() + "BroomLevel", 0);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("PM: GetBroomLevel() : " + broomLevel);
	return ( broomLevel );
}

function GetBroomUpgradeLevel():int
{
	var broomUpgradeLevel : int = PlayerPrefs.GetInt(GetActiveKey() + "BroomUpgradeLevel", 1);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("PM: GetBroomUpgradeLevel() : " + broomUpgradeLevel);
	return ( broomUpgradeLevel );
}

function SetBroomUpgradeLevel(_level : int)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("PM: SetBroomUpgradeLevel() : " + _level);
	PlayerPrefs.SetInt(GetActiveKey() + "BroomUpgradeLevel", _level);
}


//TODO
function SetHeartLevel(_level : int)
{
	PlayerPrefs.SetInt(GetActiveKey() + "HeartLevel", _level);
}

function GetHeartLevel() : int
{
	return PlayerPrefs.GetInt(GetActiveKey() + "HeartLevel", 1);
}

// ------------- LOAD MANAGER ------------------

function GetNextLevelToLoad() : String
{
	return PlayerPrefs.GetString(GetActiveKey() + "NextLevelToLoad", "Unknown");
}

function SetNextLevelToLoad(_levelName : String)
{
	PlayerPrefs.SetString(GetActiveKey() + "NextLevelToLoad", _levelName);
}

// Difficulty Level
function GetDifficultyLevel() : EDifficulty
{
	var difficulty : EDifficulty = PlayerPrefs.GetInt(GetActiveKey() + "Difficulty", EDifficulty.Easy);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Current Difficulty Setting is: " + difficulty);
	return ( difficulty );
}

function SetDifficultyLevel(_difficulty : EDifficulty)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Current Difficulty Level To : " + _difficulty);
	switch ( _difficulty )
	{
		case EDifficulty.Easy:
			PlayerPrefs.SetInt(GetActiveKey() + "Difficulty", EDifficulty.Easy);
		break;
		
		case EDifficulty.Medium:
			PlayerPrefs.SetInt(GetActiveKey() + "Difficulty", EDifficulty.Medium);
		break;
		
		case EDifficulty.Hard:
			PlayerPrefs.SetInt(GetActiveKey() + "Difficulty", EDifficulty.Hard);
		break;
	}
	PlayerPrefs.Save();
}

function GetDifficultyPathAndFileName(_difficulty : EDifficulty) : String
{
	var pathAndFileName : String = Application.persistentDataPath;
	pathAndFileName += "/";
	switch ( _difficulty )
	{
		case EDifficulty.Easy:
			pathAndFileName += PlayerPrefs.GetString("EasyDifficultyFileName", easyDifficultyFileName);
		break;
		
		case EDifficulty.Medium:
			pathAndFileName += PlayerPrefs.GetString("MediumDifficultyFileName", mediumDifficultyFileName);
		break;
		
		case EDifficulty.Hard:
			pathAndFileName += PlayerPrefs.GetString("HardDifficultyFileName", hardDifficultyFileName);
		break;
	}
	
	//pathAndFileName = Application.PersistentDataPath + pathAndFileName;
	if ( Wizards.Utils.DEBUG ) Debug.Log("PROF PATH:" + pathAndFileName);
	return ( pathAndFileName );
}

//Shop Items
function SetShopItemState(_item:String,_state:ShopItemState)
{
	var itemKey : String = GetActiveKey()+"ShopItem" + _item;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetShopItemState: " + itemKey + "=" + _state);
	PlayerPrefs.SetInt(itemKey, _state);
}

function GetShopItemState(_item:String) : ShopItemState
{
	var itemKey : String = GetActiveKey()+"ShopItem" + _item;
	
	var itemState : ShopItemState =  PlayerPrefs.GetInt(itemKey, 0);
	//if ( Wizards.Utils.DEBUG ) Debug.Log ( "GetShopItemState: " + itemKey + "=" + ShopItemState.GetValues(ShopItemState)[itemState] );
	//if ( Wizards.Utils.DEBUG ) Debug.Log("ITEMSTATE = " + itemState );
	return itemState;
}



function GetStarCoinPackState(_type:StarcoinsPack):int
{
	return PlayerPrefs.GetInt(GetActiveKey()+"StarcoinsPackState" +_type, StarcoinsPackState.Unavailable);
}

function SetStarCoinPackState(_type:StarcoinsPack,_state:StarcoinsPackState)
{
	PlayerPrefs.SetInt(GetActiveKey()+"StarcoinsPackState" + _type, _state);
}


function GetStarCoinPack(_type:StarcoinsPack):int
{
	return PlayerPrefs.GetInt("StarcoinsPack" +_type, 0);
}

function SetStarCoinPack(_type:StarcoinsPack,_count:int)
{
	PlayerPrefs.SetInt("StarcoinsPack" + _type, _count);
}

function SetSkipMovieClip(_skip:boolean)
{
	if (_skip)
	{
		PlayerPrefs.SetInt("SkipMovieClip" , 1);
	}
	else
	{
		PlayerPrefs.SetInt("SkipMovieClip" , 0);
	} 
}

function GetSkipMovieClip():boolean
{	
	var _skip:int=PlayerPrefs.GetInt("SkipMovieClip", 0);
	if (_skip==0)
	{
		return false;
	}
	else
	{
		return true;
	}
	
	
}

function SetShowTips(_value:boolean)
{
	if (_value)
	{
		PlayerPrefs.SetInt("ShowTips" , 1);
	}
	else
	{
		PlayerPrefs.SetInt("ShowTips" , 0);
	}
}

function GetShowTips()
{
	var show:int=PlayerPrefs.GetInt("ShowTips", 0);
	if (show==0)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function SetWandBitmask(_value:int)
{
	PlayerPrefs.SetInt(GetActiveKey()+"WandBitmask" , _value);
}

function GetWandBitmask():int
{
	return PlayerPrefs.GetInt(GetActiveKey()+"WandBitmask" ,WandMask.Tap);
}

function SetSpecialItemmask(_value:int)
{
	PlayerPrefs.SetInt(GetActiveKey()+"SpecialItemmask" , _value);
}

function GetSpecialItemmask()
{
	return PlayerPrefs.GetInt(GetActiveKey()+"SpecialItemmask" ,0);
}

function IsFirstTimeInShop() : boolean
{
	if ( PlayerPrefs.GetInt(GetActiveKey() + "FirstTimeInShop", 0) == 0 )
	{
		PlayerPrefs.SetInt(GetActiveKey() + "FirstTimeInShop", 1);
		return ( true );
	}
	
	return ( false );
}

function TalkToJesterCount() : int
{
	var talkCount : int = PlayerPrefs.GetInt(GetActiveKey() + "JesterTalkCount", 0);
	PlayerPrefs.SetInt(GetActiveKey() + "JesterTalkCount", talkCount + 1);
	
	return ( talkCount );
	
}

function GetNumSFXUnlocked() : int
{
	return PlayerPrefs.GetInt(GetActiveKey()+"NumSFXUnlocked" ,0);
}

function SetNumSFXUnlocked(_numUnlocked : int)
{
	PlayerPrefs.SetInt(GetActiveKey()+"NumSFXUnlocked" ,_numUnlocked);
}