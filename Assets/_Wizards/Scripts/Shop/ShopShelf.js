var touched:boolean;
var touchPos:Vector3;
var ray:Ray;
var hit : RaycastHit;
var index:int;
var dir:float;
var movePos:Vector3;
var hitboxName:String;
var itemCount:int;

var am:AudioManager;

var cw : Transform;
var catWheel : CatalogWheel;

var processMouse : boolean = false;

var startScrollPos : Vector3;

function Awake()
{
	am=GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	
	cw = GameObject.Find("CatalogBoard").GetComponent(Transform);
	
	catWheel = GameObject.Find("CatalogBoard").GetComponent(CatalogWheel) as CatalogWheel;
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		processMouse = false;
	}
}

function Update () 
{
	this.transform.position.y=Mathf.Clamp(this.transform.position.y,-10,(itemCount-1)*23+10);
	
	
	
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			touchPos=touch.position;
			ray = Camera.main.ScreenPointToRay(touchPos);
			
			PerformTap(ray);
							
		}
		
		if ( touch.phase == TouchPhase.Moved && touched)
		{
			movePos = touch.position;
				
			if ( catWheel.canScroll == true )
			{
				dir=(movePos.y-touchPos.y)*0.3;
			}
			else
			{
				dir = 0.0;
			}
			
			
			var angle : int = Mathf.RoundToInt(cw.eulerAngles.y);
			//if ( Wizards.Utils.DEBUG ) Debug.Log("" + this.name + " ANGLE: " + angle);
		
			var result : int = angle % 90;
			//if ( Wizards.Utils.DEBUG ) Debug.Log("result: " + result);
			if ( dir != 0 && result == 0 )
			{ 
				if ( Wizards.Utils.DEBUG ) Debug.Log("Scrolling");
				dir=Mathf.Clamp(dir,-5,5);
				//if ( Wizards.Utils.DEBUG ) Debug.Log(dir);
				this.transform.position.y+=dir;
				
				
				touchPos = movePos;
				
				
				//index=Mathf.Ceil(this.transform.position.y/23);
				
				if (dir>0)
				{
					index=Mathf.Ceil(this.transform.position.y/23);
				}
				else
				{
					index=Mathf.Floor(this.transform.position.y/23);
				}
				
				index=Mathf.Clamp(index,0,itemCount-1);
			}
			/* OLD
			
			movePos= Input.mousePosition;
			dir=(movePos.y-touchPos.y)*0.3;
			
			var angle : int = Mathf.RoundToInt(cw.eulerAngles.y);
			if ( Wizards.Utils.DEBUG ) Debug.Log("" + this.name + " ANGLE: " + angle);
			
			var result : int = angle % 90;
			//if ( Wizards.Utils.DEBUG ) Debug.Log("result: " + result);
			if ( result == 0 )
			{ 
				dir=Mathf.Clamp(dir,-5,5);
				this.transform.position.y+=dir*Time.deltaTime;
				
				touchPos= Input.mousePosition;
				
				
				if (dir>0)
				{
					index=Mathf.Ceil(this.transform.position.y/23);
				}
				else
				{
					index=Mathf.Floor(this.transform.position.y/23);
				}
				
				index=Mathf.Clamp(index,0,itemCount-1);
			}
			*/
		}
		
		if ( touch.phase == TouchPhase.Ended && touched)
		{
			
			touched=false;
			iTween.MoveTo(this.gameObject,iTween.Hash("islocal",true,"y",index*23,"time",0.2,"easeType",iTween.EaseType.spring));
			
			if ( transform.localPosition.x > -1.0 && transform.localPosition.x < 1.0 )
			{
				var finalMoveDistance : float = this.gameObject.transform.position.y - (index * 23);
				if ( finalMoveDistance > 5)
				{
					if ( Wizards.Utils.DEBUG ) Debug.LogWarning("IPHONE: UP SCROLL");
					am.PlayOneShotAudio(am.shopboard[0],am.FXVol);
				}
				else if ( finalMoveDistance < -5 )
				{
					if ( Wizards.Utils.DEBUG ) Debug.LogWarning("IPHONE: DOWN SCROLL");
					am.PlayOneShotAudio(am.shopboard[1],am.FXVol);
				}
			}
		}
	}
	
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	if ( processMouse )
	{
		if ( Input.GetMouseButtonUp(0) )
		{
			if (touched)
			{
				//if ( Wizards.Utils.DEBUG ) Debug.Log("SHOPSHELF : " + transform.name + "mouse released, scrolling to item slot");
				touched=false;
				iTween.MoveTo(this.gameObject,iTween.Hash("islocal",true,"y",index*23,"time",0.2,"easeType",iTween.EaseType.spring));
				
				
				if ( transform.localPosition.x > -1.0 && transform.localPosition.x < 1.0 )
				{
					//finalMoveDistance = this.gameObject.transform.position.y - (index * 23);
					finalMoveDistance = startScrollPos.y - (index * 23);
					
					if ( finalMoveDistance > 5)
					{
						if ( Wizards.Utils.DEBUG ) Debug.LogWarning("EDITOR: UP SCROLL");
						am.PlayOneShotAudio(am.shopboard[0],am.FXVol);
					}
					else if ( finalMoveDistance < -5 )
					{
						if ( Wizards.Utils.DEBUG ) Debug.LogWarning("EDITOR: DOWN SCROLL");
						am.PlayOneShotAudio(am.shopboard[1],am.FXVol);
					}
				}
			}
		}
		else if ( Input.GetMouseButtonDown(0) )
		{
			//touched=true;
			touchPos=Input.mousePosition;
			ray = Camera.main.ScreenPointToRay(touchPos);
			PerformTap(ray);
			startScrollPos = this.gameObject.transform.position;
		}
		else 
		{
			if (touched)
			{
				movePos= Input.mousePosition;
				
				if ( catWheel.canScroll == true )
				{
					dir=(movePos.y-touchPos.y)*0.3;
				}
				else
				{
					dir = 0.0;
				}
				
				
				angle = Mathf.RoundToInt(cw.eulerAngles.y);
				//if ( Wizards.Utils.DEBUG ) Debug.Log("" + this.name + " ANGLE: " + angle);
			
				result = angle % 90;
				//if ( Wizards.Utils.DEBUG ) Debug.Log("result: " + result);
				if ( dir != 0 && result == 0 )
				{ 
					//if ( Wizards.Utils.DEBUG ) Debug.Log("Scrolling");
					dir=Mathf.Clamp(dir,-5,5);
					//if ( Wizards.Utils.DEBUG ) Debug.Log(dir);
					this.transform.position.y+=dir;
					
					
					touchPos= Input.mousePosition;
					
					
					//index=Mathf.Ceil(this.transform.position.y/23);
					
					if (dir>0)
					{
						index=Mathf.Ceil(this.transform.position.y/23);
					}
					else
					{
						index=Mathf.Floor(this.transform.position.y/23);
					}
					
					index=Mathf.Clamp(index,0,itemCount-1);
				}
			}
			
		}
	}
	
	#endif
}

function PerformTap(_ray:Ray)
{
	var hits : RaycastHit[];
	hits = Physics.RaycastAll (_ray, 1500.0);
	
    // Change the material of all hit colliders
    // to use a transparent Shader
    for (var i = 0;i < hits.Length; i++) {
        var hit : RaycastHit = hits[i];
        
        if ( hit.transform.name ==hitboxName )
    	{
           	
			touched=true;
	    }
	    /*
	    if ( hit.transform.tag =="ShopUp" )
	    {
	    	index--;
	    	index=Mathf.Clamp(index,0,itemCount-1);
	    }
	    
	    if ( hit.transform.tag =="ShopDown" )
	    {
	    	index++;
	    	index=Mathf.Clamp(index,0,itemCount-1);
	    }
	    */
    }
}