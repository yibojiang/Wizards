private var pm:ProfileManager;
var audiencebar:AudienceBar;
var levelup:GameObject;
var em:ExplosionManager;
var notice:NoticeBox;

var curLevel:int;


var levelScore:int[];

var lm:LevelManager;
var newlm:NewLevelLayersManager;

var wc : WizardControl;

var achievementManager:AchievementManager;
var am:AudioManager;

var levelupOn:boolean;

var beingUsedInGameOverMenu : boolean = false; // So that I can use this for checking rewards in GameOVer Menu
// Used to disable start() and Awake() functionality.

enum RewardType
{
	FireWorkUnlock,
	HPIncrease,
	StarCoins,
	SFXUnlock
}

class LevelReward
{
	var rewardType : RewardType;
	var explosionUnlock : FireworkExplosion;
	var numSFXUnlocked : int;
	var SFXDescription : String;
	//var hpTotal : int;
	//var starCoinsGiven : int;
}

var levelRewards : LevelReward[];

var testUnlockLevel : int = 0;

function Awake(){
	am=AudioManager.Instance();
	pm=ProfileManager.Instance();
	lm=LevelManager.Instance();
	if ( !beingUsedInGameOverMenu ){
		wc=GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
		
	}
}

function Start()
{
	//curLevel=pm.GetWizardLevel();
	curLevel=CaculateLevel(pm.GetTempRecord(Record.LifeTimeScore));
	//curLevel=30;
	
	
	if ( !beingUsedInGameOverMenu )
	{
	
		// GetLevelBonus(curLevel); -PJC - Believe this was used to set the players HP Bar to correct size
		SetupHPBar(curLevel);
		// lm = GameObject.Find("LevelManager").GetComponent(LevelManager) as LevelManager;
	}
}

function Update()
{
	if ( Input.GetKeyDown(KeyCode.T) )
	{
		
		
		GetLevelBonusNew(testUnlockLevel);
		ShowLevelUp();
		testUnlockLevel++;
	}
}

// Returns TRUE if firework was unlocked by this function.
// Returns FALSE if the firework was ALREADY unlocked before calling this function.
function UnlockFireworkExplosion(_explosion:FireworkExplosion) : boolean
{
	var fireWorkUnlocked : boolean = false;
	
	if (!pm.GetFireworkExplosion(_explosion))
	{
		pm.SetFireworkExplosion(_explosion,1);
		//em.AddExplosion(_explosion,10,true);
		notice.ShowMessage("Unlocked new firework "+_explosion+" !",1);
		fireWorkUnlocked = true;
		
		DoFireWorkAchievementCheck();
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("FIREWORK ALREADY UNLOCKED : " + _explosion);
	}
	
	return ( fireWorkUnlocked );
}

function DoFireWorkAchievementCheck()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Checking for all fireworks unlocked achievement");
	if ( pm.AllFireWorksAreUnlocked() )
	{
		if (achievementManager!=null)
		{
			if ( achievementManager.achievementArray[Achievement.Firework_Lover]==0)
			{
				achievementManager.UnlockAchievement(Achievement.Firework_Lover);
			}
		}	
	}
}

function ExplodeAllFireworks()
{
	var fws : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	var glitters : GameObject[] = GameObject.FindGameObjectsWithTag("Glitter");
	var sfws:GameObject[]=GameObject.FindGameObjectsWithTag("SFW");
	for (var fw:GameObject in fws)
	{
		if (fw!=null)
			fw.SendMessage("ExplodePefect");
	}
	
	for (var glitter:GameObject in glitters)
	{
		if (glitter!=null)
			glitter.SendMessage("ExplodePefect");
	}
	
	//for (var sfw:GameObject in sfws)
	//{
		//if (sfw !=null)
			//sfw.SendMessage("Explode");
	//}
	
	
}

function FullAudienceBar()
{
	audiencebar.FullHealth();
	
}

function HealthUp(_maxHealth:float)
{
	audiencebar.LevelUp(_maxHealth);
}

function SetDropRate(_dropRate:float)
{
	audiencebar.SetDropRate(_dropRate);
}

function ShowLevelUp()
{
	
	
	var fwExp:int=Random.Range(0,10);
	Instantiate(levelup,Vector3(0,0,0),Quaternion.identity);
	//if ( Wizards.Utils.DEBUG ) Debug.Log(fwExp);
	//UnlockFireworkExplosion(fwExp);
	ExplodeAllFireworks();
	FullAudienceBar();
	

	audiencebar.isLock=true;
	lm.PauseFireworks();
	yield WaitForSeconds(1);
	em.DoCelebralationExplosion(8,2);
	yield WaitForSeconds(2);
	if (!newlm.catBoard)
	{
		lm.ResumeFireworks();	
		audiencebar.isLock=false;
	}

	
}

//every time add score called.
function CheckLevelUp(_totalScore:int)
{
	if (!levelupOn)
	{
		return;
	}
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_totalScore);
	for (var i:int=0;i<levelScore.length;i++)
	{
		if (_totalScore<levelScore[i])
		{
			if (i-1-curLevel>0 )
			{
				//Level Up
				am.PlayOneShotAudio(am.javiVoice[3],am.voiceVol);
				//GetLevelBonus(i-1);
				GetLevelBonusNew(i-1);
				ShowLevelUp();
			}
			return;
		}
	}
}


//level>=0
function GetLevelScoreByLevel(_level:int):int
{
	return (Mathf.Log(_level+1,2)*10000);
}

function CaculateLevel(_exp:int):int
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("EXP : " + _exp);
	var level=0;
	while (_exp>=GetLevelScoreByLevel(level) )
	{
		_exp-=GetLevelScoreByLevel(level);
		level++;
	}
	return (level-1);
}

