var hat : exSprite;
var hatCount : exSpriteFont;
var hatCountTotal : exSpriteFont;

var numHats : int = 0;

var hatEffect : ParticleEmitter;

var punchAmount : float = 0.25;

function Awake()
{
	hat = GetComponentInChildren(exSprite);
	//hatCount = GetComponentInChildren(exSpriteFont);
	hatEffect.emit = false;
}

function Start()
{
	HideHatCount();
}

function HideHatCount()
{
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("HIDING HATS");
	hat.GetComponent.<Renderer>().enabled = false;
	hatCount.GetComponent.<Renderer>().enabled = false;
	hatCountTotal.GetComponent.<Renderer>().enabled = false;
}

function ShowHatCount()
{
	if ( Wizards.Utils.DEBUG ) Debug.LogWarning("SHOWING HATS");
	hat.GetComponent.<Renderer>().enabled = true;
	hatCount.GetComponent.<Renderer>().enabled = true;
	hatCountTotal.GetComponent.<Renderer>().enabled = true;
}

function SetNumHats(_numHats : int)
{
	hatCount.text = "" + _numHats;
	numHats = _numHats;
}

function IncrementNumHats()
{
	numHats++;
	SetNumHats(numHats);
}

function AddNumHats(_numHats : int)
{
	numHats += _numHats;
	SetNumHats(numHats);
	hatEffect.emit = true;
	
	iTween.PunchScale(hatCount.gameObject, iTween.Hash("amount", Vector3(punchAmount,punchAmount,punchAmount), "time", 1.5));
	yield;
	hatEffect.emit = false;
}