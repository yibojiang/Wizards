var ratingsPanel:exSprite[];

private var hatNum:int=0;

var layerManager:LayerManager;
var pm : ProfileManager;
private var isGameOver:boolean=false;
var showRatingPanel:boolean=false;
var showRatingPanelToggle:float=2.0;

var scoreCountFinished:boolean=false;

var score:int;
var missCount:int;
var poorCount:int;
var goodCount:int;
var perfectCount:int;
var totalCount:int;

var displayMissCount:float;
var displayPoorCount:float;
var displayGoodCount:float;
var displayPerfectCount:float;

var TextMissCount:exSpriteFont;
var TextPoorCount:exSpriteFont;
var TextGoodCount:exSpriteFont;
var TextPerfectCount:exSpriteFont;

var audienceBar:AudienceBar;

var catBoard:CatBoard;

var isPause:boolean=false;

var audioManager:AudioManager;

private var bgmManager:BgmManager;

private var startPos:Vector2;

private var countSpeed:float=1;


private var cam:GameObject;

var newbest:GameObject;
var pauseMenu:PauseMenu;

var copperHatParticle:GameObject;
var goldenHatParticle:GameObject;
var sliverHatParticle:GameObject;

var newHatRewardEffect : GameObject;

var achievementManager:AchievementManager;
var levelLayersManager:NewLevelLayersManager;

var audiencebar:AudienceBar;

private var perfectRound:boolean=false;

private var wc : WizardControl;

var levelRewardEffect : GameObject;
var levelRewardStartPos : Vector3;
var levelRewardDestPos : Vector3;
var levelRewardMoveTime : float = 1.0;
var levelRewardEaseType : iTween.EaseType;

private var em : EventManager;

var perfectRoundText : GameObject;

function Awake()
{
	GameResume();
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager) as LayerManager;
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	audioManager=GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	cam=GameObject.Find("Main Camera");
	levelLayersManager=GameObject.Find("LevelLayersManager").GetComponent(NewLevelLayersManager);
	bgmManager=audioManager.GetComponent(BgmManager);
	
	if ( GameObject.Find("Wizard") != null )
	{
		wc = GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
	}
}

function Start()
{

}

function GetEventManager()
{
	em = GameObject.Find("EventManager").GetComponent(EventManager) as EventManager;
}

