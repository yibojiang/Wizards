import System.Collections.Generic;

var target:GameObject;
var button:GameObject;
var result:GameObject;
var pm:ProfileManager;

var TextMissCount:exSpriteFont;
var TextPoorCount:exSpriteFont;
var TextGoodCount:exSpriteFont;
var TextPerfectCount:exSpriteFont;
var TextMaxComboCount:exSpriteFont;
var TextMaxChainCount:exSpriteFont;
var TextScoreCount:exSpriteFont;

var TextRank:exSpriteFont;

var resultShowInterval:float;
var am:AudioManager;

var particleEffect:GameObject;

var showed:boolean;
var newbest:GameObject;

var mrb:exSpriteAnimation;
var toto:exSpriteAnimation;
var javi:exSpriteAnimation;

//Rank, Level Related
var curLevel:int=0;


var pointsText:exSpriteFont;
var pointsArea:GameObject;

var downtownButton:GameObject;

var path:PlayerPath;

var resultFader : GameObject;

var resultsOther : Component[];
var results : Component[];

var fadeSpeed : float = 1.0;

var fadeInResults : boolean = false;
var fadeOutResults : boolean = false;

// Target Ex
var targetEx : GameObject;
var camMoveTime : float;
var camMoveType : iTween.EaseType;

var stageDetails : Array;

var fadeOutDetails : boolean = false;

private var sDM : StageDescriptionMaster;

var vel : float = 0.0;
var smoothTime : float = 0.2;
var maxSpeed : float = 10.0;

private var expBar : ExperienceBar;
private var wLM : WizardLevelManager;

function Awake()
{
	wLM = GameObject.Find("WizardLevelManager").GetComponent(WizardLevelManager) as WizardLevelManager;
	sDM = GameObject.Find("StageDescriptionMaster").GetComponent(StageDescriptionMaster) as StageDescriptionMaster;
	expBar = GameObject.Find("ExperienceBar").GetComponent(ExperienceBar) as ExperienceBar; 
}

function ShowFace(_face:Face)
{
	SetFace(javi,_face);
	SetFace(toto,_face);
	SetFace(mrb,_face);
	iTween.MoveTo(javi.gameObject,iTween.Hash("islocal",true,"x",7,"time",1,"easetype",iTween.EaseType.easeOutQuad));
	iTween.MoveTo(toto.gameObject,iTween.Hash("islocal",true,"x",-7,"time",1,"easetype",iTween.EaseType.easeOutQuad));
	iTween.MoveTo(mrb.gameObject,iTween.Hash("islocal",true,"x",-9,"time",1,"easetype",iTween.EaseType.easeOutQuad));
}

function ShowFace()
{
	iTween.MoveTo(javi.gameObject,iTween.Hash("islocal",true,"x",7,"time",1,"easetype",iTween.EaseType.easeOutQuad));
	iTween.MoveTo(toto.gameObject,iTween.Hash("islocal",true,"x",-7,"time",1,"easetype",iTween.EaseType.easeOutQuad));
	iTween.MoveTo(mrb.gameObject,iTween.Hash("islocal",true,"x",-9,"time",1,"easetype",iTween.EaseType.easeOutQuad));
}

function HideFace()
{
	iTween.MoveTo(javi.gameObject,iTween.Hash("islocal",true,"x",15,"time",1,"easetype",iTween.EaseType.easeInQuad));
	iTween.MoveTo(toto.gameObject,iTween.Hash("islocal",true,"x",-15,"time",1,"easetype",iTween.EaseType.easeInQuad));
	iTween.MoveTo(mrb.gameObject,iTween.Hash("islocal",true,"x",-15,"time",1,"easetype",iTween.EaseType.easeInQuad));
}


function SetFace(_spriteAnimation:exSpriteAnimation,_face:Face)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_face);
	switch(_face)
	{
	case Face.Normal:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 0);
		_spriteAnimation.Pause();

		break;
	case Face.Happy	:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 1);
		_spriteAnimation.Pause();
		break;
	case Face.Sad:
		_spriteAnimation.Play(_spriteAnimation.defaultAnimation.name);
		_spriteAnimation.SetFrame(_spriteAnimation.defaultAnimation.name, 2);
		_spriteAnimation.Pause();
		break;
	
	}
	
}