//for caculation total score for each level
function SetLevelScore()
{	
	var score:float=0;
	levelScore=new int[100];
	for (var i:int=0;i<100;i++)
	{
		
	 	score+=(Mathf.Log(i+1,2)*10000);
	 	levelScore[i]=score;
	 	
	}
}

function GetLevelBonusNew(_level : int )
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Getting Level Bonus For Level : " + _level);
	
	var levelReward : int = 0;
	
	if ( _level < levelRewards.Length )
	{
		levelReward = _level;
	}
	else
	{
		levelReward = 27; // Should be starcoins! check array if not sure.
	}
	
	
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("REWARD IS : " + levelRewards[levelReward].rewardType);
	
	
	
	switch ( levelRewards[levelReward].rewardType )
	{
		case RewardType.HPIncrease:
			notice.ShowMessage("HP bar extended !",1);
			SetupHPBar(_level);
		break;
		
		case RewardType.SFXUnlock:
			UnlockSFX(levelRewards[_level].numSFXUnlocked);
			notice.ShowMessage("Unlocked new SFX : " + levelRewards[_level].SFXDescription + " !",1);
		break;
		
		case RewardType.StarCoins:
			RewardStarCoins(_level);
		break;
		
		case RewardType.FireWorkUnlock:
			if ( Wizards.Utils.DEBUG ) Debug.Log("REWARDING FIREWORK UNLOCK : " + levelRewards[_level].explosionUnlock);
			
			if ( UnlockFireworkExplosion(levelRewards[_level].explosionUnlock) == false )
			{
				// Firework was already unlocked - give starcoins instead:
				if ( Wizards.Utils.DEBUG ) Debug.Log("Firework was already unlocked! - Rewarding STARCOINS Instead");
				RewardStarCoins(_level);			
			}
			else
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("FIREWORK UNLOCK SUCCESSFUL!");
			}
			
		break;
	}
	
	curLevel=_level;
}

function UnlockSFX(_totalUnlocked : int)
{
	pm.SetNumSFXUnlocked(_totalUnlocked);
	em.SetNumSFXUnlocked(_totalUnlocked);
}


function GetNameOfNextLevelReward(_level : int) : String
{
	var rewardText : String = "Next Lvl Up Reward:";
	
	var levelReward : int = 0;
	
	if ( _level < levelRewards.Length )
	{
		levelReward = _level;
	}
	else
	{
		levelReward = 27; // Should be starcoins! check array if not sure.
	}
	
	switch ( levelRewards[levelReward].rewardType )
	{
		case RewardType.HPIncrease:
			rewardText += "Health Increase";
		break;
		
		case RewardType.StarCoins:
			rewardText += "Star Coins!";
		break;
		
		case RewardType.FireWorkUnlock:
			rewardText += "Unlock Firework!";
		break;
		
		case RewardType.SFXUnlock:
			rewardText += "Unlock SFX!";
		break;
	}
	return ( rewardText );
}

function RewardStarCoins(_level : int)
{
	var starCoinRewardAmount : int = GetStarCoinRewardAmount(_level);
			
	if ( Wizards.Utils.DEBUG ) Debug.Log("StarCoins Rewarded: " + starCoinRewardAmount);
	
	notice.ShowMessage("Star Coins Reward : " + starCoinRewardAmount + " !",1);
	
	for ( var i : int = 0; i < starCoinRewardAmount; ++i )
	{
		yield;
		wc.AddStarCoin();
	}
}

function GetStarCoinRewardAmount(_level : int) : int
{
	return ( 5 + ( _level * 5) );
}

function GetLevelBonus(_level:int)
{
	//pm.SetWizardLevel(_level);
	curLevel=_level;
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_level);
	
	
	
	if (_level==0 && _level<=levelScore.length)
	{
		//UnlockFireworkExplosion(FireworkExplosion.FWsBurst02);
	}
	
	if (_level>=2 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst01);
	}
	
	if (_level>=4 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst03);
	}
	
	if (_level>=6 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst04);
	}
	
	if (_level>=8 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst05);
	}
	
	if (_level>=10 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst06);
	}
	
	if (_level>=12 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst07);
	}
	
	if (_level>=14 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst08);
	}
	
	if (_level>=16 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst09);
	}
	
	if (_level>=18 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst10);
	}
	
	if (_level>=20 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst11);
	}
	
	if (_level>=22 && _level<=levelScore.length)
	{
		UnlockFireworkExplosion(FireworkExplosion.FWsBurst13);
		
		if (achievementManager!=null)
		{
			if ( achievementManager.achievementArray[Achievement.Firework_Lover]==0)
			{
				achievementManager.UnlockAchievement(Achievement.Firework_Lover);
			}
		}
	}
	
	//Set Audience bar
	if (_level<=19)
	{
		HealthUp(24+_level*4);
	}
	
	//Set DropRate
	//if (_level<=19)
	//{
	//	SetDropRate();
	//}
}

function SetupHPBar(_level : int)
{
	var baseHP : int = 24;
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("SETUP HP LEVEL : " + _level);
	
	var actualLevel : int = 0;
	
	if ( _level < levelRewards.Length )
	{
		actualLevel = _level;
	}
	else
	{
		actualLevel = levelRewards.Length;
		if ( Wizards.Utils.DEBUG ) Debug.Log("LEVEL MAX REACHED, CAPPING TO : " + actualLevel);
	}
	
	
	if ( actualLevel > 0 )
	{
		for ( var i : int = 0; i < actualLevel; ++i )
		{
			if ( levelRewards[i].rewardType	== RewardType.HPIncrease )
			{
				baseHP += 8;		
			}
		}
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("Current HP = " + baseHP);
	HealthUp(baseHP);
}