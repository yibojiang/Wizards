var on:boolean;

var playerName:exSpriteFont;

var keyboard : TouchScreenKeyboard;

var keyboardDone : boolean = false;

var pm:ProfileManager;

var enterNewProfile : boolean = false;
var mc:MenuTiltController;

var fade:exSprite;

private var fadeRate:float=1;
var userInfo:UserInfo[];

var userIndex:int;
var userlength:int;

var editProfile:boolean=false;
var fairyhead1:GameObject;
var fairyhead2:GameObject;
var wing1:exSpriteAnimation;
var wing2:exSpriteAnimation;
var isMoving:boolean=false;

var disabledItemsForFirstUser : GameObject[];

var signHeader : exSpriteFont;


var dialogBox:DialogBox;
class UserInfo
{
	var ID:int;
	var Name:String;
	
	function UserInfo(_id:int,_name:String)
	{
		ID=_id;
		Name=_name;
	}
}

function Show()
{
	isMoving=true;
	fairyhead1.transform.localRotation.eulerAngles.z=28;
	iTween.RotateTo(fairyhead1,iTween.Hash("islocal",true,"z",0,"time",0.5,"delay",1,"easeType",iTween.EaseType.easeOutQuad));
	wing1.Play("usersignfairy");
	wing2.Play("usersignfairy");
	
	fairyhead2.transform.localRotation.eulerAngles.z=-28;
	iTween.RotateTo(fairyhead2,iTween.Hash("islocal",true,"z",0,"time",0.5,"delay",1,"easeType",iTween.EaseType.easeOutQuad));
	
	
	UpdateDisplayName();
	fade.color.a=0;
	fadeRate=1;
	if (!on)
	{
		this.gameObject.SetActiveRecursively(true);
		iTween.MoveTo( this.gameObject,iTween.Hash("islocal",true,"time",1.5,"y",10,"easeType",iTween.EaseType.spring,"oncompletetarget",this.gameObject,"oncomplete","TurnOn"));
	}
}

function Hide()
{
	isMoving=true;
	iTween.RotateTo(fairyhead1,iTween.Hash("islocal",true,"z",28,"time",0.5,"easeType",iTween.EaseType.easeInQuad));
	iTween.RotateTo(fairyhead2,iTween.Hash("islocal",true,"z",-28,"time",0.5,"easeType",iTween.EaseType.easeInQuad));
	fadeRate=-1;
	if (on)
	{
		iTween.MoveTo( this.gameObject,iTween.Hash("islocal",true,"time",1.5,"delay",0.3,"y",100,"easeType",iTween.EaseType.easeInQuad,"oncompletetarget",this.gameObject,"oncomplete","TurnOff"));
	}
}

function TurnOn()
{
	on=true;
	isMoving=false;
	
}

function TurnOff()
{
	on=false;
	isMoving=false;
	this.gameObject.SetActiveRecursively(false);
}

function Awake()
{
	TurnOff();
	transform.position.y=100;
	
	
	
	UpdateUserInfo();
	userIndex=GetIndex(pm.GetActiveProfileID());
}

function SetupForFirstNameEntry()
{
	for ( var i : int = 0; i < disabledItemsForFirstUser.Length; ++i )
	{
		disabledItemsForFirstUser[i].SetActiveRecursively(false);
	}
	
	signHeader.text = "Enter Profile Name";
}

