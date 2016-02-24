var pm:ProfileManager;
var notice:NoticeBox;
var achievementArray:int[];

private var am : AudioManager;

function Start()
{
	am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	//Save temp data
	achievementArray=new int[pm.achievementArray.length];
	//if ( Wizards.Utils.DEBUG ) Debug.Log(pm.achievementArray.length);
	for (var i:int=0;i<pm.achievementArray.length;i++)
	{
		achievementArray[i]=pm.GetAchievement(i);
	}
	
	
}

function UnlockAchievement(_achievement:Achievement)
{
	pm.SetAchievement(_achievement,1);
	achievementArray[_achievement]=1;
	notice.ShowMessage("Achievement: "+pm.achievementArray[_achievement].title,1);
	am.PlayOneShotAudio(am.audience[0],am.audienceVol);
	
	// Countly.Instance.MyPostEvent("Achievement:" + pm.achievementArray[_achievement].title);
}

function Update () 
{

}