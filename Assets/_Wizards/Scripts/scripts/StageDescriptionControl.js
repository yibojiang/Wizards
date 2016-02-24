var stageInactiveColour : StageColour;
var stageBronze : StageColour;
var stageSilver : StageColour;
var stageGold : StageColour;

var stageNameText : exSpriteFont;
var stageRankText : exSpriteFont;

var stageRank : EStageRank;

var stageName : String;
var stageLevel : EStageLevel;

function Awake()
{
	var info : Component[] = GetComponentsInChildren(exSpriteFont);
	
	for ( var sprite : exSpriteFont in info )
	{
		if ( sprite.name == "StageName" )
		{
			stageNameText = sprite;
		}
		
		if ( sprite.name == "StageRank" )
		{
			stageRankText = sprite;
		}
	}
}

function Start()
{
	stageNameText.text = stageName;
	//stageNameText.renderer.enabled = false;
	stageRankText.GetComponent.<Renderer>().enabled = false;
}

function SetStageInactiveColour(_stageInactiveColour : StageColour)
{
	stageInactiveColour = _stageInactiveColour;
}

function SetStageBronzeColour(_stageBronze : StageColour)
{
	stageBronze = _stageBronze;
}

function SetStageSilverColour(_stageSilver : StageColour)
{
	stageSilver = _stageSilver;
}

function SetStageGoldColour(_stageGold : StageColour)
{
	stageGold = _stageGold;
}

function SetRank(_stageRank : EStageRank)
{
	stageNameText.GetComponent.<Renderer>().enabled = true;
	stageRankText.GetComponent.<Renderer>().enabled = true;
	
	stageRank = _stageRank;
	
	ApplyRank(stageRank);
}

function ApplyRank(_rank : EStageRank)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Applying Rank : " + _rank);
	switch ( _rank )
	{
		case EStageRank.Inactive:
			ApplyColour(stageInactiveColour, stageNameText);
			ApplyColour(stageInactiveColour, stageRankText);
			stageRankText.text = "";
		break;
		
		case EStageRank.Bronze:
			ApplyColour(stageBronze, stageNameText);
			ApplyColour(stageBronze, stageRankText);
			stageRankText.text = "BRONZE";
		break;
		
		case EStageRank.Silver:
			ApplyColour(stageSilver, stageNameText);
			ApplyColour(stageSilver, stageRankText);
			stageRankText.text = "SILVER";
		break;
		
		case EStageRank.Gold:
			ApplyColour(stageGold, stageNameText);
			ApplyColour(stageGold, stageRankText);
			stageRankText.text = "GOLD";
		break;
		
		case EStageRank.Perfect:
			ApplyColour(stageGold, stageNameText);
			ApplyColour(stageGold, stageRankText);
			stageRankText.text = "PERFECT";
		break;
	}
}

function ApplyColour(_source : StageColour, _targetText : exSpriteFont)
{
	_targetText.topColor = _source.topColour;
	_targetText.botColor = _source.botColour;
	_targetText.outlineColor = _source.outlineColour;
}

