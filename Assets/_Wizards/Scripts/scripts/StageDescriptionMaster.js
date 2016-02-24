enum EStageRank
{
	Inactive,
	Bronze,
	Silver,
	Gold,
	Perfect
}

enum EStageLevel
{
	StageZero,
	StageOne,
	StageTwo,
	StageThree,
	StageFour,
	StageFive,
	StageSix,
	StageSeven,
	StageEight,
	StageNine,
	StageTen,
	StageEleven,
	StageTwelve,
	StageThirteen
}

class StageColour
{
	var topColour : Color;
	var botColour : Color;
	var outlineColour : Color;
}

var debugMode : boolean = false;

var stageInactiveColour : StageColour;
var stageBronze : StageColour;
var stageSilver : StageColour;
var stageGold : StageColour;

var stageDescriptions : GameObject[];

function Awake()
{

}

function Start()
{
	stageDescriptions = GameObject.FindGameObjectsWithTag("StageDescription");
	
	SetupColours();
}

function Update ()
{
	if ( debugMode )
	{
		SetupColours();
	}
}

function SetupColours()
{
	for ( var stage : GameObject in stageDescriptions )
	{
		var s : StageDescriptionControl = stage.GetComponent(StageDescriptionControl) as StageDescriptionControl;
	
		s.SetStageInactiveColour(stageInactiveColour);
		s.SetStageBronzeColour(stageBronze);
		s.SetStageSilverColour(stageSilver);
		s.SetStageGoldColour(stageGold);
		
		s.stageName = "STAGE " + parseInt(s.stageLevel);
		
		if ( debugMode )
		{
			s.SetRank(EStageRank.Silver);
		}
		else
		{
			s.SetRank(EStageRank.Inactive);
		}
	}
}

function ApplyStageAward(_stage : EStageLevel, _rank : EStageRank )
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("STAGE : " + _stage);
	if ( Wizards.Utils.DEBUG ) Debug.Log("RANK : " + _rank);
	for ( var stage : GameObject in stageDescriptions )
	{
		var s : StageDescriptionControl = stage.GetComponent(StageDescriptionControl) as StageDescriptionControl;
		
		if ( s.stageLevel == _stage )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("FOUND STAGE : " + _stage);
			s.SetRank(_rank);
		}
	}
}