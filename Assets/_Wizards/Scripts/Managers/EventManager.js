//#pragma strict

import System.Collections.Generic;

enum EGameEvent
{
	PauseFireworks,
	ResumeFireworks,
	Scroll,
	Scale,
	SetScale,
	ScaleResume,
	ShowCatBoard,
	ShowCatBoardOnly,
	ShowTitle,
	ShowTitleWithName,
	PlayAudio,
	PlayInGameBGM,
	ChangeBGM,
	WizardOnTheGround,
	WizardFly,
	WizardToBackGround,
	WizardBackToLayer,
	GameFinished,
	SetFireworkZpos,
	StartStage,
	EndOfStage,
	ShowDragonBoss,
	PauseFireworksNoDelay,
	NewEvent
}

enum ETriggerType
{
	FixedTime,
	FireworkLevel
}

var debugTimerDisplay : exSpriteFont;
var debugTimeScale : exSpriteFont;

var targets : String[];

var events : GameEvent[];
var eventCount : int = 0;

var nl : NewLevelLayersManager;
var lm : LevelManager;

private var gm : GameManager;

private var lastRealTime : float = 0;
var realTime : float;
var gameTime : float = 0.0;
var stageTime : float = 0.0;

var currentStage : EStage;

var runStageTimer : boolean = false;

var functionNameHash : Hashtable;

var shiftTime : boolean = false;

var currentLoadingStage : EStage;

var useStageTimer : boolean = false;

var inGameTargetSpeed : float = 1.0;
var currentSpeed : exSpriteFont;
var gamePaused : boolean = false;

var gameTimerPaused : boolean = false;

var bgm : BgmManager;

function Awake()
{
	lastRealTime = Time.realtimeSinceStartup;
	
	nl = GameObject.Find("LevelLayersManager").GetComponent(NewLevelLayersManager) as NewLevelLayersManager;
	lm = GameObject.Find("LevelManager").GetComponent(LevelManager) as LevelManager;
	gm = GameObject.Find("GameManager").GetComponent(GameManager) as GameManager;
	bgm = GameObject.Find("AudioManager").GetComponent(BgmManager) as BgmManager;
	
	functionNameHash = new Hashtable();
	
	functionNameHash.Add("PauseFireworks", EGameEvent.PauseFireworks);
	functionNameHash.Add("ResumeFireworks", EGameEvent.ResumeFireworks);
	functionNameHash.Add("Scroll", EGameEvent.Scroll);
	functionNameHash.Add("Scale", EGameEvent.Scale);
	functionNameHash.Add("SetScale", EGameEvent.SetScale);
	functionNameHash.Add("ScaleResume", EGameEvent.ScaleResume);
	functionNameHash.Add("ShowCatBoard", EGameEvent.ShowCatBoard);
	functionNameHash.Add("ShowCatBoardOnly", EGameEvent.ShowCatBoardOnly);
	functionNameHash.Add("ShowTitle", EGameEvent.ShowTitle);
	functionNameHash.Add("ShowTitleWithName", EGameEvent.ShowTitleWithName);
	functionNameHash.Add("PlayAudio", EGameEvent.PlayAudio);
	functionNameHash.Add("PlayInGameBGM", EGameEvent.PlayInGameBGM);
	functionNameHash.Add("ChangeBGM", EGameEvent.ChangeBGM);
	functionNameHash.Add("WizardOnTheGround", EGameEvent.WizardOnTheGround);
	functionNameHash.Add("WizardFly", EGameEvent.WizardFly);
	functionNameHash.Add("WizardBackToLayer", EGameEvent.WizardBackToLayer);
	functionNameHash.Add("WizardToBackGround", EGameEvent.WizardToBackGround);
	functionNameHash.Add("GameFinished", EGameEvent.GameFinished);
	functionNameHash.Add("SetFireworkZpos", EGameEvent.SetFireworkZpos);
	functionNameHash.Add("EndOfStage", EGameEvent.EndOfStage);
	functionNameHash.Add("StartStage", EGameEvent.StartStage);
	functionNameHash.Add("ShowDragonBoss", EGameEvent.ShowDragonBoss);
	functionNameHash.Add("PauseFireworksNoDelay", EGameEvent.PauseFireworksNoDelay);
	
	
	
}

function Start()
{
	SortStages();
	
	EventCheck();
}

function IncreaseGameSpeed()
{
	if ( inGameTargetSpeed == 0.5 )
	{
	inGameTargetSpeed += 0.5;
	}
	else
	{
		inGameTargetSpeed += 1.0;
	}
	
	if ( inGameTargetSpeed > 10.0 )
	{
		inGameTargetSpeed = 10.0;
	}
	
	currentSpeed.text = "Speed=" + inGameTargetSpeed;
	
	
}

