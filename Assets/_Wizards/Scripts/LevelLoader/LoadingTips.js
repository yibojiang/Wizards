var tipText:SpriteText;

var tips:TipInfo[];

var rainbow:GameObject;
var showFWTips:boolean;
var fw:GameObject;

var pm:ProfileManager;

enum tipType
{
	Tip,
	Story
}

class TipInfo
{
	var type:tipType;
	var description:String;
}


function Awake()
{
	tipText=GetComponent(SpriteText);
	tips=new TipInfo[29];
	for (var i:int=0;i<tips.length;i++)
	{
		tips[i]=new TipInfo();
		tips[i].type=tipType.Tip;
	}
	
	tips[0].description="There are many ways to play Wizards.\nTry a different Wand, for a different unique experience !";
	tips[1].description="Make sure to exchange your StarCoins in the Shop.\nSome cool things are waiting for you.";
	tips[2].description="A true Wizard is patient and times his Move for a Perfect result.";
	tips[3].description="Don't Tap too quickly young wizard, wait till the last second for a Perfect Grading.";
	tips[4].description="There are many ways to play Wizards.\nTry a different Wand, for a different unique experience !";
	tips[5].description="Missing Secrets ? Make sure to tilt your phone, and have a look around";
	tips[6].description="Not sure how to play ?Make sure to go through the tutorial !Toto will be happy !";
	tips[7].description="Did you try the Swipe wand already ? If not you don’t know what you are missing. Get it in the shop";
	tips[8].description="Not enough different Fireworks Explosions in the Sky ?\nMake Score and Level Up to unlock them in the shop !!";
	tips[9].description="You can buy and equip many items in the shop, Check it out !";
	tips[10].description="If you want to succeed in the Magical Concert, be patient, and time your actions.Only a true Wizard can pass the Concert";
	tips[11].description="You earn star coins by combo. The higher your combo, the more star coins you earn.";
	tips[12].description="Tilting your device lets you control our Heroes.";
	tips[13].description="There are 3 Gradings in the Concert,\nPoor,\nGood,\nand Perfect !";
	tips[14].description="You can Build up a Chain by not missing a single Firework.";
	tips[15].description="The higher your chain, the higher the score bonus.";
	tips[16].description="If you see a star with rainbow trail, once you've stopped it, tap it as many times as you can!!!"; // SPECIAL TREATMENT - SHOWS THE RAINBOW GRAPHICS
	tips[17].description="Watch the white smoke trail closely, as it indicates your grading!! Poor, Good, Perfect"; // SPECIAL TREATMENT - SHOWS THE GRADINGS PICTURE
	tips[18].description="Have you seen a Rainbow Star ? Then Tap,tap and tap. Just don’t stop tapping that rascal !";
	tips[19].description="Make your own Firework Display in the sky,and equip just the explosions you like in the shop.";
	tips[20].description="Our friend Jester has all you need,if you have the Starcoins that is. Check the Shop out !";
	tips[21].description="If you see a Rain Bow Star don't stop hitting it till it Bangs!!!";
	tips[22].description="Have ideas you would like to share ? Drop us a line !";
	tips[23].description="Level Up to unlock more items and abilities";
	tips[24].description="Get a NEW Best in any stage and earn your self a starcoins reward";
	tips[25].description="Toto says” Only a fed cat ,is A happy cat” that we believe.";
	tips[26].description="The Magic Seal feeds on peoples positive energy to keep the evil in bane. Negative energy has the opposite effect!";
	tips[27].description="Only a few people know the true meaning and the horror of BM ! Want to be one of them ? Follow  us on facebook ! ";
	tips[28].description="Make sure to check out the achievements, but only a true Wizard can Master them all ! Are you one ?";
	
	

	var tipIndex:int=Random.Range(0,tips.length);
	//tipIndex=16;
	
	showFWTips=pm.GetShowTips();
	//showFWTips=true;
	if (showFWTips)
	{
		tipIndex=17;
		pm.SetShowTips(false);
	}
	
	tipText.Text=tips[tipIndex].description;
	
	if (tipIndex==17)
	{
		fw.SetActiveRecursively(true);
	}
	else
	{
		fw.SetActiveRecursively(false);
	}
	
	if (tipIndex==16)
	{
		rainbow.SetActiveRecursively(true);
	}
	else
	{
		rainbow.SetActiveRecursively(false);
	}
	
}

function Start()
{
	
	tipText.SetColor (Color(1,1,1,0));

}

function Update () 
{
	tipText.SetColor (Color(1,1,1,Time.time*0.3));
}