function LateUpdate()
{
	if (showRatingPanel)
	{
		if (showRatingPanelToggle>0)
		{
			showRatingPanelToggle-=Time.deltaTime;
		}
		else
		{
		    if (displayMissCount<missCount)
		    {
		    	displayMissCount+=(missCount-displayMissCount)*countSpeed*Time.deltaTime;
		    	displayMissCount=Mathf.Ceil(displayMissCount);
		    	if (displayMissCount==missCount)
		    	{
		    		showRatingPanelToggle=0.5;
		    		iTween.ScaleTo(TextMissCount.gameObject,iTween.Hash("time",0.2,"x",1.3,"y",1.3,"easetype",iTween.EaseType.linear,"delay",0) );
		    		iTween.ScaleTo(TextMissCount.gameObject,iTween.Hash("time",0.2,"x",1,"y",1,"easetype",iTween.EaseType.linear,"delay",0.2) );
		    		if (missCount<0.1*totalCount)//get 1st hat condition
		    		{
		    			showRatingPanelToggle=1;
		    			ShowHat(0);
		    			hatNum=1;
		    		}
		    	
					audioManager.PlayOneShotAudio(audioManager.catBoardAudio[1],audioManager.FXVol);
		    	}
		    	else
		    	{
		    		audioManager.PlayAudio(audioManager.pointCounting,false,audioManager.FXVol);
		    	}
		    	
		    }
		    else
		    {
		    	displayMissCount=missCount;
		    	
		    	if (displayPoorCount<poorCount)
			    {
			    	displayPoorCount+=(poorCount-displayPoorCount)*countSpeed*Time.deltaTime;
			    	displayPoorCount=Mathf.Ceil(displayPoorCount);
			    	
			    	
		    		if (displayPoorCount==poorCount)
			    	{
			    		showRatingPanelToggle=0.5;
			    		iTween.ScaleTo(TextPoorCount.gameObject,iTween.Hash("time",0.2,"x",1.3,"y",1.3,"easetype",iTween.EaseType.linear,"delay",0) );
		    			iTween.ScaleTo(TextPoorCount.gameObject,iTween.Hash("time",0.2,"x",1,"y",1,"easetype",iTween.EaseType.linear,"delay",0.2) );
						audioManager.PlayOneShotAudio(audioManager.catBoardAudio[1],audioManager.FXVol);
			    	}	
			    	else
			    	{
			    		audioManager.PlayAudio(audioManager.pointCounting,false,audioManager.FXVol);
			    	}
			    	
			    }
			    else
			    {
			    	displayPoorCount=poorCount;
			    	
			    	if (displayGoodCount<goodCount)
				    {
				    	displayGoodCount+=(goodCount-displayGoodCount)*countSpeed*Time.deltaTime;
				    	displayGoodCount=Mathf.Ceil(displayGoodCount);
		    			if (displayGoodCount==goodCount)
						{
							showRatingPanelToggle=0.5;
							iTween.ScaleTo(TextGoodCount.gameObject,iTween.Hash("time",0.2,"x",1.3,"y",1.3,"easetype",iTween.EaseType.linear,"delay",0) );
		    				iTween.ScaleTo(TextGoodCount.gameObject,iTween.Hash("time",0.2,"x",1,"y",1,"easetype",iTween.EaseType.linear,"delay",0.2) );
							if (goodCount+perfectCount>0.7*totalCount && missCount<0.1*totalCount)//get 2nd hat condition
				    		{
				    			showRatingPanelToggle=1;
				    			ShowHat(1);
				    			hatNum=2;
				    		}
				    							    	
							audioManager.PlayOneShotAudio(audioManager.catBoardAudio[1],audioManager.FXVol);
				    	}
				    	else
				    	{
							audioManager.PlayAudio(audioManager.pointCounting,false,audioManager.FXVol);
				    	}
				    }
				    else
				    {
				    	displayGoodCount=goodCount;
				    	
				    	if (displayPerfectCount<perfectCount)
					    {
					    	displayPerfectCount+=(perfectCount-displayPerfectCount)*countSpeed*Time.deltaTime;
					    	displayPerfectCount=Mathf.Ceil(displayPerfectCount);
		    				if (displayPerfectCount==perfectCount)
					    	{
					    		showRatingPanelToggle=0.5;
					    		iTween.ScaleTo(TextPerfectCount.gameObject,iTween.Hash("time",0.2,"x",1.3,"y",1.3,"easetype",iTween.EaseType.linear,"delay",0) );
		    					iTween.ScaleTo(TextPerfectCount.gameObject,iTween.Hash("time",0.2,"x",1,"y",1,"easetype",iTween.EaseType.linear,"delay",0.2) );
					    		//if (perfectCount>0.7*totalCount && goodCount+perfectCount>0.7*totalCount && missCount<0.1*totalCount)//get 3rd hat condition
					    		if (missCount == 0 && goodCount+perfectCount>0.7*totalCount && missCount<0.1*totalCount)//get 3rd hat condition
					    		{
					    			showRatingPanelToggle=1;
					    			ShowHat(2);
					    			hatNum=3;
					    		}
					    		
					    		// New best reward
					    		if ( Wizards.Utils.DEBUG ) Debug.Log("Checking perfect rewards for stage : " + levelLayersManager.stageIndex);
					    		var levelPerfectBest : int = pm.GetLevelRecord( levelLayersManager.stageIndex, Record.LevelPerfectBest);
					    		
					    		if ( perfectCount > levelPerfectBest )
					    		{
					    			pm.SetLevelRecord( levelLayersManager.stageIndex, Record.LevelPerfectBest, perfectCount);
					    			
					    			// Do Reward
					    			var rewardAmount : int = perfectCount - levelPerfectBest;
					    			if ( Wizards.Utils.DEBUG ) Debug.Log("Rewarding for new best perfect : " + rewardAmount);
					    			
					    			
					    			catBoard.ShowNewBestPerfect();
					    			
					    			RewardStarCoins(rewardAmount);
					    			
					    		}
					    		
					    		audioManager.PlayOneShotAudio(audioManager.catBoardAudio[1],audioManager.FXVol);
								scoreCountFinished=true;//score counting over
								
								PlayMasterAudio();
								
								// Perfect round check
								if ( perfectCount > 0 &&
									 missCount == 0 &&
									 poorCount == 0 &&
									 goodCount == 0 )
								{
									ShowPerfectRound();	 
								}
					    	}
					    	else
					    	{
					    		audioManager.PlayAudio(audioManager.pointCounting,false,audioManager.FXVol);
					    	}
					    }
					    else
					    {
					    	displayPerfectCount=perfectCount;
					    	
					    }
					    
					    TextPerfectCount.text=displayPerfectCount+"";
					    //TextPerfectCount.text=displayPerfectCount+"/"+Mathf.Ceil(totalCount*0.7);
				    }
				    
				    TextGoodCount.text=displayGoodCount+"";
				    
				    
			    }
			    
			    TextPoorCount.text=displayPoorCount+"";
			    
			    
		    }
		    
		    TextMissCount.text=displayMissCount+"";
		    //TextMissCount.text=displayMissCount+"/"+Mathf.Ceil(totalCount*0.1);

		    
		    
		}
	}
}

