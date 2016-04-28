import System.Collections.Generic;
import Newtonsoft.Json;
private static var instance : LevelManager;
 
public static function Instance() : LevelManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<LevelManager>();
    return instance;
}

var IsInitComplete : boolean = false;

var launchedFirework : GameObject;

private var ff : FireworkFactory;

private var currentFirework : FireWork;

var levelIntervalTimer : float = 0.0;
var nextLevelTime : float = 0.0;
var fireworkIntervalTimer : float = 0.0;
var nextLaunchTime : float = 0.0;
var repeatCount : int = 0;
var allLaunched : boolean = false;

var masterTimer : float = 0.0;

var levelBeingEdited : int = 0;
// var actualLevels : int = 3;

var testFireWorkLevel : boolean = false;

var levelsCreated : boolean = false;
var levelsInitialised : boolean = false;

var newLevel : boolean = true;

//var LevelOne : Level;


// var maxLevelCount : int = 100;

// public class LevelData{
	
// }


var levelList : List.<Level>;


var playList : PlayList;


var testPlayList : PlayList;


var activePlayList : PlayList;

// var audienceBar : AudienceBar;

var fireWorksPaused : boolean = false;

var levelCount:exSpriteFont;
var levelName:exSpriteFont;

var totalFireworks:int;

var newLevelLayersManager : NewLevelLayersManager;
var validAmountOfLevelEndFireWorks : int = 11;

var useDifficultyLevels : boolean = false;
var difficulty : EDifficulty;
var forcedDifficulty : boolean;
var forcedDifficultyLevel : EDifficulty;



// var gSL : GameSaveLoad;

var tutorialMode : boolean = true;

var levelEndFireWorksFound : int = 0;



//Container for seralization
class LevelData{
	var levels:List.<Level>;
}

class Level
{
	var levelName : String = "default";
	var levelInterval : float = 0.0;
	var fireworks : FireWork[];
	var repeatCount : int = 0;
	
	var currentFirework : int = 0;
	
	function GetFirstFireWork() : FireWork
	{
		currentFirework = 0;
		return ( GetFireWork(currentFirework) );
	}
	
	function GetNextFirework() : FireWork
	{
		currentFirework += 1;
		return ( GetFireWork(currentFirework) );
	}
	
	function IsMoreFireWorks() : boolean
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("currFirework: " + currentFirework);
		//if ( Wizards.Utils.DEBUG ) Debug.Log("length : " + fireworks.length);
		if ( currentFirework < fireworks.length - 1)
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("morefireworks:TRUE");
			return ( true );
		}
		else
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Morefireworks:FALSE");
			return ( false );
		}
	}
	
	function GetFireWork(_firework : int) : FireWork
	{
		if ( _firework < 0 || _firework >= fireworks.length )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("firework index outside range");
			return ( null );
		}
		
		return ( fireworks[_firework] );
	}
	
}

class FireWork
{
	var fireworkName : String = "firework";
	
	// OPTION 1 - RANDOM ---------------------
	var randomType : boolean = false;
	var randomPaths : flightPath[];
	var numRandomFW : int = 0;
	var maxRandomTypes : int = 12;
	
	// OPTION 2 - Fixed ----------------------
	var path : flightPath;
	
	// Special Usage : Path Points for Builder Firework.
	var builderPath : Vector3[];
	
	// COMMON --------------------------------
	var visual : VisualEffect;
	var spawnInterval : float = 0.0;
	
	// ----------------------------------------
	// NOTE: Random Velocity could effectively offer the random endpos functionality
	// Just need to fine tune the velocitys that are chosen at random to make
	// sure they are logical and stay on screen
	var randomStartPos : boolean = false;
	var randomEndPos : boolean = false;
	var randomVelocity : boolean = false;
	
	// User selected settings	
	var StartPos : Vector2 = Vector2.zero;
	var startPosGridID : int = 0;
	var gridIDDirtyFlag : boolean = false;
	
	var EndPos : Vector2 = Vector2.zero; // TODO - Make this a grid layout option rather than exact coordinates.
	var endPosGridID : int = 0;
	var endGridIDDirtyFlag : boolean = false;
	
	// ---------------------------------------
	// LifeSpanMin and Max will effect the initial velocity
	// Need to calculate how fast it needs to travel to reach its end point
	// given the lifespan.
	var lifeSpanMin : float = 0.0;
	var lifeSpanMax : float = 0.0;
	var StartVelocity : Vector2 = Vector2.zero;
	
	var levelEndFireWork : boolean = false;
	
	function Awake()
	{
		randomPaths = new flightPath[maxRandomTypes];
		
		
	}
	
	/*
	function Update()
	{
		if ( randomType == true && randomPaths.length == 0 )
		{
			randomPaths = new flightPath[maxRandomTypes];
		}
	}
	*/
}


class PlayList
{
	var playItems : Formation[];

	var currentPlayItem : int = 0;
	
	function GetFormationName() : String
	{
		return ( playItems[currentPlayItem].formationName );
	}
	
	function GetFirstLevel() : int
	{
		currentPlayItem = 0;
		
		return ( playItems[currentPlayItem].GetFirstLevel() );
	}
	
	function GetCurrentLevel() : int
	{
		return ( playItems[currentPlayItem].GetCurrentLevel() );
	}	
	
	function GetNextLevel() : int
	{
		if ( playItems[currentPlayItem].IsThereMoreLevels() == true )
		{
			playItems[currentPlayItem].GetNextLevel();
		}
		else
		{
			currentPlayItem += 1;
			
			if ( currentPlayItem < playItems.length )
			{
				return ( playItems[currentPlayItem].GetFirstLevel() );
			}
			else
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("outside range");
				return(-1);
			}
		}
		
		return ( 0 );
	}
	
	/*
	function IsThereMoreLevels() : boolean
	{
		if ( currentPlayItem >= playItems.length )
		{
			return ( false );
		}
		else
		{
			return ( true );
		}
	}*/
	
	function GetNumItems() : int
	{
		return ( playItems.Length );
	}
	
	function IsThereMoreLevels() : boolean
	{
		////if ( Wizards.Utils.DEBUG ) Debug.Log("playlist:IsThereMoreLevels");
		if ( currentPlayItem < playItems.length - 1)
		{
			return ( true );	 
		}
		else if ( currentPlayItem < playItems.length )
		{
			if ( playItems[currentPlayItem].IsThereMoreLevels() == true)
			{
				return ( true );
			}
			else
			{
				return ( false );
			}
		}
		else
		{
			return ( false );
		}
	}
}

class Formation
{
	var formationName : String = "defaultFormation";
	var levelSequence : int[];

