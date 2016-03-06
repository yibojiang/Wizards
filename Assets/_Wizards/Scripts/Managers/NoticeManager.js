private var pm:ProfileManager;
var notice:NoticeBox;
var timerController:TimerController;
var newHighScoreShowed:boolean;

private var am : AudioManager;

function Awake()
{
	newHighScoreShowed=false;
	am = GameObject.Find("AudioManager").GetComponent.<AudioManager>();
	InvokeRepeating("CheckForNewHighScore", 2.0, 1.0);
	pm=ProfileManager.Instance();
}


function ShowNotice(_text:String)
{
	notice.ShowMessage(_text,1, am.audience[0]);
}

function CheckForNewHighScore()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Checking for new highscore");
	if (pm.GetTempRecord(Record.BestScore)<pm.GetTempRecord(Record.GameScore) && pm.GetTempRecord(Record.BestScore)>0 && !newHighScoreShowed)
	{
		newHighScoreShowed=true;
		ShowNotice("New High Score");
		CancelInvoke();
	}
}