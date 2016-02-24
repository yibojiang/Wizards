import System.Collections.Generic;
import System.Text.RegularExpressions;
var submenuPosition:Vector3;
var cameraFade:CameraFade;
var shelf:GameObject;
var wheel:GameObject;
var touched:boolean;
var touchPos:Vector3;
var ray:Ray;
var hit : RaycastHit;
var curWheel:ShopWheel;
private var wheeltargetRotation:float;
private var shelftargetPosition:float;

var am:AudioManager;
var bgmManager:BgmManager;


var starcoinsText:exSpriteFont;
var starcoinsText2:exSpriteFont;
var starcoinsCount:int;
var pm:ProfileManager;
var dir:float;
var movePos:Vector3;
var achievementManager:AchievementManagerMainMenu;


var smallPackText:exSpriteFont;
var normalPackText:exSpriteFont;
var bigPackText:exSpriteFont;

var tapPointsCache:int=0;

#if UNITY_IPHONE
// private var _products:List.<StoreKitProduct>;
#endif

private var pausing:boolean=false;

var waitingDialog:WaitingDialog;

var price:exSpriteFont[];

//wand items
var wandItems:WandItem[];
var broomItems:BroomItem[];
var explosionItems:FireworkItem[];

var specialItems:SpecialItem[];

var dialogBox:ShopDialog;

var enableAllFireworks : boolean = false;

var jesterText : String[];

var productListReceived : boolean = false;

var productWaitingValidation : String;

// var transactionToVerify : StoreKitTransaction;

enum ShopWheel
{
	Broom,
	Wand,
	SFW
}

function Awake()
{
	cameraFade=Camera.main.GetComponent(CameraFade) as CameraFade;
	bgmManager=GameObject.Find("BgmManager").GetComponent(BgmManager) as BgmManager;
	am=GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	
	
	
	
	
	
	
}

// Debug function only
function EnableAllFireworks()
{
	for ( var k : int = 0; k < explosionItems.length; ++k )
	{
		pm.SetFireworkExplosion(k, 1);
		//pm.SetFireworkExplosionEnable(k, 1);
		
		explosionItems[k].SetState(ExplosionState.Available);
	}
}

function Start()
{
	starcoinsCount=pm.GetRecord(Record.StarCoins);
	if ( enableAllFireworks )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("ALL FIREWORKS CHEAT ENABLED!");
		
		EnableAllFireworks();
	}
	
	var wandObj:GameObject[]=GameObject.FindGameObjectsWithTag("WandItem");
	wandItems=new WandItem[wandObj.length];
	var code:int=pm.GetWandBitmask();
	for (var i:int=0;i<wandItems.length;i++)
	{
		wandItems[i]=wandObj[i].GetComponent(WandItem);
		var wandCode:int=wandItems[i].wandType;	
		
		if (wandItems[i].state==WandState.Equipped)
		{
			wandItems[i].SetState(WandState.Equip);
		}
		
		if (wandCode==code)
		{
			wandItems[i].SetState(WandState.Equipped);
		}
	}
	
	var broomLevel:int=pm.GetBroomLevel();
	var broomObj:GameObject[]=GameObject.FindGameObjectsWithTag("BroomItem");
	broomItems= new BroomItem[broomObj.length];
	for ( i=0;i<broomItems.length;i++)
	{
		broomItems[i]=broomObj[i].GetComponent(BroomItem);
		var level:int=broomItems[i].level;	
		
		if (broomItems[i].state==BroomState.Equipped)
		{
			broomItems[i].SetState(BroomState.Equip);
		}
		
		if (broomLevel==level)
		{
			broomItems[i].SetState(BroomState.Equipped);
		}
	}	
	
	var explosionObj:GameObject[]=GameObject.FindGameObjectsWithTag("FireworkItem");
	explosionItems= new FireworkItem[explosionObj.length];
	for ( i=0;i<explosionItems.length;i++)
	{
		explosionItems[i]=explosionObj[i].GetComponent(FireworkItem);
		
		if (pm.GetFireworkExplosionEnable(explosionItems[i].explosionType))
		{
			explosionItems[i].SetState(ExplosionState.Equipped);
		}
		

	}
	
	var curCode:int=pm.GetSpecialItemmask();
	var specialObj:GameObject[]=GameObject.FindGameObjectsWithTag("SpecialItem");
	specialItems= new SpecialItem[specialObj.length];
	for ( i=0;i<specialItems.length;i++)
	{
		specialItems[i]=specialObj[i].GetComponent(SpecialItem);
		var itemCode:int=specialItems[i].itemCode;
		if (curCode & itemCode)
		{	
			specialItems[i].SetState(ItemState.Equipped);
		}
	}
	
		

	touched=false;
	
	//Regrist Listener for iap
	if ( Wizards.Utils.DEBUG ) Debug.Log("REQUESTING PRODUCT DATA");
	#if UNITY_IPHONE
	RequestProductData();
	#endif
	//CheckIAPState();
	
	
	//initTapJoy();
	
}

