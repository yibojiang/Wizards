var RotateSpeed : float = 5.0;
var FallSpeed : float = 1.0;
var FallAcceleration  : float = 3.0;
var startX : float = 0.0;

var collected : GameObject;

var am : AudioManager;

private var myTransform:Transform;

var target:Transform=null;

private var wc : WizardControl;
private var tm : TutorialLevelManager;

function Awake()
{
	if ( GameObject.Find("TutorialLevelManager") != null )
	{
		tm = GameObject.Find("TutorialLevelManager").GetComponent(TutorialLevelManager) as TutorialLevelManager;
	}
	am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	wc = GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
	myTransform=transform;
	target=null;
}

function Start()
{
	
	startX=myTransform.position.x;
	FallAcceleration = Random.Range(2.0,6.0);
	FallSpeed = Random.Range(2.0,6.0);
}

function Init(_pos:Vector3)
{
	this.gameObject.SetActiveRecursively(true);
	startX = _pos.x;
	myTransform.position=_pos;
	FallAcceleration = Random.Range(2.0,6.0);
	FallSpeed = Random.Range(2.0,6.0);
}

function DoDestroy()
{
	this.gameObject.SetActiveRecursively(false);
}


function GetDistance(x1:float,y1:float,x2:float,y2:float):float
{
	return (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
}

function Update ()
{
	myTransform.Rotate(Vector3(0,0,RotateSpeed * Time.deltaTime));
	
	
	FallSpeed += Time.deltaTime * FallAcceleration;
	
	if (target)
	{
		
		myTransform.position = Vector3.Lerp ( myTransform.position, target.position,Time.deltaTime * 5.0);

	}
	else
	{
		myTransform.position.x = startX + Mathf.Sin(FallSpeed);
		
		myTransform.position.y -= FallSpeed * Time.deltaTime;
	}
	
	
	if ( transform.position.y < -60.0 )
	{
		//DoDestroy();
		Destroy(this.gameObject);
	}
	
	/*
	if ( Input.GetMouseButtonDown(0) )
	{
		var touchPos : Vector3 = Input.mousePosition;
		
		var ray : Ray = Camera.main.ScreenPointToRay(touchPos);
		var hit : RaycastHit;
		
		if ( Physics.Raycast(ray, hit, 100.0) )
		{
			if ( hit.transform == this.transform )
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("HIT");
				if ( tm != null )
				{
					
					//if (tm.tutorialStage>=TutorialStage.Stage5 && tm.stage4_flag>4)
	        		//{
	        		//	tm.starCoinCount++;
	        		//	tm.TextStarCoinsCount.text=""+tm.starCoinCount;
	        		//}
	        		// DONT ALLOW TAP?
				}
				else
				{
					Hit();
				}
			}
		}
	}
	*/
}

function Hit()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("StarCoin -> HIT()");
	if ( tm != null )
	{
		// We're in tutorial mode, do nothing
	}
	else
	{
	    if ( Wizards.Utils.DEBUG ) Debug.Log("Here is where we could add the FLY TO CORNER CODE...Instantiate star coin reward maybe?");
		wc.AddStarCoin();
		am.PlayAudio(SoundEffect.StarCoinCollect);
		Instantiate(collected, transform.position, Quaternion.identity);
		//DoDestroy();
		Destroy(this.gameObject);
	}
}

function BroomHit()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("StarCoin -> BROOMHIT()");
    if ( Wizards.Utils.DEBUG ) Debug.Log("Here is where we could add the FLY TO CORNER CODE...Instantiate star coin reward maybe?");
	wc.AddStarCoin();
	am.PlayAudio(SoundEffect.StarCoinCollect);
	Instantiate(collected, transform.position, Quaternion.identity);
	//DoDestroy();
	Destroy(this.gameObject);
}