enum ESortBy
{
	ID,
	StartTime,
	Stage,
}

class GameEventEditor extends EditorWindow
{
	
 	var eSL : EventsSaveLoad;	
	var em : EventManager;
	
	// SCROLL BAR
	var scrollPositions : Vector2[];
	
	var eventsScrollPosition : Vector2 = Vector2.zero;
	var eventsScrollWidth : int = 330;
	
	// GAME EVENT ITEMS
	var eventGUIWidth : int = 300;
	
	var sortBy : ESortBy = ESortBy.StartTime;
	var switchToSortBy : ESortBy;
	
	var sortedEvents : Array;
	
	var currentStage : EStage;
	var switchToStage : EStage;
	
	var newEvent : GameEvent;
	
	var enableEventRemoval : boolean = false;
	
	var closeWindowOnPlay : boolean = true;
	
	var showEventTriggered : boolean = false;
	
	var showStageHeaders : boolean = false;
	
	@MenuItem ("Wizards/GameEventEditor")
	static function ShowWindow ()
    {
        var gameEventEditor = EditorWindow.GetWindow(GameEventEditor);
        gameEventEditor.autoRepaintOnSceneChange = false;
        gameEventEditor.Init();
    }
    
    function Init()
    {
    	if ( newEvent == null )
		{
			newEvent = new GameEvent();
		}
		if ( scrollPositions == null )
		{
			scrollPositions = new Vector2[EStage.INVALID];
		}
    	GetEventManager();
    	GetEventsSaveLoad();
    	LoadEditorSettings();
    }
    
    function OnFocus()
    {
		//if ( Wizards.Utils.DEBUG ) Debug.Log("OnFocus");
		Init();
    }
    
    function LoadScrollPosition()
    {
    	//eventsScrollPosition.x = PlayerPrefs.GetFloat("EESavedScrollPositionX", 0.0);
    	//eventsScrollPosition.y = PlayerPrefs.GetFloat("EESavedScrollPositionY", 0.0);
    	
    	for ( var i : int = 0; i < scrollPositions.length; ++i )
    	{
    		scrollPositions[i].x = PlayerPrefs.GetFloat("EESavedScrollPositionX" + i, 0.0);
    		scrollPositions[i].y = PlayerPrefs.GetFloat("EESavedScrollPositionY" + i, 0.0);
    	}
    }
    
    function SaveScrollPosition()
    {
    	//PlayerPrefs.SetFloat("EESavedScrollPositionX", eventsScrollPosition.x);
    	//PlayerPrefs.SetFloat("EESavedScrollPositionY", eventsScrollPosition.y);
    	
    	for ( var i : int = 0; i < scrollPositions.length; ++i )
    	{
    		PlayerPrefs.SetFloat("EESavedScrollPositionX" + i, scrollPositions[i].x);
    		PlayerPrefs.SetFloat("EESavedScrollPositionY" + i, scrollPositions[i].y);
    	}
    }
    
    function LoadSortBy()
    {
    	sortBy = PlayerPrefs.GetInt("EESortBy", 0);
    }

    function SaveSortBy()
    {
    	PlayerPrefs.SetInt("EESortBy", sortBy);
    }
        
    function GetEventManager()
    {
    	if ( em == null )
    	{
    		em = GameObject.Find("EventManager").GetComponent(EventManager) as EventManager;
    	}
    }
    
    function GetEventsSaveLoad()
    {
    	if ( eSL == null )
    	{
    		eSL = GameObject.Find("EventsSaveLoad").GetComponent(EventsSaveLoad) as EventsSaveLoad;
    	}
    }
    
    function Update()
    {
    	if ( Application.isPlaying == true )
    	{
    		SaveEditorSettings();
    		if ( closeWindowOnPlay )
    		{
    			this.Close();
    		}
    	}
    }
    
    function OnDisable()
    {
    	SaveEditorSettings();
    }
    
    function OnLostFocus()
    {
    	SaveEditorSettings();
    }
    
    function SaveEditorSettings()
    {
   	    if ( Wizards.Utils.DEBUG ) Debug.Log("SaveEditorSettings");
   		
   		GetEventManager();
   		if ( em != null )
   		{
   			EditorUtility.SetDirty(em);	
   		}
   		
   		PlayerPrefs.SetInt("EECurrentStage", currentStage);
    	SaveSortBy();
    	SaveScrollPosition();
    }
    
    function LoadEditorSettings()
    {
    	currentStage = PlayerPrefs.GetInt("EECurrentStage", EStage.Stage0);
    	switchToStage = currentStage;
    	LoadScrollPosition();
    	LoadSortBy();
    	UpdateSortOrder();
    }
    