function UpdateUserInfo()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateUserInfo() ");
	var numProfiles : int = pm.GetNumProfiles();
    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateUserInfo() : NumProfile : " + numProfiles);
	
	userInfo=new UserInfo[numProfiles];
		
	var j=0;
	for (var i:int=0;i<numProfiles;i++)
	{
		var id:int=i+1;
	    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateUserInfo() : id : " + id);
		if (pm.ProfileEnabled(id))
		{
		    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateUserInfo() : enabledprofilename : " + pm.GetProfileName(id));
			userInfo[j]=new UserInfo(id,pm.GetProfileName(id));
			j++;
		}
		
	}
	userlength=j;
    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateUserInfo() : userlength : " + userlength);
	
}
function FirstTimePlayCleanUpFunction()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("FirstTimePlayCleanUpFunction ");
   // if ( Wizards.Utils.DEBUG ) Debug.Log("Set active profile ID TO : " + userInfo[userIndex].ID);
	
	pm.SetActiveProfileID(userInfo[userIndex].ID);
	Hide();
	UpdateDisplayName();
	
	mc.ActiveClipButton();
	mc.ActiveDowntown();
	
}
function Update () 
{
	
	fade.color.a+=fadeRate*Time.deltaTime;
	fade.color.a=Mathf.Clamp(fade.color.a,0,0.4);
	if ( enterNewProfile )
	{
		#if UNITY_IPHONE
		if ( Application.platform == RuntimePlatform.IPhonePlayer )
		{
			if ( keyboard )
			{
				playerName.text = keyboard.text;
				if (playerName.text.Length>7)
				{
					playerName.text=playerName.text.Substring(0,7);
				}
				//playerName = keyboard.text;
		
				if ( keyboard.done  )
				{
					if (editProfile)
					{
						if ( Wizards.Utils.DEBUG ) Debug.Log("modified");
						ModifyProfile();
					}
					else
					{
						if ( Wizards.Utils.DEBUG ) Debug.Log("created");
						CreateProfile();
					}
					
	
					enterNewProfile = false;
					
				}
				
				//if ( keyboard.wasCanceled )
				if ( keyboard.visible == false && keyboard.done == false )
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("USER NAME NOT CONFIRMED!!! - Keyboard Canceled");
					Hide();
					playerName.text = "";
					UpdateDisplayName();
	
					mc.ActiveClipButton();
					mc.ActiveDowntown();
					
					enterNewProfile = false;
				}
			}
		}
		#endif
		
		#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
		if (playerName.text.Length>7)
		{
			playerName.text=playerName.text.Substring(0,7);
		}
		
		if (editProfile)
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("modified");
			ModifyProfile();
		}
		else
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("created");
			CreateProfile();
		}
		

		enterNewProfile = false;
		
		#endif
		
	}
}

function GetIndex(_id:int):int
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("GetIndex : " + _id);
	var returnVal : int = 0;
	
	for (var i:int=0;i<userlength;i++)
	{
		if (userInfo[i].ID==_id)
		{
			returnVal = i;
			break;
		}
	}
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("GetINDEX : " + returnVal);
	return ( returnVal );
}


/*
	pm.SetActiveProfileID(userInfo[userIndex].ID);
	Hide();
	UpdateDisplayName();
	*/
function CreateProfile()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("Create Profile");
	var userId:int;
	if (playerName.text!="")
	{
	    if ( Wizards.Utils.DEBUG ) Debug.Log("CreateProfile() : Name : " +playerName.text);
		//if ( Wizards.Utils.DEBUG ) Debug.Log(playerName.text);
		userId=pm.CreateProfile(playerName.text);
	    if ( Wizards.Utils.DEBUG ) Debug.Log("CreateProfile() : userID : " + userId);
		UpdateUserInfo();
		userIndex=GetIndex(userId);
		
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Unnamed");
		userId=pm.CreateProfile("Javi");
		UpdateUserInfo();
		userIndex=GetIndex(userId);
	}
	playerName.text=userInfo[userIndex].Name;
}

function UpdateDisplayName()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateDisplayName");
	if ( userlength<=0)
		return;
		
	if (!pm.ProfileEnabled(pm.GetActiveProfileID()) )
	{
	    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateDisplayName : Notenabled : " + pm.GetActiveProfileID());
		userIndex=Random.Range(0,userlength);
		playerName.text=userInfo[userIndex].Name;
		pm.SetActiveProfileID(userInfo[userIndex].ID);
		mc.TextPlayerName.text = playerName.text;
	
	}
	else
	{
	    if ( Wizards.Utils.DEBUG ) Debug.Log("UpdateDisplayName : enabled : " + pm.GetActiveProfileID());
		userIndex=GetIndex(pm.GetActiveProfileID());
		playerName.text  = pm.GetActiveProfileName();
		mc.TextPlayerName.text = playerName.text;
	}
	
}