function Start()
{
	stageDetails = new Array();
	
	resultShowInterval=1.0;
	showed=false;
	
	result.transform.localPosition.y=20;
	button.transform.localPosition.y=-6;
	
	mrb.transform.localPosition.x=-15;
	toto.transform.localPosition.x=-15;
	javi.transform.localPosition.x=15;
	
	TextRank.text="";
	
	
	pointsArea.transform.localScale.x=0;
	pointsArea.transform.localScale.y=0;
	
	HideDowntownButton();
	
	GetResultSprites();
}

function GetResultSprites()
{
	results = resultFader.GetComponentsInChildren(exSpriteFont);
	resultsOther = resultFader.GetComponentsInChildren(exSprite);
}

function GetStageDetailSprites()
{
	var stageHolders : GameObject[] = GameObject.FindGameObjectsWithTag("StageDescription");
	
	for ( var holder : GameObject in stageHolders )
	{
		var sprites = holder.GetComponentsInChildren(exSpriteFont);
		
		for ( var spriteFont : exSpriteFont in sprites )
		{
			stageDetails.Add(spriteFont);
		} 
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("STAGE COUNT : " + stageDetails.length);
}



function Update () 
{
	var stopFadeIn : boolean = false;
	var stopFadeOut : boolean = false;
	
	if ( fadeOutDetails )
	{
		FadeOutStageDetails();
	}
	
	if ( fadeInResults )
	{
		FadeOutStageDetails();
		for ( var sprite : exSpriteFont in results )
		{
			
			if ( sprite != null )
			{
				if ( sprite.topColor.a < 1.0 )
				{
					sprite.topColor.a += fadeSpeed * Time.deltaTime;
					sprite.botColor.a += fadeSpeed * Time.deltaTime;
					sprite.outlineColor.a += fadeSpeed * Time.deltaTime;
					sprite.shadowColor.a  += fadeSpeed * Time.deltaTime;
				}
				else
				{
					stopFadeIn = true;
				}
			}
		}
		
		for ( var spr : exSprite in resultsOther )
		{
			
			if ( spr != null )
			{
				if ( spr.color.a < 1.0 )
				{
					spr.color.a += fadeSpeed * Time.deltaTime;
				}
				else
				{
					stopFadeIn = true;
				}
			}
		}
		
		
	}
	
	if ( fadeOutResults )
	{
		FadeInStageDetails();
		for ( var sprite : exSpriteFont in results )
		{
			if ( sprite != null )
			{
				if ( sprite.topColor.a > 0.0 )
				{
					sprite.topColor.a -= fadeSpeed * Time.deltaTime;
					sprite.botColor.a -= fadeSpeed * Time.deltaTime;
					sprite.outlineColor.a -= fadeSpeed * Time.deltaTime;
					sprite.shadowColor.a  -= fadeSpeed * Time.deltaTime;
				}
				else
				{
					stopFadeOut = true;
				}
			}
		}	
		
		for ( var spr : exSprite in resultsOther )
		{
			
			if ( spr != null )
			{
				if ( spr.color.a > 0.0 )
				{
					spr.color.a -= fadeSpeed * Time.deltaTime;
				}
				else
				{
					stopFadeIn = true;
				}
			}
		}
	}
	
	if ( stopFadeIn )
	{
		fadeInResults = false;
		fadeOutDetails = false;
	}
	
	if ( stopFadeOut )
	{
		fadeOutResults = false;
		fadeOutDetails = false;
	}
}

function FadeOutStageDetails()
{
	for ( var sprite : exSpriteFont in stageDetails )
	{
		if ( sprite != null )
		{
			//if ( Wizards.Utils.DEBUG ) Debug.Log("SPRITE: " + sprite.name);
			FadeOutStage(sprite.transform.parent.GetComponent(StageDescriptionControl).stageRank, sprite);
		}
	}
}

function FadeOutStage(_rank : EStageRank, _spriteFont : exSpriteFont)
{
	var maxAlphaTop : float = 0.0;
	var maxAlphaBot : float = 0.0;
	var maxAlphaOut : float = 0.0;
	
	switch ( _rank )
	{	
		case EStageRank.Bronze:
			maxAlphaTop = sDM.stageBronze.topColour.a;	
			maxAlphaBot = sDM.stageBronze.botColour.a;	
			maxAlphaOut = sDM.stageBronze.outlineColour.a;	
		break;
		
		case EStageRank.Silver:
			maxAlphaTop = sDM.stageBronze.topColour.a;	
			maxAlphaBot = sDM.stageBronze.botColour.a;	
			maxAlphaOut = sDM.stageBronze.outlineColour.a;	
		break;
		
		case EStageRank.Gold:
		case EStageRank.Perfect:
			maxAlphaTop = sDM.stageBronze.topColour.a;	
			maxAlphaBot = sDM.stageBronze.botColour.a;	
			maxAlphaOut = sDM.stageBronze.outlineColour.a;	
		break;
		
		
	}
	var spriteMaster : exSpriteFont = results[0];
	var vel : float;
	var smoothTime : float = 0.2;
	var maxSpeed : float = 0.1;
	
	//_spriteFont.topColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.topColor.a, 1- spriteMaster.topColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaTop);// fadeSpeed * Time.deltaTime;
	//_spriteFont.botColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.botColor.a, 1- spriteMaster.botColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaBot);
	//_spriteFont.outlineColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.outlineColor.a, 1- spriteMaster.outlineColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaOut);
	
	_spriteFont.topColor.a = Mathf.Lerp(0.0, maxAlphaTop, 1- spriteMaster.topColor.a);// fadeSpeed * Time.deltaTime;
	_spriteFont.botColor.a = Mathf.Lerp(0.0, maxAlphaBot, 1- spriteMaster.botColor.a);//Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.botColor.a, 1- spriteMaster.botColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaBot);
	_spriteFont.outlineColor.a = Mathf.Lerp(0.0, maxAlphaOut, 1- spriteMaster.outlineColor.a);//Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.outlineColor.a, 1- spriteMaster.outlineColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaOut);
	
	
	//_spriteFont.topColor.a
	
	
	//_spriteFont.botColor.a = Mathf.Lerp(0.0, maxAlphaBot, spriteMaster.topColor.a);
	//_spriteFont.outlineColor.a = Mathf.Lerp(0.0, maxAlphaOut, spriteMaster.topColor.a);
	//sprite.shadowColor.a  -= fadeSpeed * Time.deltaTime;	
}

function FadeInStageDetails()
{
	for ( var sprite : exSpriteFont in stageDetails )
	{
		if ( sprite != null )
		{
			FadeInStage(sprite.transform.parent.GetComponent(StageDescriptionControl).stageRank, sprite);
		}
	}
}

function FadeInStage(_rank : EStageRank, _spriteFont : exSpriteFont)
{
	var maxAlphaTop : float = 0.0;
	var maxAlphaBot : float = 0.0;
	var maxAlphaOut : float = 0.0;
	
	switch ( _rank )
	{	
		case EStageRank.Bronze:
			maxAlphaTop = sDM.stageBronze.topColour.a;	
			maxAlphaBot = sDM.stageBronze.botColour.a;	
			maxAlphaOut = sDM.stageBronze.outlineColour.a;	
		break;
		
		case EStageRank.Silver:
			maxAlphaTop = sDM.stageSilver.topColour.a;	
			maxAlphaBot = sDM.stageSilver.botColour.a;	
			maxAlphaOut = sDM.stageSilver.outlineColour.a;	
		break;
		
		case EStageRank.Gold:
		case EStageRank.Perfect:
			maxAlphaTop = sDM.stageGold.topColour.a;	
			maxAlphaBot = sDM.stageGold.botColour.a;	
			maxAlphaOut = sDM.stageGold.outlineColour.a;	
		break;
	}
	
	var spriteMaster : exSpriteFont = results[0];

	
	//_spriteFont.topColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.topColor.a, 1- spriteMaster.topColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaTop);// fadeSpeed * Time.deltaTime;
	//_spriteFont.botColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.botColor.a, 1- spriteMaster.botColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaBot);
	//_spriteFont.outlineColor.a = Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.outlineColor.a, 1- spriteMaster.outlineColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaOut);
	
	_spriteFont.topColor.a = Mathf.Lerp(0.0, maxAlphaTop, 1- spriteMaster.topColor.a);// fadeSpeed * Time.deltaTime;
	_spriteFont.botColor.a = Mathf.Lerp(0.0, maxAlphaBot, 1- spriteMaster.botColor.a);//Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.botColor.a, 1- spriteMaster.botColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaBot);
	_spriteFont.outlineColor.a = Mathf.Lerp(0.0, maxAlphaOut, 1- spriteMaster.outlineColor.a);//Mathf.Clamp(Mathf.SmoothDamp(_spriteFont.outlineColor.a, 1- spriteMaster.outlineColor.a, vel, smoothTime, maxSpeed),0.0, maxAlphaOut);

	
	
	//_spriteFont.botColor.a = Mathf.Lerp(0.0, maxAlphaBot, spriteMaster.topColor.a);
	//_spriteFont.outlineColor.a = Mathf.Lerp(0.0, maxAlphaOut, spriteMaster.topColor.a);
	//sprite.shadowColor.a  -= fadeSpeed * Time.deltaTime;	
}

function LateUpdate()
{
	if (target!=null)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting CAM TARGET");
		//iTween.MoveUpdate(this.gameObject,iTween.Hash("time",1,"x", target.transform.position.x,"y", target.transform.position.y));
		iTween.MoveUpdate(this.gameObject,iTween.Hash("time",2,"y", target.transform.position.y));
		//target = null;
	}
	
	if ( targetEx != null )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting CAM TARGET - Extended");
		//iTween.MoveUpdate(this.gameObject,iTween.Hash("time",camMoveTime,"y", targetEx.transform.position.y, "easetype", camMoveType));
		
		transform.position.y = targetEx.transform.position.y;
		if ( transform.position.y == targetEx.transform.position.y )
		{
			//targetEx = null;
		}
	}
}


