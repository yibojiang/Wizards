var fillSpeed : float = 5.0;

var playTime : float = 4.0;
var pm : ProfileManager;
var gm : GameManager;
var layerManager:LayerManager;

var javiToto:exSprite;
var master:exSprite;
var gameOver:boolean;

var wm:WizardLevelManager;
var timerController:TimerController;

var am:AudioManager;
function Awake()
{

	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager) as LayerManager;
}

function Start()
{
	
}

function Init()
{
	//var llm:NewLevelLayersManager=GameObject.Find("LevelLayersManager").GetComponent(NewLevelLayersManager) as NewLevelLayersManager;
	//llm.FailDialog();
	
	master.color.a = 0.0;
	javiToto.color.a = 0.0;
	
	pm.SetTempRecord(Record.PlayTimes,pm.GetTempRecord(Record.PlayTimes)+1);
	if ( Wizards.Utils.DEBUG ) Debug.Log("MASTER VOICE MODE: " + (pm.GetTempRecord(Record.PlayTimes) % 5));
	var random:int;
	if (pm.GetTempRecord(Record.PlayTimes) % 5 ==0)
	{
		random=Random.Range(8,10);
		am.PlayAudioDelay(am.masterVoice[random],am.voiceVol,0.5);
	}
	else
	{
		random=Random.Range(6,8);
		am.PlayAudioDelay(am.masterVoice[random],am.voiceVol,0.5);
	}
}


function Update ()
{
	//GamePause();
	if ( master.color.a < 1.0 )
	{
		
		master.color.a += fillSpeed * Time.fixedDeltaTime;
		javiToto.color.a += fillSpeed * Time.fixedDeltaTime;
	}
	else
	{
		if (!gameOver)
		{
			gameOver=true;	
			//Save ALL THE RECORD
			//pm.SetLifeTimeScore(pm.GetLifeTimeScore()+pm.GetGameScore());
			
			//pm.SetRecord(Record.GameHeight,layerManager.travelHeight);
			pm.SetTempRecord(Record.GameHeight,layerManager.travelHeight);
			
			pm.SaveAllRecord();
			
			var itemMask:int=pm.GetSpecialItemmask();
			var fairyMask:int=ItemMask.Fairy;
			
			if (itemMask & fairyMask)
			{
				itemMask=itemMask ^ fairyMask;
				pm.SetShopItemState("Fairy",ShopItemState.Available);
				pm.SetSpecialItemmask(itemMask);
			}
			timerController.AddTimer(3,this.gameObject,"GameOver",true);
		}

	}
}


function GameOver()
{
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",2,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","GetoMapScroll") );
}

function GetoMapScroll()
{
	pm.SetNextLevelToLoad("GameOver");
	Application.LoadLevel("LevelLoader");
}

function GamePause()
{
	Time.timeScale=0;
}

