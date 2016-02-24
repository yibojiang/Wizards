var health : float;
var maxhealth : float;

var healthDropRate : float = 1.0;

var startX : float;

var localScaleMultiplier : float = 0.0096;

var positionModifier : float = 2.06;

var glowColourOne : Color;
var glowColourTwo : Color;

var glowColourThree : Color;
var glowColourFour : Color;


var colourLerp : float = 0.0;
var lerpDirection : float = 1.0;
var lerpSpeed : float = 1.0;

var ab : AudienceBar2;

var theColour : Color;

var pm : ProfileManager;

var heartUsed:boolean=false;
var isAlive:boolean=false;

var isLock:boolean=false;

var wizard:WizardControl;

var audienceBarSet:GameObject;

var test:boolean;

var gm:GameManager;

var filling:boolean;

var easyRestorePercent : float = 0.75;
var mediumRestorePercent : float = 0.5;
var hardRestorePercent : float = 0.25;

function Awake()
{
	audienceBarSet=GameObject.Find("AudienceBarSet");
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	wizard=GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
	gm=GameObject.Find("GameManager").GetComponent(GameManager) as GameManager;
}

function Start()
{
	
	/*
	startX = transform.position.x;
	
	if ( Screen.width >480 )
	{
		transform.localScale.y *= 2.0;
		guiTexture.pixelInset = Rect(-2,-16, 4, 32);
	}
	else
	{
		transform.localScale.y *= 1.0;
		transform.localScale.z *= 0.5;
		guiTexture.pixelInset = Rect(-1,-8, 2, 16);
	}
	*/
	
	
	//maxhealth = (pm.GetWizardLevel() * 2)+20;
	pm.transform.position.x=maxhealth;
	//maxhealth=100;
	if (maxhealth>100)
	{
		maxhealth=100;
	}
	
	health = maxhealth/2;
	
	isAlive=true;

}

function LockHealthBar()
{
	isLock=true;
}

