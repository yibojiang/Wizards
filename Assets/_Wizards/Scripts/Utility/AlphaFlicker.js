private var glowChangeDuration : float = 0.0;
private var glowChangeTimer : float = 0.0;
private var glowChangeDirection : float = 1.0;

private var glowChangeSpeed : float = 0.0;

var glowChangeSpeedMin : float = 1.0;
var glowChangeSpeedMax : float = 5.0;

var durationMin : float = 0.1;
var durationMax : float = 0.3;

var alphaMin : float = 0.3;
var alphaMax : float = 1.0;

function Awake()
{
	ResetTimer();	
}

function Update ()
{
	GetComponent.<Renderer>().material.color.a += ( glowChangeDirection * glowChangeSpeed * Time.deltaTime );
	//renderer.material.color.a += Random.Range(-0.01, 0.01);
	
	if ( GetComponent.<Renderer>().material.color.a > alphaMax )
	{
		GetComponent.<Renderer>().material.color.a = alphaMax;
	}
	
	if ( GetComponent.<Renderer>().material.color.a < alphaMin )
	{
		GetComponent.<Renderer>().material.color.a = alphaMin;
	}
	
	glowChangeTimer += Time.deltaTime;	
	
	if ( glowChangeTimer > glowChangeDuration )
	{
		ResetTimer();
	}
}

function ResetTimer()
{
	glowChangeDuration = Random.Range(durationMin, durationMax);
	glowChangeDirection *= -1.0;
	glowChangeTimer = 0.0;
	
	glowChangeSpeed = Random.Range(glowChangeSpeedMin, glowChangeSpeedMax);
}