function CaculateRank(_level:int):String
{
	return "Rank "+Mathf.Clamp((30-_level),0,30)+"\n"+pm.GetRankName( _level-1);
}

//level>=0
function GetLevelScoreByLevel(_level:int):int
{
	return (Mathf.Log(_level+1,2)*10000);
}

function CaculateLevel(_exp:int):int
{
	var level=0;
	while (_exp>=GetLevelScoreByLevel(level) )
	{
		_exp-=GetLevelScoreByLevel(level);
		level++;
	}
	return (level-1);
}

function GetScoreForNextLevel(_exp:int):int
{
	var level=0;
	while (_exp>=GetLevelScoreByLevel(level) )
	{
		_exp-=GetLevelScoreByLevel(level);
		level++;
	}
	return (GetLevelScoreByLevel(level)-_exp);
	
}

function GetStatistics()
{

	if (!showed)
	{
		
		showed=true;
		//PlayerPrefs.DeleteAll();//test
		
		//Current
		var missCount:int=pm.GetRecord(Record.GameMiss);
		var poorCount:int=pm.GetRecord(Record.GamePoor);
		var goodCount:int=pm.GetRecord(Record.GameGood);
		var perfectCount:int=pm.GetRecord(Record.GamePerfect);
		var maxComboCount:int=pm.GetRecord(Record.GameMaxCombo);
		var maxChainCount:int=pm.GetRecord(Record.GameMaxChain);	
		var heightCount:int=pm.GetRecord(Record.GameHeight);
		var scoreCount:int=pm.GetRecord(Record.GameScore);
		var lifeTimeScoreCount:int=pm.GetRecord(Record.LifeTimeScore);
		
		// Countly Stats
		
		// var newEvent : CountlyEvent = new CountlyEvent();

		// newEvent.Key = "GameMissCount";
		// newEvent.Count = 1;
		// newEvent.Sum = missCount;
		// Countly.Instance.PostEvent(newEvent);
		
		// newEvent.Key = "GamePoorCount";
		// newEvent.Count = 1;
		// newEvent.Sum = poorCount;
		// Countly.Instance.PostEvent(newEvent);
		
		// newEvent.Key = "GameGoodCount";
		// newEvent.Count = 1;
		// newEvent.Sum = goodCount;
		// Countly.Instance.PostEvent(newEvent);
		
		// newEvent.Key = "GamePerfectCount";
		// newEvent.Count = 1;
		// newEvent.Sum = perfectCount;
		// Countly.Instance.PostEvent(newEvent);
		
		// newEvent.Key = "GameScore";
		// newEvent.Count = 1;
		// newEvent.Sum = scoreCount;
		// Countly.Instance.PostEvent(newEvent);
		
		//Best
		var bestMaxComboCount:int=pm.GetRecord(Record.MaxCombo);
		var bestMaxChainCount:int=pm.GetRecord(Record.MaxChain);	
		var bestHeightCount:int=pm.GetRecord(Record.MaxHeight);
		var bestScoreCount:int=pm.GetRecord(Record.BestScore);

		//yield WaitForSeconds(resultShowInterval);
		TextPerfectCount.text=perfectCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextPerfectCount.gameObject);
		//Instantiate(particleEffect,TextPerfectCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextGoodCount.text=goodCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextGoodCount.gameObject);
		//Instantiate(particleEffect,TextGoodCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextPoorCount.text=poorCount.ToString(); 
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextPoorCount.gameObject);
		//Instantiate(particleEffect,TextPoorCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextMissCount.text=missCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextMissCount.gameObject);
		//Instantiate(particleEffect,TextMissCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextMaxComboCount.text=maxComboCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextMaxComboCount.gameObject);
		//Instantiate(particleEffect,TextMaxComboCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextMaxChainCount.text=maxChainCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextMaxChainCount.gameObject);
		//Instantiate(particleEffect,TextMaxChainCount.transform.position,Quaternion.identity);
		
		yield WaitForSeconds(resultShowInterval);
		TextScoreCount.text=scoreCount.ToString();
		am.PlayOneShotAudio(am.catBoardAudio[1],am.FXVol);
		PunchResult(TextScoreCount.gameObject);
		//Instantiate(particleEffect,TextScoreCount.transform.position,Quaternion.identity);
		

		//expBar.ShowExpIncrease();
		//yield WaitForSeconds(resultShowInterval);
		
		yield expBar.ShowExpIncrease();
		
		if (heightCount>bestHeightCount)
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("heightCount : " + heightCount);
			if ( Wizards.Utils.DEBUG ) Debug.Log("bestHeightCount : " + bestHeightCount);
			pm.SetRecord(Record.MaxHeight,heightCount);
		}
		
		if (maxComboCount>bestMaxComboCount)
		{
			pm.SetRecord(Record.MaxCombo,maxComboCount);
			var newBest:GameObject = Instantiate(newbest,TextMaxComboCount.transform.position,Quaternion.identity);
			newBest.transform.parent=TextMaxComboCount.transform.parent;
			newBest.transform.localPosition.x=-3.6;
			//iTween.ShakePosition(newBest,iTween.Hash("x",0.1,"y",0.1,"looptype",iTween.LoopType.loop));
		}
		
		if (maxChainCount>bestMaxChainCount)
		{
			pm.SetRecord(Record.MaxChain,maxChainCount);
			var newBest1:GameObject = Instantiate(newbest,TextMaxChainCount.transform.position,Quaternion.identity);
			newBest1.transform.parent=TextMaxChainCount.transform.parent;
			newBest1.transform.localPosition.x=-3.6;
			//iTween.ShakePosition(newBest1,iTween.Hash("x",0.1,"y",0.1,"looptype",iTween.LoopType.loop));
		}
		
		if (scoreCount>bestScoreCount)
		{ 
			pm.SetRecord(Record.BestScore,scoreCount);
			// if (GameCenterBinding.isGameCenterAvailable())
			// {
			// 	if (GameCenterBinding.isPlayerAuthenticated())
			// 	{
			// 		GameCenterBinding.reportScore(scoreCount,"story.highscore");
			// 	}
			// }
			var newBest3:GameObject = Instantiate(newbest,TextScoreCount.transform.position,Quaternion.identity);
			newBest3.transform.parent=TextScoreCount.transform.parent;
			newBest3.transform.localPosition.x=-3.6;
			//iTween.ShakePosition(newBest3,iTween.Hash("x",0.1,"y",0.1,"looptype",iTween.LoopType.loop));
			ShowFace(Face.Happy);
		}
		else
		{
			ShowFace(Face.Sad);
		}
		
		curLevel=CaculateLevel(lifeTimeScoreCount);
		TextRank.text=CaculateRank(curLevel);
		iTween.ScaleFrom(TextRank.gameObject,iTween.Hash("islocal",true,"x",10,"y",10,"time",0.7,"easetype",iTween.EaseType.easeInQuad));
		
		am.PlayOneShotAudio(am.stamp,am.FXVol);
		
		
		
		//var ptToNextLevel:int=GetScoreForNextLevel(lifeTimeScoreCount);
		//pointsText.text=ptToNextLevel+" Pts to go for the next LvUp";
		
		UpdateRewardText(curLevel);
		
		ShowPoints();
		
		ShowButton();
		
		GetResultSprites();
		
		targetEx = null;
	}
	

}

