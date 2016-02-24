//import UnityEngine;
import System;
//import System.Collections;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;

// Anything we want to store in the XML file, we define it here
/*
class DemoData
{
    var _levelNum : int;
	var _fish : float;
	var _under : float;
	var _shield : float;
	var _split : float;
	var _normal : float;
	var _fast : float;
	var _powerup : float;
	var _bad : float;
	var _minBuy : float;
	var _maxBuy : float;
	var _hungerRate : float;
	var _numRocks : int;
	var _numLogs : int;
}
*/

//var magic : GameObject;

//class GameData
//{
	//var list : BattleBlock[];
//	var myData : Array;
	//var blocks : BattleBlock;
//}
// UserData is our custom class that holds our defined objects we want to store in XML format
//class UserData
//{
    // We have to define a default instance of the structure
   //public var _iUser : DemoData = new DemoData();
//    public var _iUser : GameData = new GameData();
    // Default constructor doesn't really do anything at the moment
//   function UserData() { }
//}

//public class GameSaveLoad: MonoBehaviour {

// An example where the encoding can be found is at
// http://www.eggheadcafe.com/articles/system.xml.xmlserialization.asp
// We will just use the KISS method and cheat a little and use
// the examples from the web page since they are fully described

// This is our local private members
private var _Save : Rect;
private var _Load : Rect;
private var _SaveMSG : Rect;
private var _LoadMSG : Rect;
//var _ShouldSave : boolean;
//var _ShouldLoad : boolean;
//var _SwitchSave : boolean;
//var _SwitchLoad : boolean;
private var _FileLocation : String;
//private var _FileName : String = "Level";
//private var _FileNameExt: String = ".xml";

private var _FileName : String = "LevelData";
private var _FileNameExt: String = ".xml";

var easyLevel : TextAsset;
var mediumLevel : TextAsset;
var hardLevel : TextAsset;


//public GameObject _Player;
//var _Player : GameObject;
//var _PlayerName : String = "Joe Schmoe";

// -- ACCESS TO THE GAME LEVELS
//var levels : leveldata;

var lm : LevelManager;

//var battleList : BattleList;

//var levelEdit : LevelEditor;

private var myData : UserData;
private var _data : String = "";

private var VPosition : Vector3;

private var ls:LevelSelector;
// When the EGO is instansiated the Start will trigger
// so we setup our initial values for our local members
//function Start () {
function Awake () { 
      // We setup our rectangles for our messages
      _Save=new Rect(10,80,100,20);
      _Load=new Rect(10,100,100,20);
      _SaveMSG=new Rect(10,120,200,40);
      _LoadMSG=new Rect(10,140,200,40);
       
      // Where we want to save and load to and from
      //_FileLocation=Application.dataPath;
      _FileLocation=Application.persistentDataPath;
      
          
      // we need soemthing to store the information into
      myData=new UserData();
      
      //levels = GameObject.Find("LevelData").GetComponent("leveldata") as leveldata;
      
     // magic = GameObject.Find("Magic");
     
     
   }
   
