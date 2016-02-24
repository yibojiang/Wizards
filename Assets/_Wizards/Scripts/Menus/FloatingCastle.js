var startLocation : Vector3;

var topLeftLimit : Vector2;
var lowerRightLimit : Vector2;

var minMoveSpeed : float = 1.0;
var maxMoveSpeed : float = 10.0;

var minMoveTime : float = 4.0;
var maxMoveTime : float = 10.0;

var dest : Vector3;
var time : float = 0.0;
var speed : float = 0.0;

function Start()
{
	startLocation = transform.position;
	Move();

}

function Move()
{
	//yield WaitForSeconds(2.0);
	
	dest.x = Random.Range(topLeftLimit.x, lowerRightLimit.x);
	dest.y = Random.Range(topLeftLimit.y, lowerRightLimit.y);
	
	time = Random.Range(minMoveTime, maxMoveTime);
	
	speed = Random.Range(minMoveSpeed, maxMoveSpeed);
	
	iTween.MoveTo(this.gameObject, iTween.Hash("islocal", true, "x", dest.x, "y", dest.y, "time", time, "speed", speed, "oncomplete", "Move", "easeType", iTween.EaseType.easeInOutSine));
}

function CancelMove()
{
	iTween.Stop(this.gameObject);
}

function StartMove()
{
	Move();
}