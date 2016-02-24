var startDelay : float = 1.0;

var fadeTime : float = 1.0;

var mySprite : exSprite;

var isRunning : boolean = false;

var monitor : float = 0.0;

function Awake()
{
	mySprite = GetComponent(exSprite);
	if ( mySprite == null )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Sprite is null");
	}
	monitor = mySprite.color.r;
}

function Start()
{
	FadeToBlack();
}

function FadeToBlack()
{
	yield WaitForSeconds(startDelay);
	isRunning = true;
	
	while ( mySprite.color.r > 0.0 )
	{
		monitor = mySprite.color.r;
		mySprite.color.r -= Time.deltaTime * ( 1 / fadeTime );
		mySprite.color.g -= Time.deltaTime * ( 1 / fadeTime );
		mySprite.color.b -= Time.deltaTime * ( 1 / fadeTime );
		yield;
	}
}