function PunchResult(_go : GameObject)
{
	iTween.PunchScale(_go, iTween.Hash("amount", Vector3(1.2,1.2,1.2), "time", 1.0));
}

function UpdateRewardText(_level : int)
{
	pointsText.text = wLM.GetNameOfNextLevelReward(_level);

	
	/*
	pointsText.text = "Unlock at Lvl " + (_level + 1) + " : ";
	if ( Wizards.Utils.DEBUG ) Debug.Log("CURRENT LEVEL = " + _level);
	
	var status : int = _level % 2;
	if ( Wizards.Utils.DEBUG ) Debug.Log("STATUS = " + status);
	
	if ( _level < 19 )
	{
		pointsText.text += "Health++"; 
	}
	
	if ( status % 2 != 0 && _level < 22)
	{
		pointsText.text += " & New FW!"; 
	}
	*/
	
}


function ShowPoints()
{
	//pointsArea.transform.localScale.y=0.03;
	iTween.ScaleTo(pointsArea,iTween.Hash("islocal",true,"x",1,"time",0.3,"easetype",iTween.EaseType.easeInOutQuad));
	iTween.ScaleTo(pointsArea,iTween.Hash("islocal",true,"y",1,"time",0.3,"easetype",iTween.EaseType.easeInOutQuad,"delay",0.4));
}

