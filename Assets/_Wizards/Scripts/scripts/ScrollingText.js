var text:String;
var toggle:float;
var toogleDuration:float=0;
//private var displayText:GUIText;

private var displayText:String;

var charIndex:int=0;
var wordLineCount:int=0;

private var isAssigned:boolean=false;
private var isFinished:boolean=false;
private var isReady:boolean=false;


var speechBubble:GameObject;
var javi:exSpriteAnimation;
var broom:exSpriteAnimation;
var toto:exSpriteAnimation;
var master:exSpriteAnimation;

var dialog:Dialog[];
var dialogLength:int;
var dialogIndex:int;

var dialogOver:boolean;

//var guiStyle : GUIStyle;
//var message : String;

var pressed:boolean=false;


var continueArrow:exSprite;

var spriteText:SpriteText;

private var lastRealTime:float;

var paused:boolean=false;

var tutMan : TutorialLevelManager;

private var am : AudioManager;

public var noHide : boolean = false;

enum Face
{
	Normal,
	Happy,
	Sad

}

function Start()
{
	if ( GameObject.Find("TutorialLevelManager") != null )
	{
		tutMan = GameObject.Find("TutorialLevelManager").GetComponent(TutorialLevelManager) as TutorialLevelManager;
	}
	
	if ( GameObject.Find("AudioManager") != null )
	{
		am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	}
	
	if ( am == null )
	{
		if ( GameObject.Find("BgmManager") != null )
		{
			am = GameObject.Find("BgmManager").GetComponent(AudioManager) as AudioManager;
		}
	}
		
	displayText="";
	spriteText.Text =displayText;
	speechBubble=GameObject.Find("SpeechBubble") as GameObject;  

	speechBubble.SetActiveRecursively(false);
	
	//continueArrow.color.a=0;
	continueArrow.GetComponent.<Renderer>().enabled=false;
}

function SetDialog(_dialog:Dialog[],_beginIndex:int,_endIndex:int)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetDialog(NO DELAY) : start : " + _beginIndex);
	noHide = false;
	speechBubble.SetActiveRecursively(true);
	
	//displayText.enabled=true;
	
	toto.gameObject.SetActiveRecursively(false); 
	javi.gameObject.SetActiveRecursively(false);
	broom.gameObject.SetActiveRecursively(false);
	master.gameObject.SetActiveRecursively(false);
	for (var i:int=_beginIndex;i<=_endIndex;i++)
	{
		dialog[i-_beginIndex].character=_dialog[i].character;	
		dialog[i-_beginIndex].text=_dialog[i].text;	
		dialog[i-_beginIndex].face=_dialog[i].face;	
	}
	
	dialogLength=_endIndex-_beginIndex+1;
	dialogIndex=0;
	isFinished=true;
	isReady=true;
	
	
	dialogOver=false;
}

function SetDialog(_dialog:Dialog[],_beginIndex:int,_endIndex:int, _noHide : boolean)
{
	noHide = _noHide;
	speechBubble.SetActiveRecursively(true);
	
	//displayText.enabled=true;
	
	toto.gameObject.SetActiveRecursively(false); 
	javi.gameObject.SetActiveRecursively(false);
	broom.gameObject.SetActiveRecursively(false);
	master.gameObject.SetActiveRecursively(false);
	for (var i:int=_beginIndex;i<=_endIndex;i++)
	{
		dialog[i-_beginIndex].character=_dialog[i].character;	
		dialog[i-_beginIndex].text=_dialog[i].text;	
		dialog[i-_beginIndex].face=_dialog[i].face;	
	}
	
	dialogLength=_endIndex-_beginIndex+1;
	dialogIndex=0;
	isFinished=true;
	isReady=true;
	
	
	dialogOver=false;
}

function SetDialog(_dialog:Dialog[],_beginIndex:int,_endIndex:int,_delay:float)
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetDialog(delay = " + _delay + ") : start : " + _beginIndex);
	
	noHide = false;
	dialogOver=false;
	yield WaitForSeconds(_delay);
	
    if ( Wizards.Utils.DEBUG ) Debug.Log("SetDialog(delay) SHOW NOW");
	
	speechBubble.SetActiveRecursively(true);
	
	//displayText.enabled=true;
	
	toto.gameObject.SetActiveRecursively(false); 
	javi.gameObject.SetActiveRecursively(false);
	broom.gameObject.SetActiveRecursively(false);
	master.gameObject.SetActiveRecursively(false);
	for (var i:int=_beginIndex;i<=_endIndex;i++)
	{
		dialog[i-_beginIndex].character=_dialog[i].character;	
		dialog[i-_beginIndex].text=_dialog[i].text;	
		dialog[i-_beginIndex].face=_dialog[i].face;	
	}
	
	dialogLength=_endIndex-_beginIndex+1;
	dialogIndex=0;
	isFinished=true;
	isReady=true;
	
	
	
	
}

function GamePause()
{
	Time.timeScale=0.0;
}

function GameResume()
{
	Time.timeScale=1.0;
}


