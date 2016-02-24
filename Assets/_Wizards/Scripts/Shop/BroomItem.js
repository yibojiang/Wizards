// BroomItem is attached to the "Price" Object, which also has a UIButton Component attached
enum BroomState
{
	Unavailable,
	Available,
	Equipped,
	Equip
}

// this gets linked to a sub-object called "text", which has a exSpriteFont Component, and is used to show the price!
// text can be either the BroomState, the Price, or "Not Sale"
var text:exSpriteFont;

// link to the UIButton Component. Calls "PerformTap" method on this object when tapped.
var button:UIButton;

// link to Profile Manager.
// Used to get the ShopItemState, and BroomLevel.
// Setting the players starcoincount.
// Setting the ItemShopState, setting the broomlevel and broomupgradelevel.
var pm:ProfileManager;

// The price of the item.
// Used for setting the display value of the price, checking the player has enough money to buy, and subtracting
// amount of starcoins if purchased.
var price:int;

// Holds a link to shopcontroller
// used for checking number of starcoins player has in the bank. ShopController holds the value, but changes are
// also written to ProfileManager.
// Plays a sound when purchase confirmed.
var shop:ShopController;

// Name of the item. This is set from this child object exSpriteFont member variable "text".
var itemName:String;
// Reference the actual display object for the itemName.
var itemNameText:exSpriteFont;

// Description - set in the inspector.
var description:String;

// used to display item in the dialog box?
var broomGraphics:exSprite;

// enum of CurrentBroomState
var state:BroomState;

// This is the items "level" or how powerful it is.
var level:int;

// NOTE: BroomUpgradeLevel (stored in PM) is the level that is one above the brooms current level.

var broomGraphicsDisplay : GameObject;


function Awake()
{
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	
	shop=GameObject.Find("Shop").GetComponent(ShopController) as ShopController;
	
	// Grab the references to the exSpriteFont Components in the children objects so they
	// can be updated. Specifically the Price display and name display.
	var texts:Component[]=this.GetComponentsInChildren(exSpriteFont);
	for (var i:int=0;i<texts.length;i++)
	{
		if (texts[i].name=="Name")
		{
			itemNameText=(texts[i] as exSpriteFont);
		}
		else if (texts[i].name=="text")
		{
			text=(texts[i] as exSpriteFont);
		}
	}
	//Grab the name from the child object.
	itemName=itemNameText.text;
	
	// grab link to UIButton
	button=this.GetComponent(UIButton) as UIButton;
	
	// setup function to call when button is pressed.
	button.scriptWithMethodToInvoke=this;
	button.methodToInvoke="PerformTap";
	
	// Fix for orange powder always being on sale
	if ( level == 0 )
	{
		pm.SetShopItemState(itemName, ShopItemState.SoldOut);
	}
	
	// Get the items state from the users profile
	var itemState:ShopItemState=pm.GetShopItemState(itemName);
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SHOPITEM: Awake(): " + itemName + " is " + itemState); 
	
	// Set the items state based on what we got from the profile manager.
	if (itemState==ShopItemState.Available)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom " + itemName + " to Available");
		state=BroomState.Available;
	}
	else if  (itemState==ShopItemState.UnAvailable)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom State to Unavailable->item state is set to unavailable");
		///if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom " + itemName + " to UnAvailable");
		state=BroomState.Unavailable;
	}
	else if  (itemState==ShopItemState.SoldOut)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom " + itemName + " to Equip");
		state=BroomState.Equip;
	}
	
	// Get the brooms upgrade level. This should always be one higher than the brooms current level
	// Brooms level initially starts at 0. So upgrade level is 1 initially. The upgrade level is used
	// to determine which is the next level available, and all other brooms level that are higher than
	// this are set to unavailble
	var broomUpgradLevel:int=pm.GetBroomUpgradeLevel();
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Broom Upgrade Level: " + broomUpgradLevel);
	// If the level of this item is greater than the brooms upgrade level,
	// Then make this broom level unavailable.
	if (level>broomUpgradLevel)
	{
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom State to Unavailable->Level is greater than broom level");
		//if ( Wizards.Utils.DEBUG ) Debug.Log("Level is greater than broom Upgrade level. Setting Broom " + itemName + " to Unavailable");
		state=BroomState.Unavailable;
	}
	
	
	text.text=""+state;
	
	if (state==BroomState.Available)
	{
		text.text=""+price;
	}
	else if (state==BroomState.Unavailable)
	{
		text.text="Locked";
	}
	
	
	
}