function OnEnable()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("ENABLE SHOP IAP CALLBACKS");
	#if UNITY_IPHONE
	// StoreKitManager.purchaseSuccessfulEvent+=StarcoinsPackGot;
	// StoreKitManager.productListReceivedEvent+=ReuqestFinished;
	// StoreKitManager.purchaseFailedEvent += purchaseFailed;
	// StoreKitManager.purchaseCancelledEvent += purchaseCancelled;
	
	//StoreKitManager.receiptValidationFailedEvent += receiptValidationFailed;
	//StoreKitManager.receiptValidationRawResponseReceivedEvent += receiptValidationRawResponseReceived;
	//StoreKitManager.receiptValidationSuccessfulEvent += receiptValidationSuccessful;
	#endif
}

function OnDisable()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("DISABLE SHOP IAP CALLBACKS");
	#if UNITY_IPHONE
	// StoreKitManager.purchaseSuccessfulEvent-=StarcoinsPackGot;
	// StoreKitManager.productListReceivedEvent-=ReuqestFinished;
	// StoreKitManager.purchaseFailedEvent -= purchaseFailed;
	// StoreKitManager.purchaseCancelledEvent -= purchaseCancelled;
	
	//StoreKitManager.receiptValidationFailedEvent -= receiptValidationFailed;
	//StoreKitManager.receiptValidationRawResponseReceivedEvent -= receiptValidationRawResponseReceived;
	//StoreKitManager.receiptValidationSuccessfulEvent -= receiptValidationSuccessful;
	#endif
}
/*
function receiptValidationFailed( error : String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: receipt validation failed with error: " + error );
	//waitingDialog.Hide();
	
	if ( error.Contains("21007") )
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("SANDBOX MODE DETECTED : Trying to verify with sandbox server");
		StoreKitBinding.validateReceipt(transactionToVerify.base64EncodedTransactionReceipt, true);	
	}
	else
	{
		pausing=false;
		waitingDialog.Show(NoticeState.Failed,"Failed to validate purchase...");// + error);
	}
}

function receiptValidationRawResponseReceived( response : String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: receipt validation raw response: " + response );
}
*/

		
function CheckBigSpenderAchievement()
{
	var bigSpender : boolean = true;
	
	if ( bigSpender )
	{
		for ( var i : int = 0;i < specialItems.length; i++)
		{
			if ( pm.GetShopItemState(specialItems[i].itemName) != ShopItemState.SoldOut)
			{
				bigSpender = false;
				break;
			}
		}
	}
	
	if ( bigSpender )
	{
		for ( i=0;i<explosionItems.length;i++)
		{
			if ( pm.GetShopItemState(explosionItems[i].itemName) != ShopItemState.SoldOut)
			{
				bigSpender = false;
				break;
			}
		}
	}
	
	if ( bigSpender )
	{
		for ( i=0;i<broomItems.length;i++)
		{
			if ( pm.GetShopItemState(broomItems[i].itemName) != ShopItemState.SoldOut)
			{
				bigSpender = false;
				break;
			}
		}
	}
	
	if ( bigSpender )
	{
		for ( i=0;i<wandItems.length;i++)
		{
			if ( pm.GetShopItemState(wandItems[i].itemName) != ShopItemState.SoldOut)
			{
				bigSpender = false;
				break;
			}
		}
	}
	
	if ( bigSpender	)
	{
		achievementManager.UnlockAchievement(Achievement.Big_Spender);
	}
}	