function HidePoints()
{
	iTween.ScaleTo(pointsArea,iTween.Hash("islocal",true,"y",0,"time",0.3,"easetype",iTween.EaseType.easeInOutQuad));
	iTween.ScaleTo(pointsArea,iTween.Hash("islocal",true,"x",0,"time",0.3,"easetype",iTween.EaseType.easeInOutQuad,"delay",0.4));
}


function SetTarget(_target:GameObject)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("SetTarget");
	target=_target;
}

function SetTargetEx(_target : GameObject, _moveTime : float, moveType : iTween.EaseType)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("SetTargetEX");
	targetEx = _target;
	camMoveTime = _moveTime;
	camMoveType = moveType;
}

function ShowResult()
{
	expBar.SetExpBarToPreviousScore();
	iTween.MoveTo(result,iTween.Hash("time",1,"islocal",true,"y",0,"easeType",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","GetStatistics") );
	fadeOutDetails = true;
}

function HideResult()
{
	iTween.MoveTo(result,iTween.Hash("time",1,"islocal",true,"y",30,"easeType",iTween.EaseType.spring) );
	HidePoints();
}

function ShowButton()
{
	path.mapTarget.transform.position.y=transform.position.y;
	SetTarget(path.mapTarget);
	if ( pm.IsUsingTallScreen() )
	{
		iTween.MoveTo(button,iTween.Hash("time",1,"islocal",true,"y",-2.5,"easeType",iTween.EaseType.spring) );
	}
	else
	{
		iTween.MoveTo(button,iTween.Hash("time",1,"islocal",true,"y",0,"easeType",iTween.EaseType.spring) );
	}
}

function HideButton()
{
	iTween.MoveTo(button,iTween.Hash("time",1,"islocal",true,"y",-9,"easeType",iTween.EaseType.spring) );
}

function ShowDowntownButton()
{
	iTween.MoveTo(downtownButton,iTween.Hash("time",1,"islocal",true,"y",0,"easeType",iTween.EaseType.spring) );
}

function HideDowntownButton()
{
	iTween.MoveTo(downtownButton,iTween.Hash("time",1,"islocal",true,"y",-9,"easeType",iTween.EaseType.spring) );
}

function ShowButtonAndResult()
{
	ShowFace();
	ShowButton();
	ShowResult();
	ShowPoints();
}

function PostFacebook()
{
	#if ENABLE_SOCIAL
	FacebookBinding.init("100295106777063");
	if (!FacebookBinding.isLoggedIn())
	{
		FacebookBinding.login();
		SocialNetworkingManager.facebookLogin+=PostScoreToFacebook;
	}
	else
	{
		PostScoreToFacebook();
	}
	#endif
	
}

function PostScoreToFacebook()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Upload to facebook");
	var scoreCount:int=pm.GetRecord(Record.GameScore);
	//var params:Hashtable=new Hashtable();
	var s:String="I got "+scoreCount+"pts in Wizards";
	/*
	params.Add("message",s);
	params.Add("link","http://itunes.apple.com/app/id409539284");
	params.Add("name","Wizards Prelude");
	params.Add("picture","https://si0.twimg.com/a/1337309881/images/oauth_application.png");
	*/
	//params["message"]=s;
	//params["link"]="http://itunes.apple.com/app/id409539284";
	//params["name"]="Wizards Prelude";
	//params["picture"]="https://si0.twimg.com/a/1337309881/images/oauth_application.png";
	//params["caption"]
	//params["description"]
	
	//FacebookBinding.postMessageWithLink("I got "+scoreCount+"pts in Wizards","https://www.facebook.com/WizardsPrelude","Wizards");
	//FacebookBinding.showPostMessageDialogWithOptions(params);
	
	var params = new Dictionary.<String, String>();
	params.Add("description",s);
	params.Add("link","http://itunes.apple.com/app/id409539284");
	params.Add("name","Wizards Prelude");
	params.Add("picture","https://si0.twimg.com/a/1337309881/images/oauth_application.png");
	//FacebookBinding.showDialog("apprequests",params);
	#if ENABLE_SOCIAL
	FacebookBinding.showDialog("feed",params);
	#endif
}

function PostTwitter()
{
	#if ENABLE_SOCIAL
	TwitterBinding.init("ykTOxsgyRPHhHbgigAGviw","vnEtXFXPklyJB9ED6BCcmINky67lrai9zdBuyTHQ");
	if (!TwitterBinding.isLoggedIn())
	{
		TwitterBinding.showOauthLoginDialog();
		SocialNetworkingManager.twitterLogin+=PostScoreToTwitter;
	}
	else
	{
		PostScoreToTwitter();
	}
	#endif
	
}

function PostScoreToTwitter()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Upload to twitter");
	var scoreCount:int=pm.GetRecord(Record.GameScore);
	//TwitterBinding.postStatusUpdate("I got "+scoreCount+"pts in Wizards","https://www.facebook.com/WizardsPrelude");
	#if ENABLE_SOCIAL
	TwitterBinding.showTweetComposer("I got "+scoreCount+"pts in Wizards"+" http://bit.ly/fb8v4r","https://si0.twimg.com/a/1337309881/images/oauth_application.png");
	#endif
}

function FadeOutResults()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FadeOutResults");
	fadeOutResults = true;
	fadeInResults = false;
}

function FadeInResults()
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("FadeInResults");
	fadeInResults = true;
	fadeOutResults = false;
}