function Start()
{
	lm = GameObject.Find("LevelManager").GetComponent(LevelManager) as LevelManager;
}

   
function LoadLevelDataSelection(_path : String, _oldVersion : boolean, _sourceStart : int, _sourceEnd : int, _destStart : int) : boolean
{
	var offSet : int = 0;
	var destLevel : int = 0;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("LoadXML : Attempting : " + _path);
	if ( LoadXML(_path) == false )
	{
		return ( false ); // unable to find file.
	}
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("hash:" + _data.GetHashCode());
	
    if(_data.ToString() != "")
    {
         // notice how I use a reference to type (UserData) here, you need this
         // so that the returned object is converted into the correct type
         //myData = (UserData)DeserializeObject(_data);
        // myData=new UserData();
         myData = DeserializeObject(_data);
         
        // LOAD NUM LEVELS
		var numLevels : int = GetInt();
		
		//lm.SetNumLevels(numLevels);
		
		// FOR EACH LEVEL
		for ( var i : int = 0; i < numLevels; i += 1 )		
		{
			if ( i < _sourceStart )
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("SKIPPING LEVEL: " + i);
				SkipLevel(_oldVersion);
				continue;
			}
			if ( i == _sourceEnd + 1)
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("REACHED END OF SOURCE: STOPPING LOAD AT:" + (i - 1));
				if ( Wizards.Utils.DEBUG ) Debug.Log("FINAL DEST LEVEL COPIED" + (_destStart + offSet - 1));
				break;
			}
			
			
			
			if ( Wizards.Utils.DEBUG ) Debug.Log("LOADING LEVEL: " + i);
			if ( Wizards.Utils.DEBUG ) Debug.Log("DEST LEVEL " + (_destStart + offSet));
			
			destLevel = _destStart + offSet;
			
			// LOAD LEVEL NAME
			lm.SetLevelName(destLevel, GetString());
				
			// LOAD LEVEL INTERVAL
			lm.SetLevelInterval(destLevel, GetFloat());
			
			// LOAD NUM FIREWORKS
			var numFireworks : int = GetInt();
			//lm.SetNumFireWorks(destLevel, numFireworks);
						
			// FOR EACH FIREWORK
			for ( var j : int = 0; j < numFireworks; j += 1 )
			{	
				// LOAD NAME
				lm.SetFireWorkName(destLevel, j, GetString());
				
				// LOAD RANDOM
				lm.SetIsFireWorkRandom(destLevel,j, GetString());
				
				// LOAD NUM RANDOM TYPES
				var numRandomTypes : int = GetInt();
				
				lm.SetNumRandomTypes(destLevel,j, numRandomTypes); // This command creates the array of (12) types.
				
				// LOAD CURRENT NUM RANDOM TYPES - This sets actual current count of random types.
				lm.SetNumRandomFireworks(destLevel,j, GetInt());
				
				// LOAD MAX RANDOM TYPES
				lm.SetMaxNumRandomTypes(destLevel, j, GetInt());
							
				// FOR EACH RANDOM TYPE
				for ( var k : int = 0; k < numRandomTypes; k += 1 )
				{
					// LOAD TYPE
					lm.SetRandomFWTypeIntValue(destLevel, j, k, GetInt());
				}
					
				// LOAD TYPE (PATH) (this is for non-random fireworks)
				lm.SetFireWorkTypeIntValue(destLevel, j, GetInt());
				
				// LOAD NUM OF POINTS FOR BUILDER PATH
				var numBuilderPoints = GetInt();
				
				lm.SetNumBuilderPoints(destLevel, j, numBuilderPoints);
				
				// FOR EACH POINT
				for ( k = 0; k < numBuilderPoints; k += 1 )
				{
					var point : Vector3;
					// LOAD POSITION (Vector 3)
					point.x = GetFloat();
					point.y = GetFloat();
					point.z = GetFloat();
					
					lm.SetBuilderPoint(destLevel, j, k, point);
				}
						
				// LOAD VISUAL TYPE
				lm.SetVisualTypeIntValue(destLevel, j, GetInt());
				
				// LOAD SPAWN INTERVAL
				lm.SetSpawnInterval(destLevel, j, GetFloat());
				
				// LOAD RANDOM START POS (true/false)
				lm.SetIsRandomStartPos(destLevel, j, GetString());
				
				// LOAD RANDOM END POS (true / false)
				lm.SetIsRandomEndPos(destLevel, j, GetString());
				
				// LOAD RANDOM VELOCITY (true / false)
				lm.SetIsRandomVelocity(destLevel, j, GetString());
				
				// LOAD START POS (Vector3)
				var newPoint : Vector3;
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetStartPos(destLevel, j, newPoint);
				
				
				// LOAD START POS GRID ID
				lm.SetStartPosGridID(destLevel,j, GetInt());
				
				// LOAD END POS GRID ID
				lm.SetEndPosGridID(destLevel,j, GetInt());
				
				// LOAD END POS (Vector3)
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetEndPos(destLevel, j, newPoint);
				
				// LOAD LIFE SPAN MIN
				lm.SetLifeTimeMin(destLevel, j, GetFloat());
				
				// LOAD LIFE SPAN MAX
				lm.SetLifeTimeMax(destLevel, j, GetFloat());
				
				// LOAD START VELOCITY
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetVelocity(destLevel, j, newPoint);
				
				if ( !_oldVersion )
				{
					// LOAD IS LEVEL END FIREWORK?
					if ( GetString() == "true" )
					{
						lm.SetLevelEndFirework(destLevel, j, true);
					}
					else
					{
						lm.SetLevelEndFirework(destLevel, j, false);
					}
				}
				
				// LOAD REPEAT COUNT
				lm.SetFireWorkAmount(destLevel, GetInt());
				
				// LOAD CURRENT FIREWORK (For saving current game state) ???
				lm.SetCurrentFireWorkNumber(destLevel, GetInt());
			}
				
			offSet += 1;
		
		}
		// DONE - LEVELS LOADED
    }			
    
    return true;
}