function NumExplosionsEquipped() : int
{
	var numExplosionsEquipped : int = 0;
	
	for ( var i : int = 0; i < explosionItems.length; ++i )
	{
		if  (explosionItems[i].state == ExplosionState.Equipped )
		{
			numExplosionsEquipped++;
		}
	}
	
	return ( numExplosionsEquipped );
}

function purchaseFailed(  error:String )
{
	pausing=false;
	waitingDialog.Show(NoticeState.Failed,"Failed to connect the apple server..");
	//waitingDialog.Hide();
	if ( Wizards.Utils.DEBUG ) Debug.Log( "purchase failed with error: " + error );
}

function purchaseCancelled( error:String )
{
	pausing=false;
	waitingDialog.Hide();
	if ( Wizards.Utils.DEBUG ) Debug.Log( "purchase cancel with error: " + error );
}

function CheckIAPState()
{
	if (pm.GetStarCoinPack(StarcoinsPack.Small)==0 )
	{
		smallPackText.text="GET";
	}
	else
	{
		SetBought(smallPackText);
	}
	
	if (pm.GetStarCoinPack(StarcoinsPack.Normal)==0 )
	{
		normalPackText.text="GET";
	}
	else
	{
		SetBought(normalPackText);
	}
	
	if (pm.GetStarCoinPack(StarcoinsPack.Large)==0 )
	{
		bigPackText.text="GET";
	}
	else
	{
		SetBought(bigPackText);
	}
}

function GotoSubmenuHit()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GOTOSUBMENU HIT!");
	cameraFade.FadeTo(this.gameObject,"GotoSubmenu");
	var random:int=Random.Range(5,8);
	am.PlayOneShotAudio(am.jesterVoice[random],am.voiceVol);
	GameObject.Find("Submenu").GetComponent(SubmenuController).submenuState = SubmenuState.Submenu;
}

function GotoSubmenu()
{
	cameraFade.gameObject.transform.position=submenuPosition;
	bgmManager.FadeBGM(bgmManager.menuBGM,BGM.Submenu);
	
}

function GetStarcoins()
{
	iTween.MoveTo(cameraFade.gameObject,iTween.Hash("time",1,"y",-246,"easeType",iTween.EaseType.easeInOutQuad,"oncompleteTarget",this.gameObject,"oncomplete","RequestProductData"));
}

function GobackShop()
{
	if (pausing)
	{
		return;
	}
	iTween.MoveTo(cameraFade.gameObject,iTween.Hash("time",1,"y",-17,"easeType",iTween.EaseType.easeInOutQuad));
}

function Update () 
{
	
	if (pausing)
	{
		return;
	}
	
	#if UNITY_EDITOR
	if ( enableAllFireworks )
	{
		//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("ALL FIREWORKS CHEAT ENABLED!");
		
		EnableAllFireworks();
	}
	
	if ( Input.GetKeyDown(KeyCode.F) )
	{
		EnableAllFireworks();
	}
	
	if ( Input.GetKeyDown(KeyCode.C) )
	{
		starcoinsCount += 500;
	}
	#endif
	
	
	starcoinsText.text=""+starcoinsCount;
	starcoinsText2.text=""+starcoinsCount;
	
	
	if ( Input.touchCount > 0 )
	{
		var touch : Touch = Input.GetTouch(0);
		
		if ( touch.phase == TouchPhase.Began )
		{
			touchPos = touch.position;
			ray = Camera.main.ScreenPointToRay(touchPos);
			
			PerformTap(ray);
							
		}
		
		if ( touch.phase == TouchPhase.Moved && touched)
		{
			/*
			movePos= touch.position;
			dir=movePos.x-touchPos.x;
			wheel.transform.eulerAngles.z-=dir;
			touchPos= touch.position;
			*/
		}
		
		if ( touch.phase == TouchPhase.Ended && touched)
		{
			touched = false;
			/*
			iTween.MoveTo(shelf,iTween.Hash("islocal",true,"x",shelftargetPosition,"time",0.5));
			
			am.PlayOneShotAudio(am.registerCash,am.FXVol);
			*/
		}
	}
	
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	
	if ( Input.GetMouseButtonUp(0) )
	{
		if (touched)
		{
			touched=false;

		}
	}
	else if ( Input.GetMouseButtonDown(0) )
	{
		touchPos=Input.mousePosition;
		ray = Camera.main.ScreenPointToRay(touchPos);
		PerformTap(ray);
	}
	else 
	{
		if (touched)
		{
			//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("Not executing???");
			movePos= Input.mousePosition;
			dir=movePos.x-touchPos.x;
			wheel.transform.eulerAngles.z-=dir;
			touchPos= Input.mousePosition;

		
		}
		
	}
	
	#endif
	
}