	var currentLevel : int = 0;
	
	function GetNumLevels() : int
	{
		return ( levelSequence.length );
	}
	
	function IsThereMoreLevels() : boolean
	{
		if ( currentLevel < levelSequence.length - 1 )
		{
			return ( true );
		}
		else
		{
			return ( false );
		}
	}
	
	function GetFirstLevel() : int
	{
		currentLevel = 0;
		
		return ( GetLevel(currentLevel) );
		 
	}
	
	function GetNextLevel() : int
	{
		currentLevel += 1;
		return ( GetLevel(currentLevel) );
	}
	
	function GetCurrentLevel() : int
	{
		return ( GetLevel(currentLevel) );
	}
	
	function GetLevel(_level : int) : int
	{
		if ( _level >= levelSequence.length )
		{
			if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Error: Not that many levels in this sequence");
			return ( -1 );
		}
		
		if ( _level < 0 )
		{
			if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Error: Level index must be >= 0");
			return ( -1 );
		}
		

		return ( levelSequence[_level] );
	}

	function ResetLevel(){
		currentLevel=0;
	}
}

function Awake()
{
	difficulty = EDifficulty.Easy; // default level if difficulty not used
	
	if ( useDifficultyLevels )
	{
		if ( forcedDifficulty )
		{
			difficulty = forcedDifficultyLevel;
		}
		else
		{
			difficulty = ProfileManager.Instance().GetDifficultyLevel();
		}
		
		if ( Wizards.Utils.DEBUG ) if ( Wizards.Utils.DEBUG ) Debug.Log("Difficulty: " + difficulty);
		
		// if ( Application.platform == RuntimePlatform.IPhonePlayer )
		// {
			// gSL.LoadLevelData(difficulty, false);
		// }
	}
}

function Start()
{
	newLevelLayersManager=NewLevelLayersManager.Instance();
	
	ff=GameObject.Find("FireworkFactory").GetComponent(FireworkFactory) as FireworkFactory;
	if ( levelList.Count > 0 )
	{
		levelsCreated = true;
		levelsInitialised = true;
	}
	else
	{
		//CreateLevels();
		//InitLevels();
	}
	
	totalFireworks=0;
	DoInit();
	
	
	ValidateLevelEndFireWorks();
	
	/*
	if ( pm.GetDifficultyLevel() == EDifficulty.Easy && newLevelLayersManager.stageIndex == 0)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : START - TUTORIAL ON");
		//tutorialMode = true;
	}
	else
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : START - TUTORIAL OFF");
		//tutorialMode = false;
	}
	*/
}

function ValidateLevelEndFireWorks()
{
	var levelEndFireWorkCount : int = 0;
	
	for ( var i : int = 0; i < levelList.Count; ++i )
	{
		if ( levelList[i].fireworks[0].levelEndFireWork	== true )
		{
			levelEndFireWorkCount++;
		}
	}
	
	if ( levelEndFireWorkCount != validAmountOfLevelEndFireWorks )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Possible Error In LevelEnd FireWork Count: " + levelEndFireWorkCount);
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Count SHOULD be: " + validAmountOfLevelEndFireWorks);
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("LevelEnd FireWork Count OK : " + levelEndFireWorkCount);
	}
}

function LevelsCreated() : boolean
{
	return ( levelsCreated );
}

function LevelsInitialised() : boolean
{
	return ( levelsInitialised );
}

/*
function OnDrawGizmos()
{
// Draw a yellow sphere at the transform's position
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Drawing Gizmo");
	Gizmos.color = Color.yellow;
	var position : Vector3 = Vector3.zero;
	
	position.x = levelList[levelBeingEdited].fireworks[0].StartPos.x;
	position.y = levelList[levelBeingEdited].fireworks[0].StartPos.y;
	position.z = -2;
	
	Gizmos.DrawSphere(position, 1);
}
*/

function NumFireWorksOnScreen() : int
{
	var numFireworks : int = 0;
	
	var fw : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	var glitter : GameObject[] = GameObject.FindGameObjectsWithTag("Glitter");
	var sfw:GameObject[]=GameObject.FindGameObjectsWithTag("SFW");
	var starCoin:GameObject[]=GameObject.FindGameObjectsWithTag("StarCoin");
	
	for ( var glit in glitter )
	{
		if ( glit.GetComponent.<Renderer>().isVisible )
		{
			numFireworks++;
		}	
	}
	

	
	numFireworks += fw.Length;
	numFireworks+= sfw.Length;
	numFireworks+= starCoin.Length;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("num fws : " + numFireworks + " @: " + Time.time);
	return ( numFireworks );
}

function PauseFireworks()
{
	fireWorksPaused = true;
}

function ResumeFireworks(_delay : float)
{
	yield WaitForSeconds(_delay);
	ResumeFireworks();
}
function ResumeFireworks()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : ResumeFireWorks");
	fireWorksPaused = false;
		
	if ( Wizards.Utils.DEBUG ) if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : ResumeFireWorks - TUTORIAL CHECK");
	/*
	if ( difficulty == EDifficulty.Easy && newLevelLayersManager.stageIndex == 0)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : ResumeFireWorks - TUTORIAL ON");
		//tutorialMode = true;
	}
	else
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager  : ResumeFireWorks - TUTORIAL OFF");
		//tutorialMode = false;
	}
	*/
}

function Update ()
{
	if ( fireWorksPaused == false )
	{
		//NumFireWorksOnScreen();
		
		if ( levelsCreated == false )
		{
			if ( levelList.Count > 0 )
			{
				levelsCreated = true;
			}
		}
		
		if ( levelsInitialised == false )
		{
			//InitLevels();
		}
		
		masterTimer += Time.deltaTime;
		
		//FIX ALL THIS BASED ON NEW STRUCTURE!!
		//THEN FINSHED EDITOR INTERFACE!!
		// The above comment items are done!
		
		/*
		if ( newLevel == true )
		{
			levelIntervalTimer = nextLevelTime;
			newLevel = false;
		}
		*/
		
		levelIntervalTimer += Time.deltaTime;
			
		if ( levelIntervalTimer > nextLevelTime )
		{
			if ( IsThereMoreFireworks() == true && currentFirework != null && allLaunched == false )
			{		

				fireworkIntervalTimer += Time.deltaTime;
			
				if ( fireworkIntervalTimer > nextLaunchTime )
				{
					// Debug.Log("Launch Firework");
					Launch(currentFirework);
					
					
					currentFirework = GetNextFirework();
					if (levelCount!=null){
						levelCount.text=""+activePlayList.GetCurrentLevel();
					}
						
					if (levelName!=null){
						levelName.text=""+levelList[activePlayList.GetCurrentLevel()].levelName;	
					}
												
					//if ( Wizards.Utils.DEBUG ) Debug.Log( activePlayList.GetCurrentLevel());
					
					fireworkIntervalTimer = 0.0;
					
					if ( currentFirework != null )
					{
						nextLaunchTime = currentFirework.spawnInterval;
					}
				}
			}
		}
	}	
}

