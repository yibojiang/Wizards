var message:exSpriteFont;
var timerController:TimerController;
var achievementRibbon:GameObject;
var isOn:boolean;

var messageQueue : List.<DisplayMessage>;

private var am : AudioManager;
private var pm : ProfileManager;

var displayPos : float;
var hiddenPos : float = 21.0;

class DisplayMessage
{
	var message : String;
	var displayTime : float;
	var soundEffect : AudioClip;
}

function Awake()
{
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;

	transform.localPosition.y = hiddenPos;
	
	if ( pm.IsUsingTallScreen() )
	{
		displayPos = 15;
	}
	else
	{
		displayPos = 12.5;
	}
	
	if ( GameObject.Find("AudioManager") != null )
	{
		am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	}
	else
	{
		am = GameObject.Find("BgmManager").GetComponent(AudioManager) as AudioManager;
	}
	timerController=GameObject.Find("TimerController").GetComponent(TimerController);
	isOn=false;
	messageQueue = new List.<DisplayMessage>();
}


function ShowMessage(_message:String,_time:float)
{
	if (isOn)
	{
		for ( var message : DisplayMessage in messageQueue )
		{
			if ( message.message == _message )
			{
			    if ( Wizards.Utils.DEBUG ) Debug.Log("Found duplicate message - discarding");
				return;
			}
		}
		
		var newMessage : DisplayMessage = new DisplayMessage();
		
		newMessage.displayTime = _time;
		newMessage.message = _message;
		messageQueue.Add(newMessage);
		return;
	}
	else
	{
		// Display Immediately
		RealShowMessage(_message, _time);
	}
}

function ShowMessage(_message:String,_time:float, _clip : AudioClip)
{
	if (isOn)
	{
		var newMessage : DisplayMessage = new DisplayMessage();
		
		newMessage.displayTime = _time;
		newMessage.message = _message;
		newMessage.soundEffect = _clip;
		messageQueue.Add(newMessage);
		return;
	}
	else
	{
		// Display Immediately
		RealShowMessage(_message, _time,  _clip);
	}
}

private function RealShowMessage(_message:String, _time:float)
{
	isOn=true;
	var ribbon:GameObject=Instantiate(achievementRibbon,Vector3(this.transform.position.x,this.transform.position.y-3,this.transform.position.z-0.1),Quaternion.identity);
	
	message.text=_message;
	iTween.MoveTo(this.gameObject,iTween.Hash("islocal",true,"y",displayPos,"time",1,"easetype",iTween.EaseType.spring,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","StayOnScreen","oncompleteparams",_time));
	
}

private function RealShowMessage(_message:String, _time:float, _clip : AudioClip)
{
	isOn=true;
	
	if ( am != null )
	{
		if ( _clip != null )
		{
			am.PlayOneShotAudio(_clip,am.audienceVol);
		}
	}
	var ribbon:GameObject=Instantiate(achievementRibbon,Vector3(this.transform.position.x,this.transform.position.y-3,this.transform.position.z-0.1),Quaternion.identity);
	
	message.text=_message;
	iTween.MoveTo(this.gameObject,iTween.Hash("islocal",true,"y",displayPos,"time",1,"easetype",iTween.EaseType.spring,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","StayOnScreen","oncompleteparams",_time));
	
}

function StayOnScreen(_time:float)
{
	timerController.AddTimer(_time,this.gameObject,"HideMessage",iTween.Hash(),true);
}

function HideMessage(_params:Hashtable)
{
	iTween.MoveTo(this.gameObject,iTween.Hash("islocal",true,"y",hiddenPos,"time",1,"easetype",iTween.EaseType.spring,"ignoretimescale",true, "oncompletetarget",this.gameObject,"oncomplete","Finished"));
	//this.transform.position.x=this.transform.parent.position.x;
}

function Finished()
{
	isOn=false;
	if ( messageQueue.Count > 0 )
	{
		if ( messageQueue[0].soundEffect != null )
		{
			ShowMessage(messageQueue[0].message, messageQueue[0].displayTime, messageQueue[0].soundEffect);
		}
		else
		{
			ShowMessage(messageQueue[0].message, messageQueue[0].displayTime);
		}
		
		messageQueue.RemoveAt(0);
	}
}
/*
function Update()
{
	if ( Input.GetKeyDown(KeyCode.M) == true )
	{
		ShowMessage("Random : " + Random.Range(0,1000), 1.0);
	}
}
*/