#if UNITY_IPHONE
function RequestProductData()
{	
	if ( productListReceived )
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("Product list already received, don't need to fetch again.");
		return;
	}
	
	// if ( StoreKitBinding.canMakePayments())
	// {
	// 	if ( Wizards.Utils.DEBUG ) Debug.Log("requesting");
	// 	var id=new String[3];
	// 	id[0]="smallbagofstarcoins";
	// 	id[1]="heavybagofstarcoins";
	// 	id[2]="giantbagofstarcoins";
	// 	StoreKitBinding.requestProductData(id);
	// }
}

// function ReuqestFinished(productList:List.<StoreKitProduct>  )
// {	
// 	if ( Wizards.Utils.DEBUG ) Debug.Log("requestfinished");
	
// 	_products=productList;
	
// 	if ( _products.Count > 0 )
// 	{
// 		productListReceived = true;
// 	}
	
// 	if ( productListReceived )
// 	{
	
// 		for ( var i : int = 0; i < _products.Count; ++i)
// 		{
// 			if (_products[i].productIdentifier == "smallbagofstarcoins")
// 			{
// 				price[0].text=_products[i].formattedPrice;	
// 			}
// 			else if (_products[i].productIdentifier == "heavybagofstarcoins")
// 			{
// 				price[1].text=_products[i].formattedPrice;	
// 			}
// 			else if (_products[i].productIdentifier == "giantbagofstarcoins")
// 			{
// 				price[2].text=_products[i].formattedPrice;	
// 			}
// 		}
// 	}
// }

// function StarcoinsPackGot(_transaction :StoreKitTransaction)
// {
// 	transactionToVerify = new StoreKitTransaction();
// 	transactionToVerify = _transaction;
	
// 	productWaitingValidation = transactionToVerify.productIdentifier;
	
// 	PurchaseSuccessful(productWaitingValidation);
	
// }

function PurchaseSuccessful(_item : String)
{	
	if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: PurchaseSuccessful()" );
	waitingDialog.Hide();
	pausing=false;
	if (_item=="smallbagofstarcoins")
	{
		StarcoinsSmallGot();
	}
	else if (_item=="heavybagofstarcoins")
	{
		StarcoinsNormalGot();
	}
	else if (_item=="giantbagofstarcoins")
	{
		StarcoinsLargeGot();
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: receipt validation successful - UNKNOWN PRODUCT :" + _item);
	}
	
	productWaitingValidation = "";
}

/*
function receiptValidationSuccessful()
{	
	if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: receipt validation successful" );
	waitingDialog.Hide();
	pausing=false;
	if (productWaitingValidation=="smallbagofstarcoins")
	{
		StarcoinsSmallGot();
	}
	else if (productWaitingValidation=="heavybagofstarcoins")
	{
		StarcoinsNormalGot();
	}
	else if (productWaitingValidation=="giantbagofstarcoins")
	{
		StarcoinsLargeGot();
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log( "SHOPCONTROL: receipt validation successful - UNKNOWN PRODUCT :" + productWaitingValidation);
	}
	
	productWaitingValidation = "";
}
*/
#endif
function RecoverAllIAP()
{
/*
	var transactionList:List.<StoreKitTransaction>  = StoreKitBinding.getAllSavedTransactions();
	if( transactionList.Count > 0 )
	{
		StoreKitBinding.validateReceipt( transactionList[0].base64EncodedTransactionReceipt, true );
	}
	*/
}

function StarcoinsSmallGot()
{
	//Temp fot test
	pm.IncrementRealStarcoins(5000);
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	starcoinsCount=pm.GetRecord(Record.StarCoins);
	
	// pm.SetStarCoinPack(StarcoinsPack.Small,1);
	// SetBought(smallPackText);
	// smallPackText.text="Bought";
	
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	PlayerPrefs.Save();
}

