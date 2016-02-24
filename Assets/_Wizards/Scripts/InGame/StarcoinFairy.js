
var state:FairyState;

var callback:Function;

var targetPos:Vector3;

var movingRadius:float;

var minMoveTime:float;
var maxMoveTime:float;

var core:ParticleEmitter;

var pm:ProfileManager;

var starcoin:GameObject;

var doubleStarcoins:boolean;

var TextStarCoinsCount:exSpriteFont;

function SetTargetPos(_pos:Vector3)
{
	targetPos=_pos;
}

function SetIdle()
{
	SetState(FairyState.Idle);
	core.emit=false;
}

function SetMoving()
{

	SetState(FairyState.Moving);
	core.emit=true;
}

function SetState(_state:FairyState)
{
	state=_state;
}

function Move()
{
	//yield WaitForSeconds(2.0);
	var dest:Vector2;
	//dest.x = Random.Range(topLeftLimit.x, lowerRightLimit.x);
	//dest.y = Random.Range(topLeftLimit.y, lowerRightLimit.y);
	
	var r:float=Random.Range(0,movingRadius);
	var rad:float=Random.Range(0,2*Mathf.PI);
	
	var tempX=r;
	var tempY=0;
	
	dest.x=tempX*Mathf.Cos(rad)-tempY*Mathf.Sin(rad);
	dest.y=tempX*Mathf.Sin(rad)+tempY*Mathf.Cos(rad);
	
	
	var	time:float = Random.Range(minMoveTime, maxMoveTime);
	
	//speed = Random.Range(minMoveSpeed, maxMoveSpeed);
	
	iTween.MoveTo(this.gameObject, iTween.Hash("islocal", true, "x", dest.x, "y", dest.y, "time", time, "oncomplete", "Move", "easeType", iTween.EaseType.easeInOutSine));
}

function Awake()
{

	var wandCode:int=pm.GetWandBitmask();
	var starcoinMask:int=WandMask.Starcoin;
	if (wandCode & starcoinMask)
	{
		doubleStarcoins=true;
	}
	else
	{
		doubleStarcoins=false;
	}
}

function Start()
{
	Move();
}

function Update () {

}

function OnTriggerEnter(hit : Collider)
{
	if ( hit.transform.tag == "StarCoin" )
	{
		hit.gameObject.GetComponent(StarCoin).Hit();
		
		if (doubleStarcoins)
		{
			pm.IncrementStarCoins(2);
		}
		else
		{
			pm.IncrementStarCoins(1);
		}
		//TextStarCoinsCount.text=""+ pm.GetGameStarCoinsCount();
		TextStarCoinsCount.text=""+ pm.GetTempRecord(Record.StarCoins);
		
		iTween.Stop(starcoin);
		starcoin.transform.localScale.x=1;
		starcoin.transform.localScale.y=1;
		starcoin.transform.rotation.eulerAngles.z=0;
		iTween.PunchScale(starcoin,iTween.Hash("x",1.1,"y",1.1,"time",1));
		iTween.PunchRotation(starcoin,iTween.Hash("z",360,"time",2));
		
	}
}