function ShowPerfectRound()
{
	var displayPos : Vector3 = Vector3(0.0, -8.10193, 0.0);
	audioManager.PlayOneShotAudio(audioManager.audience[0],audioManager.audienceVol * 2.0);
	var em : ExplosionManager = GameObject.Find("ExplosionManager").GetComponent(ExplosionManager) as ExplosionManager;
	em.DoCelebralationExplosion(10, 2.0);
	iTween.MoveTo(perfectRoundText.gameObject, iTween.Hash("position", displayPos, "time", 0.5, "easetype", iTween.EaseType.spring, "oncompletetarget", this.gameObject, "oncomplete", "HidePerfectRound"));
}

function HidePerfectRound()
{
	var endPos : Vector3 = Vector3(25.0, -8.10193, 0.0);
	iTween.MoveTo(perfectRoundText.gameObject, iTween.Hash("position", endPos, "time", 0.5, "delay", 4.0, "easetype", iTween.EaseType.spring, "oncompletetarget", this.gameObject, "oncomplete", "ResetPerfectRound"));
}

function ResetPerfectRound()
{
	var startPos : Vector3 = Vector3(-25.0, -8.10193, 0.0);
	perfectRoundText.transform.position = startPos;
}


function RewardStarCoins(_amount : int )
{
	//var go : GameObject = Instantiate(levelRewardEffect, levelRewardStartPos, Quaternion.identity);
	yield WaitForSeconds( levelRewardMoveTime );
	for ( var i : int = 0; i < _amount; ++i )
	{
		var go : GameObject = Instantiate(levelRewardEffect, levelRewardStartPos, Quaternion.identity);
		//yield;
		//go.GetComponent(iTween).tweenArguments["oncompletetarget"] = GameObject.Find("Wizard");
		
		//var mypath : Vector3[] = iTweenPath.GetPath("StarCoinPathOne");//go.GetComponent(iTweenPath).GetPath("StarCoinPathOne");			    			
		
		//var pathName : String = "";
		
		//if ( Random.value < 0.5 )
		//{
		//	pathName = "StarCoinPathTwo";
		//}
		//else
		//{
		//	pathName = "StarCoinPathOne";
		//}
		
		
		//iTween.MoveTo(go, iTween.Hash("path", iTweenPath.GetPath(pathName), "easetype", iTween.EaseType.linear, "time", 3.0, "oncompletetarget", GameObject.Find("Wizard"), "oncomplete" , "AddStarCoin"));	
					    						    						    			
		//Destroy(go, 3.5);			    						    						    					    						    						    					    						    						    			
		//go.GetComponent(iTweenEvent			    					    					    			
		//iTween.Move(go, iTween.Hash("position", levelRewardDestPos, "time", levelRewardMoveTime, "easeType", levelRewardEaseType));
					    			
		
		//wc.AddStarCoin();
		//yield WaitForSeconds( 0.05 );
	}
}

function Update()
{
	if (isPause)
	{
		isPause=false;
		ShowPausePanel();
	}
}

