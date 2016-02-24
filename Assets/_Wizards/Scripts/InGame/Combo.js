var rotateSpeed : float = 10.0;
var growSpeed : float = 10.0;

var maxSize : float = 10.0;

var explodeTimer : float = 1.0;


private var spriteAnimation:exSpriteAnimation;
private var exsprite:exSprite;
private var myTransform:Transform;

function Awake()
{
	spriteAnimation=GetComponent(exSpriteAnimation);
	exsprite=GetComponent(exSprite);
	myTransform=this.transform;
}

function Start()
{
	growSpeed = 2.0;
	rotateSpeed = 1000.0;
}

function Init(_rating:int)
{
	this.gameObject.SetActiveRecursively(true);
	
	transform.localEulerAngles.z = 0.0;
	exsprite.color.a=1.0;
	explodeTimer=1.0;
	myTransform.localScale=Vector3(0.5,0.5,0.5);
	SetComboRating(_rating);
	
}

function SetComboRating(_rating : int)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log("setFRame Message Received");
	spriteAnimation.Play("combo");
	spriteAnimation.SetFrame("combo", _rating);
	spriteAnimation.Pause();
	
}

function DoDestroy()
{
	this.gameObject.SetActiveRecursively(false);
}

function Update ()
{
	if ( myTransform.localScale.x < maxSize )
	{
		myTransform.localScale *= (1 + (growSpeed * Time.deltaTime));
		myTransform.Rotate(Vector3(0.0, 0.0, rotateSpeed * Time.deltaTime));
	}
	else
	{
		if ( myTransform.localEulerAngles.z > 10.0 && myTransform.localEulerAngles.z < 350.0 )
		{
			myTransform.Rotate(Vector3(0.0, 0.0, rotateSpeed * Time.deltaTime));
		} 
		else
		{
			myTransform.localEulerAngles.z = 0.0;
			explodeTimer -= Time.deltaTime;
			
			myTransform.localScale *= 1.01;
			exsprite.color.a -= 0.015;
			
			if ( explodeTimer < 0.0 )
			{
				DoDestroy();
				//Destroy(this.gameObject);
			}
		}
	}
}