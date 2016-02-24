enum WandState
{
	Unavailable,
	Available,
	Equipped,
	Equip
}


var wandType:WandCombo;
var state:WandState;



var text:exSpriteFont;

var button:UIButton;

var pm:ProfileManager;

var price:int;

var shop:ShopController;

var itemName:String;
var itemNameText:exSpriteFont;


var description:String;

var wandGraphics:exSprite;


function Awake()
{
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	
	shop=GameObject.Find("Shop").GetComponent(ShopController) as ShopController;
	
	
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
	
	itemName=itemNameText.text;
	
	
	button=this.GetComponent(UIButton) as UIButton;
	
	button.scriptWithMethodToInvoke=this;
	button.methodToInvoke="PerformTap";
	
	// Fix for maple wand being on sale for 0, if not equipped and then leave downtown and return.
	if ( wandType == WandCombo.Tap )
	{
		pm.SetShopItemState(itemName, ShopItemState.SoldOut);
	}
	
	var itemState:ShopItemState=pm.GetShopItemState(itemName);
	if (itemState==ShopItemState.Available)
	{
		state=WandState.Available;
	}
	else if  (itemState==ShopItemState.UnAvailable)
	{
		state=WandState.Unavailable;
	}
	else if  (itemState==ShopItemState.SoldOut)
	{
		state=WandState.Equip;
	}
	
	text.text=""+state;
	
	if (state==WandState.Available)
	{
		text.text=""+price;
	}
	else if (state==WandState.Unavailable)
	{
		text.text="Locked";
	}
	
	
	
}

function SetState(_state:WandState)
{
	state=_state;
	text.text=""+state;
	
	if (state==WandState.Available)
	{
		text.text=""+price;	
	}
	
}

function Buy()
{
	if (shop.starcoinsCount>=price)
	{
		shop.starcoinsCount-=price;
		pm.SetRecord(Record.StarCoins,shop.starcoinsCount);
		shop.am.PlayOneShotAudio(shop.am.registerCash,shop.am.FXVol);
	
		pm.SetShopItemState(itemName,ShopItemState.SoldOut);
		SetState(WandState.Equip);
		
		Equip();
		
		// var newEvent : CountlyEvent = new CountlyEvent();
		
		// newEvent.Key = "BuyWandItem";
		// newEvent.Count = 1;
		// newEvent.Sum = price;
		// newEvent.Segmentation = new Dictionary.<String, String>();
		
		// newEvent.Segmentation["Name"] = itemName;
		
	 //    if ( Wizards.Utils.DEBUG ) Debug.Log("WAND NAME : " + newEvent.Segmentation["Name"]);
		
		// Countly.Instance.PostEvent(newEvent);
		
		shop.CheckBigSpenderAchievement();
	}
	else
	{
		GetMoreCoinsPrompt();
		return;
	}
}

function GetMoreCoinsPrompt()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("NOT ENOUGH STAR COINS!");
	shop.dialogBox.Show("You need more coins!", GotoGetMoreCoins);
	shop.dialogBox.SetYesNo("Get Coins","No, thanks");
	//shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index);
	shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index, false);
	shop.dialogBox.SetName(itemName);
}

function GotoGetMoreCoins()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTO STARCOINS MENU");
	shop.GetStarcoins();
}

function Equip()
{
	for (var i:int=0;i<shop.wandItems.length;i++)
	{
		if (shop.wandItems[i].state==WandState.Equipped)
		{
			shop.wandItems[i].SetState(WandState.Equip);
		}
	}
	SetState(WandState.Equipped);
	var wandCode:int=wandType;
	pm.SetWandBitmask(wandCode);
}

function PerformTap()
{
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("TapPerformed:" + gameObject.transform.parent.gameObject.name);
	
	
	if (state==WandState.Unavailable)
	{
		
	}
	else if (state==WandState.Available)
	{
		PromptToBuy();
	}
	else if (state==WandState.Equipped)
	{
		ShowInfo();
	}
	else if (state==WandState.Equip)
	{
		Equip();
		/*
		shop.dialogBox.Show(description,Equip);
		shop.dialogBox.SetYesNo("Equip","No, thanks");
		shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index);
		shop.dialogBox.SetName(itemName);
		*/
		//if ( Wizards.Utils.DEBUG ) Debug.Log("equip");
		
	}
	
}

function PromptToBuy()
{
	shop.dialogBox.Show(description,Buy);
	shop.dialogBox.SetYesNo("Buy","No, thanks");
	// PJC ex2d old -> shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index);
	shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index, false);
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
	
	if ( state == WandState.Available )
	{
		PromptToBuy();
	}
	else if ( state == WandState.Equip )
	{
		PromptToEquip();
	}
	else if ( state == WandState.Equipped )
	{
		ShowInfo();
	}
}

function PromptToEquip()
{
	shop.dialogBox.Show(description,Equip);
	shop.dialogBox.SetYesNo("Equip","No, thanks");
	//shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index);
	shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index, false);
	//shop.dialogBox.graphics.color=wandGraphics.color;
	shop.dialogBox.SetName(itemName);
}

function ShowInfo()
{
	shop.dialogBox.Show(description, null);
	shop.dialogBox.SetYesNo("", "Dismiss");
	//shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index);
	shop.dialogBox.graphics.SetSprite(wandGraphics.atlas,wandGraphics.index, false);
	//shop.dialogBox.graphics.color=broomGraphics.color;
	shop.dialogBox.SetName(itemName);
}

