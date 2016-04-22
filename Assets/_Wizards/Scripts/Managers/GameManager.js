private static var instance : GameManager;
 
public static function Instance() : GameManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<GameManager>();
    return instance;
}

var totalFireWorks : int = 0;

var TextChainCount:exSpriteFont;

var TextFireWorkCount:exSpriteFont;
var TextScoreCount:exSpriteFont;

//for display
var displayScore:float=0;

var chainCount : int = 0;
var perfectChainCount:int=0;


//var chainDurationLimit : float = 1.2;
//var chainTimer : float = 0.0;

var comboExplodeDuration : float = 1.2;
var comboTimer : float = 0.0;
var currentComboCount : int = 0;


var audienceBar : AudienceBar;

// StarCoinStuff
var starCoin : GameObject;
var minXSpawn : float = -8.0;
var maxXSpawn : float = 8.0;
var ySpawn : float = 16.0;

var combos : GameObject[];
var comboAwardPosition : Vector3;

var gameState : GameState;

var gameOverMessage : GameOverMessage;

private var im : InputManager;
private var pm : ProfileManager;
private var lm : LevelManager;
private var am: AudioManager;
private var em : EventManager;

var wizard : WizardControl;

var myLevelScore  :int = 0;

var timeToExplode:boolean=false;

var combo:Combo;

var explodeDelay:float;
var showChainCount:boolean;

var achievementManager:AchievementManager;


var autoTap:boolean=false;
var fairyOn:boolean;
var heartOn:boolean;

var fairy:GameObject;

var heartObj:GameObject;

var gameFinished:boolean;

private var ff : FireworkFactory;
var tutorialPoorMissCounter : int = 0;
var tutorialHitOKCounter : int = 0; // For good and perfect

enum GameState
{
	Tutorial,
	InGame,
	PlayingGameOver,
	FinishedPlayingGameOver
}

enum HitRanking
{
	Poor,
	Good,
	Perfect
}

private var tm:TutorialLevelManager;

private var missModifier : float;
private var poorModifier : float;
private var goodModifier : float;
private var perfectModifier : float;
private var scoreMultiplier : float;

class LevelDifficulty
{
	var levelDifficulty : EDifficulty;
	var missModifier : float = 2.5; // Decrease Amount
	var poorModifier : float = 1.25; // Decrease Amount
	var goodModifier : float = 8.0; // Increase Amount
	var perfectModifier : float = 32.0;// Increase Amount
	var healthDropRate : float = 0.3125;// Decrease Amount
	var scoreMultiplier : float = 0.25; // Score Multiplier
}

var difficultyLevel : LevelDifficulty[];

var boss : GameObject;

var cheats : GameObject;
var fwDebug : GameObject;

private var llm:NewLevelLayersManager;

function Start()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(1|2);
	perfectChainCount=0;
	chainCount=0;
	
	ff = GameObject.Find("FireworkFactory").GetComponent(FireworkFactory) as FireworkFactory;
	im = GameObject.Find("InputManager").GetComponent(InputManager) as InputManager;
 	pm = ProfileManager.Instance();
 	tm = TutorialLevelManager.Instance();
 	
 	lm = LevelManager.Instance();
 	
 	am= AudioManager.Instance();
 	em=EventManager.Instance();
 	
 	wizard=GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
 	
 	llm=NewLevelLayersManager.Instance();
 	
 	
 	CalculateComboDuration();
 	
 	if ( pm.GetNumProfiles() == 0 )
 	{
 		pm.CreateProfile("Javie");
 	}
 	
 	pm.ResetLevelStats();
 	pm.ResetGameStats();//important!
 	
 	gameFinished=false;
 	//modified:change gamestate in unity editor

	im.SetState(gameState);
	tm.SetState(gameState);
	wizard.SetState(gameState);
	
	if (gameState==GameState.Tutorial)
	{
		
		tm.gameObject.active=true;
		lm.gameObject.active = false;
		//ff.ActivateTutorial(3);
	}
	else if(gameState==GameState.InGame)
	{
		lm.gameObject.active=true;
		tm.gameObject.active = false;

		gameOverMessage.gameObject.SetActiveRecursively(false);
		
		var itemMask:int=pm.GetSpecialItemmask();
		var fairyMask:int=ItemMask.Fairy;
		if (itemMask & fairyMask)
		{
			fairyOn=true;
		}
		else 
		{
			fairyOn=false;
		}
		
		if (fairyOn)
		{
			fairy.SetActiveRecursively(true);
		}
		else
		{
			fairy.SetActiveRecursively(false);
		}
		
		var heartMask:int=ItemMask.Heart;
		if (itemMask & heartMask)
		{
			heartOn=true;
			heartObj.SetActiveRecursively(true);
		}
		else 
		{
			heartOn=false;
			heartObj.SetActiveRecursively(false);
		}
	} 

	LoadDifficultySettings();
	
}

