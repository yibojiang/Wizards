#pragma strict
var renderqueue:int;

var doStart:boolean=false;

function Start () {	
	
	
}

function Init()
{
	var component:Component= this.GetComponentInChildren(UIScrollKnob);
	if (component!=null)
	{
		component.gameObject.GetComponent.<Renderer>().material.renderQueue=renderqueue;
	}
}

function Update () {
	if (!doStart)
	{
		Init();
		doStart=true;
	}
}