function DecreaseGameSpeed()
{
	inGameTargetSpeed -= 1.0;
	
	if ( inGameTargetSpeed < 1.0 )
	{
		inGameTargetSpeed = 0.5;
	}
	currentSpeed.text = "Speed=" + inGameTargetSpeed;
}



function SortStages()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Sorting Stage");
	System.Array.Sort(events, new GameEventStageSorter());
}

function PauseGameTimer()
{
	gameTimerPaused = true;
}

function ResumeGameTimer(_delay : float)
{
	yield WaitForSeconds(_delay);
	ResumeGameTimer();
}

function ResumeGameTimer()
{
	gameTimerPaused = false;
}

function Update ()
{
	if ( !gamePaused )
	{
		Time.timeScale = inGameTargetSpeed;
	}
	
	realTime += (Time.realtimeSinceStartup - lastRealTime);
	lastRealTime = Time.realtimeSinceStartup;
	
	if ( runStageTimer )
	{
		stageTime += Time.deltaTime;
		
		if ( !gameTimerPaused )
		{
			gameTime += Time.deltaTime;
		}
	}
	
	#if UNITY_EDITOR
	if ( debugTimerDisplay != null )
	{
		if ( useStageTimer )
		{
			debugTimerDisplay.text = "" + stageTime;
		}
		else
		{
			debugTimerDisplay.text = "" + gameTime;
		}
	}
	
	if ( debugTimeScale != null )
	{
		//debugTimeScale.text = "" + Mathf.Floor(gameTime);
		debugTimeScale.text = "" + lm.activePlayList.GetCurrentLevel();
		
	}	

	if ( Input.GetKeyDown(KeyCode.Alpha0) == true )
	{
		IncreaseGameSpeed();
		
	}
	
	if ( Input.GetKeyDown(KeyCode.Alpha9) == true )
	{
		DecreaseGameSpeed();
	}
	
	if ( Input.GetKeyDown(KeyCode.S) == true )
	{
		SortStages();
	}
	#endif
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("EM: Update");
	//var eventsChecked : int = 0;
	
	
		/*
		if ( event.stage == currentStage || ( useStageTimer == false && event.stage != EStage.INVALID) )
		{
			if ( event.hasBeenTriggered == false )
			{
				switch ( event.triggerType )
				{
					case ETriggerType.FixedTime:
						
						if ( useStageTimer )
						{
							if ( stageTime > event.startTime )
							{
								TriggerEvent(event);
								event.hasBeenTriggered = true;
							}
						}
						else
						{
							if ( gameTime > event.startTime )
							{
								TriggerEvent(event);
								event.hasBeenTriggered = true;
							}
						}
					break;
					
					case ETriggerType.FireworkLevel:
						if ( lm.GetCurrentLevel() == event.startFirework )
						{	
							TriggerEvent(event);
							event.hasBeenTriggered = true;
						}
					break;
				}
			}
		}
		*/
	//}
	//if ( Wizards.Utils.DEBUG ) Debug.Log("EventsChecked : " + eventsChecked);
}

function EventCheck() : IEnumerator
{
	var eventsPerFrame : int = 5;
	var eventsProcessed : int = 0;
	
	while ( true )
	{
		for ( var event in events )
		{
			eventsProcessed += 1;
			if ( eventsProcessed > eventsPerFrame )
			{
				eventsProcessed = 0;
				yield;
			}
			
			//yield;
			//var event : GameEvent = events[i];
			//eventsChecked++;
			// early out
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Event: " + event.stage);
			if ( event.stage == EStage.INVALID )
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("EVENT INVALID, BREAKING: " + event.stage);
				// Because we now SORT the events, all invalid stages are after the valid ones, as soon as we hit invalid,we quit.
				break;
			}
			
			if ( event.hasBeenTriggered )
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("Event already fired");
				continue;
			}
			
			if ( event.startTime > gameTime )
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("Too early for event");
				continue;
			}
			
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Valid Event" + event.eventName);
			
			TriggerEvent(event);
			event.hasBeenTriggered = true;
			
			// Optimisation - There is probably a small chance that there are very many event occuring at this time ->
			// so we can perhaps:
			// 1) skip this check?
			// 2) OR dont check all the events every frame?
			// 3) OR only check all the events every 0.25 seconds? (USE yield?)
			// 4) CHANGE EVENT TO INVALID - RESORT THE LIST
			
			// Option 4
			//yield;
			//event.stage = EStage.INVALID;

			//break; // break out of loops - may have invalid enumerator?
	
			// Option 1 UPDATE: This only saves time when an event is triggered, so not that great an optimisation probably! (plus might put other events out of sync! SO DISABLE FOR NOW
			//if ( Wizards.Utils.DEBUG ) Debug.Log("Breaking out of loop");
			//break;
		}
		//SortStages();
		//yield;
		
	}
	
	//EventCheck();
}

