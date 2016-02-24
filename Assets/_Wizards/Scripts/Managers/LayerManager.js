//*********TODO: FIX POTENTIAL BUGS IN MOVE AND ZOOM*********


var initYSpeed : float= 12.0;
var prefab : LayerImage;
var layers : Array;
var layersNum:int;
var tiltOn:boolean;
var tiltSpeed:float;
var travelHeight:float=0;
var heightText:exSpriteFont;

var tiltLayers:Layer[];

enum LayerType
{
	Background=0,
	BgCloud=1,
	Castle01=2,
	Castle02=3,
	Castle03=4,
	Platform=5,
	Castle04=6,
	FtCloud=7,
	Element=8
	
	
}

function Awake()
{
	layers=new Array();
}

function Start()
{
	
	
}


function GenerateLayer(_layerImageInfo:LayerImageInfo)
{
	// A Layer Image contains a ex2d Sprite, and controls the scrolling of the image
	// prefab = LayerImage;
	var newLayer:LayerImage=Instantiate (prefab,_layerImageInfo.position , Quaternion.identity);
	var layerSprite:exSprite=newLayer.GetComponent(exSprite); // grab the exSprite component
	
	//Set Name
	newLayer.name=_layerImageInfo.name; // Set layer name from the StageManagers Imageinfo.name
	
	
	//Set Texture
	
	// Load Atlas From Resources
	var atlas:exAtlas=Resources.Load(_layerImageInfo.atlas);
	if (_layerImageInfo.atlas!="none")
	{
		// set sprite from atlas.
		// PJC ex2d old -> layerSprite.SetSprite(atlas,_layerImageInfo.atlasIndex);
		layerSprite.SetSprite(atlas,_layerImageInfo.atlasIndex, false);
	}
	else // If no atlas, disable image.
	{
		layerSprite.GetComponent.<Renderer>().enabled=false;
	}
	
	// Set Tilt info of layer
	newLayer.layer=tiltLayers[_layerImageInfo.layerType];
	// Set Rotation of layer
	newLayer.transform.eulerAngles.z=_layerImageInfo.eulerAngles;
	
	// Attach layer to parent
	newLayer.gameObject.transform.parent=tiltLayers[_layerImageInfo.layerType].transform;
	// Set layer postion
	newLayer.gameObject.transform.localPosition.x=_layerImageInfo.position.x;
	newLayer.gameObject.transform.localPosition.z=_layerImageInfo.position.z;
	newLayer.gameObject.transform.localPosition.y=_layerImageInfo.position.y-tiltLayers[_layerImageInfo.layerType].travelHeight;
	//newLayer.transform.lossyScale.x=_layerImageInfo.scale.x;
	//newLayer.transform.lossyScale.y=_layerImageInfo.scale.y;
	
	// Set layer scale
	newLayer.transform.localScale.x=_layerImageInfo.scale.x;
	newLayer.transform.localScale.y=_layerImageInfo.scale.y;
	
	
	
	//Fix offset
	//newLayer.transform.position.y-=newLayer.layer.travelHeight;
	//newLayer.transform.position.y+=newLayer.layer.tiltYOffset;

	//Set ObjectType
	newLayer.objType=_layerImageInfo.objType;
	
	newLayer.layerManager=this;
	
	//Init
	layers.Add(newLayer); // layers is an array, adding a LayerImage object here.
	
	//newLayer.renderer.enabled=false;
}

// Adds a layer object from a prefab in the resources folder.
function GenerateLayerObject(_layerObjInfo:LayerObjInfo)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Adding Layer Object: " + _layerObjInfo.prefabName);
	var layerObjectPrefab:GameObject=Resources.Load("Prefab/"+_layerObjInfo.prefabName);
	
	var layerObjGameObj:GameObject=Instantiate (layerObjectPrefab,_layerObjInfo.position , Quaternion.identity);
	var layerObject:LayerObject=layerObjGameObj.GetComponent(LayerObject);
	

	var parentLayer:GameObject=GameObject.Find(_layerObjInfo.parentName);
	
	layerObject.parentName=_layerObjInfo.parentName;
	layerObject.transform.parent=parentLayer.transform;
	layerObject.transform.localPosition=_layerObjInfo.position;
	
	layerObject.transform.localScale.x=_layerObjInfo.scale.x;
	layerObject.transform.localScale.y=_layerObjInfo.scale.y;
	
	
	layerObject.transform.eulerAngles.z=_layerObjInfo.eulerAngles;
	
	layerObject.objType=_layerObjInfo.objType;
	
	//layerObject.renderer.enabled=false;
	
}

function SetLayer(_layerType:LayerType,_scrollSpeed:float,_tiltValue:float)
{
	tiltLayers[_layerType].scrollSpeed=_scrollSpeed;
	tiltLayers[_layerType].tiltValue=_tiltValue;
}