function IsThereMoreFireworks() : boolean
{
	////if ( Wizards.Utils.DEBUG ) Debug.Log("LevelManager:IsThereMoreFireWorks");
	if ( activePlayList.IsThereMoreLevels() == true )
	{
		////if ( Wizards.Utils.DEBUG ) Debug.Log("playlistIstheremoreLevels Returned TRUE");
		return ( true );
	}
	else
	{


		if ( Wizards.Utils.DEBUG ) Debug.Log("playlistIstheremoreLevels Returned FALSE");
		if ( Wizards.Utils.DEBUG ) Debug.Log("About to call levellist.IsMoreFireWorks");
		
		if ( activePlayList.GetCurrentLevel() == -1 )
		{
			allLaunched = true;
			return ( false );

		}
		
		if (levelList[activePlayList.GetCurrentLevel()].IsMoreFireWorks() == true )
		{
			// if ( Wizards.Utils.DEBUG ) Debug.Log("true 1");
			return ( true );
		}
		else if ( repeatCount < levelList[activePlayList.GetCurrentLevel()].repeatCount){
		// 	if ( Wizards.Utils.DEBUG ) Debug.Log("repeatCount :"+repeatCount+"/"+ levelList[activePlayList.GetCurrentLevel()].repeatCount );
			return ( true );
		}		
		else
		{
			// if ( Wizards.Utils.DEBUG ) Debug.Log("playlistIstheremorefireworks Returned FALSE");
			allLaunched = true;
			return ( false );
		}
	}
}

function GetNextFirework() : FireWork
{
	if ( levelList[activePlayList.GetCurrentLevel()].IsMoreFireWorks() == true )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Getting next firework");
		return ( levelList[activePlayList.GetCurrentLevel()].GetNextFirework() );
	}
	else
	{
		repeatCount += 1;
		
		if ( repeatCount >= levelList[activePlayList.GetCurrentLevel()].repeatCount )
		{
			repeatCount = 0;
			
			levelIntervalTimer = 0.0;
			newLevel = true;
			
			if ( IsThereMoreFireworks() == true && activePlayList.IsThereMoreLevels() == true && activePlayList.GetCurrentLevel() != -1 )
			{
				if ( activePlayList.GetNextLevel() != -1 )
				{
					nextLevelTime = levelList[activePlayList.GetCurrentLevel()].levelInterval;
			
					PrintLevelInfo();
			
					return ( levelList[activePlayList.GetCurrentLevel()].GetFirstFireWork() );
				}
				else
				{
					allLaunched = true;
					return ( null );
				}
			}
			else
			{
				return ( null );
			}
		}
		else
		{
			return ( levelList[activePlayList.GetCurrentLevel()].GetFirstFireWork() );
		}
	}
}

function AddLevel()
{
	
}

function SetCurrentLevelBeingEdited(_level : int)
{
	if ( ValidateLevel(_level) )
	{
		levelBeingEdited = _level;
	}
}

function GetNumLevels() : int
{
	return ( levelList.Count );
}

function SetNumLevels(_num : int)
{
    // if ( Wizards.Utils.DEBUG ) Debug.Log("Setting levels to : " + maxLevelCount);
	// levelList = new Level[maxLevelCount];
	
	for ( var i : int = 0; i < _num; i += 1)
	{
		var lv:Level = new Level();
		levelList[i].levelName = "" + (i + 1);
		levelList[i].fireworks = new FireWork[1];
		levelList[i].fireworks[0] = new FireWork();
		levelList[i].fireworks[0].fireworkName = "FireWork 1";
		levelList[i].fireworks[0].randomPaths = new flightPath[flightPath.MAX];
		levelList.Add(lv);
	}
	
	// actualLevels = _num;
	levelsCreated = true;
}

function LoadLevelData(stageName:String){

	var ta:TextAsset=Resources.Load("SerializedData/LevelData/"+stageName);

	var dataString:String=ta.text;
	var rawLevelData:LevelData=JsonConvert.DeserializeObject(dataString,typeof(LevelData) );	
	levelList=rawLevelData.levels;


	playList.playItems[0].levelSequence=new int[levelList.Count];
	for ( var i : int = 0; i < levelList.Count; i++ )
	{
		playList.playItems[0].levelSequence[i] = i;
		playList.playItems[0].ResetLevel();
		activePlayList=playList;
	}
	currentFirework=GetNextFirework();
}

function GetLevelName(_levelNum : int) : String
{
	if ( ValidateLevel(_levelNum) )
	{
		return ( levelList[_levelNum].levelName );
	}
	
	return ("INVALID");
}

function SetLevelEndFireWork(_levelNum : int, _levelEnd : boolean)
{
	if ( ValidateLevel(_levelNum) )
	{
		levelList[_levelNum].fireworks[0].levelEndFireWork = _levelEnd;
	}
}

function GetLevelEndFireWork(_levelNum : int) : boolean
{
	return ( levelList[_levelNum].fireworks[0].levelEndFireWork );
}

function SetLevelName(_levelNum : int, _name : String)
{
	if ( ValidateLevel(_levelNum) )
	{
		levelList[_levelNum].levelName = _name;
	}
	
	return ("INVALID");
}

function ValidateLevel(_level : int) : boolean
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("VL : " + _level);
	
		if ( levelList.Count > 0 &&
		 _level >= 0 &&
		 _level < levelList.Count )
	 {
		if ( levelList[_level].fireworks.Length == 0 )
	 	{
	 		levelList[_level].fireworks = new FireWork[1];
	 	}
	 			 
	 	if ( levelList[_level].fireworks[0] == null )
	 	{
	 		levelList[_level].fireworks[0] = new FireWork();
	 	}
	 	return ( true ) ;
	 }
	 else
	 {
	 	if ( Wizards.Utils.DEBUG ) Debug.Log("Invalid Level Index");
	 	return ( false );
	 }
}

function SetLevelToRandom(_levelNum : int, _fwNum : int, _isRandom : boolean)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Set Level To Random Called");
	if ( ValidateLevel(_levelNum) )
	{
		CheckRandomList(_levelNum, _fwNum);
		levelList[_levelNum].fireworks[_fwNum].randomType = _isRandom;
	}
}