function StarcoinsNormalGot()
{
	pm.IncrementRealStarcoins(15000);
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	starcoinsCount=pm.GetRecord(Record.StarCoins);
	
	// pm.SetStarCoinPack(StarcoinsPack.Normal,1);
	// SetBought(normalPackText);
	//normalPackText.text="Bought";
	
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	PlayerPrefs.Save();
}

function StarcoinsLargeGot()
{
	pm.IncrementRealStarcoins(30000);
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	starcoinsCount=pm.GetRecord(Record.StarCoins);
	
	// pm.SetStarCoinPack(StarcoinsPack.Large,1);
	// SetBought(bigPackText);
	// bigPackText.text="Bought";
	
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	PlayerPrefs.Save();
}


function SetBought(_text:exSpriteFont)
{
	_text.text="Bought";
}

function SetBuy(_text:exSpriteFont)
{
	_text.text="Buy";
}

function PerformTap(_ray:Ray)
{
	if (Physics.Raycast(_ray, hit, 1500.0) )
	{
       	if ( hit.transform.name == "Jester" )
    	{
    		if ( pm.TalkToJesterCount() > (jesterText.Length / 2) )
    		{
    			achievementManager.UnlockAchievement(Achievement.Small_Talker);
    		}
    		
    		var randomText : int = Random.Range(0, jesterText.Length);
    		
    		var text : String = jesterText[randomText];
    		
    		dialogBox.ShowStory(text);
    		
    		//dialogBox.ShowStory("hello, nice to meet you !");
           	
			//touched=true;
	    }
	    
	    /*//for tapjoy
	    if ( hit.transform.name == "FreeStarcoin" )
    	{
           	
			TapjoyPlugin.ShowOffers();
	    }
	    */
	    if ( hit.transform.name == "Cheat" )
    	{
			pm.IncrementRealStarcoins(5000);
			am.PlayOneShotAudio(am.registerCash,am.FXVol);
			starcoinsCount=pm.GetRecord(Record.StarCoins);
			EnableAllFireworks();
	    }
	    
	    #if UNITY_IPHONE
	    if ( hit.transform.name == "Buysmall" )
    	{
    		// if (_products != null && _products.Count > 0)
    		// {
		    // 	if (pm.GetStarCoinPack(StarcoinsPack.Small)==0 )
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BUY SMALL");
		    // 		StoreKitBinding.purchaseProduct("smallbagofstarcoins",1);
		    // 		waitingDialog.Show(NoticeState.Waiting,"Connecting to apple sever");
		    // 		pausing=true;
		    // 	}
		    // 	else
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BOUGHT");
		    // 	}
	    	// }
	    	// else 
	    	// {
	    	// 	waitingDialog.Show(NoticeState.Failed,"Fail to connect the apple server..");
	    	// 	if ( Wizards.Utils.DEBUG ) Debug.Log("can't get products");
	    	// }
	    
	    }
	    
	    if ( hit.transform.name == "Buymid" )
    	{
    	
	    	// if (_products != null && _products.Count > 0)
    		// {
		    // 	if (pm.GetStarCoinPack(StarcoinsPack.Normal)==0 )
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BUY MIDDLE");
		    // 		// StoreKitBinding.purchaseProduct("heavybagofstarcoins",1);
		    // 		waitingDialog.Show(NoticeState.Waiting,"Connecting to apple sever");
		    // 		pausing=true;
		    // 	}
		    // 	else
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BOUGHT");
		    // 	}
	    	// }
	    	// else 
	    	// {
	    	// 	waitingDialog.Show(NoticeState.Failed,"Fail to connect the apple server..");
	    	// 	if ( Wizards.Utils.DEBUG ) Debug.Log("can't get products");
	    	// }
	    }
	    
	    if ( hit.transform.name == "Buylarge" )
    	{
	    	// if (_products != null && _products.Count > 0)
    		// {
		    // 	if (pm.GetStarCoinPack(StarcoinsPack.Large)==0 )
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BUY LARGE");
		    // 		StoreKitBinding.purchaseProduct("giantbagofstarcoins",1);
		    // 		waitingDialog.Show(NoticeState.Waiting,"Connecting to apple sever");
		    // 		pausing=true;
		    // 	}
		    // 	else
		    // 	{
		    // 		if ( Wizards.Utils.DEBUG ) Debug.Log("BOUGHT");
		    // 	}
	    	// }
	    	// else 
	    	// {
	    	// 	waitingDialog.Show(NoticeState.Failed,"Fail to connect the apple server..");
	    	// 	if ( Wizards.Utils.DEBUG ) Debug.Log("can't get products");
	    	// }
	    }
	    #endif
	    

	    
	    if ( hit.transform.name == "ResetShop" )
    	{
    		
			am.PlayOneShotAudio(am.registerCash,am.FXVol);
			
			pm.SetStarCoinPack(StarcoinsPack.Small,0);
			pm.SetStarCoinPack(StarcoinsPack.Normal,0);
			pm.SetStarCoinPack(StarcoinsPack.Large,0);
			
			pm.SetRecord(Record.StarCoins,0);
			
			SetBuy(smallPackText);
			SetBuy(normalPackText);
			SetBuy(bigPackText);
			
			starcoinsCount=pm.GetRecord(Record.StarCoins);
	    }
	    
	    
	 
	}
	
}