function PlayMasterAudio()
{
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("PLAY MASTER AUDIO");
	
	// Grab highest stage completed for this game
	var curStage:int=pm.GetLevelCheckPoint();
	if ( Wizards.Utils.DEBUG ) Debug.Log("CurStage : " + curStage);
	
	
	//copper:1 silver:2 gold:3 perfect-copper:4 perfect-silver:5 perfect-gold:6
	//if ( Wizards.Utils.DEBUG ) Debug.Log(curStage);
	
	// Get the current record for number of hats in this stage
	var curHatNum:int=pm.GetLifeTimeHatCount(curStage);
	if ( Wizards.Utils.DEBUG ) Debug.Log("CurSavedHatNum : " + curHatNum);
	if ( Wizards.Utils.DEBUG ) Debug.Log("ThisGameHatNum : " + hatNum);
	
	// If current hat record for this stage is greater than 3, then subtract 3...
	// SO...If hat num is 4,5,6, it will become 1,2,3 respectively.
	if (curHatNum>3)
	{
		curHatNum-=3;
	}
	
	// Possible hat values at this point are 0, 1, 2, 3
	
	// IF best recorded hat count is less than the current number of hats in this game
	if (curHatNum<hatNum)
	{
		// BUG HERE?
		// If we get a gold hat for this stage, then we play this stage again, with perfects...it won't trigger
		// so we cant get perfect  after that...
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("BUG HERE?");
		
		// If we had a perfect round ( all perfects )
		if (perfectRound)
		{
			// THEN hats will be set to 4,5, or 6 - meaning they will appear with wings in the map
			//for perfect round
			pm.SetLifeTimeHatCount(curStage,hatNum+3);
			if ( Wizards.Utils.DEBUG ) Debug.Log("stage:"+curStage+"-wings hat: "+hatNum);
			
			// if stage is 10, reward achievement.
			if (curStage==10)
			{
				if (achievementManager.achievementArray[Achievement.Perfect_Round]==0)
				{
					achievementManager.UnlockAchievement(Achievement.Perfect_Round);
				}
			}
		}
		else 
		{
			// If we didnt have a perfect round, then just set hat num to 1,2,3 (dont think this will trigger for hats == 0
			pm.SetLifeTimeHatCount(curStage,hatNum);
			if ( Wizards.Utils.DEBUG ) Debug.Log("stage:"+curStage+"-hat: "+hatNum);
		}
		
		newbest.GetComponent.<Renderer>().enabled=true;
		//iTween.Stop(newbest);
		//iTween.ShakePosition(newbest,iTween.Hash("x",0.1,"y",0.1,"time",1,"looptype",iTween.LoopType.loop));
	}
	else
	{
		// if current record for hats >= hatnum then we end up here.
		// So if we got 3 hats (gold) previously we will still end up here?
		
		newbest.GetComponent.<Renderer>().enabled=false;
	}
	
	var random=Random.Range(1,10);
	if (hatNum<=1)
	{
		audiencebar.health+=audiencebar.maxhealth*0.2;
		catBoard.MasterShakeHead();
		if (random<=5)
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[5],audioManager.voiceVol);
		}
		else
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[1],audioManager.voiceVol);
		}
		
		
	}
	else if (hatNum==2)
	{
		audiencebar.health+=audiencebar.maxhealth*0.5;
		catBoard.MasterNodHead();
		if (random<=5)
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[2],audioManager.voiceVol);
		}
		else
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[3],audioManager.voiceVol);
		}

	}
	else if (hatNum==3)
	{
		audiencebar.health+=audiencebar.maxhealth;
		catBoard.MasterNodHead();
		if (random<=5)
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[3],audioManager.voiceVol);
			//audioManager.PlayAudio(SoundEffect.Well_Done4,true);
		}
		else
		{
			audioManager.PlayOneShotAudio(audioManager.masterVoice[4],audioManager.voiceVol);
			//audioManager.PlayAudio(SoundEffect.By_Dumbledores_Board_AMAZED1,true);
		}
	}
}

function PlayCatAudio()
{
	var random=Random.Range(1,3);
	if (random==1)
		{
		if (hatNum<=1)
		{
			audioManager.PlayOneShotAudio(audioManager.totoVoice[0],audioManager.voiceVol);		
			//audioManager.PlayAudio(SoundEffect.Cat_Trouble,true);
			
			
		}
		else if (hatNum==2)
		{
			audioManager.PlayOneShotAudio(audioManager.totoVoice[1],audioManager.voiceVol);		
			//audioManager.PlayAudio(SoundEffect.Cat_Happy2,true);	
	
		}
		else if (hatNum==3)
		{
			audioManager.PlayOneShotAudio(audioManager.totoVoice[2],audioManager.voiceVol);		
			//audioManager.PlayAudio(SoundEffect.Cat_Yeah2,true);
	
		}
	}
}