function StageCompleteRestoreHealthBonus(_delay : float)
{
	yield WaitForSeconds(_delay);
	
	var difficulty : EDifficulty = pm.GetDifficultyLevel();
	
	var restoreAmount : int = 0;
	
	switch ( difficulty )
	{
		case EDifficulty.Easy:
			restoreAmount =  easyRestorePercent * maxhealth;
		break;
		
		case EDifficulty.Medium:
			restoreAmount =  mediumRestorePercent * maxhealth;
		break;


		case EDifficulty.Hard:
			restoreAmount =  hardRestorePercent * maxhealth;
		break;

	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("If required, Restore Health TO : " + restoreAmount);
	
	if ( health < restoreAmount )
	{
		SetHealth(restoreAmount);
	}
}

function Show()
{
	if ( pm.IsUsingTallScreen() )
	{
		iTween.MoveTo(audienceBarSet,iTween.Hash("y",2.5,"time",1,"easetype",iTween.EaseType.spring));
	}
	else
	{
		iTween.MoveTo(audienceBarSet,iTween.Hash("y",0,"time",1,"easetype",iTween.EaseType.spring));
	}
}

function Hide()
{
	iTween.MoveTo(audienceBarSet,iTween.Hash("y",7,"time",1,"easetype",iTween.EaseType.spring));
}

function UseHeart()
{
	iTween.ScaleTo(gm.heartObj,iTween.Hash("x",0,"y",0,"time",0.5,"ignoretimescale",true));
}

function Update ()
{
	if (test)
	{
		isLock=true;
	}
	//health=maxhealth;
	if (health>maxhealth*0.9)
	{
		wizard.EnableGlow();

	}
	else 
	{
		wizard.DisableGlow();
	}
	
	if (health>maxhealth)
	{
		health=maxhealth;
		heartUsed=false;
	}
	
	if (!isLock)
	{
	 	health-=healthDropRate*Time.deltaTime;
	 	
		//var heartLevel:int=pm.GetHeartLevel();
		//TODO: useItem time freeze!
		
		//heartLevel=1;
		
		if (filling)
		{
			Time.timeScale=0;
			
			if (ab.displayHealth==health)
			{
				filling=false;
				Time.timeScale=1;
			}
		}
		
		if (Time.timeScale==0)
		{
			iTween.Stop(audienceBarSet);	
		}
		
		if ( ab.displayHealth <= 0 )
		{
			
			if (gm.heartOn)
			{
				health=maxhealth;
				UseHeart();
				gm.heartOn=false;
				filling=true;
				
				var itemMask:int=pm.GetSpecialItemmask();
				
				var heartMask:int=ItemMask.Heart;
				if (itemMask & heartMask)
				{
					//if ( Wizards.Utils.DEBUG ) Debug.Log("done");
					itemMask=itemMask ^ heartMask;
					pm.SetShopItemState("Heart",ShopItemState.Available);
					pm.SetSpecialItemmask(itemMask);
				}
				
				
			}
			else
			{
				if (ab.displayHealth<=0)
				{
					isAlive=false;
				}
			}
			
			
			/*
			if (!heartUsed)
			{
				switch (heartLevel)
				{
				case 1:
					health = -1;
					break;
				case 2:
					health=maxhealth*0.2;
					break;
				case 3:
					health=maxhealth*0.4;
					break;
				case 4:
					health=maxhealth*0.8;
					break;
				default:
					health = -1;
					break;
				}
				heartUsed=true;
				
			}
			
			if (health<=0)
			{
				isAlive=false;
			}
			*/
			
			
		}
	}
	
	
	
	
	if ( GetApprovalPercentage() > 0.75 )
	{
		colourLerp += Time.deltaTime * lerpSpeed * lerpDirection;
		
		if ( colourLerp > 1.0 )
		{
			lerpDirection = -1.0;
			colourLerp = 1.0;
		}
		
		if ( colourLerp < 0.0 )
		{
			lerpDirection = 1.0;
			colourLerp = 0.0;
		}
		
		theColour = Color.Lerp(glowColourOne, glowColourTwo, colourLerp);
	}
	else
	{
		theColour=glowColourOne;
	}
	
	if ( ab.displayHealth < 20 )
	{
		colourLerp += Time.deltaTime * lerpSpeed * lerpDirection;
		
		if ( colourLerp > 1.0 )
		{
			lerpDirection = -1.0;
			colourLerp = 1.0;
		}
		
		if ( colourLerp < 0.0 )
		{
			lerpDirection = 1.0;
			colourLerp = 0.0;
		}
		
		theColour = Color.Lerp(glowColourThree, glowColourFour, colourLerp*0.5);
	}
	
	
	
	ab.SetColour(theColour);
	
	


	ab.SetHealth(health,maxhealth);
	maxhealth=pm.transform.position.x;
	
}

function IncreaseApproval(_amount : int)
{
	if (!isLock)
	{
		health += _amount;
		
		if ( health > maxhealth )
		{
			health = maxhealth;
		}
	}
}

function DecreaseApproval(_amount : int)
{
	if (!isLock)
	{
		health -= _amount;
		
		
		
		if ( health <= 0 )
		{
			health = 0;
		}
		else
		{
			iTween.ShakePosition(audienceBarSet, Vector3(1,0,0), 0.5);
		}
		
	}
}

function GetApproval() : int
{
	return ( Mathf.Ceil(health) );	
}

function GetApprovalPercentage() : float
{
	return ( Mathf.Ceil(health) / maxhealth );
}

function SetApproval(_amount : int)
{
	health = _amount;
}	

function SetMaxHealth(_health : int)
{
	pm.transform.position.x=_health;
	
	maxhealth = _health;
	if (maxhealth>100)
	{
		maxhealth=100;
	}
}

function SetHealth(_health : int)
{
	health = _health;
	if (health>100)
	{
		health=100;
	}
	
}

function GetMaxHealth() : int
{
	return ( maxhealth );
}

function LevelUp(_maxhealth:float)
{
	//isLock=true;

	//if ( Wizards.Utils.DEBUG ) Debug.Log(iTween.FloatUpdate(maxhealth,_maxhealth,Time.deltaTime));
	
	pm.transform.position.x=maxhealth;
	iTween.MoveTo(pm.gameObject, iTween.Hash("x",_maxhealth,"time",0.5,"easetype",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","FullHealth"));
	
	//yield WaitForSeconds(1);
	//isLock=false;
}

function FullHealth()
{
	health=maxhealth;
}


function SetDropRate(_dropRate:float)
{	
	healthDropRate=_dropRate;
}
/*
function spring(_start:float, _end:float, _value:float):float
{
	_value = Mathf.Clamp01(_value);
	_value = (Mathf.Sin(_value * Mathf.PI * (0.2f + 2.5f * _value * _value * _value)) * Mathf.Pow(1f - _value, 2.2f) + _value) * (1f + (1.2f * (1f - _value)));
	return _start + (_end - _start) * _value;
}
*/

function ToggleTest()
{
	test=!test;
}