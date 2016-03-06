private static var instance : TimerController;
 
public static function Instance() : TimerController
{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<TimerController>();
    return instance;
}

private var lastRealTime:float;
static var realDeltaTime:float;

function AddTimer(_time:float,_target:GameObject,_functionName:String,_params:Hashtable,_ignoreTimeScale:boolean)
{
	var timer:Timer;
	timer=this.gameObject.AddComponent.<Timer>();
	timer.SetTimer(_time,_target,_functionName,_params,_ignoreTimeScale);
	//Report("TARGET: " + _target.name + " _FUNCTION: " + _functionName + " TIME: " + _time);
}

function AddTimer(_time:float,_target:GameObject,_functionName:String,_params:Hashtable)
{
	var timer:Timer;
	timer=this.gameObject.AddComponent.<Timer>();
	timer.SetTimer(_time,_target,_functionName,_params);
	//Report("TARGET: " + _target.name + " _FUNCTION: " + _functionName + " TIME: " + _time);
}

function AddTimer(_time:float,_target:GameObject,_functionName:String)
{
	var timer:Timer;
	timer=this.gameObject.AddComponent.<Timer>();
	timer.SetTimer(_time,_target,_functionName);
	//Report("TARGET: " + _target.name + " _FUNCTION: " + _functionName + " TIME: " + _time);
}

function AddTimer(_time:float,_target:GameObject,_functionName:String,_ignoreTimeScale:boolean)
{
	var timer:Timer;
	timer=this.gameObject.AddComponent.<Timer>();
	timer.SetTimer(_time,_target,_functionName,_ignoreTimeScale);
	//Report("TARGET: " + _target.name + " _FUNCTION: " + _functionName + " TIME: " + _time);
}

function Update () 
{
	realDeltaTime=Time.realtimeSinceStartup - lastRealTime;
	lastRealTime=Time.realtimeSinceStartup;
}

function Report(_timer : String)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("TIMER ADDED: " + _timer);
}