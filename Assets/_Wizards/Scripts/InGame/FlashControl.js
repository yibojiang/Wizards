var sprite : exSprite;

var currentAlpha : float = 0.0;

var flashAlphaMax : float = 0.8;
var flashAlphaDelta : float = 0.1;
var flashDecreaseRate : float = 1.0;

function Start()
{
	sprite = GetComponent(exSprite);
	GetComponent.<Renderer>().enabled = false;
}

function Update ()
{
	if ( currentAlpha > 0.0 )
	{
		currentAlpha -= Time.deltaTime * flashDecreaseRate;
		sprite.color.a = currentAlpha;
	}
	else
	{
		GetComponent.<Renderer>().enabled = false;
	}
}

function doFlash()
{
	currentAlpha += flashAlphaDelta;
	if ( currentAlpha > flashAlphaMax )
	{
		currentAlpha = flashAlphaMax;
	}
	GetComponent.<Renderer>().enabled = true;
}