function ShowRatingsNotice()
{
	//GamePause();
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Game Pause Disabled");
	
	//TODO: RANDOM POSITION (MAY CAUSE A BUG)
	/*
	
	startPos.x=Random.Range(-1,1);
	startPos.y=Random.Range(-1,1);
	startPos.Normalize();
	
	startPos=startPos*28;
	if (startPos.magnitude<10)
	{	
		startPos.x=0;
		startPos.y=-28;
	}
	
	*/
	catBoard.gameObject.SetActiveRecursively(true);
	newbest.GetComponent.<Renderer>().enabled=false;
	catBoard.AnimationOn();
	startPos.x=0;
	startPos.y=-28;
	
	for (var i:int=0;i<ratingsPanel.length;i++)
	{
		ratingsPanel[i].transform.localScale.x=0;
		ratingsPanel[i].transform.localScale.y=0;
	}
	
	catBoard.transform.position.x=startPos.x;
	catBoard.transform.position.y=startPos.y;
	ShowRatingsPanel();

	iTween.MoveAdd(catBoard.gameObject,iTween.Hash("time",2,"x",-startPos.x,"y",-startPos.y+3.5,"easetype",iTween.EaseType.linear) );
}

function HideRatingsNotice()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Hide Ratings Notice");
	catBoard.AnimationOff();
	HideRatingsPanel();
	iTween.MoveAdd(catBoard.gameObject,iTween.Hash("time",2,"x",-startPos.x,"y",-startPos.y,"easetype",iTween.EaseType.linear,"oncompletetarget",this.gameObject,"oncomplete","HideCatboard") );
}

function HideCatboard()
{
	
	catBoard.gameObject.SetActiveRecursively(false);
}

function ShowHat(_index:int)
{
	ratingsPanel[_index].gameObject.transform.localScale = Vector3(10.0,10.0,10.0);
	iTween.ScaleTo(ratingsPanel[_index].gameObject,iTween.Hash("time",1,"x",1,"y",1,"easetype",iTween.EaseType.easeInQuad) );
	
	yield WaitForSeconds(1.0);
	//iTween.ScaleTo(ratingsPanel[_index].gameObject,iTween.Hash("time",1,"x",1,"y",1,"easetype",iTween.EaseType.spring) );
	var hatEffect:GameObject;
	switch(_index)
	{
	case 0:	
		//hatEffect=Instantiate(copperHatParticle,ratingsPanel[_index].transform.position,Quaternion.identity);
		hatEffect=Instantiate(newHatRewardEffect,ratingsPanel[_index].transform.position,Quaternion.identity);
		
		//hatEffect.transform.localPosition.z=0;
		break;
	case 1:
		//hatEffect=Instantiate(sliverHatParticle,ratingsPanel[_index].transform.position,Quaternion.identity);
		hatEffect=Instantiate(newHatRewardEffect,ratingsPanel[_index].transform.position,Quaternion.identity);
		//hatEffect.transform.localPosition.z=0;
		break;
	case 2:
		//hatEffect=Instantiate(goldenHatParticle,ratingsPanel[_index].transform.position,Quaternion.identity);
		hatEffect=Instantiate(newHatRewardEffect,ratingsPanel[_index].transform.position,Quaternion.identity);
		//hatEffect.transform.localPosition.z=0;
		break;
	}
	
	hatEffect.GetComponent(ParticleEmitter).minSize = 0.5;
	hatEffect.GetComponent(ParticleEmitter).maxSize = 1.5;
	hatEffect.GetComponent(ParticleEmitter).rndVelocity.x = 12.0;
	hatEffect.GetComponent(ParticleEmitter).rndVelocity.y = 12.0;
	hatEffect.transform.position.z -= 2.0;
	
	audioManager.PlayOneShotAudio(audioManager.audience[_index+1],0.8);

}


function ShakeCamera()
{
	var cameraObject=GameObject.Find("Main Camera");
	iTween.ShakePosition(cameraObject,iTween.Hash("time",0.4,"x",2,"y",2) );
}

