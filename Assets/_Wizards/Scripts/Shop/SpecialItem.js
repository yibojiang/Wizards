enum ItemState
{
	Unavailable,
	Available,
	Equipped,
	Equip,

}

var state:ItemState;

var text:exSpriteFont;

var button:UIButton;

var pm:ProfileManager;

var price:int;

var shop:ShopController;

var itemName:String;
var itemNameText:exSpriteFont;


var description:String;

var itemGraphics:exSprite;
var itemCode:ItemMask;

var itemGraphicsSpecial:GameObject;

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
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log(itemName);

	var itemState:ShopItemState=pm.GetShopItemState(itemName);
	
	//var state1:ShopItemState=pm.GetShopItemState("Heart");
	//if ( Wizards.Utils.DEBUG ) Debug.Log(state1);
	//if ( Wizards.Utils.DEBUG ) Debug.Log(itemState);
	
	if (itemState==ShopItemState.Available)
	{
		state=ItemState.Available;
	}
	else if  (itemState==ShopItemState.UnAvailable)
	{
		state=ItemState.Unavailable;
	}
	else if  (itemState==ShopItemState.SoldOut)
	{
		state=ItemState.Equip;
	}
	
	
	text.text=""+state;
	
	if (state==ItemState.Available)
	{
		text.text=""+price;
	}
	else if (state==ItemState.Unavailable)
	{
		text.text="Locked";
	}
	
	
	
}

function SetState(_state:ItemState)
{
	state=_state;
	text.text=""+state;
	
	if (state==ItemState.Available)
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
		SetState(ItemState.Equip);
		
		Equip();
		
		// var newEvent : CountlyEvent = new CountlyEvent();
		
		// newEvent.Key = "BuySpecialItem";
		// newEvent.Count = 1;
		// newEvent.Sum = price;
		// newEvent.Segmentation = new Dictionary.<String, String>();
		
		// newEvent.Segmentation["Name"] = itemName;
		
		// Countly.Instance.PostEvent(newEvent);
		
		shop.CheckBigSpenderAchievement();
	}
	else
	{
		GetMoreCoinsPrompt();
		return;
	}
	
	HideItemGraphics();
}

function GetMoreCoinsPrompt()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("NOT ENOUGH STAR COINS!");
	shop.dialogBox.Show("You need more coins!", GotoGetMoreCoins);
	shop.dialogBox.SetYesNo("Get Coins","No, thanks");
	ShowItemGraphics();
	shop.dialogBox.SetName(itemName);
	shop.dialogBox.SetCancelFunction(HideItemGraphics);
	shop.dialogBox.callCancelImmediate = true;
}

function ShowItemGraphics()
{
	if ( itemGraphicsSpecial != null )
	{
		shop.dialogBox.callCancelImmediate = true;
		while ( shop.dialogBox.graphics.GetComponent.<Renderer>().enabled == false )
		{
			yield;
		}

		itemGraphicsSpecial.SetActiveRecursively(true);
		shop.dialogBox.graphics.GetComponent.<Renderer>().enabled = false;
		
		//itemGraphicsSpecial.transform.position = shopPosition
	}
	else if ( itemGraphics != null )
	{
		yield WaitForSeconds(0.36);
		shop.dialogBox.graphics.GetComponent.<Renderer>().enabled = true;
		//shop.dialogBox.graphics.SetSprite(itemGraphics.atlas,itemGraphics.index);
		shop.dialogBox.graphics.SetSprite(itemGraphics.atlas,itemGraphics.index, false);
	}
}

function HideItemGraphics()
{
	if ( itemGraphicsSpecial != null )
	{
		//shop.dialogBox.graphics.renderer.enabled = true;
		itemGraphicsSpecial.SetActiveRecursively(false);
		//itemGraphicsSpecial.transform.position = shopPosition
	}
}

function GotoGetMoreCoins()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTO STARCOINS MENU");
	shop.GetStarcoins();
	HideItemGraphics();
}

function Equip()
{
	var curCode:int=pm.GetSpecialItemmask();
	var code:int=itemCode;
	if ( Wizards.Utils.DEBUG ) Debug.Log(curCode);
	curCode=curCode|code;
	if ( Wizards.Utils.DEBUG ) Debug.Log(curCode);
	pm.SetSpecialItemmask(curCode);
	SetState(ItemState.Equipped);
	
	HideItemGraphics();
	
}

function Unequip()
{
	var curCode:int=pm.GetSpecialItemmask();
	var code:int=itemCode;
	if (curCode & code)
	{
		curCode=curCode^code;
		pm.SetSpecialItemmask(curCode);
	}
	SetState(ItemState.Equip);
}

function PerformTap()
{
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	
	if (state==ItemState.Unavailable)
	{
		
	}
	else if (state==ItemState.Available)
	{
		PromptToBuy();
	}
	else if (state==ItemState.Equipped)
	{
		Unequip();
	}
	else if (state==ItemState.Equip)
	{
		Equip();
		/*
		shop.dialogBox.Show(description,Equip);
		shop.dialogBox.SetYesNo("Equip","No, thanks");
		if (itemGraphics!=null)
		{
			shop.dialogBox.graphics.SetSprite(itemGraphics.atlas,itemGraphics.index);
		}
		shop.dialogBox.SetName(itemName);
		*/
		//if ( Wizards.Utils.DEBUG ) Debug.Log("equip");
	}
}

function PromptToBuy()
{
	shop.dialogBox.Show(description,Buy);
	shop.dialogBox.SetYesNo("Buy","No, thanks");
	ShowItemGraphics();
	shop.dialogBox.SetName(itemName);
	shop.dialogBox.SetCancelFunction(HideItemGraphics);
	shop.dialogBox.callCancelImmediate = true;
}

function InfoButtonPressed()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(transform.parent.parent.position);
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	
	if ( state == ItemState.Available )
	{
		PromptToBuy();
	}
	else if ( state == ItemState.Equip )
	{
		PromptToEquip();
	}
	else if ( state == ItemState.Equipped )
	{
		ShowInfo();
	}
}

function PromptToEquip()
{
	shop.dialogBox.Show(description,Equip);
	shop.dialogBox.SetYesNo("Equip","No, thanks");
	ShowItemGraphics();
	//shop.dialogBox.graphics.color=itemGraphics.color;
	shop.dialogBox.SetName(itemName);
	shop.dialogBox.SetCancelFunction(HideItemGraphics);
	shop.dialogBox.callCancelImmediate = true;
}

function ShowInfo()
{
	shop.dialogBox.Show(description, HideItemGraphics);
	shop.dialogBox.SetYesNo("", "Dismiss");
	ShowItemGraphics();
	//shop.dialogBox.graphics.color=itemGraphics.color;
	shop.dialogBox.SetName(itemName);
	shop.dialogBox.SetCancelFunction(HideItemGraphics);
	shop.dialogBox.callCancelImmediate = true;
}