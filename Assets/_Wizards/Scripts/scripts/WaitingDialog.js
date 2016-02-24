var text:exSpriteFont;
var star:exSprite;
var exsprite:exSprite;
var state:NoticeState;

var starhead:RotateHead;

var showTimer:float=1.2;
enum NoticeState
{
	Waiting,
	Failed
}

function Awake()
{
	starhead=star.GetComponent(RotateHead);
	exsprite=GetComponent(exSprite);
}

function Start()
{
	//this.gameObject.SetActiveRecursively(false);
	this.transform.localScale.x=0;
	this.transform.localScale.y=0;
}

function Show(_type:NoticeState,_text:String)
{
	if (_type==NoticeState.Failed)
	{
		text.topColor=Color.red;
		text.botColor=Color.red;
	}
	else 
	{
		text.topColor=Color.black;
		text.botColor=Color.black;
	}
	showTimer=1.2;
	//this.gameObject.SetActiveRecursively(true);
	star.GetComponent.<Renderer>().enabled=false;
	text.GetComponent.<Renderer>().enabled=false;
	this.transform.localScale.x=0;
	this.transform.localScale.y=0;
	
	text.text=_text;
	
	state=_type;
	
	iTween.Stop(this.gameObject);
	iTween.ScaleTo(this.gameObject,iTween.Hash("X",1,"time",0.2,"easeType",iTween.EaseType.easeOutQuad));
	iTween.ScaleTo(this.gameObject,iTween.Hash("y",1,"time",0.1,"delay",0.2,"easeType",iTween.EaseType.easeInOutQuad,"oncompleteTarget",this.gameObject,"oncomplete","ShowStarAndText"));
}

function Hide()
{
	
	star.GetComponent.<Renderer>().enabled=false;
	text.GetComponent.<Renderer>().enabled=false;
	
	
	this.transform.localScale.x=0;
	this.transform.localScale.y=0;
	//iTween.ScaleTo(this.gameObject,iTween.Hash("y",0,"time",0.2,"easeType",iTween.EaseType.easeInOutQuad));
	//iTween.ScaleTo(this.gameObject,iTween.Hash("x",0,"time",0.2,"delay",0.2,"easeType",iTween.EaseType.easeInOutQuad,"oncompleteTarget",this.gameObject,"oncomplete","HideAll"));
}

function HideAll()
{
	this.transform.localScale.x=0;
	this.transform.localScale.y=0;
	//this.gameObject.SetActiveRecursively(false);
}


function ShowStarAndText()
{
	if (state==NoticeState.Failed)
	{
		star.GetComponent.<Renderer>().enabled=false;
	}
	else 
	{
		star.GetComponent.<Renderer>().enabled=true;	
	}
	
	text.GetComponent.<Renderer>().enabled=true;
}

function Update () 
{
	if (state==NoticeState.Failed  )
	{
		if (showTimer>0)
		{
			showTimer-=Time.deltaTime;
		}
		else
		{
			Hide();
		}
	}


}