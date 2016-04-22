class LevelEditor extends EditorWindow
{
    var myString : String;
    var groupEnabled : boolean = false;
    var myBool : boolean = false;
    var myFloat : float = 0.0;
    
    var init : boolean = false;
    
    var levelManager : GameObject;   
    var lm : LevelManager;
    var gSL : GameSaveLoad;
    
    var currentLevelToEdit : int = 0;
    
    var numRandomFireWorks : int = 0;
    
    //var randomOptions : flightPath[];
    var maxFWTypes : int = 12;
    
    var defaultGUIWidth : int = 400;
    
    var scrollPos : Vector2 = Vector2(0,100);
    

    var text : String[];
    var textEnd : String[];
    
	var copiedLevelNumber : int = 0;       

    
   /*
     var camera : Camera;
    var renderTexture : RenderTexture;
	*/  	
  	var startIndex : int = 0;
  	var prevStartIndex : int = 0;
       
	var screenWidth : int = 640;
	var screenHeight : int = 960;
	
	var gridWidth : int = 11;
	var gridHeight : int = 15;
	
	var numGridElements : int = gridWidth * gridHeight;
	
	var numTestLevelsToPlay : int = 1;
	
	// MultiCopy
	var multiStart : int = 0;
	var multiEnd : int = 0;
	var multiDest : int = 0;
	
	var autonumberRepeatAt : int = 0;
	
	var scrollPos2 : Vector2 = Vector2.zero;
	
	var confirmDelete : boolean = false;
	
	var currentLevelDifficulty : EDifficulty;
	var switchToDifficulty : EDifficulty;
	
	
	
	// LOAD SECTION OF FILE
	var sourceStartLevel : int = 0;
	var sourceEndLevel : int = 0;
	
	var destStartLevel : int = 0;
	var destEndLevel : int = 0;
	
	// SAVING SECTIONS
	var saveStartLevel : int = 0;
	var saveEndLevel : int = 0;
	
    @MenuItem ("Wizards/LevelEditor")
    
    static function ShowWindow ()
    {
        var leveleditor = EditorWindow.GetWindow(LevelEditor);
        leveleditor.autoRepaintOnSceneChange = true;
        leveleditor.LoadLevelPosition();
        leveleditor.LoadLevelDifficulty();
        
        
        //EditorApplication.playmodeStateChanged = System.Delegate.Combine(PlayStateChanged, EditorApplication.playmodeStateChanged);
        //System.Delegate.Combine(cb, EditorApplication.update)
        
       // leveleditor.camera = Camera.main;
    }
    
    /*
    function Awake()
    {
     	renderTexture = new RenderTexture( position.width, position.height, RenderTextureFormat.ARGB32 );
    }
    */
    
    function Start()
    {
    	randomOptions = new flightPath[maxFWTypes];
    	
    	
    	
    }
    
    function Init()
    {
    	levelManager = GameObject.Find("LevelManager");
    	
    	if (levelManager != null )
    	{
    		lm = levelManager.GetComponent("LevelManager");
    	}
    	else
    	{
    		
    	}
    	
    	if ( GameObject.Find("GameSaveLoad") != null )
    	{
    		gSL = GameObject.Find("GameSaveLoad").GetComponent(GameSaveLoad) as GameSaveLoad;
    	}
    	
    	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
    	// var pm:ProfileManager=ProfileManager.Inatance();
    	
    	LoadLevelDifficulty();
    	if ( Wizards.Utils.DEBUG ) Debug.Log("CURR DIFF: " + currentLevelDifficulty);
    	if ( currentLevelDifficulty == EDifficulty.INVALID )
        {
        	currentLevelDifficulty = EDifficulty.Easy;
        	switchToDifficulty = EDifficulty.Easy;
        	
        } 
        switchToDifficulty = currentLevelDifficulty;
        if ( Wizards.Utils.DEBUG ) Debug.Log("CURR DIFF: " + currentLevelDifficulty);
        if ( Wizards.Utils.DEBUG ) Debug.Log("SWITCH DIFF: " + switchToDifficulty);
        
        SaveLevelDifficulty();
        
    }
    
    /*
    function Update()
    {
     	if ( renderTexture == null )
     	{
     		renderTexture = new RenderTexture( position.width, position.height, RenderTextureFormat.ARGB32 );
     	}
     	
     	if(camera != null)
     	{
            camera.targetTexture = renderTexture;
            camera.Render();
            camera.targetTexture = null;    
        }
        if(renderTexture.width != position.width || renderTexture.height != position.height)
        {
            renderTexture.Release();
            renderTexture = new RenderTexture( position.width, position.height, RenderTextureFormat.ARGB32 );
        }   
           // if ( Wizards.Utils.DEBUG ) Debug.Log("Pos: " + position);
    }
    */
        
    function OnGUI ()
    {
    
    	if ( !init || lm == null)
	    {
	      	Init();
	       	init = true;
	    }
	    
	   

	    
	     //GUI.DrawTexture( new Rect( 450.0f, 250.0f, 200.0, 300.0), renderTexture );  
	   
	    /* 
	    if ( lm.GetNumLevels() == 0 )
        {
        	lm.CreateLevels();
        }
        
        if ( lm.LevelsCreated() == true )
        {
        	lm.InitLevels();
        }
        */
	    
        if ( lm != null ) //&& lm.LevelsInitialised() == true)
        {
	     	var pm:ProfileManager=ProfileManager.Instance();   
	        // The actual window code goes here
	        
	        scrollPos2 = EditorGUILayout.BeginScrollView(scrollPos2);
	        
	        defaultGUIWidth = GUILayout.HorizontalSlider(defaultGUIWidth, 150, 300, GUILayout.Width(defaultGUIWidth));
	        
	         //EditorGUILayout.BeginHorizontal();
	         
	         EditorGUILayout.BeginVertical(GUILayout.Width(defaultGUIWidth));
	         GUILayout.Label("Now Editing: " + currentLevelDifficulty, EditorStyles.boldLabel);
	         EditorGUILayout.EndVertical();
	         
	         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
	         switchToDifficulty = EditorGUILayout.EnumPopup("SWITCH TO: ", switchToDifficulty);
	         if ( switchToDifficulty == currentLevelDifficulty )
	         {
	         	GUI.enabled = false;
	         }
	         if ( GUILayout.Button("SWITCH" ) )
	         {

	         	var saveTo : String = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("SAVETO: " + saveTo);
	         	gSL.SaveLevelData(saveTo);
	         	
	         	var loadFrom : String = pm.GetDifficultyPathAndFileName(switchToDifficulty);
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("LOADFROM: " + loadFrom);
	         	gSL.LoadLevelData(loadFrom, false);
	         	currentLevelDifficulty = switchToDifficulty;
	         	lm.difficulty = currentLevelDifficulty;
	         	pm.SetDifficultyLevel(currentLevelDifficulty);
	         }
	         GUI.enabled = true;
	         EditorGUILayout.EndHorizontal();
	         
	         
			
	        // EditorGUILayout.EndVertical();
   
	        /*
	         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
	         GUILayout.Label("SAVE / LOAD Current Data", EditorStyles.boldLabel);
	        
	         if ( GUILayout.Button("Load ALL Data") )
	         {
	         	var suggestedPath : String = pm.GetDifficultyFileName(currentLevelDifficulty);
	         	var loadpath = EditorUtility.OpenFilePanel("Load Level File", suggestedPath, "xml");
	         		         	
	         	if ( loadpath != "" )
	         	{         	
	         		gSL.LoadLevelData(loadpath);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
	         	}
	         }
	         
	         if ( GUILayout.Button("Save ALL Data") )
	         {
	         	suggestedPath = pm.GetDifficultyFileName(currentLevelDifficulty);
	         	var savepath = EditorUtility.SaveFilePanel("Save Level File", Application.persistentDataPath, suggestedPath, "");
	         	
	         	if ( savepath != "" )
	         	{         	
	         		gSL.SaveLevelData(savepath);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Saved: " + savepath);
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Saved");
	         	}
	         }
	         
	         EditorGUILayout.EndHorizontal();   
	         */
	        if ( lm.GetNumLevels() > 0 )
	        { 
		        EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		        
		        EditorGUILayout.BeginVertical(GUILayout.Width(defaultGUIWidth));
		        
		        GUILayout.Label ("Wizards Level Editor", EditorStyles.boldLabel);
		         
		        // myString = EditorGUILayout.TextField ("Text Field", myString);
		        
		        // groupEnabled = EditorGUILayout.BeginToggleGroup ("Optional Settings", groupEnabled);
		         
		        //  myBool = EditorGUILayout.Toggle ("Toggle", myBool);
		        //  myFloat = EditorGUILayout.Slider ("Slider", myFloat, -3, 3);
		         
		         
		         
		         
		         currentLevelToEdit = EditorGUILayout.IntSlider(currentLevelToEdit, 0, (lm.GetNumLevels() - 1), GUILayout.Width(defaultGUIWidth));
		         GUILayout.Label("Level: " + (currentLevelToEdit + 1) + "/" + lm.GetNumLevels());
		         
		         GUILayout.Label ("LevelName", EditorStyles.boldLabel);
		         lm.SetLevelName(currentLevelToEdit, GUILayout.TextField(lm.GetLevelName(currentLevelToEdit), 32, GUILayout.Width(defaultGUIWidth)));
		         
		         GUILayout.Label ("Level End Firework", EditorStyles.boldLabel);
		         lm.SetLevelEndFireWork(currentLevelToEdit, GUILayout.Toggle(lm.GetLevelEndFireWork(currentLevelToEdit), "Set as LEVEL END Firework"));
		         
		         GUILayout.Label("Level Interval", EditorStyles.boldLabel);
		         
		         lm.SetLevelInterval(currentLevelToEdit, EditorGUILayout.FloatField("Seconds", lm.GetLevelInterval(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
		         
		         
		         lm.SetLevelToRandom(currentLevelToEdit, 0, EditorGUILayout.Toggle("Random FWs", lm.IsLevelRandom(currentLevelToEdit, 0)));
		         
		         if ( lm.IsLevelRandom(currentLevelToEdit, 0) )
		         {
		         	lm.SetNumRandomFireworks(currentLevelToEdit, 0, EditorGUILayout.IntSlider(lm.GetNumRandomFireworks(currentLevelToEdit, 0), 1, maxFWTypes, GUILayout.Width(defaultGUIWidth)));
		         	
		         	//EditorGUILayout.LabelField("Random List Count: ",  "" + numRandomFireWorks);
		         	
		         	for ( var i : int = 0; i < lm.GetNumRandomFireworks(currentLevelToEdit, 0); i += 1 )
		         	{
		         		lm.SetRandomFWType(currentLevelToEdit, 0, i, EditorGUILayout.EnumPopup("FW Type: ", lm.GetRandomFWType(currentLevelToEdit, 0, i), GUILayout.Width(defaultGUIWidth)));
		         	}
		         	
		         	
		         	//GUILayout.TextField(numRandomFireWorks);
		         }
		         else
		         {
		         	lm.SetFireWorkType(currentLevelToEdit, 0, EditorGUILayout.EnumPopup("FW Type: ", lm.GetFireWorkType(currentLevelToEdit, 0), GUILayout.Width(defaultGUIWidth)));
		         }
		         
		         // FireWork visual
		         lm.SetFWVisual(currentLevelToEdit, 0, EditorGUILayout.EnumPopup("FW Visual: ", lm.GetFWVisual(currentLevelToEdit, 0), GUILayout.Width(defaultGUIWidth)));
		         
		         
		         

		         // START POSITION

		         GUILayout.Label("Start Position", EditorStyles.boldLabel);
	         

		         lm.SetLevelStartPosToRandom(currentLevelToEdit, EditorGUILayout.Toggle("Random Position", lm.GetIsLevelStartPosRandom(currentLevelToEdit)));

		         		         
		         if ( lm.GetIsLevelStartPosRandom(currentLevelToEdit) )
		         {
		  			GUILayout.Label("Start Position is RANDOM");
		         	GUILayout.BeginHorizontal();	
		         }
		         else
		      	 {
			        // BUILD GRID
			     	GUILayout.BeginHorizontal();	
			        
			        text = new String[numGridElements];
	    
				    var totalElements : int = gridWidth * gridHeight;
				    
				    var count : int = 1;
				    
				    for ( var row : int = (gridHeight - 1); row >= 0; row -= 1 )
				    {
				    	for ( var col : int = 0; col < gridWidth; col += 1 )
				    	{
				    		var index : int = row * gridWidth + col;
				    		 
				    		if ( lm.GetStartPosGridID(currentLevelToEdit, 0) == index )
				    		{
				    			text[index] = "Start";
				    		}
				    		else
				    		{
				    			text[index] = "" + count;
				    		}
				    		
				    		count += 1;
				    	} 
				    } 
			        
			        lm.SetStartPosGridID(currentLevelToEdit, 0, GUILayout.SelectionGrid(lm.GetStartPosGridID(currentLevelToEdit, 0),text,gridWidth));
					
					var calcX : int = lm.GetStartPosGridID(currentLevelToEdit, 0) % gridWidth;
					//if ( Wizards.Utils.DEBUG ) Debug.Log("gridx: " + calcX);
					
					var calcY : int = Mathf.Ceil(lm.GetStartPosGridID(currentLevelToEdit, 0) / gridWidth);
					//if ( Wizards.Utils.DEBUG ) Debug.Log("gridy: " + calcY);
			        
			        var minX : int = 0;
			        var minY : int = 0;
			        var maxX : int = 0;
			        var maxY : int = 0;
			        
			        minX = (screenWidth / gridWidth) * calcX;
			        maxX = (screenWidth / gridWidth) * (calcX + 1);
			       ////// if ( Wizards.Utils.DEBUG ) Debug.Log("minX: " + minX);
			       // if ( Wizards.Utils.DEBUG ) Debug.Log("maxX: " + maxX);
			        
			        minY = (screenHeight / gridHeight) * (gridHeight - calcY);
			        maxY = (screenHeight / gridHeight) * (gridHeight - (calcY + 1));
			       // if ( Wizards.Utils.DEBUG ) Debug.Log("minY: " + minY);
			        //if ( Wizards.Utils.DEBUG ) Debug.Log("maxY: " + maxY);
			        
			      	if ( lm.IsGridIDDirty(currentLevelToEdit, 0) )
			      	{
			      		var xloc : int = Random.Range(minX, maxX);			
			        
			        	if ( Wizards.Utils.DEBUG ) Debug.Log("xloc: " + xloc);
			        	
			        	lm.SetStartX(currentLevelToEdit, xloc);
			        	
		      			var yloc : int = Random.Range(minY, maxY);			
			        
			        	if ( Wizards.Utils.DEBUG ) Debug.Log("yloc: " + yloc);
			        	
			        	lm.SetStartY(currentLevelToEdit, yloc);
			        	
			        	lm.ClearGridIDDirtyFlag(currentLevelToEdit, 0);

			        }
			        
	        
			        			        
			         //lm.SetStartX(currentLevelToEdit, EditorGUILayout.IntField("X", lm.GetStartX(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
			         //lm.SetStartY(currentLevelToEdit, EditorGUILayout.IntField("Y", lm.GetStartY(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
			     } 
			     
			     
			     // END POSITION
			   	 GUILayout.BeginVertical();
		         GUILayout.Label("End Position", EditorStyles.boldLabel);
		         
		         lm.SetLevelEndPosToRandom(currentLevelToEdit, EditorGUILayout.Toggle("Random Position", lm.GetIsLevelEndPosRandom(currentLevelToEdit)));
		         
		         if ( lm.GetIsLevelEndPosRandom(currentLevelToEdit) )
		         {
		  			GUILayout.Label("End Position is RANDOM");
		  			GUILayout.EndVertical();
		  			
		  			//GUILayout.BeginHorizontal();
		         }
		         else
		      	 {
			        // BUILD GRID
			        GUILayout.EndVertical();
			       // GUILayout.BeginHorizontal();
			        textEnd = new String[numGridElements];
	    
				    totalElements = gridWidth * gridHeight;
				    
				    count = 1;
				    
				    for ( row = (gridHeight - 1); row >= 0; row -= 1 )
				    {
				    	for ( col = 0; col < gridWidth; col += 1 )
				    	{
				    		index = row * gridWidth + col;
				    		 
				    		if ( lm.GetEndPosGridID(currentLevelToEdit, 0) == index )
				    		{
				    			textEnd[index] = "End";
				    		}
				    		else
				    		{
				    			textEnd[index] = "" + count;
				    		}
				    		
				    		count += 1;
				    	} 
				    } 
			        
			        lm.SetEndPosGridID(currentLevelToEdit, 0, GUILayout.SelectionGrid(lm.GetEndPosGridID(currentLevelToEdit, 0),textEnd,gridWidth));
					
					calcX = lm.GetEndPosGridID(currentLevelToEdit, 0) % gridWidth;
					//if ( Wizards.Utils.DEBUG ) Debug.Log("gridx: " + calcX);
					
					calcY = Mathf.Ceil(lm.GetEndPosGridID(currentLevelToEdit, 0) / gridWidth);
					//if ( Wizards.Utils.DEBUG ) Debug.Log("gridy: " + calcY);
			        
			        minX = 0;
			        minY = 0;
			        maxX = 0;
			        maxY = 0;
			        
			        minX = (screenWidth / gridWidth) * calcX;
			        maxX = (screenWidth / gridWidth) * (calcX + 1);
			       ////// if ( Wizards.Utils.DEBUG ) Debug.Log("minX: " + minX);
			       // if ( Wizards.Utils.DEBUG ) Debug.Log("maxX: " + maxX);
			        
			        minY = (screenHeight / gridHeight) * (gridHeight - calcY);
			        maxY = (screenHeight / gridHeight) * (gridHeight - (calcY + 1));
			       // if ( Wizards.Utils.DEBUG ) Debug.Log("minY: " + minY);
			        //if ( Wizards.Utils.DEBUG ) Debug.Log("maxY: " + maxY);
			        
			      	if ( lm.IsEndGridIDDirty(currentLevelToEdit, 0) )
			      	{
			      		xloc = Random.Range(minX, maxX);			
			        
			        	if ( Wizards.Utils.DEBUG ) Debug.Log("xloc: " + xloc);
			        	
			        	lm.SetEndX(currentLevelToEdit, xloc);
			        	
		      			yloc = Random.Range(minY, maxY);			
			        
			        	if ( Wizards.Utils.DEBUG ) Debug.Log("yloc: " + yloc);
			        	
			        	lm.SetEndY(currentLevelToEdit, yloc);
			        	
			        	lm.ClearEndGridIDDirtyFlag(currentLevelToEdit, 0);

			        }
			        
	        
			        			        
			         //lm.SetStartX(currentLevelToEdit, EditorGUILayout.IntField("X", lm.GetStartX(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
			         //lm.SetStartY(currentLevelToEdit, EditorGUILayout.IntField("Y", lm.GetStartY(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
			     } 
			     
			    // GUILayout.EndHorizontal();
			     GUILayout.EndHorizontal();
			     
			     
			     ///////////////////
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			     
			       
			        
			     // START SPEED 
		        /*
		          GUILayout.Label("Start Speed", EditorStyles.boldLabel);
		         
		         lm.SetLevelStartSpeedToRandom(currentLevelToEdit, EditorGUILayout.Toggle("Random Speed", lm.IsLevelStartSpeedRandom(currentLevelToEdit)));
		         
		         if ( lm.IsLevelStartSpeedRandom(currentLevelToEdit) )
		         {
		  			GUILayout.Label("Start Speed is RANDOM");
		         }
		         else
		         {
		         	lm.SetStartSpeedX(currentLevelToEdit, EditorGUILayout.IntField("X", lm.GetStartSpeedX(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
		         	lm.SetStartSpeedY(currentLevelToEdit, EditorGUILayout.IntField("Y", lm.GetStartSpeedY(currentLevelToEdit), GUILayout.Width(defaultGUIWidth)));
		         }
		         
		         */
		         
		         GUILayout.Label("Spawn Interval", EditorStyles.boldLabel);
		         
		         lm.SetSpawnInterval(currentLevelToEdit, 0, EditorGUILayout.FloatField("Seconds", lm.GetSpawnInterval(currentLevelToEdit, 0), GUILayout.Width(defaultGUIWidth)));
		         
		         GUILayout.Label("FireWork Amount", EditorStyles.boldLabel);
		         lm.SetFireWorkAmount(currentLevelToEdit, EditorGUILayout.IntSlider(lm.GetFireWorkAmount(currentLevelToEdit), 1, 100, GUILayout.Width(defaultGUIWidth)));
		         
		         GUILayout.Label("LifeSpan", EditorStyles.boldLabel);
		         lm.SetLifeTimeMin(currentLevelToEdit, 0, EditorGUILayout.FloatField("Min", lm.GetLifeTimeMin(currentLevelToEdit, 0), GUILayout.Width(defaultGUIWidth)));
		         lm.SetLifeTimeMax(currentLevelToEdit, 0, EditorGUILayout.FloatField("Max", lm.GetLifeTimeMax(currentLevelToEdit, 0), GUILayout.Width(defaultGUIWidth)));
		         
		         
		         
		        
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         
		         
		       
		         if ( GUILayout.Button("Prev Level") )
		         {
		         	currentLevelToEdit -= 1;
		         	
		         	if ( currentLevelToEdit < 0 )
		         	{
		         		currentLevelToEdit = 0;
		         	}        
		         	
		         	GUIUtility.keyboardControl = 0;	         	
		         	
		         	lm.SetCurrentLevelBeingEdited(currentLevelToEdit);
		         };
		         
		         
		         
		         
		         if ( GUILayout.Button("Next Level") )
		         {
		         	if ( currentLevelToEdit < lm.GetMaxLevelNumber() )
		         	{
		         		currentLevelToEdit += 1;
		         	}
		         	
		         	GUIUtility.keyboardControl = 0;
		         	
		         	lm.SetCurrentLevelBeingEdited(currentLevelToEdit);
		         }
		         
		         if ( GUILayout.Button("COPY & NEXT LEVEL") )
		         {
		         	copiedLevelNumber = currentLevelToEdit;
		         	
		         	if ( currentLevelToEdit < lm.GetMaxLevelNumber() )
		         	{
		         		currentLevelToEdit += 1;
		         	}
		         	
		         	CopyLevel(currentLevelToEdit, copiedLevelNumber);
		         	
		         	GUIUtility.keyboardControl = 0;
		         	
		         	lm.SetCurrentLevelBeingEdited(currentLevelToEdit);
		         }
		         
		         EditorGUILayout.EndHorizontal();
		         
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         if ( GUILayout.Button("COPY LEVEL") )
		         {
		         	copiedLevelNumber = currentLevelToEdit;
		         }
		         
		         if ( GUILayout.Button("PASTE LEVEL") )
		         {
		         	CopyLevel(currentLevelToEdit, copiedLevelNumber);		         
		         }
		         EditorGUILayout.EndHorizontal();
		         
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         
		         
		         multiStart = EditorGUILayout.IntField("START", multiStart);
		         multiEnd  =  EditorGUILayout.IntField("END", multiEnd);
		         
		         multiDest =  EditorGUILayout.IntField("DEST", multiDest);
		         
		         if ( GUILayout.Button("COPY MULTI LEVELS") )
		         {
		         	CopyMultiLevels();         
		         }
		         
		         if ( GUILayout.Button("INSERT MULTI LEVELS") )
		         {
		         	InsertMultiLevels();         
		         }
		         
		         if ( GUILayout.Button("INSERT LEVEL") )
		         {
		         	if ( Wizards.Utils.DEBUG ) Debug.Log("Inserted Level @:" + currentLevelToEdit);
		         	lm.InsertLevel(currentLevelToEdit);         
		         }
		         
		         if ( confirmDelete == false )
		         {
		         	if ( GUILayout.Button("DELETE LEVEL"))
		         	{
		         		confirmDelete = true;	         
		         	}
		         }
		         
		         if ( confirmDelete )
		         {
		         	if ( GUILayout.Button("CANCEL DELETE"))
		         	{	         	
		         		confirmDelete = false;
		         	}

		         	if ( GUILayout.Button("CONFIRM DELETE"))
		         	{	         	
		         		if ( Wizards.Utils.DEBUG ) Debug.Log("Deleted Level @:" + currentLevelToEdit);
		         		lm.DeleteLevel(currentLevelToEdit);
		         		confirmDelete = false;
		         	}
		         	

		         }

		         
		         EditorGUILayout.EndHorizontal();
		         
		         
		       
		           
		         EditorGUILayout.EndVertical();  
		         
		        EditorGUILayout.BeginVertical(GUILayout.Width(defaultGUIWidth));
		        
		        GUILayout.Label("CREATE DIFFICULTY LEVEL FILES", EditorStyles.boldLabel);
		        
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         if ( GUILayout.Button("Generate DEFAULT Level Files") )
		         {
		         	if ( EditorUtility.DisplayDialog("Save DEFAULT Level Files", "!!! USE WITH CAUTION !!! \n This will overwrite ALL 3 difficulty level files with the current firework levels", "OVERWRITE", "CANCEL") )
		         	{
		         		if ( EditorUtility.DisplayDialog("REALLY?", "MAKE SURE YOU KNOW WHAT YOU ARE DOING!", "I KNOW WHAT I DO!", "CANCEL") )
		         		{
		         			var saveFileTo : String = pm.GetDifficultyPathAndFileName(EDifficulty.Easy);
	         				if ( Wizards.Utils.DEBUG ) Debug.Log("SAVING TO: " + saveFileTo);
	         				gSL.SaveLevelData(saveFileTo);
	         				
	         				saveFileTo = pm.GetDifficultyPathAndFileName(EDifficulty.Medium);
	         				if ( Wizards.Utils.DEBUG ) Debug.Log("SAVING TO: " + saveFileTo);
	         				gSL.SaveLevelData(saveFileTo);
	         				
	         				saveFileTo = pm.GetDifficultyPathAndFileName(EDifficulty.Hard);
	         				if ( Wizards.Utils.DEBUG ) Debug.Log("SAVING TO: " + saveFileTo);
	         				gSL.SaveLevelData(saveFileTo);
		         		}
		         	}
		         }
		         
		         EditorGUILayout.EndHorizontal();
		        
		         
		     EditorGUILayout.BeginVertical(GUILayout.Width(defaultGUIWidth));
		     EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		     
		     EditorGUILayout.BeginVertical(GUILayout.Width(defaultGUIWidth));
	         GUILayout.Label("SAVE / LOAD Current Data", EditorStyles.boldLabel);

	        
	         if ( GUILayout.Button("Load ALL Data : OLD VERSIONS") )
	         {
	         	var suggestedPath : String = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	var loadpath = EditorUtility.OpenFilePanel("Load Level File", suggestedPath, "xml");
	         		         	
	         	if ( loadpath != "" )
	         	{         	
	         		gSL.LoadLevelData(loadpath, true);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
	         	}
	         }
	         
	         if ( GUILayout.Button("Load ALL Data : NEW VERSIONS") )
	         {
	         	suggestedPath = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	loadpath = EditorUtility.OpenFilePanel("Load Level File", suggestedPath, "xml");
	         		         	
	         	if ( loadpath != "" )
	         	{         	
	         		gSL.LoadLevelData(loadpath, false);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
	         	}
	         }
	         EditorGUILayout.EndHorizontal();
	         EditorGUILayout.EndVertical();
	         
	         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
	         
	         if ( GUILayout.Button("Save ALL Data") )
	         {
	         	suggestedPath = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	var savepath = EditorUtility.SaveFilePanel("Save Level File", Application.persistentDataPath, suggestedPath, "");
	         	
	         	if ( savepath != "" )
	         	{         	
	         		gSL.SaveLevelData(savepath);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Saved: " + savepath);
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Saved");
	         	}
	         }
	         
	         EditorGUILayout.EndHorizontal();
	         
		     EditorGUILayout.EndVertical();
		     
		     		     
		     EditorGUILayout.Separator();
		     EditorGUILayout.Separator();
		     		     
		     EditorGUILayout.Separator();
		     EditorGUILayout.Separator();
		     // LoadSectionOfFile
         
         	  GUILayout.Label("LOAD Selected Levels", EditorStyles.boldLabel);
	         sourceStartLevel = EditorGUILayout.IntField("Source Start Lvl", sourceStartLevel);
			 sourceEndLevel = EditorGUILayout.IntField("Source End Lvl", sourceEndLevel);
	        
	         destStartLevel = EditorGUILayout.IntField("Destination Start Lvl", destStartLevel);
		
	         if ( GUILayout.Button("Load SELECTED Data : OLD VERSIONS") )
	         {
	         	suggestedPath = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	loadpath = EditorUtility.OpenFilePanel("Load Level File", suggestedPath, "xml");
	         		         	
	         	if ( loadpath != "" )
	         	{         	
	         		gSL.LoadLevelDataSelection(loadpath, true, sourceStartLevel, sourceEndLevel, destStartLevel);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
	         		EditorUtility.DisplayDialog("Finished Loading", "Finished Loading", "OK");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
	         	}
	         }
	         
	         if ( GUILayout.Button("Load SELECTED Data : NEW VERSIONS") )
	         {
	         	suggestedPath = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	loadpath = EditorUtility.OpenFilePanel("Load Level File", suggestedPath, "xml");
	         		         	
	         	if ( loadpath != "" )
	         	{         	
	         		gSL.LoadLevelDataSelection(loadpath, false, sourceStartLevel, sourceEndLevel, destStartLevel);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Loaded");
	         		EditorUtility.DisplayDialog("Finished Loading", "Finished Loading", "OK");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Loaded");
	         	}
	         }
	         
	         
	         
	         // END LOAD SECTION OF FILE
		     		     
		     EditorGUILayout.Separator();
		     EditorGUILayout.Separator();
		     // SaveSectionOfFile
         
         	  GUILayout.Label("SAVE Selected Levels", EditorStyles.boldLabel);
	         saveStartLevel = EditorGUILayout.IntField("Save Start Lvl", saveStartLevel);
			 saveEndLevel = EditorGUILayout.IntField("Save End Lvl", saveEndLevel);
	        
	         if ( GUILayout.Button("Save SELECTED Data") )
	         {
	         	suggestedPath = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
	         	savepath = EditorUtility.SaveFilePanel("Save Level File", Application.persistentDataPath, suggestedPath, "");
	         	
	         	if ( savepath != "" )
	         	{         	
	         		gSL.SaveLevelDataSelection(savepath, saveStartLevel, saveEndLevel);
	         		if ( Wizards.Utils.DEBUG ) Debug.Log("Data Saved: " + savepath);
	         		EditorUtility.DisplayDialog("Finished Saving", "Finished Saving", "OK");
	         	}
	         	else
	         	{
	         	if ( Wizards.Utils.DEBUG ) Debug.Log("Data NOT Saved");
	         	}
	         }
	         
	         
	         
	         // END SAVE SECTION OF FILE
		     
		     
		     
		     
		     
		     EditorGUILayout.Separator();
		     EditorGUILayout.Separator();
		     
		       	 GUILayout.Label("Play List Management", EditorStyles.boldLabel);
		       	 EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         
		         if ( GUILayout.Button("Play ALL") )
		         {
		         	lm.SetPlayModeTest(0, numTestLevelsToPlay, false);
		         	EditorApplication.ExecuteMenuItem("Edit/Play");
		         	SaveLevelPosition();
		         	SaveLevelDifficulty();
		         	
		         	this.Close();
		         	
		         	
		         }
		         
		         if ( GUILayout.Button("Play CURRENT") )
		         {
		         	lm.SetPlayModeTest(currentLevelToEdit, numTestLevelsToPlay, true);
		         	SaveLevelPosition();
		         	SaveLevelDifficulty();
		        	EditorApplication.ExecuteMenuItem("Edit/Play");

		         	
		         	this.Close();
		         }
	
		         EditorGUILayout.LabelField("NumLevelsToPlay", "" + numTestLevelsToPlay); 
		         numTestLevelsToPlay = lm.GetNumLevels() - currentLevelToEdit; 	         
		        
	        	         
		         EditorGUILayout.EndHorizontal();
		         
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         autonumberRepeatAt = EditorGUILayout.IntField("RepeatAt", autonumberRepeatAt);
		         EditorGUILayout.EndHorizontal(); 

		        EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth)); //START PLAY SEQUENCe		        
		        var iIndex : int = 0;
		        
		        if ( GUILayout.Button("AUTO NUMBER") )
		        {
		        	for ( var iCount : int = 0; i < lm.GetNumPlayItemLevels(0); ++iCount )
		        	{
		        		lm.SetPlayItemLevel(0, iCount, iIndex);
		        		
		        		iIndex += 1;
		        		
		        		if ( iIndex == autonumberRepeatAt )
		        		{
		        			iIndex = 0;
		        		}
		        	}
		        } 
		        EditorGUILayout.EndHorizontal();
		        
		        EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth)); //START PLAY SEQUENCe
		        
		        GUILayout.Label ("Level Play Sequence", EditorStyles.boldLabel);  
		        
		        EditorGUILayout.EndHorizontal();   //END PLAY SEQUENCE 
		        
		        // Edit Level Play Sequence Here
		        
		        // TODO - Edit Level Play Sequence.
		        
		        if ( lm.GetNumPlayItems() > 0 )
		        {
		        	if ( lm.GetNumPlayItemLevels(0) > 0 )
		        	{
			        	//if ( Wizards.Utils.DEBUG ) Debug.Log("Activating Scroll View");
			        	scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.Width(defaultGUIWidth), GUILayout.Height (400));
			        	for ( i = 0; i < lm.GetNumPlayItemLevels(0); i += 1 )
			        	{
			        		lm.SetPlayItemLevel(0, i, EditorGUILayout.IntField("Play Level: ", lm.GetPlayItemLevel(0, i)));
			        	}
			        	
			        	EditorGUILayout.EndScrollView();
			        }
			        else
			        {
			        	lm.SetNumPlayItemLevels(0,100);
			        }
		        }
		        else
		        {
		        	lm.SetNumPlayItems(1);
		        	
		        }
		        
		        
		       
		        
		        
		        
		         EditorGUILayout.EndVertical();   
		         
		         
		         EditorGUILayout.EndHorizontal();
		         EditorGUILayout.EndScrollView();
		         
		                   
		        // EditorGUILayout.LabelField("ObjectName", levelManager.name);
		        // EditorGUILayout.LabelField("LevelCount", ""+ lm.GetNumLevels());
		         
		         
		         /*
		         if (GUI.Button(Rect(10,100,100,50),"Add Level"))
		         {
		         	lm.AddLevel();
		         }
		         */
		         
		       //  EditorGUILayout.EndToggleGroup ();
		      
		 	}
		 	else
		 	{
		 		 EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         
		         if ( GUILayout.Button("GENERATE BLANK LEVELS") )
		         {
		         	lm.SetNumLevels(100);
		         };
		         
		         EditorGUILayout.EndHorizontal();
		         
		         EditorGUILayout.BeginHorizontal(GUILayout.Width(defaultGUIWidth));
		         
		         if ( GUILayout.Button("GENERATE RANDOM LEVELS") )
		         {
		         	//lm.SetNumLevels(100);
		         	// TODO
		         };
		         
		         EditorGUILayout.EndHorizontal();
		         		 	
		 	}
         }
         else
         {
         	//if ( Wizards.Utils.DEBUG ) Debug.Log("No Level Manager Found in Current Scene");
         }
    }
    
    function CopyMultiLevels()
    {
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiStart:" + multiStart);
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiEnd:" + multiEnd);
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiDest:" + multiDest);
     	
     	var index : int = 0;
     	for ( var m : int = multiStart; m <= multiEnd; ++m )
     	{  
     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Source:" + m);
     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Dest:" + (multiDest + index));
     		
     		CopyLevel(multiDest + index, m);
     		++index;
     	}	
    }	
    
    function InsertMultiLevels()
    {
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiStart:" + multiStart);
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiEnd:" + multiEnd);
     	//if ( Wizards.Utils.DEBUG ) Debug.Log("MultiDest:" + multiDest);
     	
     	
     	if ( multiDest <= multiEnd && multiDest >= multiStart )
     	{
     		if ( Wizards.Utils.DEBUG ) Debug.LogError("Cannot do that IO! Your destination location is also part of the source levels you are trying to copy");
     		return;
     	}
     	
     	var copyCount : int = multiEnd - multiStart+1;
     	
     	for ( var j: int = 0; j < copyCount ;j++)
     	{
     		lm.InsertBlank(multiDest);
     	}
     	
     	
     	var index : int = 0;
     	var m :int=0;
     	
     	if ( multiStart < multiDest )
     	{
	     	for (  m  = multiStart; m <= multiEnd; ++m )
	     	{  
	     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Source:" + m);
	     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Dest:" + (multiDest + index));
	     		
	     		
	     		CopyLevel(multiDest + index, m);
	     		++index;
	     	}
	     }
	     else
	     {
	     	for ( m = multiStart + copyCount; m <= multiEnd + copyCount; ++m )
	     	{  
	     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Source:" + m);
	     	//	if ( Wizards.Utils.DEBUG ) Debug.Log("Dest:" + (multiDest + index));
	     		
	     		
	     		CopyLevel(multiDest + index, m);
	     		++index;
	     	}
	     }	
    }	
    
    function OnFocus()
    {
    	autoRepaintOnSceneChange = true;
    	if ( Wizards.Utils.DEBUG ) Debug.Log("I got my focus back");
    	Init();
    }


	function CopyLevel(_toLevel : int, _fromLevel : int)
	{
		lm.CopyLevel(_toLevel, _fromLevel);
	}
	
	function SaveLevelPosition()
	{
		PlayerPrefs.SetInt("LevelEditorCurrentLevel", currentLevelToEdit);
	}
	
	function SaveLevelDifficulty()
	{
		var pm:ProfileManager=ProfileManager.Instance();
		PlayerPrefs.SetInt("LevelEditorCurrentDifficulty", currentLevelDifficulty);

		pm.SetDifficultyLevel(currentLevelDifficulty);
	}
	
	/*
	function PlayStateChanged()
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("PlayStateChanged! @ " + Time.time);
		if ( EditorApplication.isPlaying == false )
		{
			var leveleditor = EditorWindow.GetWindow(LevelEditor);
	        leveleditor.autoRepaintOnSceneChange = true;
	        leveleditor.LoadLevelPosition();
		}
	}
	*/
	
	function LoadLevelPosition()
	{
		currentLevelToEdit = PlayerPrefs.GetInt("LevelEditorCurrentLevel", 0);
		
		//if ( Wizards.Utils.DEBUG ) Debug.Log(PlayStateChanged);

		//this.playmodeStateChanged += PlayStateChanged;
	}
	
	function LoadLevelDifficulty()
	{
		currentLevelDifficulty = PlayerPrefs.GetInt("LevelEditorCurrentDifficulty", EDifficulty.Easy);
		switchToDifficulty = currentLevelDifficulty;
	}
	
	function OnLostFocus()
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("I lost my focus");
		SaveLevelPosition();
		SaveLevelDifficulty();
	}
	function OnDisable()
	{
		var pm:ProfileManager=ProfileManager.Instance();
		if ( Wizards.Utils.DEBUG ) Debug.Log("Disable Called");
		SaveLevelPosition();
		SaveLevelDifficulty();
		
	    var saveFileTo : String = pm.GetDifficultyPathAndFileName(currentLevelDifficulty);
       	if ( Wizards.Utils.DEBUG ) Debug.Log("SAVETO: " + saveFileTo);
       	gSL.SaveLevelData(saveFileTo);
       	
       	EditorUtility.SetDirty(lm);
	}


}