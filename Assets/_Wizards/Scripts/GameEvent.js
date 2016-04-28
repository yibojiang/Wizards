enum EStage
{
	Stage0,
	Stage1,
	Stage2,
	Stage3,
	Stage4,
	Stage5,
	Stage6,
	Stage7,
	Stage8,
	Stage9,
	Stage10,
	Stage11,
	Stage12,
	INVALID
}

class GameEventTimeSorter implements IComparer
{
	function Compare(a : System.Object, b : System.Object) : int
	{
		if ( !(a instanceof GameEvent) || !(b instanceof GameEvent))
		{
			return;
		}
		
		var eOne : GameEvent = a;
		var eTwo : GameEvent = b;
		
		return ( eOne.startTime - eTwo.startTime );
	}
}

class GameEventStageSorter implements IComparer
{
	function Compare(a : System.Object, b : System.Object) : int
	{
		if ( !(a instanceof GameEvent) || !(b instanceof GameEvent))
		{
			return;
		}
		
		var eOne : GameEvent = a;
		var eTwo : GameEvent = b;
		
		if ( eOne.stage == eTwo.stage )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Stages Identical, sorting on time");
			//if ( Wizards.Utils.DEBUG ) Debug.Log(eOne.eventName +":" + eOne.startTime);
			//if ( Wizards.Utils.DEBUG ) Debug.Log(eTwo.eventName +":" + eTwo.startTime);
			var result : float = eOne.startTime.CompareTo(eTwo.startTime);
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Result: " + result);
			return (  result );
		}
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Sorting on stage");
		//if ( Wizards.Utils.DEBUG ) Debug.Log(eOne.eventName +":" + eOne.stage);
		//if ( Wizards.Utils.DEBUG ) Debug.Log(eTwo.eventName +":" + eTwo.stage);
		//var result : float = eOne.startTime - eTwo.startTime;
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Result: " + result);
		return ( eOne.stage.CompareTo(eTwo.stage) );
	}
}

class GameEvent
{
	var eventName : String;
	var stage : EStage;
	var targetFunction : EGameEvent;
	var triggerType : ETriggerType;
	
	var startTime : float;
	var startFirework : float;
	var eventID : int;
	var hasBeenTriggered : boolean;
	
	// Event Specific Parameters
	// SCROLL
	var scrollSpeed : float; 
	
	// SCALE / SETSCALE / SCALERESUME - Use Same Parameters for all.
	var scaleAmount : float;
	var scaleTime : float;
	
	// SHOWTITLEWITHNAME
	var title : String;
	var subTitle : String;
	
	// PLAYAUDIO
	var audioEffect : AudioEffect;
	var volume : float;
	
	// CHANGEBGM
	var bgMusic : BGM;
	
	// FIREWORK ZPOS
	var zPos : float;
	
	// Helper variable - no need to save and load
	var confirmRemove : boolean = false;

	// Load Level Data Name.
	var levelName:String;
	

		
	function GetEventName() : String
	{
		return ( eventName );
	}
	
	function SetEventName(_eventName : String )
	{
		eventName = _eventName;
	}
	
	function GetTargetFunction() : EGameEvent
	{
		return ( targetFunction );
	}
	
	function SetTargetFunction(_targetFunction : EGameEvent )
	{
		targetFunction = _targetFunction;
	}
	
	function GetTriggerType() : ETriggerType
	{
		return ( triggerType );
	}
	
	function SetTriggerType(_triggerType : ETriggerType )
	{
		triggerType = _triggerType;
	}
	
	function GetStartTime() : float
	{
		return ( startTime );
	}
	
	function SetStartTime(_startTime : float)
	{
		startTime = _startTime;
	}
	
	function GetStartingFirework() : int
	{
		return ( startFirework );
	}
	
	function SetStartingFirework(_startingFirework : int)
	{
		startFirework = _startingFirework;
	}
	
	function GetID() : int
	{
		return ( eventID );
	}
	
	function SetID(_id : int)
	{
		eventID = _id;
	}
	
	function GetHasBeenTriggered() : boolean
	{
		return ( hasBeenTriggered );
	}
	
	function SetHasBeenTriggered(_hasBeenSet : boolean )
	{
		hasBeenTriggered = _hasBeenSet;
	}
}