function SetState(_state:BroomState)
{
	
	state=_state;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SETSTATE() : Item " + itemName + " Set State to : " + state);
	
	text.text=""+state;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("SETSTATE() : Item " + itemName + " Updating text to: " + text.text);
	
	if (state==BroomState.Available)
	{
		text.text=""+price;
		//if ( Wizards.Utils.DEBUG ) Debug.Log("SETSTATE() : Item " + itemName + " Updating text to: " + text.text);
	}
	else if (state==BroomState.Unavailable)
	{
		text.text="Locked";
		//if ( Wizards.Utils.DEBUG ) Debug.Log("SETSTATE() : Item " + itemName + "Updating text to: " + text.text);
	}
}

function Buy()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Buy()");
	// If player has enough money
	if (shop.starcoinsCount>=price)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Buy() : Player has enough money, buying!");
		// Spend starcoins
		shop.starcoinsCount-=price;
		// Update player profile with new star coin amount
		pm.SetRecord(Record.StarCoins,shop.starcoinsCount);
		
		// Play buy sound
		shop.am.PlayOneShotAudio(shop.am.registerCash,shop.am.FXVol);
		
		// Set the state of this broom item to sold out.
		if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom " + itemName + " to SoldOut State in PROFILEMANAGER");
		pm.SetShopItemState(itemName,ShopItemState.SoldOut);
		if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom " + itemName + " Shop Item State to Equip");
		SetState(BroomState.Equip);
		if ( Wizards.Utils.DEBUG ) Debug.Log("Setting Broom Upgrade Level to: " + (level + 1));
		pm.SetBroomUpgradeLevel(level+1);
		
		if ( Wizards.Utils.DEBUG ) Debug.Log("This item is: " + this.itemName);
		// For all the brooms on sale
			// If the broom(A) is unavailable
				// If this items(B) level+1 equals the unavailable brooms'(A) level 
		for (var i:int=0;i<shop.broomItems.length;i++)
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("Check Broom: " + shop.broomItems[i].itemName);
			if (shop.broomItems[i].state==BroomState.Unavailable)
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("Broom: " + shop.broomItems[i].itemName + " is unavailable");
				// if the other broom's level is one greater than mine, and it is unavailable
				// then make it available.
				if (level+1==shop.broomItems[i].level)
				{
					if ( Wizards.Utils.DEBUG ) Debug.Log("LEvel of: " + shop.broomItems[i].itemName + " is equals " + this.itemName +"  level+1");
					if ( Wizards.Utils.DEBUG ) Debug.Log("Changing broom state of " + shop.broomItems[i].itemName + "from unavailable to available->Level is 1 greater than broom level");
					shop.broomItems[i].SetState(BroomState.Available);
				}
			}
		}
		Equip();
		
		// var newEvent : CountlyEvent = new CountlyEvent();
		
		// newEvent.Key = "BuyBroomItem";
		// newEvent.Count = 1;
		// newEvent.Sum = price;
		// newEvent.Segmentation = new Dictionary.<String, String>();
		
		// newEvent.Segmentation["Name"] = itemName;
		
		// Countly.Instance.PostEvent(newEvent);
		
		shop.CheckBigSpenderAchievement();
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Not enough money, NO BUY");
		GetMoreCoinsPrompt();
		return;
	}
	
}

