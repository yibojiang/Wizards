private var gameCam : GameCamera;
private var pm : ProfileManager;

var minExpBarWidth : float;
var maxExpBarWidth : float;
var progressBarWidth : float;

var previousLevelScore : int;
var nextLevelScore : int;
var currentScore : int;

var totalScore : int;

var previousLevel : int;

var expBar : exSprite;

var previousLevelText : exSpriteFont;
var nextLevelText : exSpriteFont;

var maxIncrement : float = 50.0;
var time : float = 5.0;
var increment : float = 0.0;
var scoreRemaining : float = 0.0;

var rewardWaitTime : float = 1.0;
var rewardEffect : GameObject;
var effectPosition : Vector3;

function Awake()
{
	gameCam = GameObject.Find("TiltCamera").GetComponent(GameCamera) as GameCamera;
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
}

function Start()
{
	UpdateProgressBar();
}

function Update ()
{
	//UpdateProgressBar();
}

function UpdateProgressBar()
{
	totalScore = pm.GetRecord(Record.LifeTimeScore); // For debugging
	currentScore = pm.GetRecord(Record.LifeTimeScore);
	
	UpdateExpBar();
}

function SetExpBarToPreviousScore()
{
	totalScore = pm.GetRecord(Record.LifeTimeScore); // For debugging
	currentScore = pm.GetRecord(Record.LifeTimeScore) - pm.GetRecord(Record.GameScore);
	
	UpdateExpBar();
	
}

private function UpdateExpBar()
{
	previousLevel = gameCam.CaculateLevel(currentScore);
	previousLevelScore = 0;
	
	gameCam.UpdateRewardText(previousLevel);
	//gameCam.ShowPoints();
	
	for ( var i : int = 0; i <= previousLevel; ++i )
	{
		previousLevelScore += gameCam.GetLevelScoreByLevel(i);
	}
	nextLevelScore = previousLevelScore + gameCam.GetLevelScoreByLevel(previousLevel + 1);
	
	if ( (nextLevelScore - previousLevelScore) != 0 )
	{
		var lerpValue : float = (currentScore - previousLevelScore) * 1.0 / (nextLevelScore - previousLevelScore) * 1.0;
		progressBarWidth = Mathf.Lerp(minExpBarWidth, maxExpBarWidth, lerpValue);
	
		expBar.width = progressBarWidth;
	}
	
	UpdateLevelText();
}

function ShowExpIncrease()
{
	while ( currentScore < 	pm.GetRecord(Record.LifeTimeScore) )
	{
		if ( (nextLevelScore - previousLevelScore) != 0 )
		{
			var lerpValue : float = (currentScore - previousLevelScore) * 1.0 / (nextLevelScore - previousLevelScore) * 1.0;
			progressBarWidth = Mathf.Lerp(minExpBarWidth, maxExpBarWidth, lerpValue);
		
			expBar.width = progressBarWidth;
		}
		else
		{
			if ( Wizards.Utils.DEBUG ) Debug.LogWarning("DIVIDE BY ZERO!");
		}
		
		if ( expBar.width >= maxExpBarWidth	)
		{
			previousLevel++;
			previousLevelScore = 0;
	
			for ( var i : int = 0; i <= previousLevel; ++i )
			{
				previousLevelScore += gameCam.GetLevelScoreByLevel(i);
			}
			
			nextLevelScore = previousLevelScore + gameCam.GetLevelScoreByLevel(previousLevel + 1);
			UpdateLevelText();
			gameCam.UpdateRewardText(previousLevel);
			
			DoRewardEffect();
			
			yield WaitForSeconds(rewardWaitTime);
		} 
		
		scoreRemaining = pm.GetRecord(Record.LifeTimeScore) - currentScore;
	
		increment = scoreRemaining / time;
		
		if ( increment > maxIncrement )
		{
			increment = maxIncrement;
		}
		
		if ( increment > scoreRemaining )
		{
			increment = scoreRemaining;
		}
		
		if ( increment < 1 )
		{
			increment = 1;
		}
		
		currentScore+=increment;
		
		yield;
	}
	
	gameCam.ShowPoints();
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("FINISHED");
	//return ( 0 );
}

function DoRewardEffect()
{
	var go : GameObject = Instantiate(rewardEffect, effectPosition, Quaternion.identity);

	go.transform.parent = this.transform;
	
	go.transform.localPosition = effectPosition;
}

function UpdateLevelText()
{
	previousLevelText.text = "LV" + previousLevel;
	nextLevelText.text = "LV" + (previousLevel + 1);
}