function TriggerEvent(_event : GameEvent)
{
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("EVENTMANAGER: Event Triggered = " + _event.stage + ":" + _event.targetFunction + " @ " + gameTime + " seconds");
	switch ( _event.targetFunction )
	{
		case EGameEvent.PauseFireworks:
			PauseFireworks();
		break;
	
		case EGameEvent.ResumeFireworks:
			ResumeFireworks();
		break;

		case EGameEvent.Scroll:
			Scroll(_event);
		break;

		case EGameEvent.Scale:
			Scale(_event);
		break;
	
		case EGameEvent.SetScale:
			SetScale(_event);
		break;
	
		case EGameEvent.ScaleResume:
			ScaleResume(_event);
		break;
		
		case EGameEvent.ShowCatBoard:
			ShowCatBoard();
		break;

		case EGameEvent.ShowCatBoardOnly:
			ShowCatBoardOnly();
		break;

		case EGameEvent.ShowTitle:
			ShowTitle();
		break;

		case EGameEvent.ShowTitleWithName:
			ShowTitleWithName(_event);
		break;

		case EGameEvent.PlayAudio:
			PlayAudio(_event);
		break;

		case EGameEvent.PlayInGameBGM:
			PlayInGameBGM();
		break;

		case EGameEvent.ChangeBGM:
			ChangeBGM(_event);
		break;

		case EGameEvent.WizardOnTheGround:
			WizardOnTheGround();
		break;
		
		case EGameEvent.WizardFly:
			WizardFly();
		break;
				
		case EGameEvent.WizardToBackGround:
			WizardToBackGround();
		break;
				
		case EGameEvent.WizardBackToLayer:
			WizardBackToLayer();
		break;
				
		case EGameEvent.GameFinished:
			GameFinished();
		break;
				
		case EGameEvent.SetFireworkZpos:
			SetFireworkZpos(_event);
		break;
		
		case EGameEvent.EndOfStage:
			EndOfStage();
		break;

		case EGameEvent.StartStage:
			StartStage();
		break;
		
		case EGameEvent.ShowDragonBoss:
			ShowDragonBoss();
		break;
		
		case EGameEvent.PauseFireworksNoDelay:
			PauseFireworksNoDelay();
		break;
		}
}

function PauseFireworks()
{
	nl.PauseFireworks();
}

function PauseFireworksNoDelay()
{
	nl.PauseFireworksNoDelay();
}

function ResumeFireworks()
{
	nl.ResumeFireworks();
	//shiftTime = false;
}

function Scroll(_event : GameEvent)
{
	nl.Scroll(_event.scrollSpeed);
}

function Scale(_event : GameEvent)
{
	nl.Scale(_event.scaleAmount, _event.scaleTime);
}

function SetScale(_event : GameEvent)
{
	nl.SetScale(_event.scaleAmount, _event.scaleTime);
}
	
function ScaleResume(_event : GameEvent)
{
	nl.ScaleResume( _event.scaleTime);
}

function ShowCatBoard()
{
	nl.ShowCatBoard();
	//shiftTime = true;
}

function ShowCatBoardOnly()
{
	nl.ShowCatBoardOnly();
	//shiftTime = true;
}

function ShowTitle()
{
	nl.ShowTitle();
}

function ShowTitleWithName(_event : GameEvent)
{
	nl.ShowTitleWithName(_event.title, _event.subTitle);
}

function PlayAudio(_event : GameEvent)
{
	nl.PlayAudio(_event.audioEffect, _event.volume );
}

function PlayInGameBGM()
{
	nl.PlayInGameBGM();
}

function ChangeBGM(_event : GameEvent)
{
	nl.ChangeBGM(_event.bgMusic);
}

function WizardOnTheGround()
{
	nl.WizardOnTheGround();
}
		
function WizardFly()
{
	nl.WizardFly();
}
				
function WizardToBackGround()
{
	nl.WizardToBackGround();
}
				
function WizardBackToLayer()
{
	nl.WizardBackToLayer();
}
				
function GameFinished()
{
	nl.GameFinished();
}
				
function SetFireworkZpos(_event : GameEvent)
{
	nl.SetFireworkZpos(_event.zPos);
}

function EndOfStage()
{
	stageTime = 0.0;
	runStageTimer = false;
}

function StartStage()
{
	runStageTimer = true;
}

function ShowDragonBoss()
{
	gm.CreateBoss();
}