function GetMoreCoinsPrompt()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("NOT ENOUGH STAR COINS!");
	shop.dialogBox.Show("You need more coins!", GotoGetMoreCoins);
	shop.dialogBox.SetYesNo("Get Coins","No, thanks");
	AddBroomVisualToDialogBox();
	//shop.dialogBox.graphics.SetSprite(broomGraphics.atlas,broomGraphics.index);
	shop.dialogBox.SetName(itemName);
}

function GotoGetMoreCoins()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTO STARCOINS MENU");
	shop.GetStarcoins();
}

function Equip()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Equipping" + itemName);
	// Change all the broom items that are currently equipped, to simply Equip (unequipped)
	for (var i:int=0;i<shop.broomItems.length;i++)
	{
		if (shop.broomItems[i].state==BroomState.Equipped)
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("Unequipping broom: " + shop.broomItems[i].itemName);
			shop.broomItems[i].SetState(BroomState.Equip);
		}
	}
	// Equip this item
	SetState(BroomState.Equipped);
	//var wandCode:int=wandType;
	// Set the broom level to the same level as this broom item
	if ( Wizards.Utils.DEBUG ) Debug.Log("Setting broom " + itemName + " level to: " + level);
	pm.SetBroomLevel(level);
	
}

function PerformTap()
{
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	
	if (state==BroomState.Unavailable)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Broom " + itemName + " is unavailable!");
		ShowInfo();
	}
	else if (state==BroomState.Available)
	{
		PromptToBuy();
		
	}
	else if (state==BroomState.Equipped)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Broom " + itemName + " is already equipped!");
		ShowInfo();
	}
	else if (state==BroomState.Equip)
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Broom " + itemName + " equipping!");
		Equip();
		//shop.dialogBox.Show(description,Equip);
		//shop.dialogBox.SetYesNo("Equip","No, thanks");
		//shop.dialogBox.graphics.SetSprite(broomGraphics.atlas,broomGraphics.index);
		//shop.dialogBox.graphics.color=broomGraphics.color;
		//shop.dialogBox.SetName(itemName);		
	}
	
}

function PromptToBuy()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Broom " + itemName + " Prompting to buy!");
	shop.dialogBox.Show(description,Buy);
	shop.dialogBox.SetYesNo("Buy","No, thanks");
	AddBroomVisualToDialogBox();
	//shop.dialogBox.graphics.SetSprite(broomGraphics.atlas,broomGraphics.index);
	//shop.dialogBox.graphics.color=broomGraphics.color;
	shop.dialogBox.SetName(itemName);
}

function InfoButtonPressed()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(transform.parent.parent.position);
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	if ( state == BroomState.Available )
	{
		PromptToBuy();
	}
	else if ( state == BroomState.Equip )
	{
		PromptToEquip();
	}
	else if ( state == BroomState.Equipped || state == BroomState.Unavailable)
	{
		ShowInfo();
	}
}

function PromptToEquip()
{
	shop.dialogBox.Show(description,Equip);
	shop.dialogBox.SetYesNo("Equip","No, thanks");
	AddBroomVisualToDialogBox();
	//shop.dialogBox.graphics.SetSprite(broomGraphics.atlas,broomGraphics.index);
	//shop.dialogBox.graphics.color=broomGraphics.color;
	shop.dialogBox.SetName(itemName);
}

function ShowInfo()
{
	shop.dialogBox.Show(description, null);
	shop.dialogBox.SetYesNo("", "Dismiss");
	AddBroomVisualToDialogBox();
	//shop.dialogBox.graphics.SetSprite(broomGraphics.atlas,broomGraphics.index);
	//shop.dialogBox.graphics.color=broomGraphics.color;
	shop.dialogBox.SetName(itemName);
}

function AddBroomVisualToDialogBox()
{
	if ( broomGraphicsDisplay != null )
	{
		var go : GameObject = Instantiate(broomGraphicsDisplay);
		shop.dialogBox.SetBroomVisual(go);
	}
}