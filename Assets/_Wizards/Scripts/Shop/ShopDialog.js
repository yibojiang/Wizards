var info:SpriteText;
var ray : Ray;
var hit : RaycastHit;

var callbackFunction:Function;
var cancelFunction:Function;

var yes:FadeFont;
var no:FadeFont;
var bubble:GameObject;
var arrow:exSprite;

var dialogText:String;


var graphics:exSprite;
var itemName:exSpriteFont;

var isStory:boolean;

var fireworkVisual : GameObject;
var fireworkVisualPos : Vector3 = Vector3(-21.54, 13.29, -2.70);

var broomVisual : GameObject;
var broomVisualPos : Vector3 = Vector3(-21.54, 13.29, -2.70);

private var catWheel : CatalogWheel;

var callCancelImmediate : boolean = false;

function SetYesNo(_yes:String,_no:String)
{
	yes.GetComponent(exSpriteFont).text=_yes;
	no.GetComponent(exSpriteFont).text=_no;
}

function Awake()
{
	catWheel = GameObject.Find("CatalogBoard").GetComponent(CatalogWheel) as CatalogWheel;
}

function Start()
{
	
	this.gameObject.SetActiveRecursively(false);
	isStory=false;
}

function Update ()
{
	ProcessInput();
	
	// Check if user is swiping or scrolling
	if ( catWheel == null )
	{
		Awake();
	}
	
	if ( catWheel.canScroll || catWheel.canSwipe )
	{
		ForceCancel();
	}
}

function SetName(_name:String)
{
	itemName.text=_name;
}

function ShowStory(_infoText:String)
{
	info.transform.localPosition.x=-30;
	info.maxWidth=60;
	isStory=true;
	
	this.gameObject.SetActiveRecursively(true);
	bubble.transform.localScale.x=0;
	bubble.transform.localScale.y=0;
	
	graphics.GetComponent.<Renderer>().enabled=false;
	info.Text="";
	itemName.text="";
	yes.SetAlpha(0);
	no.SetAlpha(0);
	this.gameObject.SetActiveRecursively(true);
	
	dialogText=_infoText;
	
	callbackFunction=null;
	
	
	iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",1,"y",1,"time",0.3,"easeType",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","ShowStoryText") );
	cancelFunction=null;
}

function Show(_infoText:String,_function:Function)
{
	info.transform.localPosition.x=-9.5;
	info.maxWidth=40;
	
	this.gameObject.SetActiveRecursively(true);
	bubble.transform.localScale.x=0;
	bubble.transform.localScale.y=0;
	
	graphics.GetComponent.<Renderer>().enabled=false;
	info.Text="";
	
	itemName.text="";
	yes.SetAlpha(0);
	no.SetAlpha(0);
	this.gameObject.SetActiveRecursively(true);
	
	dialogText=_infoText;
	
	callbackFunction=_function;
	
	
	iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",1,"y",1,"time",0.3,"easeType",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","ShowText") );
	cancelFunction=null;
}

function SetCancelFunction(_function:Function)
{
	cancelFunction=_function;
}



function ShowText()
{
	if ( PrefabVisualEnabled() == false )
	{
		graphics.GetComponent.<Renderer>().enabled=true;
	}
	info.Text=dialogText;
	yes.FadeIn(0.5,0,true);
	no.FadeIn(0.5,0,true);
}

function ShowStoryText()
{
	info.Text=dialogText;
	
}

function ProcessInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(ray, hit, 1000.0) )
		{
			if (!isStory)
			{
				if ( hit.transform.name == "Yes" )
	        	{	
	        		if ( callbackFunction != null )
	        		{
		        		info.Text="";
		        		itemName.text="";
						yes.SetAlpha(0);
						no.SetAlpha(0);
						graphics.GetComponent.<Renderer>().enabled=false;
						RemoveVisuals();
						iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","CallFunction") );
					}	
			    }
			    
			    if ( hit.transform.name == "No" )
	        	{
	        		info.Text="";
	        		itemName.text="";
	        		yes.SetAlpha(0);
					no.SetAlpha(0);
	 				graphics.GetComponent.<Renderer>().enabled=false;
	 				RemoveVisuals();
	 				if ( callCancelImmediate )
					{
						callCancelImmediate = false;
						CancelFunction();
					}
	        		iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","Hide") );
			    }
		    }
		    else
		    {
		    	if ( hit.transform.name == "Block" )
	        	{
	        		info.Text="";
	        		itemName.text="";
	        		yes.SetAlpha(0);
					no.SetAlpha(0);
	 				graphics.GetComponent.<Renderer>().enabled=false;
	 				if ( callCancelImmediate )
					{
						callCancelImmediate = false;
						CancelFunction();
					}
	        		iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","Hide") );
	        		isStory = false;
	        	}
		    }
		}	
	}
}

function ForceCancel()
{
	info.Text="";
	itemName.text="";
	yes.SetAlpha(0);
	no.SetAlpha(0);
	graphics.GetComponent.<Renderer>().enabled=false;
	RemoveVisuals();
	if ( callCancelImmediate )
	{
		callCancelImmediate = false;
		CancelFunction();
	}
	iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","Hide") );
}		    

function CallFunction()
{
	RemoveVisuals();
	this.gameObject.SetActiveRecursively(false);
	if ( callbackFunction != null )
	{
		callbackFunction();
	}
}

function CancelFunction()
{
	if ( cancelFunction != null )
	{
		cancelFunction();
	}
}

function Hide()
{
	RemoveVisuals();
	this.gameObject.SetActiveRecursively(false);
	if (cancelFunction!=null)
	{
		cancelFunction();
	}
}

function SetFireworkVisual(_fireworkVisual : GameObject)
{
	fireworkVisual = _fireworkVisual;
	fireworkVisual.transform.parent = bubble.transform;
	fireworkVisual.transform.localPosition = fireworkVisualPos;
	fireworkVisual.transform.localScale = Vector3(1.0,1.0,1.0);
	

	fireworkVisual.GetComponentInChildren.<ParticleEmitter>().Simulate(1.0);
	

	//fireworkVisual.transform.parent = bubble.transform;
}

function RemoveVisuals()
{
	RemoveFireworkVisual();
	RemoveBroomVisual();
}

function RemoveFireworkVisual()
{
	if ( fireworkVisual	!= null )
	{
		fireworkVisual.GetComponentInChildren.<ParticleEmitter>().emit = false;
		fireworkVisual.GetComponentInChildren.<ParticleEmitter>().ClearParticles();
		//fireworkVisual.GetComponentInChildren(ParticleEmitter).Simulate(2.0);
		Destroy(fireworkVisual);
		fireworkVisual = null;
	}
}

function SetBroomVisual(_broomVisual : GameObject)
{
	if ( broomVisual != null )
	{
		Destroy(broomVisual);
		broomVisual = null;
		yield;
	}
	broomVisual = _broomVisual;
	broomVisual.transform.parent = bubble.transform;
	broomVisual.transform.localPosition = fireworkVisualPos;
	broomVisual.transform.localScale = Vector3(1.0,1.0,1.0);
}

function RemoveBroomVisual()
{
	if ( broomVisual != null )
	{
		Destroy(broomVisual);
		broomVisual = null;
	}
}

function PrefabVisualEnabled() : boolean
{
	if ( broomVisual == null && fireworkVisual	== null )
	{
		return ( false );
	}
	
	return ( true );
}
