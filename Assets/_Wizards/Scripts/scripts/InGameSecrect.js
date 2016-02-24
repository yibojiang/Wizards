var pm:ProfileManager;
var exanimation:exSpriteAnimation;
var exsprite:exSprite;
var secrect:Secrect;
var got:boolean=false;

var am:AudioManager;

var achievementManager:AchievementManager;

var notice:NoticeBox;

function Awake()
{
	notice=GameObject.Find("NoticeBox").GetComponent(NoticeBox) as NoticeBox;
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	exanimation=this.GetComponent(exSpriteAnimation) as exSpriteAnimation;
	exsprite=this.GetComponent(exSprite) as exSprite;
	
	
	var achievementObj:GameObject=GameObject.Find("AchievementManager");
	if (achievementObj!=null)
	{
		achievementManager=achievementObj.GetComponent(AchievementManager);
	}
	
	var amObj:GameObject=GameObject.Find("AudioManager");
	if (amObj!=null)
	{
		am=amObj.GetComponent(AudioManager) as AudioManager;
	}
	
}


function Start()
{
	exanimation.Play("Secrect");
	exanimation.SetFrame("Secrect",secrect);
	exanimation.Pause();
	
	
	if (pm.GetSecrect(secrect)==0)
	{
		this.gameObject.SetActiveRecursively(true);
	}
	else
	{
		this.gameObject.SetActiveRecursively(false);
		if (achievementManager!=null)
		{
			achievementManager.CheckSecrects();
		}
	}
	
	
	
	
}

function GetSecrect()
{
	if (got)
	{
		return;
	}
	got=true;
	
	pm.SetSecrect(secrect,1);

	notice.ShowMessage("You got a Secret !",1);
	
	// Countly.Instance.MyPostEvent("SecretFound:" + secrect.ToString());
	
	am.PlayOneShotAudio(am.javiVoice[2],am.voiceVol);
	
	if (achievementManager!=null)
	{
		achievementManager.CheckSecrects();
	}
}

function Update () 
{
	if (got)
	{
		exsprite.color.a-=Time.deltaTime;
		exsprite.scale.x+=0.3*Time.deltaTime;
		exsprite.scale.y+=0.3*Time.deltaTime;
	} 
	if (exsprite.color.a<=0)
	{
		GameObject.Destroy(this.gameObject);
	}
	
	
}