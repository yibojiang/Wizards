private static var instance:InputManager;

public static function Instance() : InputManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<InputManager>();
    return instance;
}

var touch : Touch;
var touchPos : Vector3;

var ray : Ray;
//var hit : RaycastHit;

var wizard : WizardControl;

// private var gm : GameManager;

// var state : GameState;


private var pm:ProfileManager;

var inputMode:InputMode;

var touched:boolean=false;

var swords:GameObject[];
var swordObj:GameObject;

var notice:NoticeBox;

var quickExplode:boolean;


var disableInput : boolean = false;

enum InputMode
{
	SwipeMode,
	TapMode,
	Mix
}


function InitSwords()
{
	for (var i:int=0;i<5;i++)
	{
		swords[i]=Instantiate(swordObj,Vector3(0,0,0),Quaternion.identity);
	}
}

function InitSword(_fingerid:int,_pos:Vector3)
{
	if (swords[_fingerid]!=null)
	{
		swords[_fingerid].GetComponent.<ParticleEmitter>().emit=false;
	}
	
	if (swordObj!=null)
	{
		swords[_fingerid]=Instantiate(swordObj,Vector3(_pos.x,_pos.y,0),Quaternion.identity);
	}
}

function Awake()
{
	notice=GameObject.Find("NoticeBox").GetComponent(NoticeBox) as NoticeBox;
}

function Start()
{
	//InitSwords();
	pm=ProfileManager.Instance();
	var gm:GameManager=GameManager.Instance();
	touched=false;

	var wandCode:int=pm.GetWandBitmask();
	var tapMask:int=WandMask.Tap;
	var swipeMask:int=WandMask.Swipe;
	var explodeMask:int=WandMask.Explode;
	var starcoin_tapMask:int = WandMask.Starcoin;
	
	
	//wandCode=WandCombo.Tap_Swipe_Explode;
	
	if (wandCode & tapMask )  
	{
		inputMode=InputMode.TapMode;
	}
	
	if (wandCode & swipeMask )  
	{
		inputMode=InputMode.SwipeMode;
	}
	
	if (wandCode & swipeMask && wandCode & tapMask)  
	{
		inputMode=InputMode.Mix;
	}
	
	if (wandCode & explodeMask)
	{
		quickExplode=true;
	}
	else
	{
		quickExplode=false;
	}
	
	if (wandCode & starcoin_tapMask)
	{
	    if ( Wizards.Utils.DEBUG ) Debug.LogWarning("WAND : Enabling quick explode for starcoin wand");
		quickExplode = true;
	}
	
	if (gm.gameState==GameState.Tutorial)
	{
		quickExplode=false;
		inputMode=InputMode.TapMode;
	}
	
}

function PerformTap(_ray:Ray)
{	
    wizard.DoTap();
    var hits : RaycastHit[];
	hits = Physics.RaycastAll(_ray, 100.0);

	for (var i = 0;i < hits.Length; i++)
	{
		ProcessHit(hits[i]);
	}
}

function PerformSwipe(_ray:Ray)
{
	var hits : RaycastHit[];
	hits = Physics.RaycastAll(_ray, 100.0);

	for (var i = 0;i < hits.Length; i++)
	{
		ProcessHit(hits[i]);
	}
}

function ProcessHit(hit : RaycastHit)
{
  	if ( hit.transform.tag == "Firework" )
    	{
    		if (quickExplode)
    		{
    			hit.transform.gameObject.GetComponent(fw_main).ExplodeNoDelay();
           		
           	}
           	else
           	{
           		hit.transform.gameObject.GetComponent(fw_main).Explode();
           	}
	    }
	    
	    if ( hit.transform.tag == "BombFirework" )
    	{	 
           	hit.transform.gameObject.GetComponent(fw_main).ExplodePefect();
           	ExplodeAllFireworks();
	    }
	    
	    if ( hit.transform.tag == "Glitter" )
    	{
           	hit.transform.gameObject.GetComponent(fw_glitter).Explode();
	    }
	    
	    if ( hit.transform.tag == "SFW" )
    	{
           	hit.transform.gameObject.SendMessage("Explode");   	 
	    }
	    
	    if ( hit.transform.tag == "Secrect" )
    	{
    		hit.transform.gameObject.GetComponent(InGameSecrect).GetSecrect();
    		//notice.ShowMessage("You got a Secret !",1);
    	}
    	
    	if ( hit.transform.tag == "StarCoin" )
    	{
           	var starCoin : StarCoin = hit.transform.gameObject.GetComponent(StarCoin) as StarCoin;
           	
           	if ( starCoin.enabled == true )
           	{
           		starCoin.Hit();
           	}
	    }
}