function IsLevelRandom(_levelNum : int, _fwNum : int ) : boolean
{
	if ( ValidateLevel(_levelNum) )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("LVL: " + _levelNum);
		//if ( Wizards.Utils.DEBUG ) Debug.Log("FW: " + _fwNum);
		if ( levelList[_levelNum].fireworks[_fwNum] != null )
		{
			return ( levelList[_levelNum].fireworks[_fwNum].randomType );
		}
	}
	
	return ( false );
}

function SetRandomFWType(_level : int, _fwNum : int, _randomNum : int, _type : flightPath)
{
	if ( ValidateLevel(_level) )
	{
		CheckRandomList(_level, _fwNum);
		levelList[_level].fireworks[_fwNum].randomPaths[_randomNum] = _type;
	}
}

function GetNumRandomTypes(_level : int, _fwNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].randomPaths.length );
	}
	
	return 0;
}


function SetNumRandomFireworks(_level : int, _fwNum : int, _numRandom : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[_fwNum].numRandomFW = _numRandom;
	}
}

function GetNumRandomFireworks(_level : int, _fwNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].numRandomFW);
	}
	return 0;
}


function SetNumRandomTypes(_level : int, _fwNum : int, _numTypes : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Should only call me on loading");
	levelList[_level].fireworks[_fwNum].randomPaths = new flightPath[_numTypes];
}

function GetMaxNumRandomTypes(_level : int, _fwNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].maxRandomTypes );
	}
	return 0;
}

function SetMaxNumRandomTypes(_level : int, _fwNum : int, _max : int)
{
	levelList[_level].fireworks[_fwNum].maxRandomTypes = _max;
}


function GetRandomFWType(_level : int, _fwNum : int, _randomNum : int) : flightPath
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].randomPaths[_randomNum] );
	}
	return 0;
}

function GetRandomFWTypeIntValue(_level : int, _fwNum : int, _randomNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(levelList[_level].fireworks[_fwNum].randomPaths[_randomNum]);
		return ( levelList[_level].fireworks[_fwNum].randomPaths[_randomNum] );
	}
	return 0;
}

function SetRandomFWTypeIntValue(_level : int, _fwNum : int, _randomNum : int, _type : int)
{
	CheckRandomList(_level, _fwNum);
	levelList[_level].fireworks[_fwNum].randomPaths[_randomNum] = _type;
}

function GetFireWorkType(_level : int, _fwNum : int) : flightPath
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].path );
	}
	return 0;
}

function SetFireWorkType(_level : int,  _fwNum : int, _type : flightPath)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[_fwNum].path = _type;
	}
}

function GetFWVisual(_level : int, _fwNum : int ) : VisualEffect
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].visual );
	}
	return 0;
}

function SetFWVisual(_level : int, _fwNum : int, _visual : VisualEffect)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[_fwNum].visual = _visual;
	}
	
}

function SetLevelEndFirework(_level : int, _fwNum, _isLevelEnd : boolean)
{
	levelList[_level].fireworks[_fwNum].levelEndFireWork = _isLevelEnd;
}

function GetLevelEndFirework(_level : int, _fwNum) : boolean
{
	return ( levelList[_level].fireworks[_fwNum].levelEndFireWork );
}


function GetFireWorkTypeIntValue(_level : int, _fwNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].path );
	}
	return 0;
}

function SetFireWorkTypeIntValue(_level : int,  _fwNum : int, _type : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[_fwNum].path = _type;
	}
}

function GetNumBuilderPoints(_level : int, _fwNum : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].builderPath.Length );
	}
	return 0;
}

function SetNumBuilderPoints(_level : int, _fwNum : int, _numBuilderPoints : int)
{
	levelList[_level].fireworks[_fwNum].builderPath = new Vector3[_numBuilderPoints];
}

function GetBuilderPoint(_level : int, _fwNum : int, _point : int) : Vector3
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].builderPath[_point] );
	}	
	return Vector3(0,0,0);
}

function SetBuilderPoint(_level : int, _fwNum : int, _point : int, _thepoint : Vector3)
{
	levelList[_level].fireworks[_fwNum].builderPath[_point] = _thepoint;	
}

function GetStartPos(_level : int, _fwNum : int) : Vector3
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].StartPos );
	}	
	return Vector3(0,0,0);
}

function SetStartPos(_level : int, _fwNum : int, _pos : Vector3)
{
	levelList[_level].fireworks[_fwNum].StartPos = _pos;
}

function GetCurrentFireWorkNumber(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].currentFirework );
	}	
	return 0;
}

function SetCurrentFireWorkNumber(_level : int, _num : int)
{
	levelList[_level].currentFirework = _num;
}

function GetEndPos(_level : int, _fwNum : int) : Vector3
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].EndPos );
	}	
	return Vector3(0,0,0);
}

function SetEndPos(_level : int, _fwNum : int, _pos : Vector3)
{
	levelList[_level].fireworks[_fwNum].EndPos = _pos;
}

function GetStartVelocity(_level : int, _fwNum : int) : Vector3
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].StartVelocity );
	}	
	return Vector3(0,0,0);
}

function SetVelocity(_level : int, _fwNum : int, _pos : Vector3)
{
	levelList[_level].fireworks[_fwNum].StartVelocity = _pos;
}

function SetStartX(_level : int, _x : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].StartPos.x = ValidPositionX(_x);
	}
}

function SetEndX(_level : int, _x : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].EndPos.x = ValidPositionX(_x);
	}
}

function SetStartY(_level : int, _y : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].StartPos.y = ValidPositionY(_y);
	}
}

function SetEndY(_level : int, _y : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].EndPos.y = ValidPositionY(_y);
	}
}

function GetStartX(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].StartPos.x );
	}
	return 0;
}

function GetStartY(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].StartPos.y );
	}
	return 0;
}

// --------

function SetStartSpeedX(_level : int, _x : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].StartVelocity.x = ValidSpeedX(_x);
	}
}

function SetStartSpeedY(_level : int, _y : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].StartVelocity.y = ValidSpeedY(_y);
	}
}

function GetStartSpeedX(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].StartVelocity.x );
	}
	return 0;
}

function GetStartSpeedY(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].StartVelocity.y );
	}
	return 0;
}

function GetFireWorkAmount(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return( levelList[_level].repeatCount );
	}
	return 0;
}

function GetNumFireWorks(_level : int) : int
{
	if ( ValidateLevel(_level) )
	{
		return( levelList[_level].fireworks.Length );
	}
	return 0;
}

function SetNumFireWorks(_level : int, _num : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Creating Firework Array");
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Level: " + _level);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FW: " + _num);
	levelList[_level].fireworks = new FireWork[_num];
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FWs Created, length:" + levelList[_level].fireworks.length);
	
	for ( var i : int = 0; i < _num; i += 1)
	{
		levelList[_level].fireworks[i] = new FireWork();
	}
}

