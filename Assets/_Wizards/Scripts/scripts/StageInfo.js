class LayerImageInfo
{
	var name:String;
	var position:Vector3;
	var scale:Vector2;
	var eulerAngles:float;
	
	var atlas:String;
	var atlasIndex:int;
	var layerType:LayerType;
	var objType:ObjectType;
}

class LayerObjInfo
{
	var parentName:String;
	var position:Vector3;
	var scale:Vector2;
	var eulerAngles:float;
	
	var objType:ObjectType;
	var prefabName:String;

}

class LayerInfo
{
	var layerType:LayerType;
	var scrollSpeed:float;
	var tiltValue:float;
}

class StageInfo
{
	var title:String;
	var subTitle:String;
	
	var layerInfo:LayerInfo[];
	var layerImageInfo:LayerImageInfo[];
	var layerObjInfo:LayerObjInfo[];
	
	var startHeight:float;
	var endHeight:float;
}


function Awake()
{

}

function Start()
{

}

function Update () 
{

}