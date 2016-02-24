var stars:exSprite;
var alphaChangeRate:float;
var leftEye:exSpriteAnimation;
var rightEye:exSpriteAnimation;
var timerController:TimerController;
var master:exSpriteAnimation;

var leftWhisker:GameObject;
var rightWhisker:GameObject;
var catHead:GameObject;

var newBestMiss : exSpriteFont;
var newBestPoor : exSpriteFont;
var newBestGood : exSpriteFont;
var newBestPerfect : exSpriteFont;

var newBestScaleSize : float = 1.230759;
var newBestScaleTime : float = 1.0;

function Awake()
{
	this.gameObject.SetActiveRecursively(false);
}

function AnimationOn()
{
	iTween.MoveBy(this.gameObject,iTween.Hash("time",0.8,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong) );
	iTween.MoveAdd(catHead.gameObject,iTween.Hash("time",5,"x",1,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.pingPong) );
	
	iTween.RotateAdd(leftWhisker.gameObject,iTween.Hash("time",1,"z",15,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong,"delay",0.5) );
	iTween.RotateAdd(rightWhisker.gameObject,iTween.Hash("time",1,"z",-15,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong,"delay",0.5) );
}

function AnimationOff()
{
	iTween.Stop(this.gameObject);
	iTween.Stop(catHead.gameObject);
	iTween.Stop(leftWhisker.gameObject);
	iTween.Stop(rightWhisker.gameObject);
}

function HideNewBests()
{
	newBestMiss.GetComponent.<Renderer>().enabled = false;
	newBestPoor.GetComponent.<Renderer>().enabled = false;
	newBestGood.GetComponent.<Renderer>().enabled = false;
	newBestPerfect.GetComponent.<Renderer>().enabled = false;
}

function ShowNewBestMiss()
{
	newBestMiss.transform.localScale = Vector3(0.0, 0.0, 0.0);
	newBestMiss.GetComponent.<Renderer>().enabled = true;
	iTween.ScaleTo(newBestMiss.gameObject, iTween.Hash("scale", Vector3(newBestScaleSize,newBestScaleSize,newBestScaleSize), "time", newBestScaleTime, "easetype", iTween.EaseType.spring));
}


function ShowNewBestPoor()
{
	newBestPoor.transform.localScale = Vector3(0.0, 0.0, 0.0);
	newBestPoor.GetComponent.<Renderer>().enabled = true;
	iTween.ScaleTo(newBestPoor.gameObject, iTween.Hash("scale", Vector3(newBestScaleSize,newBestScaleSize,newBestScaleSize), "time", newBestScaleTime, "easetype", iTween.EaseType.spring));
}


function ShowNewBestGood()
{
	newBestGood.transform.localScale = Vector3(0.0, 0.0, 0.0);
	newBestGood.GetComponent.<Renderer>().enabled = true;
	iTween.ScaleTo(newBestGood.gameObject, iTween.Hash("scale", Vector3(newBestScaleSize,newBestScaleSize,newBestScaleSize), "time", newBestScaleTime, "easetype", iTween.EaseType.spring));
}


function ShowNewBestPerfect()
{
	newBestPerfect.transform.localScale = Vector3(0.0, 0.0, 0.0);
	newBestPerfect.GetComponent.<Renderer>().enabled = true;
	iTween.ScaleTo(newBestPerfect.gameObject, iTween.Hash("scale", Vector3(newBestScaleSize,newBestScaleSize,newBestScaleSize), "time", newBestScaleTime, "easetype", iTween.EaseType.spring));
}

function Update () 
{
	
	
	if (stars.color.a<=0.1)
	{
		alphaChangeRate=0.8;
	}
	
	if (stars.color.a>=0.9)
	{
		alphaChangeRate=-0.8;
	}	
	
	stars.color.a+=alphaChangeRate*Time.deltaTime;


}


function MasterNodHead()
{
	master.Play("MasterHeadNod");
}

function MasterShakeHead()
{
	master.Play("MasterHeadShake");
}
