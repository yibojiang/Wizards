var cinem:exSprite;
var a:exSprite;
var nowplaying:exSprite;
var o:exSprite;
var star:exSprite;

var light1:GameObject;
var light2:GameObject;

var lightToggle:float=0.5;

var starToggle:float=1;


function Awake()
{	
	light1.SetActiveRecursively(true);
	light2.SetActiveRecursively(false);

}

function Update () {
	if (lightToggle>0)
	{
		lightToggle-=Time.deltaTime;
	}
	else
	{
		light2.SetActiveRecursively(light1.active);
		light1.SetActiveRecursively(!light1.active);
		
		lightToggle=0.5;
	}
	
	if (starToggle>0)
	{
		starToggle-=Time.deltaTime;
	}
	else
	{
		star.GetComponent.<Renderer>().enabled=!star.GetComponent.<Renderer>().enabled;
		starToggle=1;
	}
}