function MoveSword(_id:int,_pos:Vector3)
{
	if (swords[_id]!=null)
	{
		swords[_id].transform.position.x=touchPos.x;
		swords[_id].transform.position.y=touchPos.y;
	}
}

function ResetSword(_id:int)
{
	if (swords[_id]!=null)
	{
		swords[_id].GetComponent.<ParticleEmitter>().emit=false;
	}
}

function Update()
{
	if ( disableInput )
	{
		return;
	}
	
	var playerAction : boolean = false;
	
	if ( Input.touchCount > 0 && Input.touchCount<=4)
	{
		for (var t:Touch in Input.touches)
		{
			touchPos = Camera.main.ScreenToWorldPoint (t.position);
			
			if ( t.phase == TouchPhase.Began )
			{
				if (inputMode==InputMode.TapMode)
				{
					ray = Camera.main.ScreenPointToRay(t.position);
					PerformTap(ray);
				}
				else if (inputMode==InputMode.SwipeMode)
				{
					InitSword(t.fingerId,touchPos);
				}
				else if (inputMode==InputMode.Mix)
				{
					
					InitSword(t.fingerId,touchPos);
					ray = Camera.main.ScreenPointToRay(t.position);
					PerformTap(ray);
				}
			}
			else if ( t.phase == TouchPhase.Moved )
			{
				if (inputMode==InputMode.SwipeMode)
				{						
					ray = Camera.main.ScreenPointToRay(t.position);
					MoveSword(t.fingerId,touchPos);
					
					PerformSwipe(ray);

				}
				else if (inputMode==InputMode.Mix)
				{					
					ray = Camera.main.ScreenPointToRay(t.position);
					MoveSword(t.fingerId,touchPos);
					PerformSwipe(ray);
					
				}
			}
			else if ( t.phase == TouchPhase.Ended )
			{
				if (inputMode==InputMode.SwipeMode)
				{ 
					ResetSword(t.fingerId);
					wizard.DoTap();
				}
				else if (inputMode==InputMode.Mix)
				{
					ResetSword(t.fingerId);
					wizard.DoTap();
				}
			}
			
		
		}
	}
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log(Input.GetAxis("Mouse X"));
	if ( Input.GetMouseButtonUp(0) )
	{
		if (inputMode==InputMode.SwipeMode)
		{
			
			touched=false;
			wizard.DoTap();
			
			ResetSword(0);
		}
		else if (inputMode==InputMode.Mix)
		{
			touched=false;
			ResetSword(0);
			wizard.DoTap();
		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		if (inputMode==InputMode.TapMode)
		{
			ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			PerformTap(ray);
		}
		else if (inputMode==InputMode.SwipeMode)
		{	
			touchPos=Camera.main.ScreenToWorldPoint (Input.mousePosition);
			InitSword(0,touchPos);
			touched=true;
			
		}
		else if (inputMode==InputMode.Mix)
		{
			
			touchPos=Camera.main.ScreenToWorldPoint (Input.mousePosition);
			InitSword(0,touchPos);
			
			touched=true;
			ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			PerformTap(ray);
			
		}
		
	}
	else 
	{
		if ((Mathf.Abs( Input.GetAxis("Mouse X") )>0.3 || Mathf.Abs( Input.GetAxis("Mouse Y") )>0.3) && touched)
		{
			if (inputMode==InputMode.SwipeMode)
			{
				ray = Camera.main.ScreenPointToRay(Input.mousePosition);
				touchPos=Camera.main.ScreenToWorldPoint (Input.mousePosition);
				
				
				MoveSword(0,touchPos);
				
				
				PerformSwipe(ray);
			}
			else if (inputMode==InputMode.Mix)
			{					
				ray = Camera.main.ScreenPointToRay(Input.mousePosition);
				touchPos=Camera.main.ScreenToWorldPoint (Input.mousePosition);
				MoveSword(0,touchPos);
				PerformSwipe(ray);
			}
		}
		
	}
	
	#endif
	
	
}

function ExplodeAllFireworks()
{
	var fws : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	var glitters : GameObject[] = GameObject.FindGameObjectsWithTag("Glitter");
	var sfws:GameObject[]=GameObject.FindGameObjectsWithTag("SFW");
	for (var fw:GameObject in fws)
	{
		if (fw!=null)
			fw.GetComponent(fw_main).ExplodePefect();
	}
	
	for (var glitter:GameObject in glitters)
	{
		if (glitter!=null)
			glitter.GetComponent(fw_glitter).ExplodePefect();
	}
	
	//for (var sfw:GameObject in sfws)
	//{
		//if (sfw !=null)
			//sfw.SendMessage("Explode");
	//}
	
	
}

// function SetState(_state : GameState)
// {
// 	state = _state;
// }