function SkipLevel(_oldVersion : boolean)
{
	// LOAD LEVEL NAME
	GetString();
		
	// LOAD LEVEL INTERVAL
	GetFloat();
	
	// LOAD NUM FIREWORKS
	var numFireworks : int = GetInt();
				
	// FOR EACH FIREWORK
	for ( var j : int = 0; j < numFireworks; j += 1 )
	{	
		// LOAD NAME
		GetString();
						
		// LOAD RANDOM
		GetString();
						
		// LOAD NUM RANDOM TYPES
		var numRandomTypes : int = GetInt();
		
		// LOAD CURRENT NUM RANDOM TYPES - This sets actual current count of random types.
		GetInt();
		
		// LOAD MAX RANDOM TYPES
		GetInt();
					
		// FOR EACH RANDOM TYPE
		for ( var k : int = 0; k < numRandomTypes; k += 1 )
		{
			// LOAD TYPE
			GetInt();
		}
			
		// LOAD TYPE (PATH) (this is for non-random fireworks)
		GetInt();
		
		// LOAD NUM OF POINTS FOR BUILDER PATH
		var numBuilderPoints = GetInt();
		
		// FOR EACH POINT
		for ( k = 0; k < numBuilderPoints; k += 1 )
		{
			var point : Vector3;
			// LOAD POSITION (Vector 3)
			point.x = GetFloat();
			point.y = GetFloat();
			point.z = GetFloat();
		}
				
		// LOAD VISUAL TYPE
		GetInt();
		
		// LOAD SPAWN INTERVAL
		GetFloat();
		
		// LOAD RANDOM START POS (true/false)
		GetString();
		
		// LOAD RANDOM END POS (true / false)
		GetString();
		
		// LOAD RANDOM VELOCITY (true / false)
		GetString();
		
		// LOAD START POS (Vector3)
		var newPoint : Vector3;
		newPoint.x = GetInt();
		newPoint.y = GetInt();
		newPoint.z = GetInt();
		
		// LOAD START POS GRID ID
		GetInt();
		
		// LOAD END POS GRID ID
		GetInt();
		
		// LOAD END POS (Vector3)
		newPoint.x = GetInt();
		newPoint.y = GetInt();
		newPoint.z = GetInt();
		
		// LOAD LIFE SPAN MIN
		GetFloat();
		
		// LOAD LIFE SPAN MAX
		GetFloat();
		
		// LOAD START VELOCITY
		newPoint.x = GetInt();
		newPoint.y = GetInt();
		newPoint.z = GetInt();
	
		if ( !_oldVersion )
		{
			// LOAD IS LEVEL END FIREWORK?
			GetString();
		}
		
		// LOAD REPEAT COUNT
		GetInt();
		
		// LOAD CURRENT FIREWORK (For saving current game state) ???
		GetInt();
	}
}
      
         
function LoadLevelData(_path : String, _oldVersion : boolean) : boolean
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("LoadXML : Path : " + _path);
	
	if ( LoadXML(_path) == false )
	{
		return ( false ); // unable to find file.
	}
	
	//#endif
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("hash:" + _data.GetHashCode());
	
    if(_data.ToString() != "")
    {
         // notice how I use a reference to type (UserData) here, you need this
         // so that the returned object is converted into the correct type
         //myData = (UserData)DeserializeObject(_data);
        // myData=new UserData();
         myData = DeserializeObject(_data);
         
        // LOAD NUM LEVELS
		var numLevels : int = GetInt();
		
		lm.SetNumLevels(numLevels);
		
		// FOR EACH LEVEL
		for ( var i : int = 0; i < numLevels; i += 1 )		
		{
			// LOAD LEVEL NAME
			lm.SetLevelName(i, GetString());
				
			// LOAD LEVEL INTERVAL
			lm.SetLevelInterval(i, GetFloat());
			
			// LOAD NUM FIREWORKS
			var numFireworks : int = GetInt();
			lm.SetNumFireWorks(i, numFireworks);
						
			// FOR EACH FIREWORK
			for ( var j : int = 0; j < numFireworks; j += 1 )
			{	
				// LOAD NAME
				lm.SetFireWorkName(i, j, GetString());
				
				// LOAD RANDOM
				lm.SetIsFireWorkRandom(i,j, GetString());
				
				// LOAD NUM RANDOM TYPES
				var numRandomTypes : int = GetInt();
				
				lm.SetNumRandomTypes(i,j, numRandomTypes); // This command creates the array of (12) types.
				
				// LOAD CURRENT NUM RANDOM TYPES - This sets actual current count of random types.
				lm.SetNumRandomFireworks(i,j, GetInt());
				
				// LOAD MAX RANDOM TYPES
				lm.SetMaxNumRandomTypes(i, j, GetInt());
							
				// FOR EACH RANDOM TYPE
				for ( var k : int = 0; k < numRandomTypes; k += 1 )
				{
					// LOAD TYPE
					lm.SetRandomFWTypeIntValue(i, j, k, GetInt());
				}
					
				// LOAD TYPE (PATH) (this is for non-random fireworks)
				lm.SetFireWorkTypeIntValue(i, j, GetInt());
				
				// LOAD NUM OF POINTS FOR BUILDER PATH
				var numBuilderPoints = GetInt();
				
				lm.SetNumBuilderPoints(i, j, numBuilderPoints);
				
				// FOR EACH POINT
				for ( k = 0; k < numBuilderPoints; k += 1 )
				{
					var point : Vector3;
					// LOAD POSITION (Vector 3)
					point.x = GetFloat();
					point.y = GetFloat();
					point.z = GetFloat();
					
					lm.SetBuilderPoint(i, j, k, point);
				}
						
				// LOAD VISUAL TYPE
				lm.SetVisualTypeIntValue(i, j, GetInt());
				
				// LOAD SPAWN INTERVAL
				lm.SetSpawnInterval(i, j, GetFloat());
				
				// LOAD RANDOM START POS (true/false)
				lm.SetIsRandomStartPos(i, j, GetString());
				
				// LOAD RANDOM END POS (true / false)
				lm.SetIsRandomEndPos(i, j, GetString());
				
				// LOAD RANDOM VELOCITY (true / false)
				lm.SetIsRandomVelocity(i, j, GetString());
				
				// LOAD START POS (Vector3)
				var newPoint : Vector3;
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetStartPos(i, j, newPoint);
				
				
				// LOAD START POS GRID ID
				lm.SetStartPosGridID(i,j, GetInt());
				
				// LOAD END POS GRID ID
				lm.SetEndPosGridID(i,j, GetInt());
				
				// LOAD END POS (Vector3)
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetEndPos(i, j, newPoint);
				
				// LOAD LIFE SPAN MIN
				lm.SetLifeTimeMin(i, j, GetFloat());
				
				// LOAD LIFE SPAN MAX
				lm.SetLifeTimeMax(i, j, GetFloat());
				
				// LOAD START VELOCITY
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetVelocity(i, j, newPoint);
				
				if ( !_oldVersion )
				{
					// LOAD IS LEVEL END FIREWORK?
					if ( GetString() == "true" )
					{
						lm.SetLevelEndFirework(i, j, true);
					}
					else
					{
						lm.SetLevelEndFirework(i, j, false);
					}
				}
				
				// LOAD REPEAT COUNT
				lm.SetFireWorkAmount(i, GetInt());
				
				// LOAD CURRENT FIREWORK (For saving current game state) ???
				lm.SetCurrentFireWorkNumber(i, GetInt());
			}
				
		// DONE - LEVELS LOADED
		
		}
        
        // LOAD NUMBER OF PLAY ITEMS
		var numPlayItems : int = GetInt();
		
		lm.SetNumPlayItems(numPlayItems);
				
		// FOR EACH PLAY ITEM
		for ( i = 0; i < numPlayItems; i += 1)
		{
			// LOAD FORMATION (PlayITEM ) NAME
			lm.SetPlayItemName(i, GetString());
			
			// LOAD NUMBER OF LEVELS IN SEQUENCE
			numLevels = GetInt();
			
			lm.SetNumPlayItemLevels(i, numLevels);
			
			// FOR EACH LEVEL IN SEQUENCE
			for (j = 0; j < numLevels; j += 1)	
			{
				// LOAD LEVEL NUMBER
				lm.SetPlayItemLevel(i, j, GetInt());
			}
			
			// LOAD CURRENT LEVEL (For saving current game state) ???
			lm.SetPlayItemCurrentLevel(i, GetInt());
		}
		
		// LOAD CURRENT PLAY ITEM (For saving current game state) ???
		lm.SetCurrentPlayItem(GetInt());
    }			
    
    return true;
}
               
                                             
//function LoadLevelData(_levelNum, _path : String) : boolean
//function LoadLevelData(_path : String, _oldVersion : boolean) : boolean
function LoadLevelData(_difficulty : EDifficulty, _oldVersion : boolean) : boolean
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("LoadXML : Difficulty : " + _difficulty);
	
	
	//#if UNITY_EDITOR
	/*
	if ( LoadXML(_path) == false )
	{
		return ( false ); // unable to find file.
	}
	*/
	//#endif
	
	switch ( _difficulty )
	{
		case EDifficulty.Easy:
			_data = easyLevel.text;
		break;
		
		case EDifficulty.Medium:
			_data = mediumLevel.text;
		break;
		
		case EDifficulty.Hard:
			_data = hardLevel.text;
		break;
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log("hash:" + _data.GetHashCode());
	
    if(_data.ToString() != "")
    {
         // notice how I use a reference to type (UserData) here, you need this
         // so that the returned object is converted into the correct type
         //myData = (UserData)DeserializeObject(_data);
        // myData=new UserData();
         myData = DeserializeObject(_data);
         
        // LOAD NUM LEVELS
		var numLevels : int = GetInt();
		
		lm.SetNumLevels(numLevels);
		
		// FOR EACH LEVEL
		for ( var i : int = 0; i < numLevels; i += 1 )		
		{
			// LOAD LEVEL NAME
			lm.SetLevelName(i, GetString());
				
			// LOAD LEVEL INTERVAL
			lm.SetLevelInterval(i, GetFloat());
			
			// LOAD NUM FIREWORKS
			var numFireworks : int = GetInt();
			lm.SetNumFireWorks(i, numFireworks);
						
			// FOR EACH FIREWORK
			for ( var j : int = 0; j < numFireworks; j += 1 )
			{	
				// LOAD NAME
				lm.SetFireWorkName(i, j, GetString());
				
				// LOAD RANDOM
				lm.SetIsFireWorkRandom(i,j, GetString());
				
				// LOAD NUM RANDOM TYPES
				var numRandomTypes : int = GetInt();
				
				lm.SetNumRandomTypes(i,j, numRandomTypes); // This command creates the array of (12) types.
				
				// LOAD CURRENT NUM RANDOM TYPES - This sets actual current count of random types.
				lm.SetNumRandomFireworks(i,j, GetInt());
				
				// LOAD MAX RANDOM TYPES
				lm.SetMaxNumRandomTypes(i, j, GetInt());
							
				// FOR EACH RANDOM TYPE
				for ( var k : int = 0; k < numRandomTypes; k += 1 )
				{
					// LOAD TYPE
					lm.SetRandomFWTypeIntValue(i, j, k, GetInt());
				}
					
				// LOAD TYPE (PATH) (this is for non-random fireworks)
				lm.SetFireWorkTypeIntValue(i, j, GetInt());
				
				// LOAD NUM OF POINTS FOR BUILDER PATH
				var numBuilderPoints = GetInt();
				
				lm.SetNumBuilderPoints(i, j, numBuilderPoints);
				
				// FOR EACH POINT
				for ( k = 0; k < numBuilderPoints; k += 1 )
				{
					var point : Vector3;
					// LOAD POSITION (Vector 3)
					point.x = GetFloat();
					point.y = GetFloat();
					point.z = GetFloat();
					
					lm.SetBuilderPoint(i, j, k, point);
				}
						
				// LOAD VISUAL TYPE
				lm.SetVisualTypeIntValue(i, j, GetInt());
				
				// LOAD SPAWN INTERVAL
				lm.SetSpawnInterval(i, j, GetFloat());
				
				// LOAD RANDOM START POS (true/false)
				lm.SetIsRandomStartPos(i, j, GetString());
				
				// LOAD RANDOM END POS (true / false)
				lm.SetIsRandomEndPos(i, j, GetString());
				
				// LOAD RANDOM VELOCITY (true / false)
				lm.SetIsRandomVelocity(i, j, GetString());
				
				// LOAD START POS (Vector3)
				var newPoint : Vector3;
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetStartPos(i, j, newPoint);
				
				
				// LOAD START POS GRID ID
				lm.SetStartPosGridID(i,j, GetInt());
				
				// LOAD END POS GRID ID
				lm.SetEndPosGridID(i,j, GetInt());
				
				// LOAD END POS (Vector3)
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetEndPos(i, j, newPoint);
				
				// LOAD LIFE SPAN MIN
				lm.SetLifeTimeMin(i, j, GetFloat());
				
				// LOAD LIFE SPAN MAX
				lm.SetLifeTimeMax(i, j, GetFloat());
				
				// LOAD START VELOCITY
				newPoint.x = GetInt();
				newPoint.y = GetInt();
				newPoint.z = GetInt();
				lm.SetVelocity(i, j, newPoint);
				
				if ( !_oldVersion )
				{
					// LOAD IS LEVEL END FIREWORK?
					if ( GetString() == "true" )
					{
						lm.SetLevelEndFirework(i, j, true);
					}
					else
					{
						lm.SetLevelEndFirework(i, j, false);
					}
				}
				
				// LOAD REPEAT COUNT
				lm.SetFireWorkAmount(i, GetInt());
				
				// LOAD CURRENT FIREWORK (For saving current game state) ???
				lm.SetCurrentFireWorkNumber(i, GetInt());
			}
				
		// DONE - LEVELS LOADED
		
		}
        
        // LOAD NUMBER OF PLAY ITEMS
		var numPlayItems : int = GetInt();
		
		lm.SetNumPlayItems(numPlayItems);
				
		// FOR EACH PLAY ITEM
		for ( i = 0; i < numPlayItems; i += 1)
		{
			// LOAD FORMATION (PlayITEM ) NAME
			lm.SetPlayItemName(i, GetString());
			
			// LOAD NUMBER OF LEVELS IN SEQUENCE
			numLevels = GetInt();
			
			lm.SetNumPlayItemLevels(i, numLevels);
			
			// FOR EACH LEVEL IN SEQUENCE
			for (j = 0; j < numLevels; j += 1)	
			{
				// LOAD LEVEL NUMBER
				lm.SetPlayItemLevel(i, j, GetInt());
			}
			
			// LOAD CURRENT LEVEL (For saving current game state) ???
			lm.SetPlayItemCurrentLevel(i, GetInt());
		}
		
		// LOAD CURRENT PLAY ITEM (For saving current game state) ???
		lm.SetCurrentPlayItem(GetInt());
    }			
    
    return true;
}