function GetFireWorkName(_level : int, _firework : int) : String
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_firework].fireworkName );
	}
	return "";
}

function SetFireWorkName(_level : int, _firework : int, _name : String)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting name");
	//if ( Wizards.Utils.DEBUG ) Debug.Log("LVL: " + _level);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FW: " + _firework);
	//if ( Wizards.Utils.DEBUG ) Debug.Log(levelList[_level].fireworks[_firework]);
	levelList[_level].fireworks[_firework].fireworkName = _name;
}

function SetIsFireWorkRandom(_level : int, _firework : int, _random : String)
{
	if ( _random == "true")
	{
		levelList[_level].fireworks[_firework].randomType = true;
	}
	else
	{
		levelList[_level].fireworks[_firework].randomType = false;
	}
}

function GetIsFireWorkRandom(_level : int, _firework : int) : String
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_firework].randomType == true )
		{
			return ( "true" );
		}
		else
		{
			return  ( "false" );
		}
	}
	return "";
}

function SetFireWorkAmount(_level : int, _amount : int)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].repeatCount = _amount;
	}
}

function ValidSpeedX(_x : int ) : int
{
	// TODO - Work out valid speed X taking Y into account	
	
	if ( _x < -15 )
	{
		return ( -15 );
	}
	
	if ( _x > 15 )
	{
		return ( 15 );
	}
	
	return ( _x );
}

function ValidSpeedY(_y : int) : int
{
	// TODO - Work out valid speed Y taking X into account
	
	if ( _y < -15 )
	{
		return ( -15 );
	}
	
	if ( _y > 15 )
	{
		return ( 15 );
	}
	
	return ( _y );
}

function GetMaxLevelNumber() : int
{
	return ( levelList.Count - 1 );
}

function GetVisualType(_level : int, _fwNum : int ) : VisualEffect
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].visual );
	}
	return 0;
}

function GetVisualTypeIntValue(_level : int, _fwNum : int ) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].visual );
	}
	return 0;
}

function SetVisualTypeIntValue(_level : int, _fwNum : int, _visual : int)
{
	levelList[_level].fireworks[_fwNum].visual = _visual;
}

function GetSpawnInterval(_level : int, _fwNum : int ) : float
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].spawnInterval );
	}
	return 0;
}

function SetSpawnInterval(_level : int, _fwNum : int, _interval : float )
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[_fwNum].spawnInterval = _interval;
	}
}

function IsLevelStartSpeedRandom(_level : int) : boolean
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].randomVelocity );
	} 
	return false;
}

function GetIsLevelStartPosRandom(_level : int):boolean
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].randomStartPos );
	} 	
	return false;
	
}

function GetIsLevelEndPosRandom(_level : int):boolean
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[0].randomEndPos );
	} 	
	return false;
}

function SetLevelStartSpeedToRandom(_level : int, _random : boolean)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].randomVelocity = _random;
	} 
}

function SetLevelStartPosToRandom(_level : int, _random : boolean)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].randomStartPos = _random;
	} 
}

function SetLevelEndPosToRandom(_level : int, _random : boolean)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].fireworks[0].randomEndPos = _random;
	} 
}

function SetLifeTimeMin(_level : int, _fwNum : int, _lifeTimeMin : float)
{
	if ( ValidateLevel(_level) )
	{
		if ( _lifeTimeMin < 1 )
		{
			_lifeTimeMin = 1;
		}
		
		if ( _lifeTimeMin >= levelList[_level].fireworks[_fwNum].lifeSpanMax )
		{
			SetLifeTimeMax(_level, _fwNum, _lifeTimeMin);
		}
		
		levelList[_level].fireworks[_fwNum].lifeSpanMin = _lifeTimeMin;
	}
}

function GetIsRandomStartPos(_level : int, _fwNum : int ) : String
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_fwNum].randomStartPos == true )
		{
			return ( "true" );
		}
		else
		{
			return  ( "false" );
		}
	}
	return "error";
}

function SetIsRandomStartPos(_level : int, _fwNum : int, _israndom : String)
{
	if ( _israndom == "true" )
	{ 
		levelList[_level].fireworks[_fwNum].randomStartPos = true;
	}
	else
	{
		levelList[_level].fireworks[_fwNum].randomStartPos = false;
	}
}

function GetIsRandomEndPos(_level : int, _fwNum : int ) : String
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_fwNum].randomEndPos == true )
		{
			return ( "true" );
		}
		else
		{
			return  ( "false" );
		}
	}
	return "error";
}

function SetIsRandomEndPos(_level : int, _fwNum : int, _israndom : String)
{
	if ( _israndom == "true" )
	{ 
		levelList[_level].fireworks[_fwNum].randomEndPos = true;
	}
	else
	{
		levelList[_level].fireworks[_fwNum].randomEndPos = false;
	}
}


function GetIsRandomVelocity(_level : int, _fwNum : int ) : String
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_fwNum].randomVelocity == true )
		{
			return ( "true" );
		}
		else
		{
			return  ( "false" );
		}
	}
	
	return "error";
}

function SetIsRandomVelocity(_level : int, _fwNum : int, _israndom : String)
{
	if ( _israndom == "true" )
	{ 
		levelList[_level].fireworks[_fwNum].randomVelocity = true;
	}
	else
	{
		levelList[_level].fireworks[_fwNum].randomVelocity = false;
	}
}



function SetLifeTimeMax(_level : int, _fwNum : int, _lifeTimeMax : float)
{
	if ( ValidateLevel(_level) )
	{
		if ( _lifeTimeMax < 1 )
		{
			_lifeTimeMax = 1;
		}
	
		if ( _lifeTimeMax < levelList[_level].fireworks[_fwNum].lifeSpanMin )
		{
			SetLifeTimeMin(_level, _fwNum, _lifeTimeMax);
		}
		
		levelList[_level].fireworks[_fwNum].lifeSpanMax = _lifeTimeMax;
	}
}


function GetLifeTimeMin(_level : int, _fwNum : int) : float
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].lifeSpanMin );
	}
	return 0.0;
}

function GetStartPosGridID(_level : int, _fwNum) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].startPosGridID );
	}
	return 0;
}	

function GetEndPosGridID(_level : int, _fwNum) : int
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].endPosGridID );
	}
	return 0;
}	


function SetStartPosGridID(_level : int, _fwNum, _id : int)
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_fwNum].startPosGridID != _id )
		{
			levelList[_level].fireworks[_fwNum].gridIDDirtyFlag = true;
		}
		levelList[_level].fireworks[_fwNum].startPosGridID = _id;
	}
}

