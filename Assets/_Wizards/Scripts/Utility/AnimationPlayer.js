var anim : exSpriteAnimation;

var playOnStart : boolean = false;
var startDelay : float = 0.0;

var playRandomly : boolean = false;
var randomMinTime : float = 0.0;
var randomMaxTime : float = 1.0;

var fixedIntervalTime : float = 1.0;

var playDefaultAnimation : boolean = true;

function Awake()
{
	anim = GetComponent(exSpriteAnimation);
	
	if ( anim == null )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("No animation Component found!");
	}
}

function Start()
{
	if ( playOnStart )
	{
		PlayOnStart();
	}
	
	RunTimer();
}

function PlayOnStart()
{
	yield WaitForSeconds(startDelay);
	PlayAnimations();
}

function RunTimer()
{
	while ( true )
	{
		var yieldTime : float = 0.0;
		
		if ( playRandomly )
		{
			yieldTime = Random.Range(randomMinTime, randomMaxTime);
		}
		else
		{
			yieldTime = fixedIntervalTime;
		}
		
		yield WaitForSeconds(yieldTime);
		
		PlayAnimations();
	}
}

function PlayAnimations()
{
	if ( anim != null )
	{
		if ( playDefaultAnimation )
		{
			anim.PlayDefault();
		}
		else
		{
			if ( Wizards.Utils.DEBUG ) Debug.LogError("Playing non default animations Not Implemented");
		}
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("animation not found");
	}
}