function ShowRatingsPanel()
{
	catBoard.HideNewBests();
	scoreCountFinished=false;
	showRatingPanel=true;
	showRatingPanelToggle=2.0;
	//Caculate the star number based on the score.
	//score=pm.GetLevelScore();
	score=pm.GetTempRecord(Record.LevelScore);
	/*
	missCount=5;
	poorCount=10;
	goodCount=0;
	perfectCount=85;
	*/
	
	missCount=pm.GetTempRecord(Record.LevelMiss);
	poorCount=pm.GetTempRecord(Record.LevelPoor);
	goodCount=pm.GetTempRecord(Record.LevelGood);
	perfectCount=pm.GetTempRecord(Record.LevelPerfect);
	
	//Achievement Perfect Round.
	if (achievementManager!=null)
	{
		if (levelLayersManager.currentStageIndex==10)
		{
			if (missCount==0 && poorCount==0 && goodCount==0 && achievementManager.achievementArray[Achievement.Perfect_Round]==0)
			{
				achievementManager.UnlockAchievement(Achievement.Perfect_Round);
			}
		}
	}
	
	if (missCount==0 && poorCount==0 && goodCount==0)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("PERFECT ROUND!");
		perfectRound=true;
	}
	/*
	missCount=15;
	poorCount=10;
	goodCount=75;
	perfectCount=0;
	*/
	totalCount=missCount+poorCount+goodCount+perfectCount;
	
	TextMissCount.text="0";
	TextPoorCount.text="0";
	TextGoodCount.text="0";
	TextPerfectCount.text="0";
	displayMissCount=-0.1;
	displayPoorCount=-0.1;
	displayGoodCount=-0.1;
	displayPerfectCount=-0.1;
	

}

function HideRatingsPanel()
{
	PlayCatAudio();
	
	showRatingPanel=false;
	
	
	
	
	hatNum=0;
	perfectRound=false;
}

function AudioPause()
{

	bgmManager.GetComponent.<AudioSource>().Pause();
	var fws : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	for ( var fw in fws )
	{
		if (fw.GetComponent.<AudioSource>()!=null)
		{
			fw.GetComponent.<AudioSource>().Pause();
		}
		
	}
}

function AudioResume()
{
	bgmManager.GetComponent.<AudioSource>().Play();
	var fws : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	for ( var fw in fws )
	{
		if (fw.GetComponent.<AudioSource>()!=null)
		{
			fw.GetComponent.<AudioSource>().Play();
		}
	}
}

function ShowPausePanel()
{
	if (Time.timeScale!=0)
	{
		GamePause();
		AudioPause();
		bgmManager.PauseBGM(bgmManager.inGameBGM);
		//if ( Wizards.Utils.DEBUG ) Debug.Log(Time.time+"Pause");
		iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.2,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","PauseMenuEnter"));
	}

}

function PauseMenuEnter()
{
	iTween.MoveTo(cam,iTween.Hash("time",0,"ignoretimescale",true,"x",50));
	iTween.CameraFadeTo(iTween.Hash("amount",0,"time",0.2,"ignoretimescale",true) );
	pauseMenu.Enter();
}



function HidePausePanel(_function:String)
{
	pauseMenu.Leave();
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.2,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete",_function));
}

function PauseMenuLeave()
{
	iTween.MoveTo(cam,iTween.Hash("time",0,"ignoretimescale",true,"x",0));
	iTween.CameraFadeTo(iTween.Hash("amount",0,"time",0.2,"ignoretimescale",true) );
	GameResume();
	bgmManager.GetComponent.<AudioSource>().Play();
	bgmManager.FadeInBGM(bgmManager.inGameBGM,0.8);
	AudioResume();
}

function Downtown()
{
	pm.SetNextLevelToLoad("Submenu");
	Application.LoadLevel("LevelLoader");
	
}

function Retry()
{
	pm.SetNextLevelToLoad("Game");
	Application.LoadLevel("LevelLoader");
}

function OnApplicationPause(pause:boolean)
{
	if (pause)
	{
		isPause=true;
	}
}

function GameResume()
{
	Time.timeScale=1;
	if ( em == null )
	{
		GetEventManager();
	}
	em.gamePaused = false;
	
}

function GamePause()
{
	Time.timeScale=0;
	if ( em == null )
	{
		GetEventManager();
	}
	em.gamePaused = true;
}



function SkipTutorial()
{
	pm.SetNextLevelToLoad("Game");
	Application.LoadLevel("LevelLoader");
}