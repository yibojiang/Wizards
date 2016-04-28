var layerManager:LayerManager;
var sm:StageManager;


var stages:Stage[];
private var myData : UserData;
var _FileName : String = "StageInfo";
var _TutorialFileName : String = "TutorialStageInfo";
private var _FileNameExt: String = ".xml";
private var _data : String = "";
private var _FileLocation : String;



function Awake()
{
	var stageObj:GameObject[]=GameObject.FindGameObjectsWithTag("Stage");
	stages=new Stage[stageObj.length];
	//if ( Wizards.Utils.DEBUG ) Debug.Log(stageObj);
	for (var i:int=0;i<stageObj.length;i++)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(stageObj[stageObj.length-i-1].GetComponent(Stage));
		stages[i]=stageObj[stageObj.length-i-1].GetComponent(Stage);
	}
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager);
	sm=GameObject.Find("StageManager").GetComponent(StageManager);
	_FileLocation=Application.persistentDataPath;
	if ( Wizards.Utils.DEBUG ) Debug.Log("DATAPATH: " + _FileLocation);
	
	myData=new UserData();
	
	
}

function Start()
{

}

function LoadStages(_path:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("LoadStages");
	//if ( Wizards.Utils.DEBUG ) Debug.Log("LoadXML : Attempting : " + _levelNum);
	if ( LoadXML(_path) == false )
	{
		return; // unable to find file.
	}
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("hash:" + _data.GetHashCode());
	
    if(_data.ToString() != "")
    {
         // notice how I use a reference to type (UserData) here, you need this
         // so that the returned object is converted into the correct type
         //myData = (UserData)DeserializeObject(_data);
        // myData=new UserData();
         myData = DeserializeObject(_data);
         
        // LOAD NUM Stages
		var numStages : int = GetInt();
		sm.SetStageNum(numStages);
		
		// FOR EACH Stage
		for (var i:int=0;i<numStages;i++)
		{			
			//Load Stage Title
			sm.stageInfo[i].title=GetString();
			
			//Load Stage SubTitle
			sm.stageInfo[i].subTitle=GetString();
			
			
			//Load NUM Layer
			var numLayer:int=GetInt();
			sm.SetStageLayerInfoNum(i,numLayer);
			
			//Load the properties of layers.
			for (var l:int=0;l<numLayer;l++)
			{
				//Save LayerType
				sm.stageInfo[i].layerInfo[l].layerType=GetInt();
				
				//Load ScrollSpeed
				sm.stageInfo[i].layerInfo[l].scrollSpeed=GetFloat();
				
				//Load TiltValue
				sm.stageInfo[i].layerInfo[l].tiltValue=GetFloat();
			}
			
			
			//Load Num LayerImage
			var numLayerImage:int=GetInt();
			sm.SetStageLayerImageInfoNum(i,numLayerImage);
			
			//Load Properties of LayerImage
			for (var j:int=0;j<numLayerImage;j++)
			{				
				//Load Name
				sm.stageInfo[i].layerImageInfo[j].name=GetString();
				
				//Load Position
				sm.stageInfo[i].layerImageInfo[j].position.x=GetFloat();
				sm.stageInfo[i].layerImageInfo[j].position.y=GetFloat();
				sm.stageInfo[i].layerImageInfo[j].position.z=GetFloat();
				
				//Load Scale
				sm.stageInfo[i].layerImageInfo[j].scale.x=GetFloat();
				sm.stageInfo[i].layerImageInfo[j].scale.y=GetFloat();
				
				//Load eulerAngles
				sm.stageInfo[i].layerImageInfo[j].eulerAngles=GetFloat();
				
				//Load Atlas && Index
				sm.stageInfo[i].layerImageInfo[j].atlas=GetString();
				sm.stageInfo[i].layerImageInfo[j].atlasIndex=GetInt();
				
				//Load LayerType
				sm.stageInfo[i].layerImageInfo[j].layerType=GetInt();
				
				//Load ObjectType
				sm.stageInfo[i].layerImageInfo[j].objType=GetInt();
				
			}
			
			//Load Num LayerObj
			var numLayerObj:int=GetInt();
			sm.SetStageLayerObjInfoNum(i,numLayerObj);
			
			//Load Properties of LayerObject
			for (var k:int=0;k<numLayerObj;k++)
			{
			
				//Load ParentName
				sm.stageInfo[i].layerObjInfo[k].parentName=GetString();
				
				//Load Position
				sm.stageInfo[i].layerObjInfo[k].position.x=GetFloat();
				sm.stageInfo[i].layerObjInfo[k].position.y=GetFloat();
				sm.stageInfo[i].layerObjInfo[k].position.z=GetFloat();
				
				//load Scale
				sm.stageInfo[i].layerObjInfo[k].scale.x=GetFloat();
				sm.stageInfo[i].layerObjInfo[k].scale.y=GetFloat();
				
				//Load eulerAngles
				sm.stageInfo[i].layerObjInfo[k].eulerAngles=GetFloat();
				
				//Load ObjType
				sm.stageInfo[i].layerObjInfo[k].objType=GetInt();
				
				//Load PrefabName
				sm.stageInfo[i].layerObjInfo[k].prefabName=GetString();

			}
			
			//Load StartHeight & EndHeight
			sm.stageInfo[i].startHeight=GetFloat();
			sm.stageInfo[i].endHeight=GetFloat();
			
			
		}
	}
}

