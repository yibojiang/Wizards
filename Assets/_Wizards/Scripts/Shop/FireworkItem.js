enum ExplosionState
{
	Unavailable,
	Available,
	Equipped,
	Equip
}



var state:ExplosionState;

var level:int;

var text:exSpriteFont;

var button:UIButton;

var pm:ProfileManager;

var price:int;

var shop:ShopController;

var itemName:String;
var itemNameText:exSpriteFont;


var description:String;

var explosionGraphics:exSprite;

var explosionGraphicsDisplay : GameObject;

var explosionType:FireworkExplosion;

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
	text.useMultiline = true;
	text.lineSpacing = -1.408145;
	text.textAlign = exSpriteFont.TextAlign.Center;
	text.transform.localPosition.y = -2.720703;
	itemName=itemNameText.text;
	
	
	button=this.GetComponent(UIButton) as UIButton;
	
	button.scriptWithMethodToInvoke=this;
	button.methodToInvoke="PerformTap";
	
	if ( explosionType == FireworkExplosion.FWsBurst02 )
	{
		pm.SetShopItemState(itemName, ShopItemState.SoldOut);
		pm.SetFireworkExplosion(explosionType, 1);
		pm.SetFireworkExplosionEnable(explosionType, 1);
	}
	
	var itemState:ShopItemState=pm.GetShopItemState(itemName);
	if (itemState==ShopItemState.Available)
	{
		state=ExplosionState.Available;
	}
	else if  (itemState==ShopItemState.UnAvailable)
	{
		state=ExplosionState.Unavailable;
	}
	else if  (itemState==ShopItemState.SoldOut)
	{
		state=ExplosionState.Equip;
		//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Need to have another shop saved state here i think, otherwise if equipped, but exit shop, when returning item will not be equipped");
	}
	
	if (!pm.GetFireworkExplosion(explosionType))
	{
		state=ExplosionState.Unavailable;
	}
	
	text.text=""+state;
	
	if (state==ExplosionState.Available)
	{
		text.scale.x = 0.3;
		text.scale.y = 0.3;
		text.text=""+price;
	}
	else if (state==ExplosionState.Unavailable)
	{
		text.scale.x = 0.2;
		text.scale.y = 0.2;
		
		var wm : WizardLevelManager = GameObject.Find("WizardLevelManager").GetComponent(WizardLevelManager) as WizardLevelManager;
		
		for ( var j : int = 0; j < wm.levelRewards.length; ++j)
		{
			if ( explosionType == wm.levelRewards[j].explosionUnlock && wm.levelRewards[j].rewardType == RewardType.FireWorkUnlock )
			{
				text.text="Locked\nReq. Lvl " + (j + 1);
				break;
			}
		}
	}
	
	
	
}

function SetState(_state:ExplosionState)
{
	state=_state;
	text.text=""+state;
	
	if (state==ExplosionState.Available)
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
		SetState(ExplosionState.Equip);
		
		Equip();
		
		// var newEvent : CountlyEvent = new CountlyEvent();
		
		// newEvent.Key = "BuyFireworkItem";
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
	}
}

function GetMoreCoinsPrompt()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("NOT ENOUGH STAR COINS!");
	shop.dialogBox.Show("You need more coins!", GotoGetMoreCoins);
	shop.dialogBox.SetYesNo("Get Coins","No, thanks");
	//shop.dialogBox.graphics.SetSprite(explosionGraphics.atlas,explosionGraphics.index);
	shop.dialogBox.SetName(itemName);
}

function GotoGetMoreCoins()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTO STARCOINS MENU");
	shop.GetStarcoins();
}

function Equip()
{
	
	SetState(ExplosionState.Equipped);
	pm.SetFireworkExplosionEnable(explosionType,1);
	
}

function Unequip()
{
	SetState(ExplosionState.Equip);
	pm.SetFireworkExplosionEnable(explosionType,0);
}

function PerformTap()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(transform.parent.parent.position);
	if ( transform.parent.parent.localPosition.x < -1.0 || transform.parent.parent.localPosition.x > 1.0 )
	{
		// We're not in a valid position, dont process tap
		return;
	}
	
	//if ( explosionType != FireworkExplosion.FWsBurst02 )
	//{
		if (state==ExplosionState.Unavailable)
		{
			ShowInfo();
		}
		else if (state==ExplosionState.Available)
		{
			PromptToBuy();
			
		}
		else if (state==ExplosionState.Equipped)
		{
			if ( shop.NumExplosionsEquipped() > 1 )
			{
				Unequip();
			}
			else
			{
				ShowMustHaveOneEquippedDialog();
			}
		}
		else if (state==ExplosionState.Equip)
		{
			Equip();
		}
	//}
}

function PromptToBuy()
{
	shop.dialogBox.Show(description,Buy);
	shop.dialogBox.SetYesNo("Buy","No, thanks");
	//shop.dialogBox.graphics.SetSprite(explosionGraphics.atlas,explosionGraphics.index);
	AddFireworkVisualToDialogBox();
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
	
	if ( state == ExplosionState.Available )
	{
		PromptToBuy();
	}
	else if ( state == ExplosionState.Equip )
	{
		PromptToEquip();
	}
	else if ( state == ExplosionState.Equipped || state == ExplosionState.Unavailable )
	{
		ShowInfo();
	}
}

function PromptToEquip()
{
	shop.dialogBox.Show(description,Equip);
	shop.dialogBox.SetYesNo("Equip","No, thanks");
	//shop.dialogBox.graphics.SetSprite(explosionGraphics.atlas,explosionGraphics.index);
	AddFireworkVisualToDialogBox();
	shop.dialogBox.SetName(itemName);
}

function ShowInfo()
{
	shop.dialogBox.Show(description, null);
	shop.dialogBox.SetYesNo("", "Dismiss");
	//shop.dialogBox.graphics.SetSprite(explosionGraphics.atlas,explosionGraphics.index);
	AddFireworkVisualToDialogBox();
	shop.dialogBox.SetName(itemName);
}

function AddFireworkVisualToDialogBox()
{
	if ( explosionGraphicsDisplay != null )
	{
		var go : GameObject = Instantiate(explosionGraphicsDisplay);
		shop.dialogBox.SetFireworkVisual(go);
	}
}

function ShowMustHaveOneEquippedDialog()
{
	shop.dialogBox.Show("Javie, you need at least one firework equipped for the show!", null);
	shop.dialogBox.SetYesNo("", "OK");
	//shop.dialogBox.graphics.SetSprite(explosionGraphics.atlas,explosionGraphics.index);
	AddFireworkVisualToDialogBox();
	shop.dialogBox.SetName(itemName);
}