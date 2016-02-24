var parentName:String;
var position:Vector3;
var width:float;
var height:float;
var objType:ObjectType;

var prefabName:String;
var scale:Vector2;
var eulerAngles:float;


enum ObjectType
{
	Static=0,
	Hover=1,
	MovingCloud=2,
	Rotate=3
}

function Awake()
{
	prefabName=this.name;
}

//Invoked after instantiated and properties are set up.
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

}