function LoadDifficultySettings()
{
	//var difficulty : EDifficulty = pm.GetDifficultyLevel();
	var difficulty : EDifficulty = lm.difficulty;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Setting up difficulty level : " + difficulty);
	
	switch ( difficulty )
	{
		case EDifficulty.Easy:
			missModifier = difficultyLevel[0].missModifier; // Decrease Amount
			poorModifier = difficultyLevel[0].poorModifier; // Decrease Amount
			goodModifier = difficultyLevel[0].goodModifier; // Increase Amount
			perfectModifier = difficultyLevel[0].perfectModifier;// Increase Amount
			audienceBar.healthDropRate = difficultyLevel[0].healthDropRate;// Decrease Amount
			scoreMultiplier = difficultyLevel[0].scoreMultiplier; // Score Multiplier
		break;
		
		case EDifficulty.Medium:
			missModifier = difficultyLevel[1].missModifier; // Decrease Amount
			poorModifier = difficultyLevel[1].poorModifier; // Decrease Amount
			goodModifier = difficultyLevel[1].goodModifier; // Increase Amount
			perfectModifier = difficultyLevel[1].perfectModifier;// Increase Amount
			audienceBar.healthDropRate = difficultyLevel[1].healthDropRate;// Decrease Amount
			scoreMultiplier = difficultyLevel[1].scoreMultiplier; // Score Multiplier
		break;
		
		case EDifficulty.Hard:
			missModifier = difficultyLevel[2].missModifier; // Decrease Amount
			poorModifier = difficultyLevel[2].poorModifier; // Decrease Amount
			goodModifier = difficultyLevel[2].goodModifier; // Increase Amount
			perfectModifier = difficultyLevel[2].perfectModifier;// Increase Amount
			audienceBar.healthDropRate = difficultyLevel[2].healthDropRate;// Decrease Amount
			scoreMultiplier = difficultyLevel[2].scoreMultiplier; // Score Multiplier
		break;
	}
}


function ToggleTest()
{
	//audienceBar.ToggleTest();
	autoTap=!autoTap;
	
}

function CalculateComboDuration()
{
	if (gameState==GameState.Tutorial)
	{
		comboExplodeDuration=1.2;
	}
	else if(gameState==GameState.InGame)
	{
		var wandCode:int=pm.GetWandBitmask();
		var comboMask:int=WandMask.Combo;
		if (wandCode  & comboMask)
		{
			comboExplodeDuration=1.4;
		}
		else
		{
			comboExplodeDuration=1.2;
		}
		
		
	} 
}

function GetChainCount() : int
{
	return ( chainCount );
	
}



