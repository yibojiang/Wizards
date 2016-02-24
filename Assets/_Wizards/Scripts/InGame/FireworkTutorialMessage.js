private var spriteAnimation:exSpriteAnimation;
private var exsprite:exSprite;
private var myTransform:Transform;

var wait : exSprite;
var tap : exSprite;

var pulseSpeed : float = 5.0;

var scaleHolder : GameObject;

function Awake()
{
	spriteAnimation=GetComponent(exSpriteAnimation);
	exsprite=GetComponent(exSprite);
	myTransform=this.transform;
	
	Init();
}

function Init()
{
	transform.localEulerAngles.z = 0.0;
	exsprite.color.a=1.0;
	SetTutorialRating(0);
	// 0 = poor
	// 1 = good
	// 2 = perfect
	//DoPulse();
	
}

function DoPulse()
{
	iTween.ScaleTo(scaleHolder, iTween.Hash("scale", Vector3(1.4,1.4,1.4), "time", 0.1, "easetype", iTween.EaseType.easeInOutSine, "looptype", iTween.LoopType.pingPong));
}

function Update()
{
	
}

function SetTutorialRating(_rating : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("setFRame Message Received");
	spriteAnimation.Play("fwTutorial");
	spriteAnimation.SetFrame("fwTutorial", _rating);
	spriteAnimation.Pause();
	
	switch ( _rating )
	{
		case 0: // POOR
			wait.GetComponent.<Renderer>().enabled = true;
			tap.GetComponent.<Renderer>().enabled = false;
			//ShrinkWait
		break;
		
		case 1: // GOOD
			wait.GetComponent.<Renderer>().enabled = false;
			tap.GetComponent.<Renderer>().enabled = true;
			//DoTap();
			DoPulse();
		break;
		
		case 2: // PERFECT
			wait.GetComponent.<Renderer>().enabled = false;
			tap.GetComponent.<Renderer>().enabled = true;		
		break;
	}
}

function DoWait()
{
	while ( wait.GetComponent.<Renderer>().enabled == true )
	{
		yield FadeWait();
		yield ShowWait();
	}
}

function DoTap()
{
	while ( tap.GetComponent.<Renderer>().enabled == true )
	{
		yield FadeTap();
		yield ShowTap();
	}
}

function FadeWait()
{
	while ( wait.scale.x > 0.8 )
	{
		//wait.color.a -= Time.deltaTime * pulseSpeed;
		wait.scale.x -= Time.deltaTime * pulseSpeed;
		wait.scale.y -= Time.deltaTime * pulseSpeed;
		yield;
	}
}

function ShowWait()
{
	//while ( wait.color.a < 1.0 )
	while ( wait.scale.x < 1.0 )
	{
		//wait.color.a += Time.deltaTime * pulseSpeed;
		wait.scale.x += Time.deltaTime * pulseSpeed;
		wait.scale.y += Time.deltaTime * pulseSpeed;
		yield;
	}
}

function FadeTap()
{
	//while ( tap.color.a > 0.2 )
	while ( tap.scale.x > 0.8 )
	{
		//tap.color.a -= Time.deltaTime * pulseSpeed;
		tap.scale.x -= Time.deltaTime * pulseSpeed;
		tap.scale.y -= Time.deltaTime * pulseSpeed;
		yield;
	}
}

function ShowTap()
{
	//while ( tap.color.a < 1.0 )
	while ( tap.scale.x < 1.0 )
	{
		//tap.color.a += Time.deltaTime * pulseSpeed;
		tap.scale.x += Time.deltaTime * pulseSpeed;
		tap.scale.y += Time.deltaTime * pulseSpeed;
		yield;
	}
}