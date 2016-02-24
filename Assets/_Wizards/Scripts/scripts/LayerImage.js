var isLoop : boolean = false;
var spawnHeight : float;
var deadHeight: float;
var layerType:LayerType;

var layer:Layer;

var height:float;
var width:float;

var position:Vector3;
var scale:Vector2;
var objType:ObjectType;

var atlas:String;
var atlasIndex:int;

var eulerAngles:float;

var myTransform : Transform;
var layerManager:LayerManager;

function Awake()
{
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager);
	
	myTransform=transform;
}

function Init()
{
	if (objType==ObjectType.Static)
	{
	
	}
	else if (objType==ObjectType.Hover)
	{
		this.gameObject.AddComponent(Hover);
	}
	else if (objType==ObjectType.MovingCloud)
	{
		
		this.gameObject.AddComponent(MovingCloud);
	}
	else if (objType==ObjectType.Rotate)
	{
		this.gameObject.AddComponent(Rotate);
	}
	
}

function Start()
{
	
	Init();
	
}

function Update () 
{
	if (layerManager.initYSpeed!=0)
	{
		myTransform.localPosition.y-=Time.deltaTime*layerManager.initYSpeed*layer.scrollSpeed;
	}
}