/*

function initTapJoy()
{
	
	//init tapjoy
	// This MUST be set before any other Tapjoy method calls if notifications are to be used.
	TapjoyPlugin.SetCallbackHandler("Shop");
	// Init Tapjoy Connect
	TapjoyPlugin.RequestTapjoyConnect("2926a095-0cdc-4c48-b77d-5fd5e1a32665", "yrLlgCV3RXWDUSOobhSt");

	TapjoyPlugin.SetTransitionEffect((TapjoyTransition.TJCTransitionExpand) );
    TapjoyPlugin.SetUserDefinedColorWithIntValue(0x808080);
    
    // Get Tap Points of this user. The user ID defaults to the UDID of this device.
	// It doesn't need to be set if Tapjoy Managed currency is used.
	TapjoyPlugin.GetTapPoints();

	// Send request for display ad.
	//TapjoyPlugin.GetDisplayAd();

	TapjoyPlugin.SetFeaturedAppDisplayCount(TapjoyPlugin.TJC_FEATURED_COUNT_INF);
	
    // Inidicate that video ads should be initialized and enabled. Video ads will load in the offer wall when this is called.
    //TapjoyPlugin.InitVideoAd();
    // By default, video cache count is set to 5. This is here for reference.
    //TapjoyPlugin.SetVideoCacheCount(5);

	// Initialize virtual goods.
	//TapjoyPlugin.InitVirtualGoods();

}

function VirtualGoodPurchaseComplete(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function CurrencyEarned(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("currency earned message: "+message);
	
	
	//var numbersOnly:String = Regex.Replace(message, "[^0-9]", "");
	
	
	TapjoyPlugin.ShowDefaultEarnedCurrencyAlert();
	tapPointsCache=TapjoyPlugin.QueryTapPoints();
	if ( Wizards.Utils.DEBUG ) Debug.Log("TAP POINTS: "+tapPointsCache);
	TapjoyPlugin.SpendTapPoints(tapPointsCache);
	
	
}

function FeaturedAppLoaded(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
	
	TapjoyPlugin.ShowFeaturedAppFullScreenAd();
}

function VideoAdBegan(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function VideoAdClosed(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function TapjoyConnectSuccess(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function TapjoyConnectFail(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function TapPointsLoaded(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("TapjoyPoints"+TapjoyPlugin.QueryTapPoints());
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}

function TapPointsLoadedError(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
}


function TapPointsSpent(message:String)
{
	pm.IncrementRealStarcoins(tapPointsCache);
	am.PlayOneShotAudio(am.registerCash,am.FXVol);
	starcoinsCount=pm.GetRecord(Record.StarCoins);
	
	if ( Wizards.Utils.DEBUG ) Debug.Log("TAP POINTS SPENT: "+TapjoyPlugin.QueryTapPoints());
	//if ( Wizards.Utils.DEBUG ) Debug.Log(message);
	
}

function TapPointsSpendError(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
	
}

function TapPointsAwarded(message:String)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log(message);
	
}

*/