function SaveLevelDataSelection(_fullnameandpath : String, _sourceStart : int, _sourceEnd : int)
{

	////myData._iUser.list = battleList.GetList(); 
	myData = new UserData();
		
	myData._iUser.myData = new Array();

	var numLevels : int = _sourceEnd - _sourceStart + 1;
	
	var currentLevel : int = 0;
	
	// SAVE NUM LEVELS
	AddData("" + numLevels);
		
	// FOR EACH LEVEL
	for ( var i : int = 0; i < numLevels; i += 1 )		
	{
		currentLevel = _sourceStart + i;
		
		// SAVE LEVEL NAME
		AddData("" + lm.GetLevelName(currentLevel));
			
		// SAVE LEVEL INTERVAL
		AddData("" + lm.GetLevelInterval(currentLevel));
		
		// SAVE NUM FIREWORKS
		AddData("" + lm.GetNumFireWorks(currentLevel));
					
		// FOR EACH FIREWORK
		for ( var j : int = 0; j < lm.GetNumFireWorks(currentLevel); j += 1 )
		{	
			// SAVE NAME
			AddData("" + lm.GetFireWorkName(currentLevel, j));
			
			// SAVE RANDOM
			AddData("" + lm.GetIsFireWorkRandom(currentLevel,j));
			
			// SAVE NUM RANDOM TYPES
			AddData("" + lm.GetNumRandomTypes(currentLevel,j));
			
			// SAVE CURRENT NUM RANDOM TYPES
			AddData("" + lm.GetNumRandomFireworks(currentLevel,j));
			
			// SAVE MAX RANDOM TYPES
			AddData("" + lm.GetMaxNumRandomTypes(currentLevel, j));
			
			// FOR EACH RANDOM TYPE
			for ( var k : int = 0; k < lm.GetNumRandomTypes(currentLevel,j); k += 1 )
			{
				// SAVE TYPE
				AddData("" + lm.GetRandomFWTypeIntValue(currentLevel, j, k));
			}
				
			// SAVE TYPE (PATH) (this is for non-random fireworks)
			AddData("" + lm.GetFireWorkTypeIntValue(currentLevel, j));
			
			// SAVE NUM OF POINTS FOR BUILDER PATH
			AddData("" + lm.GetNumBuilderPoints(currentLevel, j));
			
			// FOR EACH POINT
			for ( k = 0; k < lm.GetNumBuilderPoints(currentLevel, j); k += 1 )
			{
				var point : Vector3 = lm.GetBuilderPoint(currentLevel, j, k);
				// SAVE POSITION (Vector 3)
				AddData("" + point.x);
				AddData("" + point.y);
				AddData("" + point.z);
			}
					
			// SAVE VISUAL TYPE
			AddData("" + lm.GetVisualTypeIntValue(currentLevel, j));
			
			// SAVE SPAWN INTERVAL
			AddData("" + lm.GetSpawnInterval(currentLevel, j));
			
			// SAVE RANDOM START POS (true/false)
			AddData("" + lm.GetIsRandomStartPos(currentLevel, j));
			
			// SAVE RANDOM END POS (true / false)
			AddData("" + lm.GetIsRandomEndPos(currentLevel, j));
			
			// SAVE RANDOM VELOCITY (true / false)
			AddData("" + lm.GetIsRandomVelocity(currentLevel, j));
			
			// SAVE START POS (Vector3)
			var newPoint : Vector3 = lm.GetStartPos(currentLevel, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE START POS GRID ID
			AddData("" + lm.GetStartPosGridID(currentLevel,j));
			
			// SAVE END POS GRID ID
			AddData("" + lm.GetEndPosGridID(currentLevel,j));		
			
			// SAVE END POS (Vector3)
			newPoint = lm.GetEndPos(currentLevel, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE LIFE SPAN MIN
			AddData("" + lm.GetLifeTimeMin(currentLevel, j));
			
			// SAVE LIFE SPAN MAX
			AddData("" + lm.GetLifeTimeMax(currentLevel, j));
			
			// SAVE START VELOCITY
			newPoint = lm.GetStartVelocity(currentLevel, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE IS LEVELEND FIREWORK?
			
			if ( lm.GetLevelEndFirework(currentLevel, j) == true )
			{
				AddData("true");
			}
			else
			{
				AddData("false");
			}
			
			// SAVE REPEAT COUNT
			AddData("" + lm.GetFireWorkAmount(currentLevel));
			
			// SAVE CURRENT FIREWORK (For saving current game state) ???
			AddData("" + lm.GetCurrentFireWorkNumber(currentLevel));
		}
			
	// DONE - LEVELS SAVED
	
	}
	
    // Time to creat our XML!
    _data = SerializeObject(myData);
    //_data = (magic.GetComponent("Magic") as Magic).EncryptThis(_data);
    // This is the final resulting XML from the serialization process
   
    CreateXML(_fullnameandpath);
    
    return true;
    //if ( Wizards.Utils.DEBUG ) Debug.Log(_data);
}


function SaveLevelData(_fullnameandpath : String)
{

	////myData._iUser.list = battleList.GetList(); 
	myData = new UserData();
		
	myData._iUser.myData = new Array();

	
	
	// SAVE NUM LEVELS
	AddData("" + lm.GetNumLevels());
		
	// FOR EACH LEVEL
	for ( var i : int = 0; i < lm.GetNumLevels(); i += 1 )		
	{
		// SAVE LEVEL NAME
		AddData("" + lm.GetLevelName(i));
			
		// SAVE LEVEL INTERVAL
		AddData("" + lm.GetLevelInterval(i));
		
		// SAVE NUM FIREWORKS
		AddData("" + lm.GetNumFireWorks(i));
					
		// FOR EACH FIREWORK
		for ( var j : int = 0; j < lm.GetNumFireWorks(i); j += 1 )
		{	
			// SAVE NAME
			AddData("" + lm.GetFireWorkName(i, j));
			
			// SAVE RANDOM
			AddData("" + lm.GetIsFireWorkRandom(i,j));
			
			// SAVE NUM RANDOM TYPES
			AddData("" + lm.GetNumRandomTypes(i,j));
			
			// SAVE CURRENT NUM RANDOM TYPES
			AddData("" + lm.GetNumRandomFireworks(i,j));
			
			// SAVE MAX RANDOM TYPES
			AddData("" + lm.GetMaxNumRandomTypes(i, j));
			
			// FOR EACH RANDOM TYPE
			for ( var k : int = 0; k < lm.GetNumRandomTypes(i,j); k += 1 )
			{
				// SAVE TYPE
				AddData("" + lm.GetRandomFWTypeIntValue(i, j, k));
			}
				
			// SAVE TYPE (PATH) (this is for non-random fireworks)
			AddData("" + lm.GetFireWorkTypeIntValue(i, j));
			
			// SAVE NUM OF POINTS FOR BUILDER PATH
			AddData("" + lm.GetNumBuilderPoints(i, j));
			
			// FOR EACH POINT
			for ( k = 0; k < lm.GetNumBuilderPoints(i, j); k += 1 )
			{
				var point : Vector3 = lm.GetBuilderPoint(i, j, k);
				// SAVE POSITION (Vector 3)
				AddData("" + point.x);
				AddData("" + point.y);
				AddData("" + point.z);
			}
					
			// SAVE VISUAL TYPE
			AddData("" + lm.GetVisualTypeIntValue(i, j));
			
			// SAVE SPAWN INTERVAL
			AddData("" + lm.GetSpawnInterval(i, j));
			
			// SAVE RANDOM START POS (true/false)
			AddData("" + lm.GetIsRandomStartPos(i, j));
			
			// SAVE RANDOM END POS (true / false)
			AddData("" + lm.GetIsRandomEndPos(i, j));
			
			// SAVE RANDOM VELOCITY (true / false)
			AddData("" + lm.GetIsRandomVelocity(i, j));
			
			// SAVE START POS (Vector3)
			var newPoint : Vector3 = lm.GetStartPos(i, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE START POS GRID ID
			AddData("" + lm.GetStartPosGridID(i,j));
			
			// SAVE END POS GRID ID
			AddData("" + lm.GetEndPosGridID(i,j));		
			
			// SAVE END POS (Vector3)
			newPoint = lm.GetEndPos(i, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE LIFE SPAN MIN
			AddData("" + lm.GetLifeTimeMin(i, j));
			
			// SAVE LIFE SPAN MAX
			AddData("" + lm.GetLifeTimeMax(i, j));
			
			// SAVE START VELOCITY
			newPoint = lm.GetStartVelocity(i, j);
			AddData("" + newPoint.x);
			AddData("" + newPoint.y);
			AddData("" + newPoint.z);
			
			// SAVE IS LEVELEND FIREWORK?
			
			if ( lm.GetLevelEndFirework(i, j) == true )
			{
				AddData("true");
			}
			else
			{
				AddData("false");
			}
			
			// SAVE REPEAT COUNT
			AddData("" + lm.GetFireWorkAmount(i));
			
			// SAVE CURRENT FIREWORK (For saving current game state) ???
			AddData("" + lm.GetCurrentFireWorkNumber(i));
		}
			
	// DONE - LEVELS SAVED
	
	}
	
	// **** SAVE PLAYLIST ****
	
	// SAVE NUMBER OF PLAY ITEMS
	AddData("" + lm.GetNumPlayItems());
	
	// FOR EACH PLAY ITEM
	for ( i = 0; i < lm.GetNumPlayItems(); i += 1)
	{
		// SAVE FORMATION (PlayITEM ) NAME
		AddData("" + lm.GetPlayItemName(i));
		
		// SAVE NUMBER OF LEVELS IN SEQUENCE
		AddData("" + lm.GetNumPlayItemLevels(i));
		
		// FOR EACH LEVEL IN SEQUENCE
		for (j = 0; j < lm.GetNumPlayItemLevels(i); j += 1)	
		{
			// SAVE LEVEL NUMBER
			AddData("" + lm.GetPlayItemLevel(i, j));
		}
		
		// SAVE CURRENT LEVEL (For saving current game state) ???
		AddData("" + lm.GetPlayItemCurrentLevel(i));
	}
	
	// SAVE CURRENT PLAY ITEM (For saving current game state) ???
	AddData("" + lm.GetCurrentPlayItem());
    
    
    // Time to creat our XML!
    _data = SerializeObject(myData);
    //_data = (magic.GetComponent("Magic") as Magic).EncryptThis(_data);
    // This is the final resulting XML from the serialization process
   
    CreateXML(_fullnameandpath);
    
    return true;
    //if ( Wizards.Utils.DEBUG ) Debug.Log(_data);
}

function AddData(_data : String)
{
	myData._iUser.myData.Add(_data);	
}
/* The following metods came from the referenced URL */
//string UTF8ByteArrayToString(byte[] characters)
function UTF8ByteArrayToString(characters : byte[] )
{     
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var constructedString : String  = encoding.GetString(characters);
   return (constructedString);
}

//byte[] StringToUTF8ByteArray(string pXmlString)
function StringToUTF8ByteArray(pXmlString : String)
{
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var byteArray : byte[]  = encoding.GetBytes(pXmlString);
   return byteArray;
}
   
   // Here we serialize our UserData object of myData
   //string SerializeObject(object pObject)
function SerializeObject(pObject : Object)
{
   var XmlizedString : String  = null;
   var memoryStream : MemoryStream  = new MemoryStream();
   var xs : XmlSerializer = new XmlSerializer(typeof(UserData));
   var xmlTextWriter : XmlTextWriter  = new XmlTextWriter(memoryStream, Encoding.UTF8);
   xs.Serialize(xmlTextWriter, pObject);
   memoryStream = xmlTextWriter.BaseStream; // (MemoryStream)
   XmlizedString = UTF8ByteArrayToString(memoryStream.ToArray());
   return XmlizedString;
}

   // Here we deserialize it back into its original form
   //object DeserializeObject(string pXmlizedString)
function DeserializeObject(pXmlizedString : String)   
{
   var xs : XmlSerializer  = new XmlSerializer(typeof(UserData));
   var memoryStream : MemoryStream  = new MemoryStream(StringToUTF8ByteArray(pXmlizedString));
   var xmlTextWriter : XmlTextWriter  = new XmlTextWriter(memoryStream, Encoding.UTF8);
   return xs.Deserialize(memoryStream);
}


function FileExists(_fileNum) : boolean
{
	var exists : boolean = true;
	
	var fullpath : String = _FileLocation+"/"+ _FileName + _fileNum + _FileNameExt;
    //if ( Wizards.Utils.DEBUG ) Debug.Log(fullpath);
    var t : FileInfo = new FileInfo(fullpath);
    
    if(!t.Exists)
    {
    	exists = false;
    	if ( Wizards.Utils.DEBUG ) Debug.Log("File doesnt exist!");
    }
    
    return exists;	
}
   // Finally our save and load methods for the file itself
function CreateXML(_fullnameandpath : String)
{
   var writer : StreamWriter;
   //FileInfo t = new FileInfo(_FileLocation+"\\"+ _FileName);
   //var fullpath : String = _FileLocation+"/"+ _FileName + _levelNum + _FileNameExt;
   var fullpath : String = _fullnameandpath;// + _FileNameExt;
   if ( Wizards.Utils.DEBUG ) Debug.Log(fullpath);
   var t : FileInfo = new FileInfo(fullpath);
   if(!t.Exists)
   {
      writer = t.CreateText();
   }
   else
   {
      t.Delete();
      writer = t.CreateText();
   }
   
   
   writer.Write(_data);
   writer.Close();
   //if ( Wizards.Utils.DEBUG ) Debug.Log("File written.");
}

function SaveString(_fullnameandpath : String, _filenum : int)
{
	
	//File.WriteAllText(fullpath, _string);
		
	var writer : StreamWriter;
   //FileInfo t = new FileInfo(_FileLocation+"\\"+ _FileName);
  // var fullpath : String = _FileLocation+"/"+ _FileName + _filenum + _FileNameExt;
   var fullpath : String = _fullnameandpath + _FileNameExt;
   if ( Wizards.Utils.DEBUG ) Debug.Log("saving original data" + fullpath);
   var t : FileInfo = new FileInfo(fullpath);
   if(!t.Exists)
   {
      writer = t.CreateText();
   }
   else
   {
      t.Delete();
      writer = t.CreateText();
   }
   writer.Write(_fullnameandpath);
   writer.Close();
   
   
   
}
   
function LoadXML(_fullnameandpath : String) : boolean
{
   var fileFound : boolean = true;
   //StreamReader r = File.OpenText(_FileLocation+"\\"+ _FileName);
   //var fullpath : String = _FileLocation+"/"+ _FileName + _levelNum + _FileNameExt;
   var fullpath : String = _fullnameandpath;
   if ( Wizards.Utils.DEBUG ) Debug.Log(fullpath);
   var t : FileInfo = new FileInfo(fullpath);
   if(t.Exists)
   {
   		var r : StreamReader = File.OpenText(fullpath);
   		var _info : String = r.ReadToEnd();
   		r.Close();
   		_data=_info;
   		//if ( Wizards.Utils.DEBUG ) Debug.Log("File Read");
   }
   else
   {
   		if ( Wizards.Utils.DEBUG ) Debug.Log("No File to read");
   		fileFound = false;
   }
   
   return fileFound;
}

function GetFloat() : float
{
	return ( float.Parse(myData._iUser.myData.Shift()) );
}

function GetInt() : int
{
	return ( int.Parse(myData._iUser.myData.Shift()) );
}

function GetString() : String
{
	return ( myData._iUser.myData.Shift() );
}