function Update ()
{
	#if UNITY_EDITOR
	if ( Input.GetKeyDown(KeyCode.C) )
	{
		if ( cheats.transform.localPosition.x == 0.0 )
		{
			cheats.transform.localPosition.x = 100.0;
			fwDebug.transform.position.y = -100.0;
		}
		else
		{
			cheats.transform.localPosition.x = 0.0;
			fwDebug.transform.position.y = -11.95931;
		}
	}
	#endif
	
	if ( Wizards.Utils.DEBUG )
	{
		if ( Input.GetKeyDown(KeyCode.S) )
		{
			ShowStarCoins(1);
		}
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log(comboTimer);
	switch ( gameState )
	{
		case GameState.Tutorial:
			if ( comboTimer < comboExplodeDuration )
			{
				comboTimer += Time.deltaTime;
			}
			break;
		case GameState.InGame:
			if ( comboTimer < comboExplodeDuration )
			{
				comboTimer += Time.deltaTime;
			}
		
			if ( audienceBar.isAlive )
			{ 
	   	 		
	   		}
	   	 	else
	    	{
	    		DoGameFinished();
	    	}
	    break;
	    
	    case GameState.PlayingGameOver:

		break;
	}
}

function DoGameFinished()
{
	// var layerManager:LayerManager=GameObject.Find("LayerManager").GetComponent(LayerManager) as LayerManager;
	var layerManager:LayerManager=LayerManager.Instance();
	//pm.SetRecord(Record.GameHeight,layerManager.travelHeight);
	pm.SetTempRecord(Record.GameHeight,layerManager.GetTravelHeight());
	
	// var newEvent : CountlyEvent = new CountlyEvent();
	// newEvent.Key = "TravelHeightReached";
	// newEvent.Count = 1;
	// newEvent.Sum = layerManager.travelHeight;
	
	// Countly.Instance.PostEvent(newEvent);
	
	// newEvent.Key = "GameOver";
	// newEvent.Count = 1;
	// newEvent.Segmentation = new Dictionary.<String, String>();
	// newEvent.Segmentation["Stage"] = llm.stageIndex.ToString();
	// Countly.Instance.PostEvent(newEvent);
	
	// newEvent.Key = "StageReached:" + llm.stageIndex.ToString();
	// newEvent.Count = 1;
	// Countly.Instance.PostEvent(newEvent);
	
	pm.SaveAllRecord();
	
	
	var itemMask:int=pm.GetSpecialItemmask();
	var fairyMask:int=ItemMask.Fairy;
	
	if (itemMask & fairyMask)
	{
		itemMask=itemMask ^ fairyMask;
		pm.SetShopItemState("Fairy",ShopItemState.Available);
		pm.SetSpecialItemmask(itemMask);
	}
	
	gameState = GameState.PlayingGameOver;
	GamePause();
	im.SetState(gameState); // Doesn't seem to affect anything directly in Input Manager.
	
	if (!gameFinished)
	{
		
		gameOverMessage.gameObject.SetActiveRecursively(true);
		gameOverMessage.Init();
		
	}
	else
	{
		// TODO : If Boss kills player, different dialog
		GameFinished();
		if (achievementManager.achievementArray[Achievement.By_Bubbledots_Beard]==0)
		{
			achievementManager.UnlockAchievement(Achievement.By_Bubbledots_Beard);
		}
	}
}

function WinGame()
{
	Invoke("BossDefeated", 4.0);	
	
}

function BossDefeated()
{
	// TODO : If Boss kills player, different dialog
	gameFinished = true;
	DoGameFinished();
}

function GameFinished()
{
// TODO : If Boss kills player, different dialog
	pm.SetGameFinished(true);
	
	llm.FinalDialog();
	while ( llm.DialogFinished() == false )
	{
		yield;
	}
	
	llm.GotoEndClip();
}

function GamePause()
{
	Time.timeScale=0;
}



function LateUpdate()
{
	
	
	
    switch ( gameState )
	{
		case GameState.Tutorial:
			
			if ( comboTimer > comboExplodeDuration )
		    {
		    	//if ( Wizards.Utils.DEBUG ) Debug.Log(currentComboCount);
		    	if ( currentComboCount > 1 )
		    	{
		    		if ( pm.GetVibration() == true )
		    		{
		    			Handheld.Vibrate();
		    		}
		    		
		    		showComboAward();
		    		pm.IncrementScore(currentComboCount * 100 * scoreMultiplier);
		    		audienceBar.IncreaseApproval(currentComboCount);
		    	}
		    	
		    	TellFireworksToExplode(currentComboCount);   	
		    	
		    	currentComboCount = 0;
		    	//comboTimer = 0.0;
		    }
		    if (tm.tutorialStage==TutorialStage.Stage1)
		    {
		    	chainCount=0;
		    }
		    if (tm.tutorialStage==TutorialStage.Stage2)
			{
				tm.chainCount=chainCount;
				
			}
			if (tm.tutorialStage==TutorialStage.Stage3)
			{
				
				tm.comboCount=currentComboCount;
				if (tm.comboCount==2)
				{
					currentComboCount=0;
				    if ( Wizards.Utils.DEBUG ) Debug.Log("INCREASE COMBO COUNT!!!");
					tm.comboNum++;
				}
			}	
			
			if (tm.tutorialStage==TutorialStage.Stage4)
			{
				
				tm.comboCount=currentComboCount;
			}
			
			break;
		case GameState.InGame:
    
		    if ( comboTimer > comboExplodeDuration )
		    {
		    	
		    	if ( currentComboCount > 1 )
		    	{
		    		if ( pm.GetVibration() == true )
		    		{
		    			Handheld.Vibrate();
		    		}
		    		
		    		showComboAward();
		    		//score += currentComboCount * 100;
		    		pm.IncrementScore(currentComboCount * 100 * scoreMultiplier);
		    		audienceBar.IncreaseApproval(currentComboCount);
		    	}    	
		    	
		    	TellFireworksToExplode(currentComboCount);  
		    	currentComboCount = 0;
		    	//comboTimer = 0.0;
		    }
		    

			break;
	}
	var curScore:int=pm.GetTempRecord(Record.GameScore);
    if (displayScore<curScore)
    {
    	displayScore+=(curScore-displayScore)*5*Time.deltaTime;
    }
    else
    {
    	displayScore=curScore;
    }
    
    TextScoreCount.text=Mathf.Ceil(displayScore)+"";
    
    TextFireWorkCount.text= "" + totalFireWorks;
	
	/*
	if (lm!=null)
	{
		TextFireworkCount.text=""+lm.totalFireworks;
	}
	*/

    
	var ratio:float;
	var target = Quaternion.Euler (0, 0, 0);

	if (showChainCount)
	{
		if (chainCount==0)
		{
			if (TextChainCount.botColor.a>0)
			{
				TextChainCount.topColor.a-=2*Time.deltaTime;
				TextChainCount.botColor.a-=2*Time.deltaTime;
				TextChainCount.outlineColor.a-=2*Time.deltaTime;
			}
		}
		else 
		{
			if (TextChainCount.transform.localScale.x>1.01)
			{
				ratio=Mathf.Lerp(1,TextChainCount.transform.localScale.x,2*Time.deltaTime);
				TextChainCount.transform.localScale.x/= ratio;
				TextChainCount.transform.localScale.y/= ratio;
				TextChainCount.transform.rotation = Quaternion.Slerp(TextChainCount.transform.rotation, target, 2*Time.deltaTime);
			}
			else
			{
				TextChainCount.transform.localScale.x=1;
				TextChainCount.transform.localScale.y=1;
				TextChainCount.transform.rotation= Quaternion.identity;
				
	
			}
		}
	}
	

}

function ShowChainCount()
{
	showChainCount=true;
	TextChainCount.GetComponent.<Renderer>().enabled=true;
}

function HideChainCount()
{
	showChainCount=false;
	TextChainCount.GetComponent.<Renderer>().enabled=false;
}

function TellFireworksToExplode(_combo:int)
{
	explodeDelay=_combo*1.0/4;
	timeToExplode=true;
	
}

function GetState() : GameState
{
	return ( gameState );
}

function IncreaseChainCount()
{
	if (gameState==GameState.Tutorial && tm.tutorialStage==TutorialStage.Stage1)
	{
		
	}
	else 
	{
		chainCount++;
		if ( chainCount > 0 )
	    {
			var ran:int=Random.Range(-45,45);
			TextChainCount.text="x"+chainCount;
	    	TextChainCount.transform.localScale.x=3;
	    	TextChainCount.transform.localScale.y=3;
			TextChainCount.topColor.a=1;
			TextChainCount.botColor.a=1;
			TextChainCount.outlineColor.a=1;
			TextChainCount.transform.rotation= Quaternion.identity;
			TextChainCount.transform.Rotate(0,0,ran);	
	    }
	}
}

function ReportGlitters()
{
	pm.IncrementScore(10 * scoreMultiplier);
	IncreaseChainCount();
}

function ReportHit(_rank : HitRanking, _fwType : flightPath, _position : Vector3)
{
	timeToExplode=false;
	totalFireWorks += 1;

	
	if (gameState==GameState.InGame)
	{		
		switch ( _rank )
		{
			case HitRanking.Poor:
			    perfectChainCount=0;
			    ResetChainCount();
	        	
			    comboTimer += 1.0;
			    
	
			   	audienceBar.DecreaseApproval(poorModifier);
			    pm.IncrementPoorCount();
			    IncrementPoorMissCounter();
			    
				
			break;
			
			case HitRanking.Good:
				
				pm.IncrementScore(10 * scoreMultiplier);
				IncreaseChainCount();
				//if ( _fwType != flightPath.GlitterRain )
				//{
				perfectChainCount=0;
        		currentComboCount += 1;
        		pm.IncrementGoodCount();
        		comboTimer = 0.0;	
	        	//}
	        	
	        	IncrementHitCounter();
	        	
	        	audienceBar.IncreaseApproval(goodModifier);
	        	
			break;
			
			case HitRanking.Perfect:
				pm.IncrementScore(20 * scoreMultiplier);
	        	IncreaseChainCount();
	        	perfectChainCount++;
	        	
	        	currentComboCount += 1;
	        	
	        	if ( chainCount > 1 )
	        	{
	        		pm.IncrementScore(Mathf.Clamp( chainCount * 10,0,500) * scoreMultiplier);
	        	}
	        	
	        	//Achievement First tap perfect.
	        	if (achievementManager!=null)
	        	{
		        	if ( totalFireWorks==1 && achievementManager.achievementArray[Achievement.Natural_Talent]==0)
					{
						achievementManager.UnlockAchievement(Achievement.Natural_Talent);
					}
				}
	
	        	comboTimer = 0.0;
	        	audienceBar.IncreaseApproval(perfectModifier);
	        	pm.IncrementPerfectCount();
	        	
	        	IncrementHitCounter();
	        	
	        	
			break;
		}
		
		if ( _fwType == flightPath.ChainStraight ||
			 _fwType == flightPath.Chaser ||
			 _fwType == flightPath.Spawner )
		{
			if ( _rank != HitRanking.Poor )
			{
				currentComboCount -= 1;
			}
		} 
	}
	else if (gameState==GameState.Tutorial)
	{
		switch ( _rank )
		{
			case HitRanking.Poor:
				ResetChainCount();
				//IncreaseChainCount();
			    comboTimer += 1.0;
			   	audienceBar.DecreaseApproval(poorModifier);
			   	    
			   	tm.poorCount++;
			   	
			   	
			   	IncrementPoorMissCounter();
			   	
			   	if (tm.tutorialStage==TutorialStage.Stage1)
	        	{
	        		if (tm.fireworkCount>=5)
	        		{
	        			tm.fireworkCount=0;
	        			var random:int=Random.Range(17,18);
	        			tm.scrollingText.SetDialog(tm.dialog,random,random,tm.explosionDelay);
	        		}
	        		if (!tm.poorTapped)
					{
						tm.poorTapped=true;	
						tm.fireworkCount=0;
						
						tm.scrollingText.SetDialog(tm.dialog,6,9,1.2);
					}
	        	}
			break;
			
			case HitRanking.Good:
				//chainCount += 1;
				pm.IncrementScore(10 * scoreMultiplier);
				IncreaseChainCount();
	        	//if ( _fwType != flightPath.GlitterRain )
				//{
	        	currentComboCount += 1;
	        	tm.goodCount++;
	        	//}
	        	
	        	comboTimer = 0.0;
	        	audienceBar.IncreaseApproval(goodModifier);
	        	
	        	IncrementHitCounter();
	        	
	        	if (tm.tutorialStage==TutorialStage.Stage1)
	        	{
	        		if (tm.fireworkCount>=5)
	        		{
	        			tm.fireworkCount=0;
	        			var rnd:int=Random.Range(17,18);
	        			tm.scrollingText.SetDialog(tm.dialog,rnd,rnd,tm.explosionDelay);
	        		}
	        		if (!tm.goodTapped)
					{
						tm.goodTapped=true;	
						tm.fireworkCount=0;
						tm.scrollingText.SetDialog(tm.dialog,10,16,tm.explosionDelay);
					}
	        	}
			break;
			
			case HitRanking.Perfect:
				pm.IncrementScore(20 * scoreMultiplier);
	        	IncreaseChainCount();
	        	currentComboCount += 1;
	        	if ( chainCount > 1 )
	        	{
	        		pm.IncrementScore(Mathf.Clamp( chainCount * 10,0,500) * scoreMultiplier);
	        	}
	        	comboTimer = 0.0;
	        	audienceBar.IncreaseApproval(perfectModifier);
	        	
	        	tm.perfectCount++;
	        	
	        	IncrementHitCounter();
	        	
	        	if (tm.tutorialStage==TutorialStage.Stage1)
	        	{
	        		tm.fireworkCount=0;
	        		if (!tm.perfectTapped)
					{
						tm.perfectTapped=true;	
						//tutorial modified
						tm.scrollingText.SetDialog(tm.dialog,166,170,tm.explosionDelay);
					}
					
				
	       
	        	}
			break;
		}
		
		if ( _fwType == flightPath.ChainStraight ||
			 _fwType == flightPath.Chaser ||
			 _fwType == flightPath.Spawner )
		{
			if ( _rank != HitRanking.Poor )
			{
				currentComboCount -= 1;
			}
		} 
	
	}
	
	
	
	  
}

function IncrementPoorMissCounter()
{
   	tutorialPoorMissCounter++;
   	tutorialHitOKCounter = 0;
   	
   	if ( tutorialPoorMissCounter >= 3 )
   	{
   		tutorialPoorMissCounter = 0;
		
		if ( gameState==GameState.Tutorial )
		{
			ff.ActivateTutorial(3); // number of fireworks to activate guide for!
		}
		else if ( gameState==GameState.InGame )
		{
			if ( lm.newLevelLayersManager.stageIndex == 0 && lm.difficulty == EDifficulty.Easy )
			{
				//lm.tutorialMode = true;
				ff.ActivateTutorial(3);
			}
			else
			{
				//lm.tutorialMode = false;
				ff.DeactivateTutorial();
			}
		}
   	}
}

function IncrementHitCounter()
{
	tutorialHitOKCounter++;
	tutorialPoorMissCounter = 0;
	
	if ( tutorialHitOKCounter >= 3 )
	{
		tutorialPoorMissCounter = 0;
		//lm.tutorialMode = false;
		ff.DeactivateTutorial();
	}
}

function ResetChainCount()
{
	if (chainCount>pm.GetRecord(Record.GameMaxChain))
	{
		pm.SetTempRecord(Record.GameMaxChain,chainCount);
	}
	chainCount = 0;
}

function ReportMiss()
{
	//totalFireWorks += 1;
	//comboTimer += 1.0;
	ResetChainCount();
	perfectChainCount=0;
	
	if (gameState==GameState.InGame)
	{	
		audienceBar.DecreaseApproval(missModifier);
		//ADD MISS INCREMENT STATS.
		pm.IncrementMissCount();
		IncrementPoorMissCounter();
	}
	else if (gameState==GameState.Tutorial)
	{
		
		IncrementPoorMissCounter();
		
		audienceBar.DecreaseApproval(missModifier);
		if (tm.tutorialStage==TutorialStage.Stage1)
		{
			if (tm.fireworkCount>=5)
	        {
    			tm.fireworkCount=0;
    			var random:int=Random.Range(17,18);
    			tm.scrollingText.SetDialog(tm.dialog,random,random,1.0);
	        }
			if (!tm.missTapped)
			{
				tm.missTapped=true;	
				tm.missCount++;
				tm.scrollingText.SetDialog(tm.dialog,5,5,1.0);
			}
		}
		
		//tutorial modified
		if (tm.tutorialStage==TutorialStage.Stage2)
		{
			tm.missCount++;
			if (tm.missCount>=5)
	        {
    			tm.missCount=0;
    			tm.scrollingText.SetDialog(tm.dialog,173,173,1.0);
	        }
			
		}
	}
	
}

function showComboAward()
{
	//record the maxCombo
	if (gameState==GameState.InGame)
	{	
		if (pm.GetTempRecord(Record.GameMaxCombo)<currentComboCount) 
		{
			
			pm.SetTempRecord(Record.GameMaxCombo,currentComboCount);
		}
	}

	var comboAwardText : int = 0;
	
	if ( currentComboCount > 16 )
	{
		comboAwardText = 15;
	}
	else
	{
		comboAwardText = currentComboCount - 2;
	}
	
	combo.Init(comboAwardText);
	
	if (currentComboCount == 2)
	{
		if (gameState==GameState.InGame)
		{
			var random:int=Random.Range(0,3);
			am.PlayOneShotAudio(am.javiVoice[Random.Range(4,6)],am.voiceVol);
			if (random==1)
			{
				am.PlayOneShotAudio(am.audience[1],am.audienceVol*5);
			}
		}
		
		
	}
	
	if (currentComboCount>=6)
	{
		wizard.DoCircle();
	}
	
	if (currentComboCount >= 3 && currentComboCount < 6)
	{
		wizard.Jump();
	}
	 
	if ( currentComboCount >= 3 && currentComboCount <= 5 )
	{
		if (tm.tutorialStage==TutorialStage.Stage4 && tm.comboCount==3 && tm.stage4_flag==0 )
		{
			tm.stage4_flag=1;
			
			Instantiate(starCoin, Vector3(-5, ySpawn, 0), Quaternion.identity);
		}
		else
		{
			ShowStarCoins(1);
		}
		
		if (gameState==GameState.InGame)
		{
			am.PlayOneShotAudio(am.javiVoice[Random.Range(4,22)],am.voiceVol);
			random=Random.Range(0,2);
			if (random==1)
			{
				am.PlayOneShotAudio(am.audience[1],am.audienceVol*5);
			}
		}
	}
	else if ( currentComboCount >= 6 && currentComboCount <= 8 )
	{
		
		am.PlayOneShotAudio(am.javiVoice[Random.Range(4,22)],am.voiceVol);
		random=Random.Range(0,2);
		if (random==1)
		{
			am.PlayOneShotAudio(am.audience[1],am.audienceVol*5);
		}
		
		ShowStarCoins(2);
	}
	else if ( currentComboCount >= 9 && currentComboCount <= 15 )
	{
		am.PlayOneShotAudio(am.javiVoice[Random.Range(4,22)],am.voiceVol);
		random=Random.Range(0,2);
		if (random==1)
		{
			am.PlayOneShotAudio(am.audience[1],am.audienceVol*5);
		}
	
		ShowStarCoins(3);
	}
	else if ( currentComboCount > 15 )
	{
		// Supercombo
		am.PlayOneShotAudio(am.javiVoice[Random.Range(22,29)],am.voiceVol);
		ShowStarCoins(12);
	}
	
	if (achievementManager!=null)
	{
		//Achievement: Super Combo Master.
		if (currentComboCount>15 && achievementManager.achievementArray[Achievement.Super_Combo_Master]==0)
		{
			achievementManager.UnlockAchievement(Achievement.Super_Combo_Master);
		}
	}
}

function ShowStarCoins(_count:int)
{
	
	yield WaitForSeconds(1.0);
	var position : Vector3 = Vector3.zero;
	
	for (var i:int=0;i<_count;i++)
	{
		yield WaitForSeconds(Random.Range(0,1));
		position = Vector3(Random.Range(minXSpawn, maxXSpawn), ySpawn, 30);
		//var starCoin:StarCoin= GetStarCoinFromPool();
		//starCoin.Init(position);
		Instantiate(starCoin, position, Quaternion.identity);
	}
	

}

function comboFireworksCanExplode() : boolean
{
	var result : boolean = false;
	
	if ( comboTimer > comboExplodeDuration )
	{
		result = true;
	}
	else
	{
		result = false;
	}
	
	//print(result);
	return ( result );
	

}

function DoGameOver()
{
	
}

function Reset()
{
	//if ( Wizards.Utils.DEBUG ) Debug.LogError("Reset Called");
	//totalFireWorks = 0;
	//currentComboCount = 0;
	//chainCount = 0;
}

function SkipTutorial()
{
	pm.SetNextLevelToLoad("Game");
	Application.LoadLevel("LevelLoader");
}

function CreateBoss()
{
	var go : GameObject = Instantiate(boss, Vector3.zero, Quaternion.identity);
	go.name = "DrageonBoss";
	
	em.PauseGameTimer();
	lm.PauseFireworks();
	audienceBar.test = true;
	
	TurnOffHealthCheat(10.0);
}

function TurnOffHealthCheat(_delay : float)
{
	yield WaitForSeconds(_delay);
	audienceBar.test = false;
	audienceBar.isLock = false;
}

function BossDestroyedResumeGame(_delay : float)
{
	yield WaitForSeconds(_delay);
	em.ResumeGameTimer();
	lm.ResumeFireworks();
}
	