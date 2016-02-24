enum FairyState
{
	Idle,
	Moving
}

var state:FairyState;

var callback:Function;

var targetPos:Vector3;

var movingRadius:float;

var minMoveTime:float;
var maxMoveTime:float;

var core:ParticleEmitter;

var spriteAnimation:exSpriteAnimation;

var useTargetPos : boolean = false;

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

function Shake()
{
	//iTween.Stop(this.gameObject);
	iTween.PunchPosition(transform.parent.gameObject,iTween.Hash("x",2,"time",1,"oncompletetarget",this.gameObject,"oncomplete","SetIdle"));
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
	
	
	if ( useTargetPos )
	{
		dest.x=targetPos.x + (tempX*Mathf.Cos(rad)-tempY*Mathf.Sin(rad));
		dest.y=targetPos.y + (tempX*Mathf.Sin(rad)+tempY*Mathf.Cos(rad));
	}
	else
	{
		dest.x=tempX*Mathf.Cos(rad)-tempY*Mathf.Sin(rad);
		dest.y=tempX*Mathf.Sin(rad)+tempY*Mathf.Cos(rad);
	}
	
	
	var	time:float = Random.Range(minMoveTime, maxMoveTime);
	
	//speed = Random.Range(minMoveSpeed, maxMoveSpeed);
	
	iTween.MoveTo(this.gameObject, iTween.Hash("islocal", true, "x", dest.x, "y", dest.y, "time", time, "oncomplete", "Move", "easeType", iTween.EaseType.easeInOutSine));
}

function Start()
{
	Move();
}

function SetBack(_deg:float)
{
	spriteAnimation.Play("fairy");
	spriteAnimation.SetFrame("fairy",1);
	spriteAnimation.Pause();
	spriteAnimation.transform.rotation.eulerAngles.z=_deg;
}

function SetCog()
{
	spriteAnimation.Play("fairy");
	spriteAnimation.SetFrame("fairy",0);
	spriteAnimation.Pause();
}