    function UpdateSortOrder()
    {
    	switch ( sortBy )
    	{
    		case ESortBy.StartTime:
    			TimeSort();
    		break;
    		
    		case ESortBy.Stage:
    			StageSort();
    		break;
    	}
    	
    	switchToSortBy = sortBy;
    }
    
   	function TimeSort()
    {
     	System.Array.Sort(em.events, new GameEventTimeSorter());
    }
	
	function StageSort()
    {
     	System.Array.Sort(em.events, new GameEventStageSorter());
    }    
    
    	
    function CompareTimes(_one : GameEvent, _two : GameEvent)
    {
    	return ( _one.startTime.CompareTo(_two.startTime) );
    }
    
    function OnInspectorUpdate()
	{
    	// This will only get called 10 times per second.
    	//Repaint();
    	    	
    	if (GUI.changed)
    	{
	    	if ( em != null )
	    	{
	    		EditorUtility.SetDirty(em);
	    	}
	    	else
	    	{
	    		if ( Wizards.Utils.DEBUG ) Debug.Log("No link to EM");
	    	}
	    }
	}
    
	function OnGUI()
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("OnGUI");
		//eventsScrollWidth = EditorGUILayout.IntSlider(eventsScrollWidth, 100, 500, GUILayout.Width(1024));
		

		
		
		// STAGE SELECT		
		EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
	    GUILayout.Label("Now Editing: " + currentStage, EditorStyles.boldLabel);
	    EditorGUILayout.EndVertical();
	    
	    EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
	    GUILayout.Label("Total Stage Events: " + GetNumEvents(currentStage), EditorStyles.boldLabel);
	    EditorGUILayout.EndVertical();
	         
		// NEXT / PREVIOUS STAGE BUTTONS
		EditorGUILayout.BeginHorizontal(GUILayout.Width(eventGUIWidth));
		if ( currentStage > EStage.Stage0 )
		{
			GUI.enabled = true;
		}
		else
		{
			GUI.enabled = false;
		}
		if ( GUILayout.Button("Previous Stage" ) )
	    {
	    	currentStage -= 1;
	    	switchToStage = currentStage;
	    	UnFocus();
	    }
	    if ( currentStage < EStage.Stage12 )
		{
			GUI.enabled = true;
		}
		else
		{
			GUI.enabled = false;
		}
		if ( GUILayout.Button("Next Stage" ) )
	    {
	    	currentStage += 1;
	    	switchToStage = currentStage;
	    	UnFocus();
	    }
	    GUI.enabled = true;
		EditorGUILayout.EndHorizontal();
		
		// JUMP TO STAGE
		EditorGUILayout.BeginHorizontal(GUILayout.Width(eventGUIWidth));
	    switchToStage = EditorGUILayout.EnumPopup("Jump To Stage: ", switchToStage);
   		currentStage = switchToStage;
	    EditorGUILayout.EndHorizontal();
		
		// SORT SELECT
		EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
	    GUILayout.Label("Sort Order: " + sortBy, EditorStyles.boldLabel);
	    EditorGUILayout.EndVertical();
	         
	    EditorGUILayout.BeginHorizontal(GUILayout.Width(eventGUIWidth));
	    switchToSortBy = EditorGUILayout.EnumPopup("SORT BY: ", switchToSortBy);
	    //if ( switchToSortBy == sortBy )
	    //{
	    //   GUI.enabled = false;
	   // }
	    if ( GUILayout.Button("UPDATE" ) )
	    {
	    	sortBy = switchToSortBy;
	    	UpdateSortOrder();
	    	UnFocus();
	    }
	   // GUI.enabled = true;
	    EditorGUILayout.EndHorizontal();
		
		// BEGIN PANEL
		EditorGUILayout.BeginHorizontal();
		EditorGUILayout.BeginVertical();
		
		//eventsScrollPosition = EditorGUILayout.BeginScrollView(eventsScrollPosition, false, false, GUILayout.Width(eventsScrollWidth));
		scrollPositions[currentStage] = EditorGUILayout.BeginScrollView(scrollPositions[currentStage], false, false, GUILayout.Width(eventsScrollWidth));
		//for ( var event : GameEvent in em.events )
		for ( var i : int = 0; i < em.events.length; ++i)
		{
			var event : GameEvent = em.events[i];
			//var event : GameEvent = em.events[sortedEvents[i]];
			
			if ( event.stage == currentStage )
			{
				EditorGUILayout.Separator();
				DisplayEvent(event);
			}
		}
		
		EditorGUILayout.EndScrollView();
		
		EditorGUILayout.EndVertical();
		
		// 2nd Panel TOOLS (Add Event)
		
		
		EditorGUILayout.BeginVertical();
		
		EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
	    GUILayout.Label("Add New Event", EditorStyles.boldLabel);
	    EditorGUILayout.EndVertical();
		
		//DisplayEvent(newEvent);
		
		if ( GUILayout.Button("ADD EVENT", GUILayout.Width(eventGUIWidth) ) )
	    {
			em.AddEvent(currentStage);
			UnFocus();
	    }
	    
	    EditorGUILayout.Separator();
	    
	    EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
	    GUILayout.Label("TOOLS & Options", EditorStyles.boldLabel);
	    EditorGUILayout.EndVertical();
	    
	    if ( GUILayout.Button("DEFAULT NAMES", GUILayout.Width(eventGUIWidth) ) )
	    {
			em.SetDefaultNames();
			UnFocus();
	    }
	    
	    if ( enableEventRemoval )
	    {
	        if ( GUILayout.Button("Disable Removing Events", GUILayout.Width(eventGUIWidth) ) )
		    {
				enableEventRemoval = false;
				UnFocus();
		    }
		}
		else
		{
			if ( GUILayout.Button("Enable Removing Events", GUILayout.Width(eventGUIWidth) ) )
		    {
				enableEventRemoval = true;
				UnFocus();
		    }
		}
		
		if ( showStageHeaders )
	    {
	        if ( GUILayout.Button("Disable Showing Stage Headers", GUILayout.Width(eventGUIWidth) ) )
		    {
				showStageHeaders = false;
				UnFocus();
		    }
		}
		else
		{
			if ( GUILayout.Button("Enable Showing Stage Headers", GUILayout.Width(eventGUIWidth) ) )
		    {
				showStageHeaders = true;
				UnFocus();
		    }
		}
		
		closeWindowOnPlay = GUILayout.Toggle(closeWindowOnPlay, "Close GEE Window on Play",GUILayout.Width(eventGUIWidth));
		
		showEventTriggered = GUILayout.Toggle(showEventTriggered, "Show \"EventHasBeenTriggered\" Flag",GUILayout.Width(eventGUIWidth));
		
		// SAVE LOAD SECTION
		/*
		EditorGUILayout.BeginHorizontal(GUILayout.Width(eventGUIWidth));
         
		if ( GUILayout.Button("Load ALL Events") )
		{
			var loadpath = EditorUtility.OpenFilePanel("Load Events File", Application.persistentDataPath, "");
		 		         	
		 	if ( loadpath != "" )
		 	{         	
		 		eSL.LoadEventData(loadpath);
		 		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
		 	}
		 	else
		 	{
		 		if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
		 	}
		}
		 
		if ( GUILayout.Button("Save ALL Events") )
		{
		 	var savepath = EditorUtility.SaveFilePanel("Save Events File", Application.persistentDataPath, "EventData.xml" , "");
		 	
		 	if ( savepath != "" )
		 	{         	
		 		eSL.SaveEventData(savepath);
		 		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Saved");
		 	}
		 	else
		 	{
				if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Saved");
			}
		}
		 
		EditorGUILayout.EndHorizontal(); 
		*/
		
		
		EditorGUILayout.EndVertical();
			
		EditorGUILayout.EndHorizontal();
	}
}

function UnFocus()
{
	GUIUtility.keyboardControl = 0;
}