function SetCurrentStageForLoadingEvents(_stage : EStage)
{
	currentLoadingStage = _stage;
}

function AddEvent(_delay : float, _completeFunction : String, _params : Hashtable)
{
	//if ( Wizards.Utils.DEBUG ) Debug.LogError("Don't call me right now, eventCount not valid useage");
	//return;
	var eventType : EGameEvent = GetEventTypeByName(_completeFunction);
	
	var event : GameEvent = AddEvent(currentLoadingStage);
	
	event.stage = currentLoadingStage;
	event.eventName = _completeFunction;
	event.targetFunction = eventType;
	event.startTime = _delay;
	event.triggerType = ETriggerType.FixedTime;
 
	switch ( eventType )
	{
		case EGameEvent.Scroll:
			event.scrollSpeed = _params["speed"];
		break;

		case EGameEvent.Scale:
			event.scaleAmount = _params["amount"];
			event.scaleTime = _params["time"];
		break;
	
		case EGameEvent.SetScale:
			event.scaleAmount = _params["amount"];
			event.scaleTime = _params["time"];
		break;
	
		case EGameEvent.ScaleResume:
			event.scaleTime = _params["time"];
		break;

		case EGameEvent.ShowTitleWithName:
			event.subTitle = _params["subTitle"];
			event.title = _params["title"];
		break;

		case EGameEvent.PlayAudio:
			event.audioEffect = AudioEffect.CrowdIO;
			event.volume = _params["volume"];
			
		break;

		case EGameEvent.ChangeBGM:
			event.bgMusic = _params["bgm"];
		break;
				
		case EGameEvent.SetFireworkZpos:
			event.zPos = _params["Zpos"];
		break;
	}
	//eventCount++;
}

function GetEventTypeByName(_completeFunction : String) : EGameEvent
{
	return ( functionNameHash[_completeFunction] );
}

function InitialiseEvents(_numEvents : int)
{
	if ( events != null )
	{
		for (event in events )
		{
			event = null;
		}
		events = null;
	}
	
	events = new GameEvent[1000];
	
	for ( var i : int = 0; i < _numEvents; ++i)
	{
		events[i] = new GameEvent();
	}
	
	//eventCount = _numEvents;
	
}

function AddEvent(_stage : EStage) : GameEvent
{
	var eventAdded : boolean = false;
	var newEvent : GameEvent;
	
	for ( var event in events )
	{
		if ( event.stage == EStage.INVALID )
		{
			event.stage = _stage;
			event.targetFunction = EGameEvent.NewEvent;
			eventAdded = true;
			newEvent = event;
			break;
		}
	}
	
	if ( !eventAdded )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Events Array Full : Contact Programmer!");
		//ExpandEventArray();
		return;
	}
	
	return ( newEvent );
}

function AddEvent(_newEvent : GameEvent )
{
	//if ( eventCount >= events.Length )
	//{
		
	//}
	
	var eventAdded : boolean = false;
	
	for ( var event in events )
	{
		if ( event.stage == EStage.INVALID )
		{
			CopyEvent(_newEvent, event);
			eventAdded = true;
		}
	}
	
	if ( !eventAdded )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Events Array Full : Contact Programmer!");
		//ExpandEventArray();
		return;
	}
	//eventCount++;
}

function CopyEvent(_from : GameEvent, _to : GameEvent)
{
	if ( _from.eventName == "" )
	{
		_to.eventName = "" + _from.targetFunction;
	}
	else
	{
		_to.eventName = _from.eventName;
	}
	_to.stage = _from.stage;
	_to.targetFunction = _from.targetFunction;
	_to.triggerType = _from.triggerType;
	_to.startFirework = _from.startFirework;
	_to.eventID = _from.eventID;
	_to.hasBeenTriggered = _from.hasBeenTriggered;
	_to.scrollSpeed = _from.scrollSpeed;
	_to.scaleAmount = _from.scaleAmount;
	_to.scaleTime = _from.scaleTime;
	_to.title = _from.title;
	_to.subTitle = _from.subTitle;
	_to.audioEffect = _from.audioEffect;
	_to.volume = _from.volume;
	_to.bgMusic = _from.bgMusic;
	_to.zPos = _from.zPos;
}

function ExpandEventArray()
{

}

function GetNumStageEvents(_stage : EStage) : int
{	
	var stageEventCount = 0;
	for ( var event in events )
	{
		if ( event.stage == _stage )
		{
			++stageEventCount;
		}
	}
	
	return ( stageEventCount );
}	

function SetDefaultNames()
{
	for ( var i : int = 0; i < events.length; ++i )
	{
		events[i].eventName = "" + events[i].stage;
	}
}	

function NextStage()
{
	currentStage += 1;
	stageTime = 0.0;
}