function SaveStages( _fullnameandpath : String)
{
	myData = new UserData();
	myData._iUser.myData = new Array();
	
	
	
	// SAVE NUM Stages
	AddData("" + stages.Length);
	
	// FOR EACH Stage
	for (var i:int=0;i<stages.length;i++)
	{
		// SAVE Stage Title
		AddData("" + stages[i].title);
		
		// SAVE Stage SubTitle
		AddData("" + stages[i].subTitle);
		
		
		//SAVE NUM Layer
		AddData(""+stages[i].layers.length);
		
		//SAVE the properties of layers.
		for (var layer:Layer in stages[i].layers)
		{
			var layerType0:int=layer.layerType;
			//Save LayerType
			AddData(""+layerType0);
		  
			//Save ScrollSpeed
			AddData(""+layer.scrollSpeed);
			
			//Save TiltValue
			AddData(""+layer.tiltValue);
		}
		
		// SAVE NUM LayerImage
		AddData("" + stages[i].layerImages.length);
		
		//TODO Write down the properties of layerImages.
		for (var layerImage:LayerImage in stages[i].layerImages)
		{
			
			//Save Name
			AddData(""+layerImage.gameObject.name);
			
			//Save Position
			AddData(""+layerImage.position.x);
			AddData(""+layerImage.position.y);
			AddData(""+layerImage.position.z);
			
			//Save Scale
			AddData(""+layerImage.scale.x);
			AddData(""+layerImage.scale.y);

			//Save eulerAngles
			AddData(""+layerImage.eulerAngles);
			
			//Save Atlas && Index
			AddData(""+layerImage.atlas);
			AddData(""+layerImage.atlasIndex);
			
			//Save LayerType
			var layerType:int=layerImage.layerType;
			AddData(""+layerType);
			
			
			
			//Save ObjectType
			var objType:int=layerImage.objType;
			AddData(""+objType);
			
		}
		
		// SAVE NUM LayerObject
		AddData("" + stages[i].layerObjs.length);
		
		//TODO Write down the properties of layerObj.
		for (var layerObj:LayerObject in stages[i].layerObjs)
		{
			
			//Save ParentName
			AddData(""+layerObj.parentName);
			
			//Save Position
			AddData(""+layerObj.position.x);
			AddData(""+layerObj.position.y);
			AddData(""+layerObj.position.z);
			
			//Save Scale
			AddData(""+layerObj.scale.x);
			AddData(""+layerObj.scale.y);
			
			//Save eulerAngles
			AddData(""+layerObj.eulerAngles);
			
			//Save ObjType
			var objectType:int=layerObj.objType;
			AddData(""+objectType);
			
			//Save PrefabName
			AddData(""+layerObj.prefabName);
		
		}
		
		//SAVE StartHeight & EndHeight
		AddData(""+GetStartHeight(i));
		AddData(""+GetEndHeight(i));
		
		
	}
	
	_data = SerializeObject(myData);
	CreateXML(_fullnameandpath);
    if ( Wizards.Utils.DEBUG ) Debug.Log(_data);
}

function GetStartHeight(_stageIndex:int):float
{
	var minHeight:float=9999999;
	for (var layerImage:LayerImage in stages[_stageIndex].layerImages)
	{
		if (layerImage.layerType==LayerType.Castle02)
		{
			/*
			if (layerImage.position.y<minHeight)
			{
				minHeight=layerImage.position.y;
			}
			*/
			if (layerImage.tag=="StageEnd")
			{
				minHeight=layerImage.position.y;
			}
			
		}
	}
	return minHeight;
}

function GetEndHeight(_stageIndex:int):float
{
	var maxHeight:float=-9999999;
	for (var layerImage:LayerImage in stages[_stageIndex].layerImages)
	{
		/*
		if (layerImage.layerType==LayerType.Castle02)
		{
			if (layerImage.position.y>maxHeight)
			{
				maxHeight=layerImage.position.y;
			}
			
		}
		*/
		if (layerImage.tag=="StageEnd")
		{
			maxHeight=layerImage.position.y;
		}
	}
	return maxHeight;
}

function LoadDefaultStages()
{
	LoadStages(_FileLocation+"/"+ _FileName +  _FileNameExt);
}

function LoadTutorialStages()
{
	LoadStages(_FileLocation+"/"+ _TutorialFileName +  _FileNameExt);
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
   var fullpath : String = _FileLocation+"/"+_fullnameandpath + _FileNameExt;
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