function DisplayEvent(event : GameEvent)
{
	if ( showStageHeaders )
	{
		event.stage = EditorGUILayout.EnumPopup("Stage", event.stage, GUILayout.Width(eventGUIWidth));
	}
	//GUILayout.Label("Event ID: " + i, EditorStyles.boldLabel);
	//event.eventName = EditorGUILayout.TextField("Name", event.eventName, GUILayout.Width(eventGUIWidth));
	
	event.targetFunction = EditorGUILayout.EnumPopup("Event", event.targetFunction, EditorStyles.boldLabel, GUILayout.Width(eventGUIWidth));


	
	
	switch ( event.targetFunction )
	{
		case EGameEvent.PauseFireworks:
			PauseFireworks();
		break;
	
		case EGameEvent.ResumeFireworks:
			ResumeFireworks();
		break;

		case EGameEvent.Scroll:
			Scroll(event);
		break;

		case EGameEvent.Scale:
			Scale(event);
		break;
	
		case EGameEvent.SetScale:
			SetScale(event);
		break;
	
		case EGameEvent.ScaleResume:
			ScaleResume(event);
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
			ShowTitleWithName(event);
		break;

		case EGameEvent.PlayAudio:
			PlayAudio(event);
		break;

		case EGameEvent.PlayInGameBGM:
			PlayInGameBGM();
		break;

		case EGameEvent.ChangeBGM:
			ChangeBGM(event);
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
			SetFireworkZpos(event);
		break;
	}
	
	event.triggerType = EditorGUILayout.EnumPopup("Trigger", event.triggerType, GUILayout.Width(eventGUIWidth));
	switch ( event.triggerType )
	{
		case ETriggerType.FixedTime:
			event.startTime = EditorGUILayout.FloatField("Start Time", event.startTime, GUILayout.Width(eventGUIWidth));
		break;

		case ETriggerType.FireworkLevel:
			event.startFirework = EditorGUILayout.IntField("Firework No.", event.startFirework, GUILayout.Width(eventGUIWidth));
		break;
	}
	//var style : GUIStyle = new GUIStyle();
	//style.alignment = TextAnchor.MiddleRight;
	
	if ( showEventTriggered )
	{
		EditorGUILayout.BeginVertical(GUILayout.Width(eventGUIWidth));
		if ( event.hasBeenTriggered == false )
		{
	    	GUILayout.Label("Triggered: FALSE");
	    }
	    else
	    {
	    	GUILayout.Label("Triggered: TRUE");
	    }
	    EditorGUILayout.EndVertical();
	}
	

	if ( enableEventRemoval )
	{
		EditorGUILayout.BeginHorizontal();
		
		if ( !event.confirmRemove )
		{
			if ( GUILayout.Button("Remove", GUILayout.Width(60)) == true )
			{	
				event.confirmRemove = true;
			}
		}
		else
		{
			GUILayout.Label("Confirm Remove?");
			if ( GUILayout.Button("YES,",GUILayout.Width(35)) == true )
			{
				event.stage = EStage.INVALID;
				event.confirmRemove = false;
			}
			
			if ( GUILayout.Button("NO",GUILayout.Width(35)) == true )
			{
				// nothing
				event.confirmRemove = false;
			}
			
		}
		EditorGUILayout.EndHorizontal();			
	}
}

function PauseFireworks()
{
	
}

function ResumeFireworks()
{

}

function Scroll(_event : GameEvent)
{
	_event.scrollSpeed = EditorGUILayout.FloatField("Scroll Speed", _event.scrollSpeed, GUILayout.Width(eventGUIWidth));	
}

function Scale(_event : GameEvent)
{
	_event.scaleAmount = GetFloat(_event.scaleAmount, "Scale Amount");
	_event.scaleTime = GetFloat(_event.scaleTime, "Scale Time");
}

function SetScale(_event : GameEvent)
{
	_event.scaleAmount = GetFloat(_event.scaleAmount, "Scale Amount");
	_event.scaleTime = GetFloat(_event.scaleTime, "Scale Time");
}
	
function ScaleResume(_event : GameEvent)
{
	_event.scaleTime = GetFloat(_event.scaleTime, "Scale Time");
}

function ShowCatBoard()
{
	
}

function ShowCatBoardOnly()
{
	
}

function ShowTitle()
{
	
}

function ShowTitleWithName(_event : GameEvent)
{
	_event.title = GetString(_event.title, "Title");
	_event.subTitle = GetString(_event.subTitle, "Sub-Title");
}

function PlayAudio(_event : GameEvent)
{
	_event.audioEffect = GetAudioEfectType(_event.audioEffect, "AudioType");
	_event.volume = GetFloat(_event.volume, "Volume");
}

function PlayInGameBGM()
{

}

function ChangeBGM(_event : GameEvent)
{
	_event.bgMusic = GetBGM(_event.bgMusic, "BG Music");
}

function WizardOnTheGround()
{

}
		
function WizardFly()
{

}
				
function WizardToBackGround()
{

}
				
function WizardBackToLayer()
{

}
				
function GameFinished()
{

}
				
function SetFireworkZpos(_event : GameEvent)
{
	_event.zPos = GetFloat(_event.zPos, "Firework ZPos");
}

function GetFloat( _myFloat : float, _label : String) : float
{
	return ( EditorGUILayout.FloatField(_label, _myFloat, GUILayout.Width(eventGUIWidth)) );
}

function GetString( _myString : String, _label : String) : String
{
	return ( EditorGUILayout.TextField(_label, _myString, GUILayout.Width(eventGUIWidth)) );
}

function GetAudioEfectType(_enum : AudioEffect, _label : String) : AudioEffect
{
	return ( EditorGUILayout.EnumPopup(_label, _enum, GUILayout.Width(eventGUIWidth)) );
}

function GetBGM(_enum : BGM, _label : String) : BGM
{
	return ( EditorGUILayout.EnumPopup(_label, _enum, GUILayout.Width(eventGUIWidth)) );
}

function GetNumEvents(_stage : EStage ) : int
{
	return ( em.GetNumStageEvents(_stage) );
}