function SetText(_character:Character,_text:String,_face:Face)
{
	text=_text;
	wordLineCount=0;
	charIndex=0;
	toogleDuration=0.03;
	toggle=toogleDuration;
	//displayText.text="";
	displayText="";
	spriteText.Text =displayText;
	isFinished=false;
	isAssigned=true;
	
	switch(_character)
	{
	case Character.Toto:   
		toto.gameObject.SetActiveRecursively(true); 
		javi.gameObject.SetActiveRecursively(false);
		broom.gameObject.SetActiveRecursively(false);
		master.gameObject.SetActiveRecursively(false);
		SetFace(toto,_face);
		break;
	case Character.Javi:  
		toto.gameObject.SetActiveRecursively(false); 
		javi.gameObject.SetActiveRecursively(true);
		broom.gameObject.SetActiveRecursively(false);
		master.gameObject.SetActiveRecursively(false);
		SetFace(javi,_face);
		break;
	case Character.Broom: 
		toto.gameObject.SetActiveRecursively(false); 
		javi.gameObject.SetActiveRecursively(false);
		broom.gameObject.SetActiveRecursively(true);
		master.gameObject.SetActiveRecursively(false);
		SetFace(broom,_face);
		break;
	case Character.Master:
		toto.gameObject.SetActiveRecursively(false); 
		javi.gameObject.SetActiveRecursively(false);
		broom.gameObject.SetActiveRecursively(false);
		master.gameObject.SetActiveRecursively(true);
		SetFace(master,_face);
		break;
	case Character.Narratage:
		toto.gameObject.SetActiveRecursively(false); 
		javi.gameObject.SetActiveRecursively(false);
		broom.gameObject.SetActiveRecursively(false);
		master.gameObject.SetActiveRecursively(false);
		break;
	}
	GamePause();
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Game Pause Disabled");
	
	if ( tutMan != null )
	{
		tutMan.PauseFireworks();
	}
}


function SetFace(_spriteAnimation:exSpriteAnimation,_face:Face)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_face);
	switch(_face)
	{
	case Face.Normal:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 0);
		_spriteAnimation.Pause();

		break;
	case Face.Happy	:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 1);
		_spriteAnimation.Pause();
		break;
	case Face.Sad:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 2);
		_spriteAnimation.Pause();
		break;
	
	}
	
}

function HideText()
{
	speechBubble.SetActiveRecursively(false);
	//this.gameObject.SetActiveRecursively(false);
	//displayText.text="";
	displayText="";
	spriteText.Text =displayText;
	//if ( Wizards.Utils.DEBUG ) Debug.Log(displayText.text);
	//displayText.enabled=false;
	dialogIndex=dialogLength;
	isFinished=true;
	isAssigned=false;
	GameResume();
	if ( tutMan != null )
	{
		tutMan.ResumeFireworks();
	}
	dialogOver=true;
	//continueArrow.color.a=0;
	continueArrow.GetComponent.<Renderer>().enabled=false;
}

function Awake()
{
	lastRealTime = Time.realtimeSinceStartup;
}

function Update () {
	
	if (paused)
	{
		return;
	}
	
	if (pressed || isReady)
	{
		pressed=false;
		
		if (isReady)
		{
			isReady=false;
		}
		
		
		if (isFinished && !isReady)
		{
			
			if (dialogIndex<dialogLength)
			{
				if ( am != null )
				{
					am.PlayPageFlip();
				}
				else
				{
					if ( Wizards.Utils.DEBUG ) Debug.LogWarning("AUDIOMANAGER NOT FOUND FOR PAGE FLIP SOUND");
				}
				SetText(dialog[dialogIndex].character,dialog[dialogIndex].text,dialog[dialogIndex].face);
				//if ( Wizards.Utils.DEBUG ) Debug.Log(dialog[dialogIndex].face);
				// TODO - Check for Javies "HEY" text and play sound here.
				
				if ( dialog[dialogIndex].text == "Hey..!\nRelax Toto, relax." )
				{
					am.PlayOneShotAudio(am.javiVoice[Random.Range(2,4)],am.voiceVol);
				}
				dialogIndex++;
				
			}
			else
			{
				if ( !noHide )
				{
					HideText();
				}
			}
	
		}
		else
		{
			
			
			//show the whole text
			if (!isFinished)
			{
				//continueArrow.color.a=1;
				if (!noHide)
				{
					continueArrow.GetComponent.<Renderer>().enabled=true;
				}
				//displayText.text=text;
				displayText=text;
				spriteText.Text =displayText;
				
				isFinished=true;
				isAssigned=false;
			}

		}
	}
	
	
	if (!isFinished && isAssigned)
	{
		continueArrow.GetComponent.<Renderer>().enabled=false;
		if (charIndex<text.Length)
		{
			/*
			if (toggle>0)
			{
				toggle-=Time.deltaTime;
				var deltaTime:float=Time.realtimeSinceStartup - lastRealTime;
				lastRealTime=Time.realtimeSinceStartup;
				toggle-=deltaTime;
			}
			else
			{
				toggle=toogleDuration;
				
				displayText.text+=text.Chars[charIndex];
				charIndex++;
			}
			*/
			//displayText.text+=text.Chars[charIndex];
			displayText+=text.Chars[charIndex];
			spriteText.Text =displayText;	
			charIndex++;
		}
		else
		{
			if (!noHide	)
			{
				continueArrow.GetComponent.<Renderer>().enabled=true;
			}

			isFinished=true;	
			isAssigned=false;
		}
	}
	
	
	
}

