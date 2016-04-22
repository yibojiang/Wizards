private static var instance : AchievementManager;
 
public static function Instance() : AchievementManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<AchievementManager>();
    return instance;
}
var notice:NoticeBox;
var panelController:PanelController;
// private var timerController:TimerController;
var achievementArray:int[];

var lifeTimePerfect:int;
var lifeTimeFWCount:int;



private var pm:ProfileManager;

function Awake()
{
	pm =ProfileManager.Instance();
	// timerController=GameObject.Find("TimerController").GetComponent(TimerController);
	//Save temp data
	achievementArray=new int[pm.achievementArray.length];
	//if ( Wizards.Utils.DEBUG ) Debug.Log(pm.achievementArray.length);
	for (var i:int=0;i<pm.achievementArray.length;i++)
	{
		achievementArray[i]=pm.GetAchievement(i);
	}
}

function Start()
{
	
	
	
}

function UnlockAchievement(_achievement:Achievement)
{
	var am:AudioManager =AudioManager.Instance();
	if ( Wizards.Utils.DEBUG ) Debug.Log("ACHIEVEMENT STATUS : " + achievementArray[_achievement]);
	if ( achievementArray[_achievement] == 0 )
	{
		pm.SetAchievement(_achievement,1);
		achievementArray[_achievement]=1;
		notice.ShowMessage("Achievement: "+pm.achievementArray[_achievement].title,1, am.audience[0]);
		// Countly.Instance.MyPostEvent("Achievement:" + pm.achievementArray[_achievement].title);
		
		//am.PlayOneShotAudio(am.audience[0],am.audienceVol);
	}
}

function CheckSecrects()
{
	if (achievementArray[Achievement.No_stone_unturned]!=0)
	{
		return;
	}
	
	var getAll:boolean=true;
	for (var i:int=0;i<pm.secrectArray.length;i++)
	{
		if (pm.GetSecrect(i) ==0)
		{
			getAll=false;
			break;
		}
	}
	
	if (getAll)
	{
		UnlockAchievement(Achievement.No_stone_unturned);
	}
}

 //Used for debugging secrents / achievement for finding all secrets
#if UNITY_EDITOR
function Update()
{
	if ( Input.GetKeyDown(KeyCode.O) )
	{
		for (var i:int=0;i<pm.secrectArray.length;i++)
		{	
			pm.SetSecrect(i, 1);
		}
		
		for (var j : int = 0; j < achievementArray.length; i++)
		{	
			pm.SetAchievement(j, 1 );
		}
		
		PlayerPrefs.Save();
	}
}
#endif


function LateUpdate () 
{
	var gm:GameManager=GameManager.Instance();
	if (gm.perfectChainCount >=10 && achievementArray[Achievement.Not_Bad]==0)
	{
		UnlockAchievement(Achievement.Not_Bad);
	}
	
	if (gm.currentComboCount>=40 && achievementArray[Achievement.Not_bad_at_all]==0)
	{
		UnlockAchievement(Achievement.Not_bad_at_all);
	}
	
	if (gm.totalFireWorks>=1000 && achievementArray[Achievement.Super_Detonator]==0)
	{
		UnlockAchievement(Achievement.Super_Detonator);
	}
	
	if (gm.chainCount>=200 && achievementArray[Achievement.No_Escape]==0)
	{
		UnlockAchievement(Achievement.No_Escape);
	}
	
	/*
	if (pm.GetTempRecord(Record.LifeTimePerfect) >=10 && achievementArray[Achievement.BeginnerPerfect]==0)
	{
		UnlockAchievement(Achievement.BeginnerPerfect);
	}
	
	if (gm.currentComboCount>=8 && achievementArray[Achievement.HighCombo]==0)
	{Achievement
		UnlockAchievement(Achievement.HighCombo);
	}
	
	if (gm.chainCount>=20 && achievementArray[Achievement.HighChain]==0)
	{
		UnlockAchievement(Achievement.HighChain);
	}
	
	if (pm.GetTempRecord(Record.LifeTimePerfect)>=50 && achievementArray[Achievement.HighPerfect]==0)
	{
		UnlockAchievement(Achievement.HighPerfect);
	}
	
	if (gm.currentComboCount>=15 && achievementArray[Achievement.ProCombo]==0)
	{
		UnlockAchievement(Achievement.ProCombo);
	}
	
	if (gm.chainCount>=50 && achievementArray[Achievement.ProChain]==0)
	{
		UnlockAchievement(Achievement.ProChain);
	}
	
	if (pm.GetTempRecord(Record.LifeTimePerfect)>=100 && achievementArray[Achievement.ProPerfect]==0)
	{
		UnlockAchievement(Achievement.ProPerfect);
		
	}
	
	if (pm.GetTempRecord(Record.LifeTimePerfect)+pm.GetTempRecord(Record.LifeTimeGood)+pm.GetTempRecord(Record.LifeTimePoor)>=100 && achievementArray[Achievement.FW_100]==0)
	{
		UnlockAchievement(Achievement.FW_100);
	}
	
	if (pm.GetTempRecord(Record.LifeTimePerfect)+pm.GetTempRecord(Record.LifeTimeGood)+pm.GetTempRecord(Record.LifeTimePoor)>=300 && achievementArray[Achievement.FW_300]==0)
	{
		UnlockAchievement(Achievement.FW_300);
	}
	
	if (pm.GetTempRecord(Record.LifeTimePerfect)+pm.GetTempRecord(Record.LifeTimeGood)+pm.GetTempRecord(Record.LifeTimePoor) >=500 && achievementArray[Achievement.FW_500]==0)
	{
		UnlockAchievement(Achievement.FW_500);
	}
	*/
}