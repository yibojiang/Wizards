private var starBurst : GameObject;
private var starBurstSprite : exSprite;
var starBurstFadeRate : float = 2.0;
var growRate : float = 1.01;
var starBurstStartAlpha = 0.5;

var burstStartScale : float = 0.6;
var starBurstFragment : GameObject;
var numFragments : float = 0.0;
var startRadius : float = 3.043311;
var rotationAdjust : float = 0.0;
private var radius : float = 0.0;
private var startAngle : float = 0.0;
var angleCorrection : float = 90.0;
var zOffSet : float = -6.0;

var startAlpha : float = 1.0;
var endAlpha : float = 0.0;
var fadeOutSpeed : float = 1.0;
var lerpValue : float = 0.0;
private var fadeOutTime : float = 0.0;

var moveSpeed : float = 1.0;

private var angleGap : float = 0.0;
private var fragmentList : Array;
 var currentAlpha : float;

var debug : boolean = false;

var disableFlash : boolean = false;

var canProcess : boolean = false;

function Start()
{
	fragmentList = new Array();
	
	angleGap = 360.0 / numFragments;
		
	for ( var i : int = 0; i < numFragments ; ++i )
	{
		var fragment : GameObject = Instantiate(starBurstFragment, Vector3.zero, Quaternion.identity);
		fragmentList.Add(fragment);		
	}
	
	//starBurst = GetComponentInChildren(GameObject);
	
	if ( !disableFlash )
	{
		starBurstSprite = GetComponentInChildren(exSprite);
		//starBurstSprite.gameObject.active = false;
	}
	
	Init();
	Disable();
	
	if ( debug )
	{
		Explode(transform.position);
	}
		
	//UpdateFragments();	
}

function Init()
{
	lerpValue = 0.0;
	radius = startRadius;
	currentAlpha = 1.0;
 	//fadeOutTime = fadeTime;
	
	var offset : float = 90.0 - (360 / numFragments);
	
	if ( !disableFlash )
	{
		starBurstSprite.gameObject.active = true;
		starBurstSprite.color.a = starBurstStartAlpha;
		starBurstSprite.gameObject.transform.localScale = Vector3(burstStartScale,burstStartScale,burstStartScale);
		starBurstSprite.gameObject.transform.position.z = zOffSet - 1.0;
	}
	
	startAngle = transform.eulerAngles.z + offset;
	
	var currentAngle : float = startAngle + rotationAdjust;
	
	for ( var frag : GameObject in fragmentList )
	{
		frag.transform.eulerAngles = Vector3(0.0, 0.0, currentAngle + angleCorrection);
		currentAngle += angleGap;
	}
}

function Update ()
{
	if ( canProcess )
	{
		if ( !disableFlash )
		{
			UpdateStarBurst();
		}
	
		UpdateFragments();
	}
}

function Explode(_pos : Vector3)
{
	transform.position = _pos;
	for ( var frag : GameObject in fragmentList )
	{
		frag.active = true;
	}
	if ( !disableFlash )
	{
		starBurstSprite.gameObject.active = true;
	}
	//renderer.enabled = true;
	canProcess = true;
	//UpdateFragments();
}

function UpdateStarBurst()
{
	if ( starBurstSprite.color.a > 0.0 )
	{
		starBurstSprite.color.a -= Time.deltaTime * starBurstFadeRate;
		starBurstSprite.gameObject.transform.localScale += Vector3(1.0,1.0,1.0) * Time.deltaTime * growRate;
	}
}

function UpdateFragments()
{
	radius += moveSpeed * Time.deltaTime;
	
	lerpValue += fadeOutSpeed * Time.deltaTime;
	
	//fadeOutTime -= Time.deltaTime;
		
	currentAlpha = Mathf.Lerp(startAlpha, endAlpha, lerpValue);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("ALPHA: " + currentAlpha); //- Make the alpha fade from 1->0
	
	var currentAngle : float = startAngle + rotationAdjust;
	
	for ( var frag : GameObject in fragmentList )
	{
		frag.transform.position.x = transform.position.x + (radius * Mathf.Cos(currentAngle * Mathf.Deg2Rad));
		frag.transform.position.y = transform.position.y + (radius * Mathf.Sin(currentAngle * Mathf.Deg2Rad));
		frag.transform.position.z = zOffSet;
		
		var sprite : exSprite = frag.GetComponent(exSprite);
		sprite.color.a = currentAlpha;
		
		currentAngle += angleGap;
	}
	
	if ( currentAlpha <= 0.0 )
	{
		if ( debug == true )
		{
			Init();
		}
		else
		{
			Disable();
			
		}
	}
}

function Disable()
{
	canProcess = false;
	//renderer.enabled = false;
	Init();
	
	if ( !disableFlash )
	{
		starBurstSprite.gameObject.active = false;
	}
	
	for ( var frag : GameObject in fragmentList )
	{
		frag.active = false;
	}
}