function GetNextProfile()
{
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	if (isMoving)
	{
		return;
	}
	
	if (userlength==0)
	{
		return;
	}
	userIndex++;
	userIndex=Mathf.Clamp(userIndex,0,userlength-1);
	playerName.text=userInfo[userIndex].Name;
	
}

function GetPreviousProfile()
{
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	if (isMoving)
	{
		return;
	}
	if (userlength==0)
	{
		return;
	}
	userIndex--;
	userIndex=Mathf.Clamp(userIndex,0,userlength-1);
	playerName.text=userInfo[userIndex].Name;
	
}


function CancelUserEntry()
{
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	if (isMoving)
	{
		return;
	}
	if (userlength==0)
	{
		return;
	}
	
	signHeader.text = "Profile Name";
	
	Hide();
	UpdateDisplayName();
	
	mc.ActiveClipButton();
	mc.ActiveDowntown();
}

function DeleteAction()
{
	if (userlength<=1)
	{
		pm.SetProfileEnabled(userInfo[userIndex].ID,0);
		UpdateUserInfo();
		userIndex=0;
		playerName.text="";
	}
	else
	{
		pm.SetProfileEnabled(userInfo[userIndex].ID,0);
		UpdateUserInfo();
		userIndex=Random.Range(0,userlength);
		playerName.text=userInfo[userIndex].Name;
		pm.SetActiveProfileID(userInfo[userIndex].ID);
	}
}

function DeleteUser()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteUser");
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteUser A");
		if ( !keyboard.done  )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteUser B");
			return;
		}
	}
	#endif
	
	if (isMoving)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteUser C");
		return;
	}
	
	if (userlength==0)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("DeleteUser D");
		return;
	}
	
	dialogBox.gameObject.SetActiveRecursively(true);
	yield;
	dialogBox.Show("Are you sure, this action \ncan not be undone !",DeleteAction);
	
}

function Confirm()
{
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	
	if (isMoving)
	{
		return;
	}
	if (userlength==0)
	{
		return;
	}
    //if ( Wizards.Utils.DEBUG ) Debug.Log("Set active profile ID TO : " + userInfo[userIndex].ID);
    
    signHeader.text = "Profile Name";
    
	pm.SetActiveProfileID(userInfo[userIndex].ID);
	Hide();
	UpdateDisplayName();
	
	mc.ActiveClipButton();
	mc.ActiveDowntown();
	#if UNITY_EDITOR
	if ( Wizards.Utils.DEBUG ) Debug.Log("I am running");
	keyboardDone = true;
	#endif
	
}

function EnterNewProfile()
{
	#if UNITY_IPHONE
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	if (isMoving)
	{
		return;
	}
	if ( Wizards.Utils.DEBUG ) Debug.Log("Enter name");
	
	signHeader.text = "Enter Profile Name";
	
	playerName.text="";
	doKeyBoard();
	editProfile=false;
	
}

function doKeyBoard()
{
	enterNewProfile = true;
	#if UNITY_IPHONE
	
	TouchScreenKeyboard.hideInput = true;
	//keyboard = TouchScreenKeyboard.Open(playerName.text); // OLD VERSION
	keyboard = TouchScreenKeyboard.Open(playerName.text, TouchScreenKeyboardType.Default, false, false, false, false, "<Enter Name>");
	#endif
}

function EditProfile()
{
	#if UNITY_IPHONE
	if ( Wizards.Utils.DEBUG ) Debug.Log("I am running");
	if ( keyboard )
	{
		if ( !keyboard.done  )
		{
			return;
		}
	}
	#endif
	
	if (isMoving)
	{
		return;
	}
	if (userlength==0)
	{
		return;
	}
	
	signHeader.text = "Edit Profile Name";
	
	//playerName.text="";
	doKeyBoard();
	editProfile=true;
	
}

function ModifyProfile()
{

	if (playerName.text!="")
	{
		pm.SetupProfile(userInfo[userIndex].ID,playerName.text);

	}
	else
	{
		playerName.text="Javi";
		pm.SetupProfile(userInfo[userIndex].ID,playerName.text);
	}
	
}