function Scale(_rate:float,_time:float)
{
	//iTween.ScaleTo(backgroundLayer.gameObject,iTween.Hash("time",1,"x",_rate,"y",_rate,"easetype",iTween.EaseType.linear) );
	//iTween.ScaleTo(cloudsLayer.gameObject,iTween.Hash("time",_time,"x",_rate,"y",_rate*0.8,"easetype",iTween.EaseType.easeInOutQuad) );
	
	iTween.ScaleTo(tiltLayers[LayerType.Castle01].gameObject,iTween.Hash("time",_time,"x",_rate,"y",_rate,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle02].gameObject,iTween.Hash("time",_time,"x",_rate,"y",_rate,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle03].gameObject,iTween.Hash("time",_time,"x",_rate*1.1,"y",_rate*1.1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Platform].gameObject,iTween.Hash("time",_time,"x",_rate*1.2,"y",_rate*1.2,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle04].gameObject,iTween.Hash("time",_time,"x",1.25,"y",1.25,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.FtCloud].gameObject,iTween.Hash("time",_time,"x",1.3,"y",1.3,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Element].gameObject,iTween.Hash("time",_time,"x",_rate*1.35,"y",_rate*1.35,"easetype",iTween.EaseType.easeInOutQuad) );
	/*
	iTween.ScaleTo(castleLayer01.gameObject,iTween.Hash("time",_time,"x",_rate,"y",_rate,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(castleLayer02.gameObject,iTween.Hash("time",_time,"x",_rate*1.1,"y",_rate*1.1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(treeLayer.gameObject,iTween.Hash("time",_time,"x",_rate*1.2,"y",_rate*1.2,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(elementLayer.gameObject,iTween.Hash("time",_time,"x",_rate*1.3,"y",_rate*1.3,"easetype",iTween.EaseType.easeInOutQuad) );
	*/
}

function ScaleResume(_time:float)
{
	
	//iTween.ScaleTo(cloudsLayer.gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Background].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.BgCloud].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle01].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle02].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle03].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Platform].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Castle04].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.FtCloud].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(tiltLayers[LayerType.Element].gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	/*
	iTween.ScaleTo(castleLayer01.gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(castleLayer02.gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(treeLayer.gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.ScaleTo(elementLayer.gameObject,iTween.Hash("time",_time,"x",1,"y",1,"easetype",iTween.EaseType.easeInOutQuad) );
	*/
}


function Move(_amount:float,_time:float)
{
	//_amount;
	TiltOff();
	/*
	iTween.MoveAdd(castleLayer01.gameObject,iTween.Hash("time",_time,"x",_amount*castleLayer01.transform.parent.localScale.x/(Mathf.Pow( castleLayer01.transform.position.z,1)*castleLayer01.size ),"easetype",iTween.EaseType.easeInOutQuad,"oncomplete","TiltOn","oncompletetarget",this.gameObject) );
	iTween.MoveAdd(castleLayer02.gameObject,iTween.Hash("time",_time,"x",_amount*castleLayer02.transform.parent.localScale.x/(Mathf.Pow( castleLayer02.transform.position.z,1)*castleLayer02.size ),"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.MoveAdd(treeLayer.gameObject,iTween.Hash("time",_time,"x",_amount*treeLayer.transform.parent.localScale.x/(Mathf.Pow( treeLayer.transform.position.z,1)*treeLayer.size ),"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.MoveAdd(elementLayer.gameObject,iTween.Hash("time",_time,"x",_amount*elementLayer.transform.parent.localScale.x/(Mathf.Pow( elementLayer.transform.position.z,1)*elementLayer.size ),"easetype",iTween.EaseType.easeInOutQuad) );
	*/
}



function MoveResume(_time:float)
{
	TiltOff();
	/*
	iTween.MoveTo(castleLayer01.gameObject,iTween.Hash("time",_time,"x",0,"easetype",iTween.EaseType.easeInOutQuad,"oncomplete","TiltOn","oncompletetarget",this.gameObject) );
	iTween.MoveTo(castleLayer02.gameObject,iTween.Hash("time",_time,"x",0,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.MoveTo(treeLayer.gameObject,iTween.Hash("time",_time,"x",0,"easetype",iTween.EaseType.easeInOutQuad) );
	iTween.MoveTo(elementLayer.gameObject,iTween.Hash("time",_time,"x",0,"easetype",iTween.EaseType.easeInOutQuad) );
	*/
}

function TiltOn()
{
	tiltOn=true;
	//castleLayer01.tiltXOffset=0;

}

function TiltOff()
{
	tiltOn=false;
}

//Destroy layers that are not in the game screen.
function DestroyLayersOutOfScreen()
{
	for (var i:int=layers.length-1;i>=0;i--)
	{
		if ( ( (layers[i] as LayerImage).transform.position.y>=30*(layers[i] as LayerImage).transform.parent.localScale.x &&  (layers[i] as LayerImage).layerType!=LayerType.Background )  || (layers[i] as LayerImage).transform.position.y<=-40*(layers[i] as LayerImage).transform.parent.localScale.x  )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log((layers[i] as Layer).GetComponent(exLayerXY).layer+" " +(layers[i] as Layer).transform.position.y+" destroy!");
			Destroy((layers[i] as LayerImage).gameObject);
			layers.RemoveAt(i);
			
		}
	}
	System.GC.Collect();
}


function GetLayerTopYPosition(_layerTyoe:LayerType):float
{
	var top:float=0.0;
	var index:int=0;
	for (var i:int=0;i<layers.length;i++)
	{
		if ( (layers[i] as LayerImage).layerType==_layerTyoe  && (layers[i] as LayerImage).transform.position.y>top)
		{
			top=(layers[i] as LayerImage).transform.position.y;
			index=i;

		}
	}
	
	return (top/(layers[index] as LayerImage).transform.parent.localScale.y+30);
	
}


function Pause()
{
	initYSpeed = 0.0;
}

function Play(YSpeed:float)
{
	initYSpeed= YSpeed;
}

function DestroyAllLayers()
{
	while (layers.length>0)
	{
		Destroy((layers.Shift() as LayerImage).gameObject);
	}
}



function LateUpdate ()
{
	travelHeight=tiltLayers[LayerType.Castle02].travelHeight;
	if (heightText!=null)
	{
		heightText.text=""+Mathf.Ceil(travelHeight)+"M";
		
	}

	
	/*
	if (Time.frameCount % 30 == 0)
	{
	   System.GC.Collect();
	}
	*/
	
}