function SetEndPosGridID(_level : int, _fwNum, _id : int)
{
	if ( ValidateLevel(_level) )
	{
		if ( levelList[_level].fireworks[_fwNum].endPosGridID != _id )
		{
			levelList[_level].fireworks[_fwNum].endGridIDDirtyFlag = true;
		}
		levelList[_level].fireworks[_fwNum].endPosGridID = _id;
	}
}

function IsGridIDDirty(_level : int, _fwNum : int) : boolean
{
	return  (levelList[_level].fireworks[_fwNum].gridIDDirtyFlag);
}

function IsEndGridIDDirty(_level : int, _fwNum : int) : boolean
{
	return  (levelList[_level].fireworks[_fwNum].endGridIDDirtyFlag);
}

function ClearGridIDDirtyFlag(_level : int, _fwNum : int)
{
	levelList[_level].fireworks[_fwNum].gridIDDirtyFlag = false;
}


function ClearEndGridIDDirtyFlag(_level : int, _fwNum : int)
{
	levelList[_level].fireworks[_fwNum].endGridIDDirtyFlag = false;
}

function GetLevelInterval(_level : int) : float
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].levelInterval);
	}
	return 0.0;
}

function SetLevelInterval(_level : int, _interval : float)
{
	if ( ValidateLevel(_level) )
	{
		levelList[_level].levelInterval = _interval;
	}
}


function GetLifeTimeMax(_level : int, _fwNum : int) : float
{
	if ( ValidateLevel(_level) )
	{
		return ( levelList[_level].fireworks[_fwNum].lifeSpanMax );
	}
	return 0.0;
}




function ValidPositionX(_x : int) : int
{
	if ( _x < 0 )
	{
		return ( 0 );
	}
	
	if ( _x > 640 )
	{
		return ( 640 );
	}
	
	return ( _x );
}

function ValidPositionY(_y : int) : int
{
	if ( _y < 0 )
	{
		return ( 0 );
	}
	
	if ( _y > 960 )
	{
		return ( 960 );
	}
	
	return ( _y );
}

function GetNumPlayItems() : int
{
	return ( playList.playItems.Length );
}

function SetNumPlayItems(_numItems : int)
{
	playList.playItems = new Formation[_numItems];
	
	for ( var i : int = 0; i < _numItems; i += 1 )
	{
		playList.playItems[i] = new Formation();
		playList.playItems[i].levelSequence = new int[100];
		for ( var j : int = 0; j < 100; j += 1 )
		{
			playList.playItems[i].levelSequence[j] = j;
		}
	}
}

function GetPlayItemName(_item : int) : String
{
	return ( playList.playItems[_item].formationName );
}

function SetPlayItemName(_item : int, _name : String)
{
	playList.playItems[_item].formationName = _name;
}

function GetNumPlayItemLevels(_item : int) : int
{
	if ( playList.playItems.length > 0 )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(playList.playItems[_item].levelSequence);
		return ( playList.playItems[_item].levelSequence.Length );
	}
	
	return 0;
}

function SetNumPlayItemLevels(_item : int, _numLevels : int)
{
	playList.playItems[_item].levelSequence = new int[_numLevels];
	
	for ( var i : int = 0; i < _numLevels; i += 1 )
	{
		playList.playItems[_item].levelSequence[i] = i;
	}
}

function GetPlayItemLevel(_item : int, _level : int) : int
{
	return ( playList.playItems[_item].levelSequence[_level] );
}

function SetPlayItemLevel(_item : int, _level : int, _levelNum : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SetPlayItemlevel" + playList.playItems[_item].levelSequence[_level]);
	playList.playItems[_item].levelSequence[_level] = _levelNum;
}

function GetPlayItemCurrentLevel(_item : int) : int
{
	return ( playList.playItems[_item].currentLevel );
}

function SetPlayItemCurrentLevel(_item : int, _level : int)
{
	playList.playItems[_item].currentLevel = _level;
}

function GetCurrentPlayItem() : int
{
	return ( playList.currentPlayItem );
}

function SetCurrentPlayItem(_level : int)
{
	playList.currentPlayItem = _level;
}



function CheckRandomList(_level : int, _fwNum : int)
{
	if ( _fwNum < levelList[_level].fireworks.length )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Check Random List. LVL: " + _level + " fw: " + _fwNum);
		if ( levelList[_level].fireworks[_fwNum].randomPaths.length == 0 )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Creating new RANDOM LIST OF TYPES");
			levelList[_level].fireworks[_fwNum].randomPaths = new flightPath[levelList[_level].fireworks[_fwNum].maxRandomTypes];
		}
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Non-Existing Firework. LVL: " + _level + " fw: " + _fwNum);
	}
}

function GetAllLaunched() : boolean
{
	return ( allLaunched );
}

function CreateLevels()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Create Levels Called");
	levelList = new List.<Level>();
	levelsCreated = true;
}

function InitLevels()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("lm:InitLevels Called");
	
	for ( var i : int = 0; i < 100 ; i += 1)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("level" + i);
		levelList[i].levelName = "Level_" + i;
		levelList[i].levelInterval = 4;
		levelList[i].repeatCount = 5;		
		
		levelList[i].fireworks = new FireWork[2];
		levelList[i].fireworks[0] = new FireWork();
		levelList[i].fireworks[0].fireworkName = "firework";
		
		levelList[i].fireworks[0].randomType = true;
		levelList[i].fireworks[0].randomPaths = new flightPath[12];
		levelList[i].fireworks[0].numRandomFW = 0;
		
		for ( var j : int = 0; j < 12; j += 1 )
		{
			levelList[i].fireworks[0].randomPaths[j] = j;
		}
		
		levelList[i].fireworks[0].maxRandomTypes = 12;
				
		//levelList[i].fireworks[0].flightPath Not Used on Init
		
		levelList[i].fireworks[0].builderPath = new Vector3[5];
		levelList[i].fireworks[0].builderPath[0] = Vector3(0.0, -7.0, 0.0);
		levelList[i].fireworks[0].builderPath[1] = Vector3(-5.0, 0.0, 0.0);
		levelList[i].fireworks[0].builderPath[2] = Vector3(0.0, 5.0, 0.0);
		levelList[i].fireworks[0].builderPath[3] = Vector3(5.0, 0.0, 0.0);
		levelList[i].fireworks[0].builderPath[4] = Vector3(0.0, 0.0, 0.0);
		
		
		
		levelList[i].fireworks[0].visual = VisualEffect.Star;
		levelList[i].fireworks[0].spawnInterval = 1.0;
		levelList[i].fireworks[0].randomStartPos = true;
		levelList[i].fireworks[0].randomEndPos = true;
		levelList[i].fireworks[0].randomVelocity = true;
		levelList[i].fireworks[0].StartPos = Vector3(0.0,-8.0,0.0);
		levelList[i].fireworks[0].startPosGridID = 0;
		levelList[i].fireworks[0].EndPos = Vector3(0.0, 15.0,0.0);
		levelList[i].fireworks[0].lifeSpanMin = 3.0;
		levelList[i].fireworks[0].lifeSpanMax = 5.0;
		levelList[i].fireworks[0].StartVelocity = Vector3(0.0, 5.0, 0.0);
	}
	
	levelsInitialised = true;
	DoInit();
}

