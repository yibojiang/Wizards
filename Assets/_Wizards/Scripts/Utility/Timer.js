var timer:float=0;
var endTime:float;
var timerName : String;


var target:GameObject;
private var functionName:String;
private var params:Hashtable;
private var ignoreTimeScale:boolean=false;
private var startCounting:boolean=false;

private var lastRealTime:float;

function SetTimer(_time:float,_target:GameObject,_functionName:String,_params:Hashtable,_ignoreTimeScale:boolean)
{
	endTime=_time;
	target=_target;
	functionName=_functionName;
	params=_params;
	ignoreTimeScale=_ignoreTimeScale;
	startCounting=true;
	timerName = _functionName;
}

function SetTimer(_time:float,_target:GameObject,_functionName:String,_params:Hashtable)
{
	endTime=_time;
	target=_target;
	functionName=_functionName;
	params=_params;
	ignoreTimeScale=false;
	startCounting=true;
	timerName = _functionName;
}

function SetTimer(_time:float,_target:GameObject,_functionName:String,_ignoreTimeScale:boolean)
{
	endTime=_time;
	target=_target;
	functionName=_functionName;
	ignoreTimeScale=_ignoreTimeScale;
	startCounting=true;
	timerName = _functionName;
}

function SetTimer(_time:float,_target:GameObject,_functionName:String)
{
	endTime=_time;
	target=_target;
	functionName=_functionName;
	params=null;
	ignoreTimeScale=false;
	startCounting=true;
	timerName = _functionName;
}


function TimeUp()
{
	if (params!=null)
	{
		target.SendMessage(functionName,params);
	}
	else
	{
		target.SendMessage(functionName);
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Time Up");
	Destroy(this);
	
}

function Awake()
{
	lastRealTime = Time.realtimeSinceStartup;
}

function Update () 
{
	
	if (!ignoreTimeScale)
	{
		if (timer<endTime)
		{
			timer+=Time.deltaTime;
		}
		else
		{
			TimeUp();
		}
	}
	else
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log(timer);
		
		if (timer<endTime)
		{
			timer+=(Time.realtimeSinceStartup - lastRealTime);
			lastRealTime=Time.realtimeSinceStartup;
			

		}
		else
		{
			TimeUp();
		}
		
		
	}
}