var maxHealth : float = 100.0;

var health : float = 0.0;
var displayHealth:float=0.0;

var startX : float = 0.0;

var startLerp : float = -7.1;
var endLerp : float = 0.0;

var exControl : exSprite;

private var left:exSprite;
private var right:exSprite;
private var mid:exSprite;

var leftValue:float=14;

function Awake()
{
	left=GameObject.Find("AudiencebarLeft").GetComponent(exSprite);
	right=GameObject.Find("AudiencebarRight").GetComponent(exSprite);
	mid=GameObject.Find("AudiencebarMid").GetComponent(exSprite);

}
function Start()
{
	//startX = transform.position.x;
	exControl = this.GetComponent(exSprite);
	
	
}

function Update ()
{
	if (Mathf.Abs(health- displayHealth)>0.5)
	{
		if (displayHealth>health)
		{
			var inc : float = 25*TimerController.realDeltaTime;
			
			if ( displayHealth - inc < displayHealth )
			{
				displayHealth = health;
			}
			else
			{
				displayHealth -= inc;
			}
		}
		else 
		{
			inc = 25*TimerController.realDeltaTime;
			
			if ( displayHealth + inc > displayHealth )
			{
				displayHealth = health;
			}
			else
			{
				displayHealth += inc;
			}
		}
	}
	else 
	{
		displayHealth=health;
	}

	//startLerp=( (maxHealth-leftValue)/100.0)*(-5.655192);
	startLerp=( (maxHealth-leftValue)/100.0)*(-7.1);
	left.transform.position.x=startLerp;
	right.transform.position.x=-startLerp;
	
	if (right.transform.position.x-left.transform.position.x>0)
	{
		//mid.transform.localScale.x=(right.transform.position.x-left.transform.position.x)/11.310384;
		mid.transform.localScale.x=(right.transform.position.x-left.transform.position.x)/11;
	}
	//mid.transform.localScale.x=(maxHealth)/(100);
	transform.localScale.x=displayHealth*0.01;
	//transform.localScale.x = displayHealth/maxHealth ;
	//transform.position.x = Mathf.Lerp(startLerp, endLerp, (displayHealth / maxHealth));
	//transform.position.x = mid.transform.position.x;
	transform.position.x = left.transform.position.x-left.width*left.scale.x+1;
	//transform.position.x= Mathf.Lerp( startLerp, endLerp, (displayHealth / maxHealth));
}


function SetHealth(_health : float,_maxHealth:float)
{
	health = _health;
	maxHealth=_maxHealth;
}

function SetColour(_color : Color)
{
	//renderer.material.color = _color;
	exControl.color = _color;
}	