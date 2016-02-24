import System;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;

class GameData
{
	var myData : Array;
}

// UserData is our custom class that holds our defined objects we want to store in XML format
class UserData
{
    // We have to define a default instance of the structure
   //public var _iUser : DemoData = new DemoData();
    public var _iUser : GameData = new GameData();
    // Default constructor doesn't really do anything at the moment
   function UserData() { }
}

// This is our local private members
private var _FileLocation : String;

private var myData : UserData;
private var _data : String = "";

var saveLoadVersionKey : String = "WizardsEventSaveFileVersion";
var saveLoadVersionValue : int = 0;

var em : EventManager;

function Awake ()
{ 
      // Where we want to save and load to and from
      //_FileLocation=Application.dataPath;
      _FileLocation=Application.persistentDataPath;
          
      // we need soemthing to store the information into
      myData=new UserData();
}
   
function Start()
{
	//lm = GameObject.Find("LevelManager").GetComponent(LevelManager) as LevelManager;
	em = GameObject.Find("EventManager").GetComponent(EventManager) as EventManager;
}
   
function LoadEventData(_path : String) : boolean
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Loading Event Data From : " + _path);
	if ( LoadXML(_path) == false )
	{
		return ( false ); // unable to find file.
	}
	
    if(_data.ToString() != "")
    {
         myData = DeserializeObject(_data);
     
   		// Save Version Number
   		var saveLoadVersionKeyCheck : String = GetString();
   		
   		if ( saveLoadVersionKeyCheck != saveLoadVersionKey )
   		{
   			if ( Wizards.Utils.DEBUG ) Debug.LogError("Invalid Event File Detected! Nothing Loaded");
   			return;
   		}
		
		if ( Wizards.Utils.DEBUG ) Debug.Log("Loading Event Data: Event Save File Recognised: " + saveLoadVersionKeyCheck);
		
		var saveLoadVersionValueCheck : int = GetInt();
		if ( Wizards.Utils.DEBUG ) Debug.Log("Loading Event Data: Event Save File Version : " + saveLoadVersionValueCheck);
		
		switch ( saveLoadVersionValueCheck )
		{
			case 0:
				LoadVersion_0();
			break;
		}
	}
		
    return true;
}

function LoadVersion_0()
{
    // LOAD NUM LEVELS
	var numEvents : int = GetInt();
	
	em.InitialiseEvents(numEvents);
	
	// FOR EACH LEVEL
	for ( var i : int = 0; i < numEvents; i += 1 )		
	{
		em.events[i].eventName = GetString();
		em.events[i].stage = GetInt();
		em.events[i].targetFunction = GetInt();
		em.events[i].triggerType = GetInt();
		em.events[i].startTime = GetFloat();
		em.events[i].startFirework = GetInt();
		em.events[i].eventID = GetInt();
		if ( GetString() == "true" )
		{
			em.events[i].hasBeenTriggered = true;
		}
		else
		{
			em.events[i].hasBeenTriggered = false;
		}
		
		em.events[i].scrollSpeed = GetFloat();
		em.events[i].scaleAmount = GetFloat();
		em.events[i].scaleTime = GetFloat();
		em.events[i].title = GetString();
		em.events[i].subTitle = GetString();
		em.events[i].audioEffect = GetInt();
		em.events[i].volume = GetFloat();
		em.events[i].bgMusic = GetInt();
		em.events[i].zPos = GetFloat();
	}
}

// Use save versioning!
function SaveEventData(_fullnameandpath : String)
{ 
	myData = new UserData();
		
	myData._iUser.myData = new Array();
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Saving Event Data: File Version Key: " + saveLoadVersionKey);
	if ( Wizards.Utils.DEBUG ) Debug.Log("Saving Event Data: File Version Value: " + saveLoadVersionValue);
	// Save Version Number
	AddData("" + saveLoadVersionKey);
	AddData("" + saveLoadVersionValue);
	
	switch ( saveLoadVersionValue )
	{
		case 0:
			SaveVersion_0();
		break;
	}
	
    // Time to creat our XML!
    _data = SerializeObject(myData);
    
    CreateXML(_fullnameandpath);
    
    return true;
}

function SaveVersion_0()
{
	// SAVE NUM EVENTS
	AddData("" + em.events.length);
		
	// FOR EACH EVENT
	for ( var i : int = 0; i < em.events.length; i += 1 )		
	{
		var event : GameEvent = em.events[i];

		AddData("" + event.eventName);
		AddData("" + event.stage);
		AddData("" + parseInt(event.targetFunction));
		AddData("" + parseInt(event.triggerType));
		AddData("" + event.startTime);
		AddData("" + event.startFirework);
		AddData("" + event.eventID);
		if ( event.hasBeenTriggered == true )
		{
			AddData("true");
		}
		else
		{
			AddData("false");
		}
		
		AddData("" + event.scrollSpeed);
		AddData("" + event.scaleAmount);
		AddData("" + event.scaleTime);
		AddData("" + event.title);
		AddData("" + event.subTitle);
		AddData("" + parseInt(event.audioEffect));
		AddData("" + event.volume);
		AddData("" + parseInt(event.bgMusic));
		AddData("" + event.zPos);
	}
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

/*
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
*/
   // Finally our save and load methods for the file itself
function CreateXML(_fullnameandpath : String)
{
   var writer : StreamWriter;
   //FileInfo t = new FileInfo(_FileLocation+"\\"+ _FileName);
   //var fullpath : String = _FileLocation+"/"+ _FileName + _levelNum + _FileNameExt;
   var fullpath : String = _fullnameandpath;
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
   var fullpath : String = _fullnameandpath;
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