function DoInit()
{
	if ( levelList.Count == 0 )
	{
		//InitLevels();
		// Or Load Levels
	}
	
	if( testFireWorkLevel == true )
	{
		activePlayList = testPlayList;
	}
	else
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Playing All");
		activePlayList = playList;
		
		/*
		activePlayList = new PlayList();
		activePlayList.playItems = new Formation[100];
		
		activePlayList.currentPlayItem = 0;
		
		for ( var i : int = 0; i < 100; i += 1)
		{
			activePlayList.playItems[i].levelSequence = new int[1];
			activePlayList.playItems[i].levelSequence[0] = i;
			activePlayList.playItems[i].formationName = "Formation_" + i;
		}
		*/

	}
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer ||
		 Application.platform == RuntimePlatform.Android )
	{
		activePlayList = playList;	 
	} 
	
	currentFirework = levelList[activePlayList.GetFirstLevel()].GetFirstFireWork();
	
	levelIntervalTimer = 0.0;
	nextLevelTime = 1.0;//levelList[activePlayList.GetCurrentLevel()].levelInterval;
	
	fireworkIntervalTimer = 0.0;
	nextLaunchTime = 0.0;//currentFirework.spawnInterval;
	
	repeatCount = 0;
	
	masterTimer = 0.0;
	
	

	allLaunched = !allLaunched;
}

function SetPlayModeTest(_level : int, _numLevels : int, _test : boolean)
{
	testFireWorkLevel = _test;
	
	var index : int = 0;
	
	testPlayList.playItems[0].levelSequence = new int[_numLevels];
	
	if ( ValidateLevel(_level) )
	{
		for ( var i : int = _level; i < (_level + _numLevels) ; ++i )
		{
			testPlayList.playItems[0].levelSequence[index] = i;

			index++;
		}
		
		testPlayList.currentPlayItem = 0;
		testPlayList.playItems[0].currentLevel = 0;		
	}
}

function PrintLevelInfo()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FormationName: " + activePlayList.GetFormationName() );
	//if ( Wizards.Utils.DEBUG ) Debug.Log("LevelName: " + levelList[activePlayList.GetCurrentLevel()].levelName );
}

function OldLaunch(_firework : FireWork)
{
	var start : Vector3;
	
	if ( _firework.randomStartPos == false )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(_firework.StartPos);
		start = PixelToWorld(_firework.StartPos.x, _firework.StartPos.y);
		
		//script.SetPosition(_firework.StartPos.x, _firework.StartPos.y);
	}
	else
	{
		//random start pos
		start = PixelToWorld(Random.Range(100,540), Random.Range(50, 100));
		//script.SetPosition(Random.Range(100,540), Random.Range(50, 300));
	}
	
	
	if ( _firework.randomType == true )
	{
		//launchedFirework = ff.GetFirework(_firework.randomPaths[Random.Range(0, _firework.randomPaths.length)], _firework.visual, start);
	}
	else
	{
		//launchedFirework = ff.GetFirework(_firework.path, _firework.visual, start);
	}
	
	var script : fw_main = launchedFirework.GetComponent("fw_main") as fw_main;

	if ( _firework.path != flightPath.Builder )
	{
		if ( _firework.randomVelocity == false )
		{
			script.SetVelocity(_firework.StartVelocity.x, _firework.StartVelocity.y);
			//launchedFirework.SendMessage("SetVelocity", _firework.StartVelocity.x, _firework.StartVelocity.y);
		}
		else
		{
			// random start velocity
			if ( _firework.path == flightPath.Bow )
			{
				script.SetVelocity(Random.Range(-2.0, 2.0), Random.Range(7.0, 7.0));
			}
			else
			{
				script.SetVelocity(Random.Range(-2.0, 2.0), Random.Range(3.0, 6.0));
			}
		}
		
		script.SetLifeTime(Random.Range(_firework.lifeSpanMin, _firework.lifeSpanMax));
	}
	else
	{
		launchedFirework.SendMessage("SetBuilderPath", _firework.builderPath);
	}
	
	
	
	
}


function Launch(_firework : FireWork)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Launching FireWork" + _firework);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("levelName: " + levelList[activePlayList.GetCurrentLevel()].levelName);
	totalFireworks++;
	var start : Vector3;
	var end : Vector3;
	var lifeSpan : float;
	
	lifeSpan = Random.Range(_firework.lifeSpanMin, _firework.lifeSpanMax);
	// Debug.Log(lifeSpan+": "+_firework.lifeSpanMin+"/"+_firework.lifeSpanMax);
	if ( _firework.randomStartPos == false )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(_firework.StartPos);
		start = PixelToWorld(_firework.StartPos.x, _firework.StartPos.y);
		
		//script.SetPosition(_firework.StartPos.x, _firework.StartPos.y);
	}
	else
	{
		//random start pos
		start = PixelToWorld(Random.Range(100,540), Random.Range(50, 100));
		//script.SetPosition(Random.Range(100,540), Random.Range(50, 300));
	}
	
	if ( _firework.randomEndPos == false )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(_firework.StartPos);
		end = PixelToWorld(_firework.EndPos.x, _firework.EndPos.y);
		
		//script.SetPosition(_firework.StartPos.x, _firework.StartPos.y);
	}
	else
	{
		//random end pos
		end = PixelToWorld(Random.Range(100,540), Random.Range(500, 700));
		//script.SetPosition(Random.Range(100,540), Random.Range(50, 300));
	}
	
	
	
	if ( _firework.randomType == true )
	{
		//var FWtype : flightPath = _firework.randomPaths[Random.Range(0, _firework.randomPaths.length)];
		var FWtype : flightPath = _firework.randomPaths[Random.Range(0, _firework.numRandomFW)];
		
		if ( FWtype == flightPath.ChainStraight )
		{
			lifeSpan *= 0.33;
			//end *= 0.33;
		}	
		
		launchedFirework = ff.GetFirework(FWtype, _firework.visual, start, end, lifeSpan);
	}
	else
	{
		if ( _firework.path == flightPath.ChainStraight )
		{
			lifeSpan *= 0.33;
			//end *= 0.33;
		}
		
		launchedFirework = ff.GetFirework(_firework.path, _firework.visual, start, end, lifeSpan);
	}
	
	var script : fw_main = launchedFirework.GetComponent("fw_main") as fw_main;

	if ( _firework.path == flightPath.ChainStraight )
	{
		//script.actualEndPos = end;
		//script.velocity *= 0.33;
		//script.lifeTime *= 0.33;
	}

	if ( _firework.path != flightPath.Builder )
	{
		// Do nothing
	}
	else
	{
		launchedFirework.SendMessage("SetBuilderPath", _firework.builderPath);
	}
	
	if ( _firework.levelEndFireWork	== true )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Level End FireWork FOUND: Sending CANPAUSEFIREWORKS MESSAGE to newLEVELLAYERMANAGER");
		newLevelLayersManager.CanPauseFireWorks();
		levelEndFireWorksFound++;
	}
	
	if ( tutorialMode )
	{
		script.ActivateTutorialMode();
	}
}

