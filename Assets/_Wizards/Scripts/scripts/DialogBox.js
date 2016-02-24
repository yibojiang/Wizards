var info:exSpriteFont;
var ray : Ray;
var hit : RaycastHit;

var callbackFunction:Function;
var cancelFunction:Function;

var yes:FadeFont;
var no:FadeFont;
var bubble:GameObject;


function Start()
{
	
	this.gameObject.SetActiveRecursively(false);
}

function Update () {
	ProcessInput();
}


function Show(_infoText:String,_function:Function)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("DialogBox-Show");
	this.gameObject.SetActiveRecursively(true);
	//yield;
	bubble.transform.localScale.x=0;
	bubble.transform.localScale.y=0;
	
	info.GetComponent(FadeFont).SetAlpha(0);

	yes.SetAlpha(0);
	no.SetAlpha(0);
	this.gameObject.SetActiveRecursively(true);
	
	info.text=_infoText;
	callbackFunction=_function;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("DialogBox-About to iTween");

	iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",1,"y",1,"time",0.3,"easeType",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","ShowText") );
	cancelFunction=null;
}

function SetCancelFunction(_function:Function)
{
	cancelFunction=_function;
}

function ShowText()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Show Text");
	info.GetComponent(FadeFont).FadeIn(0.5,0,true);
	yes.FadeIn(0.5,0,true);
	no.FadeIn(0.5,0,true);
}

function ProcessInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(ray, hit, 1000.0) )
		{

			if ( hit.transform.name == "Yes" )
        	{	
        	
 				info.GetComponent(FadeFont).SetAlpha(0);
				yes.SetAlpha(0);
				no.SetAlpha(0);
				iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","CallFunction") );
		    }
		    
		    if ( hit.transform.name == "No" )
        	{
        		info.GetComponent(FadeFont).SetAlpha(0);
        		yes.SetAlpha(0);
				no.SetAlpha(0);
 
        		iTween.ScaleTo(bubble,iTween.Hash("ignoretimescale",true,"x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeOutQuad,"oncompletetarget",this.gameObject,"oncomplete","Hide") );
		    }

		}	
	}
}

function CallFunction()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Call function called");
	this.gameObject.SetActiveRecursively(false);
	callbackFunction();
}

function CancelFunction()
{
	cancelFunction();
}

function Hide()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Hide function called");
	this.gameObject.SetActiveRecursively(false);
	if (cancelFunction!=null)
	{
		cancelFunction();
	}
}