function InsertLevel(_currentLevel : int)
{
	for ( var i : int = levelList.Count - 2; i >= _currentLevel; --i )
	{
		CopyLevel(i + 1, i);
	}
	levelList[_currentLevel].levelName = "[INS]" + levelList[_currentLevel].levelName; 
}

function InsertBlank(_levelNum : int)
{
	for ( var i : int = levelList.Count - 2; i >= _levelNum; --i )
	{
		CopyLevel(i + 1, i);
	}
}

function DeleteLevel(_currentLevel : int)
{
	for ( var i : int = _currentLevel; i < levelList.Count - 1; ++i )
	{
		CopyLevel(i, i + 1);
	}
	//levelList[_currentLevel].levelName = "[INS]" + levelList[_currentLevel].levelName; 
}



function CopyLevel(_toLevel, _fromLevel)
{
	//var clone = Instantiate(levelList[_fromLevel], Vector3.zero, Quaternion.identity);
	//levelList[_toLevel] = clone;
	
	// LEVEL DATA
	//levelList[_toLevel].levelName =  "Copy of " + levelList[_fromLevel].levelName;
	levelList[_toLevel].levelName = levelList[_fromLevel].levelName;

	var fValue : float = levelList[_fromLevel].levelInterval;
	levelList[_toLevel].levelInterval = fValue;
	levelList[_toLevel].repeatCount = levelList[_fromLevel].repeatCount;
	levelList[_toLevel].currentFirework = levelList[_fromLevel].currentFirework;
	
	// FIREWORK DATA FOR THE LEVEL
	levelList[_toLevel].fireworks[0].fireworkName = levelList[_fromLevel].fireworks[0].fireworkName;
	levelList[_toLevel].fireworks[0].randomType = levelList[_fromLevel].fireworks[0].randomType;
	levelList[_toLevel].fireworks[0].numRandomFW = levelList[_fromLevel].fireworks[0].numRandomFW;
	
	// RANDOM PATHS
	for ( var i : int = 0; i < 12 ; i += 1)
	{
		levelList[_toLevel].fireworks[0].randomPaths[i] = levelList[_fromLevel].fireworks[0].randomPaths[i];
	}
	
	levelList[_toLevel].fireworks[0].maxRandomTypes = levelList[_fromLevel].fireworks[0].maxRandomTypes;
	levelList[_toLevel].fireworks[0].path = levelList[_fromLevel].fireworks[0].path;
	
	// BUILDER PATH
	var bLength : int = levelList[_fromLevel].fireworks[0].builderPath.Length;
	
	levelList[_toLevel].fireworks[0].builderPath = new Vector3[bLength];
	
	for ( i = 0; i < bLength; i+=1 )
	{
	    levelList[_toLevel].fireworks[0].builderPath[i] = levelList[_fromLevel].fireworks[0].builderPath[i];
	}
	levelList[_toLevel].fireworks[0].visual = levelList[_fromLevel].fireworks[0].visual;
	levelList[_toLevel].fireworks[0].spawnInterval = levelList[_fromLevel].fireworks[0].spawnInterval;
	levelList[_toLevel].fireworks[0].randomStartPos = levelList[_fromLevel].fireworks[0].randomStartPos;
	levelList[_toLevel].fireworks[0].randomEndPos = levelList[_fromLevel].fireworks[0].randomEndPos;
	levelList[_toLevel].fireworks[0].randomVelocity = levelList[_fromLevel].fireworks[0].randomVelocity;
	levelList[_toLevel].fireworks[0].StartPos.x = levelList[_fromLevel].fireworks[0].StartPos.x;
	levelList[_toLevel].fireworks[0].StartPos.y = levelList[_fromLevel].fireworks[0].StartPos.y;
	levelList[_toLevel].fireworks[0].startPosGridID = levelList[_fromLevel].fireworks[0].startPosGridID;
	levelList[_toLevel].fireworks[0].endPosGridID = levelList[_fromLevel].fireworks[0].endPosGridID;
	
	levelList[_toLevel].fireworks[0].EndPos.x = levelList[_fromLevel].fireworks[0].EndPos.x;
	levelList[_toLevel].fireworks[0].EndPos.y = levelList[_fromLevel].fireworks[0].EndPos.y;
	levelList[_toLevel].fireworks[0].lifeSpanMin = levelList[_fromLevel].fireworks[0].lifeSpanMin;
	levelList[_toLevel].fireworks[0].lifeSpanMax = levelList[_fromLevel].fireworks[0].lifeSpanMax;
	levelList[_toLevel].fireworks[0].StartVelocity.x = levelList[_fromLevel].fireworks[0].StartVelocity.x;
	levelList[_toLevel].fireworks[0].StartVelocity.y = levelList[_fromLevel].fireworks[0].StartVelocity.y;
	levelList[_toLevel].fireworks[0].levelEndFireWork = levelList[_fromLevel].fireworks[0].levelEndFireWork;
	
}

function PixelToWorld(_x : int, _y : int) : Vector3
{
	var pos : Vector3 = scaledRect.Position(_x, _y);
	pos.z = 10;
	return ( Camera.main.ScreenToWorldPoint(pos) );
}

function GetCurrentLevel() : int
{
	return ( activePlayList.GetCurrentLevel() );
}

function SkipToNextFireWorkLevel()
{
	fireworkIntervalTimer = nextLaunchTime - 0.5;
	levelIntervalTimer = nextLevelTime - 0.5;
}

function ToggleTutorialMode()
{
	tutorialMode = !tutorialMode;
}