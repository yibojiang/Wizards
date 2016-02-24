var o_countdownTimer : countdownTimer;
o_countdownTimer = GetComponent(countdownTimer);
o_countdownTimer.setStartTime(10);
o_countdownTimer.setTimerDoneAction(timerDone_GotoArrivalAtCastle);
o_countdownTimer.setTimerState(true);

var fireworkFactory:FireworkFactory;
var layerManager:LayerManager;

var pm:ProfileManager;

var goodCount:int=0;
var perfectCount:int=0;
var poorCount:int=0;
var missCount:int=0;
var comboCount:int=0;
var chainCount:int=0;
var starCoinCount:int=0;

//stage1
var goodTapped:boolean=false;
var poorTapped:boolean=false;
var missTapped:boolean=false;
var perfectTapped:boolean=false;
var fireworkCount:int=0;

//stage2
var getChain:boolean=false;


//stage3
var getCombo:boolean=false;
var comboNum:int=0;

//stage4
var starCoinDrop:boolean=false;
var notGetStarCoin:boolean=false;
var getStarCoin:boolean=false;
var canTilt:boolean=false;
var stage4_flag:int=0;

//stage5
var stage5_flag:int=0;
var notFirstGlitter:boolean=false;

//stage6
var stage6_flag:int=0;
var audienceBar2:exSprite;
var audienceBar:AudienceBar;
var audienceBarSet:GameObject;
var SFWCount:int=0;

//stage7
var stage7_flag:int=0;

var gameState:GameState;
var tutorialStage:TutorialStage;
var gm:GameManager;



var arrivalatCastle:exSprite;
var tutorialStory:exSprite;


private var fireToggle:float;

var wizard : WizardControl;
var wizardBroom : WizardControl;


var TextChainCount:exSpriteFont;
var TextStarCoinsCount:exSpriteFont;
var TextFireWorkCount:exSpriteFont;
var TextScoreCount:exSpriteFont;



var scrollingText:ScrollingText;
var bgmManager:BgmManager;
var audioManager:AudioManager;

/*
var titleText:TextMesh;
var subTitleText:TextMesh;
*/

var titleText:exSpriteFont;
var subTitleText:exSpriteFont;

private var fireWorksPaused:boolean;

//Layers
private var sm:StageManager;
private var layerSL:LayerSaveAndLoad;

var wizardOnBroom:exSprite;

private var cameraFade:CameraFade;

var explosionDelay:float=3.2;

var achievementManager:AchievementManagerTutorial;

var dialogBox:DialogBox;

var inputMan : InputManager;

enum Character
{
	Toto,
	Javi,
	Broom,
	Master,
	Narratage
}

class Dialog
{
	var character:Character;
	var text:String;
	var face:Face;
}

var dialog:Dialog[];

enum TutorialStage
{
	ArrivalAtCastle,
	TutorialStory,
	Idle,
	Stage1,
	Stage2,
	Stage3,
	Stage4,
	Stage5,
	Stage6,
	Stage7
}


function Start()
{
	Time.timeScale=1.0;
	if (gameState==GameState.Tutorial)
	{
		inputMan = GameObject.Find("InputManager").GetComponent(InputManager) as InputManager;
		cameraFade=GameObject.Find("Main Camera").GetComponent(CameraFade);
		layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager) as LayerManager;
		pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
		fireworkFactory=GameObject.Find("FireworkFactory").GetComponent(FireworkFactory) as FireworkFactory;

		gm=GameObject.Find("GameManager").GetComponent(GameManager) as GameManager;
		wizard=GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
		wizardBroom=GameObject.Find("WizardBroom").GetComponent(WizardControl) as WizardControl;
		arrivalatCastle=GameObject.Find("ArrivalatCastle").GetComponent(exSprite) as exSprite; 
		tutorialStory=GameObject.Find("TutorialStory").GetComponent(exSprite) as exSprite; 

		wizardOnBroom=GameObject.Find("WizardOnBroom").GetComponent(exSprite);

		audienceBar2=GameObject.Find("AudienceBar2").GetComponent(exSprite) as exSprite;
		audienceBar=GameObject.Find("AudienceBar").GetComponent(AudienceBar) as AudienceBar;
		audienceBarSet=GameObject.Find("AudienceBarSet");
		
		sm=GameObject.Find("StageManager").GetComponent(StageManager);
		//layerSL=GameObject.Find("LayerSaveAndLoad").GetComponent(LayerSaveAndLoad);
		//background music
		bgmManager=GameObject.Find("AudioManager").GetComponent(BgmManager) as BgmManager;
		

		bgmManager.ChangeBgm(iTween.Hash("source",bgmManager.inGameBGM,"bgm",BGM.STORY));
		
		//AudioManager
		audioManager=GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
		
		wizardBroom.SetCharacterState(CharacterState.Broom);
		wizard.SetCharacterState(CharacterState.Stand);
		
		//TODO: audienceBar not showed first
		tutorialStage=TutorialStage.Idle;
		layerManager.Pause();
		SetupDialog();
	
		fireToggle=2.0;
		
		gm.HideChainCount();
		
		TextChainCount.text="";
		TextStarCoinsCount.text="0";
		TextFireWorkCount.text="0";
		TextScoreCount.text="0";
		
		//TODO: Load Tutorial Stage
		//layerSL.LoadTutorialStages();
		LoadStage(0);
				
	}
	else if(gameState==GameState.InGame)
	{
		
	} 
	
}

function LoadStage(_index:int)
{
	layerManager.DestroyLayersOutOfScreen();//Destory old stages assets
	Resources.UnloadUnusedAssets();//unload resource
	
	//Load LayerImage
	for (var i:int=0;i<sm.stageInfo[_index].layerImageInfo.length;i++)
	{
		layerManager.GenerateLayer(sm.stageInfo[_index].layerImageInfo[i]);
	}
	
	//Load LayerObject
	for (var j:int=0;j<sm.stageInfo[_index].layerObjInfo.length;j++)
	{
		layerManager.GenerateLayerObject(sm.stageInfo[_index].layerObjInfo[j]);
		
	}

}

function SetupDialog()
{
	//dialog=new Dialog[50];
	for (var i:int=0;i<dialog.Length;i++)
	{
		dialog[i].face=Face.Normal;
	}
	//new Stage1 Instruction
	dialog[147].character=Character.Toto;
	dialog[147].text="Miaow... O.k, so lets start from the beginning and see what you still remember.. Miaow!";
	dialog[148].character=Character.Javi;
	dialog[148].face=Face.Normal;
	dialog[148].text="Hey,it's not like I don't remember anything,ok ? It's just a bit...eh Fuzzy ! Hehe...";
	dialog[149].character=Character.Broom;
	dialog[149].face=Face.Sad;
	dialog[149].text="Oh..Holy Mother of Trees! I hate when you say 'Fuzzy' that means trouble !";
	dialog[150].character=Character.Toto;
	dialog[150].text="Miaow, Javi the Magical Concert is all about you, and keeping the Balance between Light and Dark.";
	dialog[151].character=Character.Toto;
	dialog[151].text="Your timing with the Fireworks, is the Symbol of the Battle of the Spheres!";
	dialog[152].character=Character.Toto;
	dialog[152].text="And remember,those are not just normal Fireworks Javi... they are full of Magic!";
	dialog[153].character=Character.Toto;
	dialog[153].text="They are alive!";
	dialog[154].character=Character.Toto;
	dialog[154].text="Many have different behavior and require different reactions from you, they will Challenge you!";
	dialog[155].character=Character.Toto;
	dialog[155].text="And only the chosen ones are able to Master them!";
	dialog[156].character=Character.Javi;
	dialog[156].face=Face.Happy;
	dialog[156].text="Ha... that Sounds like me!";
	dialog[157].character=Character.Broom;
	dialog[157].face=Face.Sad;
	dialog[157].text="Hm... that sounds more like the end is near!";
	dialog[158].character=Character.Javi;
	dialog[158].face=Face.Sad;
	dialog[158].text="Grrrrrr....!";
	dialog[159].character=Character.Toto;
	dialog[159].text="Miaow, The Concert is a test of your skills,";
	dialog[160].character=Character.Toto;
	dialog[160].text="and the most important event in a young Wizards life,";
	dialog[161].character=Character.Toto;
	dialog[161].text="The Fate of the Kingdom lies on you..... Miaow";
	dialog[162].character=Character.Broom;
	dialog[162].face=Face.Sad;
	dialog[162].text="Oh no, how could they ever choose you? We are truly Doomed!";
	dialog[163].character=Character.Javi;
	dialog[163].face=Face.Sad;
	dialog[163].text="B !!!!";
	dialog[164].character=Character.Toto;
	dialog[164].text="Miaow... alright Javi, I will send a Magical Firework up, try to hit it on time,ok? Miaow,";
	dialog[165].character=Character.Javi;
	dialog[165].face=Face.Happy;
	dialog[165].text="Haha...Heroes of Ancient past,here I come!";
	
	//Miss
	dialog[5].character=Character.Toto;
	dialog[5].face=Face.Sad;
	dialog[5].text="Miaow, Lets try that again, and don't wait tooo long! Focus and watch it's Tail closely,Miaow";
	
	
	//Poor
	dialog[6].character=Character.Toto;
	dialog[6].face=Face.Sad;
	dialog[6].text="Miaow, That was not bad Javi.. you hit that thing!";
	dialog[7].character=Character.Toto;
	dialog[7].face=Face.Sad;
	dialog[7].text="But did you noticed... the explosion wasn't that pretty. This is because you hit it too quickly!";
	dialog[8].character=Character.Toto;
	dialog[8].face=Face.Sad;
	dialog[8].text="The Magical Concert is all about Timing it right.";
	dialog[9].character=Character.Toto;
	dialog[9].face=Face.Sad;
	dialog[9].text="Try to wait a bit longer,go for a higher Grading,time your move, watch the Firework closely, and see what happens next time, ok?";
	   

	//Good
	dialog[10].character=Character.Toto;
	dialog[10].text="Miaow that was Good!";
	dialog[11].character=Character.Toto;
	dialog[11].text="Javie just remember at all times, The Magical Concert is all about Timing it right.";
	dialog[12].character=Character.Toto;
	dialog[12].text="The better your timing of hitting those Buggers,";
	dialog[13].character=Character.Toto;
	dialog[13].text="the longer you wait, the better the result Displayed,the happier the audience will be.";
	dialog[14].character=Character.Toto;
	dialog[14].text="There are 3 Grades,\n POOR,\nGOOD\nand PERFECT.";
	dialog[15].character=Character.Toto;
	dialog[15].text="Don't forget that if you want to succeed in the Concert, the Audience needs to be Happy!";
	dialog[16].character=Character.Toto;
	dialog[16].text="So, try to do it better now, I know you can.. Miaow!";
	 

	//No perfect
	dialog[17].character=Character.Toto;
	dialog[17].text="Miaow,you have to time your Tap right, wait a bit longer Javi, watch the white smoke Tail, until it's gone, then hit it!";
	dialog[18].character=Character.Toto;
	dialog[18].text="Watch the Firework closely, it will tell you when to hit it,but then be Quick.. Miaow!";
	

	//new Perfect
	dialog[166].character=Character.Toto;
	dialog[166].face=Face.Happy;
	dialog[166].text="Miaaaaowww.... By Bubbeldot's Beard, that's it! WOW you did it.. Miaow!";
	dialog[167].character=Character.Broom;
	dialog[167].face=Face.Happy;
	dialog[167].text="Ha, Even a Blind Roachtail can get Lucky at times!";
	dialog[168].character=Character.Javi;
	dialog[168].face=Face.Sad;
	dialog[168].text="Broom... shut it, or I will fly all night on you!!!";
	dialog[169].character=Character.Broom;
	dialog[169].face=Face.Sad;
	dialog[169].text="AHHHHHHHHHHH!!!! Please don't, My back hurts already just by thinking of it!";
	dialog[170].character=Character.Toto;
	dialog[170].text="Miaow... Javi, Can you do it again? Try to get a few more Perfects!";

	//new Stage1 finished

	dialog[19].character=Character.Toto;
	dialog[19].text="Miaow,that was Fishtastic ! So remember: The better your timing, the better your grade! A better Grade means more points you score!";
	dialog[20].character=Character.Toto;
	dialog[20].text="But the most important is, the better the Displayed result,the happier the audience will be!";
	dialog[21].character=Character.Toto;
	dialog[21].text="And really,really really, you want to keep that Audience happy,and with that positive energy the Eternal Seal locked and the Evil banished for another Year,";
	dialog[22].character=Character.Toto;
	dialog[22].text="or the Concert is very soon over,and the evil set free again!";
	dialog[23].character=Character.Toto;
	dialog[23].text="And I do not want to think what Master will do with us if we should fail... ohoh.. Miaow!";
	dialog[24].character=Character.Broom;
	dialog[24].face=Face.Sad;
	dialog[24].text="I will end up as Firewood? Or they will let me Clean out the hole Castle by my self?!!! ";
	dialog[25].character=Character.Toto;
	dialog[25].face=Face.Happy;
	dialog[25].text="Don't worry Javi, all you need is just a bit more practice, and it will be easy as Dinosaurs Pepo,... Miaow";
	
	
	
	//chain failed
	dialog[173].character=Character.Toto;
	dialog[173].face=Face.Sad;
	dialog[173].text="Miaow, Are you sleeping or just BM?";
	
	//Build chain
	dialog[27].character=Character.Toto;
	dialog[27].text="Miaow, as you can see... if you don't miss any Fireworks in a row, you are building up a Chain.";
	dialog[28].character=Character.Toto;
	dialog[28].text="A Chain will reward you with more points, the higher you can build it! And a no miss keeps the Audience happy as well!";

	//Stage2 finished
	dialog[33].character=Character.Toto;
	dialog[33].face=Face.Happy;
	dialog[33].text="Miaow... that was wonderful! Slowly I have hope that we really can make it.. Miaow!";
	dialog[34].character=Character.Javi;
	dialog[34].face=Face.Happy;
	dialog[34].text="Hehe.. no problem,easy as pepos! We will be Legends. Haha..!";
	dialog[35].character=Character.Broom;
	dialog[35].face=Face.Sad;
	dialog[35].text="Hm..... really? Known as what ? The Legendary epic failure of Hydorah?";
	dialog[36].character=Character.Javi;
	dialog[36].face=Face.Sad;
	dialog[36].text="Grrrrrr...youuu,come here B...lets fly for a while. Hold still... !!!";

	//new Stage3 instruction
	dialog[37].character=Character.Toto;
	dialog[37].text="Miaow...alright, next up, are Combos! You remember those right.. Miaow?";
	dialog[38].character=Character.Javi;
	dialog[38].face=Face.Happy;
	dialog[38].text="Eh....!!!";
	dialog[39].character=Character.Toto;
	dialog[39].face=Face.Sad;
	dialog[39].text="Miaow... !!!!!!";
	dialog[40].character=Character.Broom;
	dialog[40].face=Face.Sad;
	dialog[40].text="We are as good as Dead Wood!";
	dialog[41].character=Character.Toto;
	dialog[41].face=Face.Normal;
	dialog[41].text="Miaow,During the Concert you will be able to Combo the Fireworks!";
	dialog[42].character=Character.Toto;
	dialog[42].text="This means.. you link their time of Detonation together, again.. if your timing is right! Lets have a try.. Miaow.";


	//Get combo
	dialog[43].character=Character.Toto;
	dialog[43].face=Face.Happy;
	dialog[43].text="Miaow... Javi, that was great! Go on!";


	//new Stage3 finished
	dialog[44].character=Character.Toto;
	dialog[44].face=Face.Happy;
	dialog[44].text="Miaow.. as you can see, you link the detonation time of the Fireworks to each other.";
	dialog[45].character=Character.Toto;
	dialog[45].face=Face.Happy;
	dialog[45].text="This means, with each linked Firework to the Combo, you renew the Detonation time for all of them!";
	dialog[46].character=Character.Toto;
	dialog[46].face=Face.Happy;
	dialog[46].text="So they will wait for each other for a moment before exploding.";
	dialog[47].character=Character.Toto;
	dialog[47].face=Face.Happy;
	dialog[47].text="Thats Great for making Points, impressing the Audience and with that creating more positive energy.";
	dialog[48].character=Character.Toto;
	dialog[48].face=Face.Happy;
	dialog[48].text="The more you link, the higher your Combo! Timing is the Key..once again!";
	dialog[49].character=Character.Toto;
	dialog[49].face=Face.Happy;
	dialog[49].text="Sadly your current Magic Wand is not strong enough at the moment to stop them for long,";
	dialog[50].character=Character.Toto;
	dialog[50].face=Face.Happy;
	dialog[50].text="but you can change that with some Wand upgrades from the Shop if you got the Starcoins... Miaow!";
	


	//Stage4 instruction
	dialog[51].character=Character.Javi;
	dialog[51].text="Star Coins?";
	dialog[52].character=Character.Broom;
	dialog[52].face=Face.Sad;
	dialog[52].text="Oh no, Star Coins...!!!";
	dialog[53].character=Character.Toto;
	dialog[53].face=Face.Sad;
	dialog[53].text="Miaow, you forgot about Star Coins as well..? Miaow !!";
	dialog[54].character=Character.Javi;
	dialog[54].face=Face.Happy;
	dialog[54].text="Ehhh,,,,,!!!";
	dialog[55].character=Character.Toto;
	dialog[55].text="Ok.. try this.. Miaow!";
	


	//Star coins
	dialog[56].character=Character.Toto;
	dialog[56].text="...!!!! (Looking at Javi)";
	dialog[57].character=Character.Javi;
	dialog[57].face=Face.Happy;
	dialog[57].text="....??? (Looking at Toto)";
	dialog[58].character=Character.Broom;
	dialog[58].face=Face.Sad;
	dialog[58].text="!!!!! (Looking at both)";
	dialog[59].character=Character.Toto;
	dialog[59].text="Miaow, You saw that?";
	dialog[60].character=Character.Javi;
	dialog[60].face=Face.Happy;
	dialog[60].text="......???";
	dialog[61].character=Character.Toto;
	dialog[61].text="That was a Star Coin, Miaow!";
	dialog[62].character=Character.Broom;
	dialog[62].face=Face.Sad;
	dialog[62].text="Oh, My Back hurts already!!";
	dialog[63].character=Character.Javi;
	dialog[63].face=Face.Happy;
	dialog[63].text="A Star Coin?";
	dialog[64].character=Character.Toto;
	dialog[64].face=Face.Sad;
	dialog[64].text="Miaow.... Javi did you ever listen to anything when Master was teaching?";
	dialog[65].character=Character.Javi;
	dialog[65].face=Face.Happy;
	dialog[65].text="StarCoins, sure I know! You can EAT that right?";
	dialog[66].character=Character.Toto;
	dialog[66].face=Face.Happy;
	dialog[66].text="Miaowwwwwwwwww.... Ahhh !, ok, I tell you, Star Coins are Magical Coins,";
	dialog[67].character=Character.Toto;
	dialog[67].face=Face.Happy;
	dialog[67].text="you can get them by creating bigger Combos, the energy out of the Combo,";
	dialog[68].character=Character.Toto;
	dialog[68].face=Face.Happy;
	dialog[68].text="combined with the positive energy out of the Audience creates StarCoins!";
	dialog[69].character=Character.Toto;
	dialog[69].face=Face.Happy;
	dialog[69].text="StarCoins are very rare, and can be used for many things, but with out a doubt Jester,the Magical Shop";
	dialog[70].character=Character.Toto;
	dialog[70].face=Face.Happy;
	dialog[70].text="Keeper loves them the most!";
	dialog[71].character=Character.Javi;
	dialog[71].text="How do I collect them ? They seem out of reach !";
	dialog[72].character=Character.Toto;
	dialog[72].text="Miaow...thats easy. You can ride your Broom, or ask Mr.B to get them for you.";
	dialog[73].character=Character.Broom;
	dialog[73].text="Ahhhhhh..... No riding, I am off.. I get them for you!!!";
	dialog[74].character=Character.Javi;
	dialog[74].face=Face.Sad;
	dialog[74].text="...";
	
	
	//broom flies
	dialog[75].character=Character.Broom;
	dialog[75].face=Face.Happy;
	dialog[75].text="Here we go... Ok, lets do it!";
	dialog[76].character=Character.Toto;
	dialog[76].text="Miaow... ok Javie, tell Mr.B where to move,";
	dialog[77].character=Character.Toto;
	dialog[77].text="you can command him by tilting the Magical remote ...eh Wand I mean,in your hand.";
	dialog[78].character=Character.Toto;
	dialog[78].text="Miaow.. ok, now lets try to catch that Star Coin!";
	
	//get starcoin
	dialog[79].character=Character.Broom;
	dialog[79].face=Face.Happy;
	dialog[79].text="Got it... haha";
	dialog[80].character=Character.Javi;
	dialog[80].face=Face.Happy;
	dialog[80].text="Yeah.... !!!!";
	dialog[81].character=Character.Toto;
	dialog[81].text="Miaow... try to collect as many as you can of them, the Magic Shop Owner is really really keen on them!";
	dialog[82].character=Character.Toto;
	dialog[82].text="He will exchange them happily for some interesting stuff,";
	dialog[83].character=Character.Toto;
	dialog[83].text="such as Broom improvements,new Wands including the Amazing Swipe Wand , Special items and explosions and other curiosities.";
	
	
	//Stage4 finished
	dialog[84].character=Character.Javi;
	dialog[84].face=Face.Happy;
	dialog[84].text="Haha... no one will stand in my way now, Locomalito, here I come!!!!";


	//new Stage5 instruction
	dialog[85].character=Character.Toto;
	dialog[85].text="Miaow... one more thing Javi,";
	dialog[86].character=Character.Toto;
	dialog[86].text="during the Concert, you will have to face many challenges, and only the best and bravest can succeed and stand till the end.";
	dialog[87].character=Character.Toto;
	dialog[87].text="Don't forget, some Fireworks will be different then others.. and will require you to take different actions!";
	dialog[88].character=Character.Javi;
	dialog[88].face=Face.Happy;
	dialog[88].text="Ha... I think I remember that part! Don't you worry, I am the best!";
	dialog[89].character=Character.Broom;
	dialog[89].face=Face.Sad;
	dialog[89].text="ehhh... ";
	dialog[90].character=Character.Javi;
	dialog[90].face=Face.Sad;
	dialog[90].text="......";
	dialog[91].character=Character.Toto;
	dialog[91].text="Miaow... I surely hope so! Alright, have a try Javi! Here!";

	//tap the glitter
	dialog[92].character=Character.Toto;
	dialog[92].face=Face.Happy;
	dialog[92].text="Miaow... WOW.. ok, seems you did not forget anything in class.. Miaow!";
	dialog[93].character=Character.Javi;
	dialog[93].face=Face.Happy;
	dialog[93].text="Hehe.. I told you... man, I feel hungry now.";
	dialog[94].character=Character.Broom;
	dialog[94].text="Now that you mention it... me too! In which pocket did I put that Star Coin again ? Let me see !";
	dialog[95].character=Character.Toto;
	dialog[95].face=Face.Sad;
	dialog[95].text="Miyeah.....me too ! Ahhhh...what am I talking? I am on a Diet !!! You guys stop mentioning food all the time!";
	
	//not tap the glitter
	dialog[96].character=Character.Toto;
	dialog[96].text="Miaow.. so much about that!";
	dialog[97].character=Character.Toto;
	dialog[97].text="Javi... after the explosion... try to Tap the Glitter rain... and see what happens! Ok?";
	dialog[98].character=Character.Javi;
	dialog[98].face=Face.Happy;
	dialog[98].text="Hey, I know that! I was just.... trying something new!";
	dialog[99].character=Character.Toto;
	dialog[99].face=Face.Sad;
	dialog[99].text="......";
	

	//Stage6 instruction
	dialog[100].character=Character.Toto;
	dialog[100].text="Miaow... ok, so lets put you to the test.";
	dialog[101].character=Character.Toto;
	dialog[101].text="Use all you have learned to succeed!";
	dialog[102].character=Character.Toto;
	dialog[102].text="And Since the Audience is not here, I will pretend to be the Audience !";
	dialog[103].character=Character.Toto;
	dialog[103].text="Lets see if you can make me happy, and keep me entertained!";
	
	//Audience bar appears
	dialog[104].character=Character.Javi;
	dialog[104].face=Face.Sad;
	dialog[104].text="Ahh....!!!";
	dialog[105].character=Character.Toto;
	dialog[105].text="Miaow.... here we go! this is your Final test Javi,";
	dialog[106].character=Character.Toto;
	dialog[106].text="Remember the higher your Fireworks grading is, the happier I..";
	dialog[107].character=Character.Toto;
	dialog[107].text="eh.. I mean Master and the Audience will be!";
	dialog[108].character=Character.Toto;
	dialog[108].text="If you can fill up the Meter and make it glow, you will release all the happiness and positive energy in the Audience,";
	dialog[109].character=Character.Toto;
	dialog[109].text="and keep the evil banished, seal it away for another year!";

	
	dialog[110].character=Character.Javi;
	dialog[110].text="Ha.. that part Toto I never believed. I wish it would be true..";
	dialog[111].character=Character.Javi;
	dialog[111].text="I would challenge all those Evil forces and become a Legend like the Heroes of Hydorah!";
	dialog[112].character=Character.Javi;
	dialog[112].text="But sadly its just a bed time story to keep the Children nice and sweet!";
	dialog[113].character=Character.Javi;
	dialog[113].text="The Concert is just a big Magical Show! Anyway... I can do it !!!";
	dialog[114].character=Character.Javi;
	dialog[114].text="Challenge me oh mighty Toto.. haha";
	
	dialog[115].character=Character.Toto;
	dialog[115].face=Face.Sad;
	dialog[115].text="Grr.....Miaow!";
	dialog[116].character=Character.Toto;
	dialog[116].face=Face.Normal;
	dialog[116].text="Javiiiiiii.... Don't forget, the sake of the kingdom lies on your shoulders.";
	dialog[117].character=Character.Toto;
	dialog[117].face=Face.Sad;
	dialog[117].text="Miaow.. and I really don't want to think about that! Oh Master what have you done... miaow";
	dialog[173].character=Character.Broom;
	dialog[173].face=Face.Sad;
	dialog[173].text="Now I have to Cry...a lot ! This is what I am talking about. We are all Doomed";
	
	dialog[118].character=Character.Toto;
	dialog[118].text="Miaow... try not to let the Audience bar deplete, a POOR or MISS will cost you dearly and all is over!";
	dialog[119].character=Character.Toto;
	dialog[119].text="Remember:A Different Firework grading, will result in a different Audience bar fill up or cut!";
	dialog[120].character=Character.Toto;
	dialog[120].text="Release all the happy energy and keep the Evil Sealed away";
	dialog[121].character=Character.Toto;
	dialog[121].text="Keep the Audience entertained to fill up the bar,";
	dialog[122].character=Character.Toto;
	dialog[122].text="or it will be steady depleting ...till we fail";
	dialog[123].character=Character.Toto;
	dialog[123].text="and remember,when you miss a Firework, or hit it Poorly, you build up negative feelings and energy!";
	dialog[124].character=Character.Toto;
	dialog[124].text="And thats Not good, not good at all..Miaow !!!";
	
	dialog[125].character=Character.Javi;
	dialog[125].face=Face.Happy;
	dialog[125].text="Ok, lets do that!";

	//failed
	dialog[126].character=Character.Toto;
	dialog[126].face=Face.Sad;
	dialog[126].text="Miaooowwwwwwwwww... we are Doomed!";
	dialog[127].character=Character.Toto;
	dialog[127].face=Face.Sad;
	dialog[127].text="Javi you have to do better than this... give your best.. Miaow!";

	//succeed
	dialog[128].character=Character.Toto;
	dialog[128].face=Face.Happy;
	dialog[128].text="Miaow..... oh yeah, and when you have a filled up glowing bar you trigger special explosions! The higher your Level the more you will unlock!!";
	dialog[129].character=Character.Toto;
	dialog[129].face=Face.Happy;
	dialog[129].text="Since the positive energy of the people is feeding them... thats the best!";
	dialog[130].character=Character.Toto;
	dialog[130].face=Face.Happy;
	dialog[130].text="These Special Explosion give you the most score and the people are really happy!";
	dialog[131].character=Character.Toto;
	dialog[131].face=Face.Happy;
	dialog[131].text="Try to get there as often as you can!";
	
	dialog[132].character=Character.Javi;
	dialog[132].face=Face.Happy;
	dialog[132].text="... hehe";
	
	dialog[133].character=Character.Toto;
	dialog[133].face=Face.Happy;
	dialog[133].text="Miaow... Thats it Javi!";
	dialog[134].character=Character.Toto;
	dialog[134].face=Face.Happy;
	dialog[134].text="The Concerts simple rules are Time your hit,";
	dialog[135].character=Character.Toto;
	dialog[135].face=Face.Happy;
	dialog[135].text="Grade high,\nScore high,\nget better!";
	dialog[136].character=Character.Toto;
	dialog[136].face=Face.Happy;
	dialog[136].text="As you Level up... you will Unlock new Explosions and Special Explosions!";
	dialog[137].character=Character.Toto;
	dialog[137].face=Face.Happy;
	dialog[137].text="Don't forget it this time alright? Miaow...!!";
	
	dialog[138].character=Character.Javi;
	dialog[138].face=Face.Happy;
	dialog[138].text="I really feel Hungry now!!";
	
	dialog[139].character=Character.Broom;
	dialog[139].face=Face.Happy;
	dialog[139].text="Me too !";
	
	dialog[140].character=Character.Toto;
	dialog[140].face=Face.Sad;
	dialog[140].text="Oh Master....how could you do that to me ? I don't deserve this...AAHHHHH !!! ";


	//Stage6 finished
	dialog[141].character=Character.Master;
	dialog[141].face=Face.Normal;
	dialog[141].text="Javi!!!!!!!!!!!!!!!!"; 
	dialog[142].character=Character.Toto;
	dialog[142].text="!!!!!!!!!!!!";
	dialog[143].character=Character.Broom;
	dialog[143].text="!!!!!!!!!!!!";
	dialog[144].character=Character.Javi;
	dialog[144].text="!!!!!!!!!!!!";
	dialog[145].character=Character.Master;
	dialog[145].face=Face.Sad;
	dialog[145].text="Here you are... Everybody is waiting Boy!, the Concert is about to begin and you..,you fool around with your friends!";
	dialog[146].character=Character.Master;
	dialog[146].face=Face.Sad;
	dialog[146].text="Keep me waiting.. all of us... AGAIN !!!!!!!!!!Rumble Dumble, Hurry , YOU ARE LATE !!!!!!";
}

function SkipStory()
{
	scrollingText.paused=false;
	scrollingText.HideText();
	tutorialStage=TutorialStage.Idle;
	ShowTitle();
	GameResume();
	
}

function PauseText()
{
	scrollingText.paused=false;
	if (!scrollingText.speechBubble.gameObject.active)
	{
		GameResume();
		ResumeFireworks();
	}
}

function ProcessInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		var ray:Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		if (Physics.Raycast(ray, hit, 100.0) )
		{
	 		if (hit.transform.tag == "SkipButton")
		    {
		    	if (arrivalatCastle!=null || tutorialStory!=null)
		    	{
		    		//if ( Wizards.Utils.DEBUG ) Debug.Log("hit");
		    		GamePause();
		    		scrollingText.paused=true;
		    		dialogBox.Show("Are you sure to skip story ?",SkipStory);
					dialogBox.SetCancelFunction(PauseText);
		    		
		    	}
		    	else
		    	{
		    		//GamePause();
		    		PauseFireworks();
		    		scrollingText.paused=true;
		    		dialogBox.Show("Are you sure to skip tutorial ?",timerDone_GotoGame);
		    		dialogBox.SetCancelFunction(PauseText);
		    		//timerDone_GotoGame();
				}
		    }
		    
			if ( hit.transform.tag == "SpeechBubble")
			{
				scrollingText.pressed=true;
			}
			
			if (hit.transform.tag == "Glitter")
		    {
		    	if (stage5_flag==0)
		    	{
		    		stage5_flag=1;
		    	}
		    }
		 }
	}
}

function Update()
{
	ProcessInput();
	if (tutorialStage==TutorialStage.ArrivalAtCastle)
	{
		/*
		if (arrivalatCastle.color.a>0 )
		{
		
			arrivalatCastle.color.a-=Time.deltaTime*0.5;
			arrivalatCastle.transform.position.x+=Time.deltaTime*5;
			arrivalatCastle.transform.position.y-=Time.deltaTime*10;
			arrivalatCastle.scale.x+=Time.deltaTime*0.1;
			arrivalatCastle.scale.y+=Time.deltaTime*0.1;
		}
		else
		{
		
			tutorialStage=TutorialStage.Idle;
			o_countdownTimer.setStartTime(1);
			o_countdownTimer.setTimerState(true);
			o_countdownTimer.setTimerDoneAction(timerDone_GotoTutorialStory);
		}
		*/
		//tutorialStage=TutorialStage.Idle;
		//o_countdownTimer.setStartTime(1);
		//o_countdownTimer.setTimerState(true);
		//
		
	}
	else if (tutorialStage==TutorialStage.TutorialStory)
	{
		/*
		if (tutorialStory.transform.position.y>-15.7)
		{
			tutorialStory.transform.position.y-=0.01;
		}
		*/
		
		if (scrollingText.dialogOver)
		{
			tutorialStage=TutorialStage.Idle;
			o_countdownTimer.setStartTime(1);
			o_countdownTimer.setTimerState(true);
			o_countdownTimer.setTimerDoneAction(ShowTitle);
			/*
			if (tutorialStory.color.a>0 )
			{
				tutorialStory.color.a-=Time.deltaTime*0.5;
				tutorialStory.transform.position.x-=tutorialStory.transform.position.x*Time.deltaTime;
				tutorialStory.transform.position.y-=tutorialStory.transform.position.y*Time.deltaTime;
				tutorialStory.scale.x+=Time.deltaTime*0.01;
				tutorialStory.scale.y+=Time.deltaTime*0.01;
			}
			else
			{
				
				tutorialStage=TutorialStage.Idle;
				o_countdownTimer.setStartTime(2);
				o_countdownTimer.setTimerState(true);
				o_countdownTimer.setTimerDoneAction(timerDone_ShowTitle);
			}
			*/
		}

	}
	else if (tutorialStage==TutorialStage.Stage1)
	{ 

		gm.comboExplodeDuration=1.2;
		
		if (!fireWorksPaused)
		{
			if (fireToggle>0)
			{
				fireToggle-=Time.deltaTime;
			}
			else
			{
				// TODO - Grab this code and make arcade mode?
				if (NumFireWorksOnScreen()==0)
				{
					var randomFW:int=Random.Range(1,10);
	
					if (randomFW<=5)
					{
						fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(0.0,2.0),0),Random.Range(3.0,3.5));
					}
					else 
					{
				
						fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(9.5,8.5),-10,0),  Vector3(Random.Range(-3.5,-2.0),Random.Range(-2.0,2.0),0),Random.Range(3.0,3.5));
					}

					fireworkCount++;
					fireToggle=6.0;
				}
			}
		}
		
		if (perfectCount>=3)
		{
			
			PauseFireworks();
			
			if (NumFireWorksOnScreen()==0)
			{
				scrollingText.SetDialog(dialog,19,25,2.4);
				//Set the clock to Stage2.			
				tutorialStage=TutorialStage.Idle;
				o_countdownTimer.setStartTime(3);
				o_countdownTimer.setTimerState(true);
				o_countdownTimer.setTimerDoneAction(timerDone_GotoStage2);
			}
			
		}
	}
	else if (tutorialStage==TutorialStage.Stage2)
	{
	

		//Set the combo duration to normal.
		gm.comboExplodeDuration=1.2;
		
		if (!fireWorksPaused)
		{
			if (fireToggle>0)
			{
				fireToggle-=Time.deltaTime;
			}
			else
			{
				if (NumFireWorksOnScreen()==0)
					{
					var randomFWChain:int=Random.Range(1,10);
	
					if (randomFWChain<=5)
					{
						fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-10,0),  Vector3(Random.Range(-7.0,-2.0),Random.Range(8.5,9.0),0),Random.Range(3.0,3.5));
					}
					else 
					{
						fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(9.5,8.5),-9,0),  Vector3(Random.Range(-3.5,-1.0),Random.Range(-2.0,2.0),0),Random.Range(3.0,3.5));
					}
					
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,8),0),Random.Range(2,4));
					fireToggle=6.0;
				}
			}
		}
		
		if (!getChain)
		{
			if (chainCount==2)
			{

				scrollingText.SetDialog(dialog,27,28,explosionDelay);
				getChain=true;
			}
		}
		else
		{
			if (chainCount>=4)
			{	
				
				PauseFireworks();
			
				if (NumFireWorksOnScreen()==0)
				{
					//Stage2 finished
				    if ( Wizards.Utils.DEBUG ) Debug.Log("Setting STAGE 2 FINISHED TEXT");
					scrollingText.SetDialog(dialog,33,36,2);
					//Set the clock to Stage3.
				    if ( Wizards.Utils.DEBUG ) Debug.Log("Starting Countdown timer stage 3 FINISHED TEXT");
					tutorialStage=TutorialStage.Idle;
					o_countdownTimer.setStartTime(3);
					o_countdownTimer.setTimerState(true);
					o_countdownTimer.setTimerDoneAction(timerDone_GotoStage3);
				}
			}
		}

	}
	else if (tutorialStage==TutorialStage.Stage3)
	{


		gm.comboExplodeDuration=1.2;
		if (!fireWorksPaused)
		{
			if (fireToggle>0)
			{
				fireToggle-=Time.deltaTime;
			}
			else
			{
				if (NumFireWorksOnScreen()==0)
				{
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,8),0),Random.Range(3.0,4.0));
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,8),0),Random.Range(3.0,4.0));
					
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(0.0,2.0),0),Random.Range(2.5,3.5),Random.Range(0.2,0.5));
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(9.5,8.5),-10,0),  Vector3(Random.Range(-3.5,-3.0),Random.Range(-2.0,1.0),0),Random.Range(2.5,3.0));
		
	
					fireToggle=6.5;
				}
			}
		}
		
		if (!getCombo)
		{
			if (comboNum==1)
			{
				getCombo=true;
				scrollingText.SetDialog(dialog,43,43,explosionDelay);
			}
		}
		else 
		{
			if (comboNum>=3)
			{
				PauseFireworks();
			
				if (NumFireWorksOnScreen()==0)
				{
					//Stage3 finished
					scrollingText.SetDialog(dialog,44,50,explosionDelay);
					
					
					//Set the clock to Stage3.
					tutorialStage=TutorialStage.Idle;
					o_countdownTimer.setStartTime(4.0);
					o_countdownTimer.setTimerState(true);
					o_countdownTimer.setTimerDoneAction(timerDone_GotoStage4);
				}
			}
		}
	}
	else if (tutorialStage==TutorialStage.Stage4)//StarCoins
	{
		
		gm.comboExplodeDuration=1.2;
		if (!fireWorksPaused)
		{
			if (fireToggle>0)
			{
				fireToggle-=Time.deltaTime;
			}
			else
			{
				if (NumFireWorksOnScreen()==0)
				{
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(6,9),0),Random.Range(3,4));
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,9),0),Random.Range(5,6));
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(7,9),0),Random.Range(3,6));
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(1.0,2.0),0),Random.Range(2.5,3.5),1);
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(0.0,1.0),0),Random.Range(2.5,3.0));
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(9.5,8.5),-10,0),  Vector3(Random.Range(-3.5,-3.0),Random.Range(-2.0,1.0),0),Random.Range(2.5,3.5),0.5);
					fireToggle=10.5;
				}
			}
		}
		
		
		if (stage4_flag==1)
		{
			PauseFireworks();
			if (NumFireWorksOnScreen()==0)
			{
				scrollingText.SetDialog(dialog,56,74);
				stage4_flag=2;
			}

		}	
		//else if (stage4_flag==2 && scrollingText.dialogOver)
		//{
			//broom fly
		//}
		else if (stage4_flag==3 )
		{
			PauseFireworks();
			scrollingText.SetDialog(dialog,75,77);
			stage4_flag=4; 
		}	
		//else if (stage4_flag==4 )
		//{
			//waiting for tilt
			
		//}	
		else if (stage4_flag==5 )
		{
			ResumeFireworks();
			fireToggle=2.0;
			scrollingText.SetDialog(dialog,78,78);
			stage4_flag=8; 
		}
//		else if (stage4_flag==7)
//		{
//			fireToggle=7.5;
//			stage4_flag=8;
//		}
		else if (stage4_flag==8)
		{
			if (starCoinCount==1)
			{
				//scrollingText.SetDialog(dialog,79,83,1.2);
				stage4_flag=9;
			}
		}
		else if (stage4_flag==9)
		{	
			if (starCoinCount>1)
			{
				PauseFireworks();
				
				if (NumFireWorksOnScreen()==0)
				{
					//Stage3 finished
					scrollingText.SetDialog(dialog,79,84,1.2);
					
					
					//Set the clock to Stage3.
					tutorialStage=TutorialStage.Idle;
					o_countdownTimer.setStartTime(3);
					o_countdownTimer.setTimerState(true);
					o_countdownTimer.setTimerDoneAction(timerDone_GotoStage5);
				}
			}
		}

	
	}
	else if (tutorialStage==TutorialStage.Stage5)
	{

		gm.comboExplodeDuration=1.2;
		if (!fireWorksPaused)
		{
			if (fireToggle>0)
			{
				fireToggle-=Time.deltaTime;
			}
			else
			{
				if (stage5_flag==0)
				{
					if (notFirstGlitter && scrollingText.dialogOver)
					{
						//not tap the glitter
						scrollingText.SetDialog(dialog,96,99);
					}
					else if (!notFirstGlitter)
					{
						notFirstGlitter=true;
					}
				
				}
				fireworkFactory.GetFirework(flightPath.GlitterRain, VisualEffect.Star,  Vector3(Random.Range(-5,5),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,8),0),Random.Range(3,4));
				fireToggle=9.5;	
			}
		}
		
		if (stage5_flag==1 && scrollingText.dialogOver)
		{
			PauseFireworks();
			inputMan.disableInput = false;
			if (NumFireWorksOnScreen()==0)
			{
				//tap the glitter
				scrollingText.SetDialog(dialog,92,95,1.2);
				tutorialStage=TutorialStage.Idle;
				o_countdownTimer.setStartTime(4);
				o_countdownTimer.setTimerState(true);
				o_countdownTimer.setTimerDoneAction(timerDone_GotoStage6);
			}
		}

	}
	
	else if (tutorialStage==TutorialStage.Stage6 ) 
	{

		
		if (stage6_flag==0 && scrollingText.dialogOver)
		{

			//Audience bar appears
			audienceBar.Show();
			audienceBar.SetMaxHealth(50);
			audienceBar.health=audienceBar.maxhealth*0.5;

			audienceBar.isLock=true;
			stage6_flag=1;
			

		}
		else if (stage6_flag==1)
		{
			var myDialog=new Dialog[23];
			for (var i:int=0;i<myDialog.Length;i++)
			{
				myDialog[i]=new Dialog();
			}
			
			myDialog[0].character=Character.Javi;
			myDialog[0].face=Face.Sad;
			myDialog[0].text="Ahh....!!!";
			myDialog[1].character=Character.Toto;
			myDialog[1].text="Miaow.... here we go! this is your Final test Javi,";
			myDialog[2].character=Character.Toto;
			myDialog[2].text="Remember the higher your Fireworks grading is, the happier I..";
			myDialog[3].character=Character.Toto;
			myDialog[3].text="eh.. I mean Master and the Audience will be!";
			myDialog[4].character=Character.Toto;
			myDialog[4].text="If you can fill up the Meter and make it glow, you will release all the happiness and positive energy in the Audience,";
			myDialog[5].character=Character.Toto;
			myDialog[5].text="and keep the evil banished, seal it away for another year!";
		
			
			myDialog[6].character=Character.Javi;
			myDialog[6].text="Ha.. that part Toto I never believed. I wish it would be true..";
			myDialog[7].character=Character.Javi;
			myDialog[7].text="I would challenge all those Evil forces and become a Legend like the Heroes of Hydorah!";
			myDialog[8].character=Character.Javi;
			myDialog[8].text="But sadly its just a bed time story to keep the Children nice and sweet!";
			myDialog[9].character=Character.Javi;
			myDialog[9].text="The Concert is just a big Magical Show! Anyway... I can do it !!!";
			myDialog[10].character=Character.Javi;
			myDialog[10].text="Challenge me oh mighty Toto.. haha";
			
			myDialog[11].character=Character.Toto;
			myDialog[11].face=Face.Sad;
			myDialog[11].text="Grr.....Miaow!";
			myDialog[12].character=Character.Toto;
			myDialog[12].face=Face.Normal;
			myDialog[12].text="Javiiiiiii.... Don't forget, the sake of the kingdom lies on your shoulders.";
			myDialog[13].character=Character.Toto;
			myDialog[13].face=Face.Sad;
			myDialog[13].text="Miaow.. and I really don't want to think about that! Oh Master what have you done... miaow";
			myDialog[14].character=Character.Broom;
			myDialog[14].face=Face.Sad;
			myDialog[14].text="Now I have to Cry...a lot ! This is what I am talking about. We are all Doomed";
			
			myDialog[15].character=Character.Toto;
			myDialog[15].text="Miaow... try not to let the Audience bar deplete, a POOR or MISS will cost you dearly and all is over!";
			myDialog[16].character=Character.Toto;
			myDialog[16].text="Remember: Different Firework grading, will result in a different Audience bar fill up or cut!";
			myDialog[17].character=Character.Toto;
			myDialog[17].text="The better the grading, the happier the Audience, the higher the fill up energy.";
			myDialog[18].character=Character.Toto;
			myDialog[18].text="The Audience needs to be entertained,";
			myDialog[19].character=Character.Toto;
			myDialog[19].text="so its always steady depleting if you do nothing...";
			myDialog[20].character=Character.Toto;
			myDialog[20].text="and when you miss a Firework, or hit it Poorly, you build up negative feelings and energy!";
			myDialog[21].character=Character.Toto;
			myDialog[21].text="And thats Not good, not good at all..Miaow !!!";
			
			myDialog[22].character=Character.Javi;
			myDialog[22].face=Face.Happy;
			myDialog[22].text="Ok, lets do that!";

		
			
			scrollingText.SetDialog(myDialog,0,22,2);
			audienceBar.isLock=false;
			stage6_flag=2;
			
		}
		else if (stage6_flag==2 && scrollingText.dialogOver)
		{
			if (SFWCount>=3)
			{			
				PauseFireworks();
				audienceBar.isLock=false;
				audienceBar.Hide();
				stage6_flag=3;
				
				if ( achievementManager!=null)
				{
					if ( achievementManager.achievementArray[Achievement.Appreciated]==0)
					{
						achievementManager.UnlockAchievement(Achievement.Appreciated);
					}
				}
			}
			if (audienceBar.health<=0 )
			{
				//fallied
				scrollingText.SetDialog(dialog,126,127);
				audienceBar.health=audienceBar.maxhealth*0.5;

			}
			
			if (!fireWorksPaused)
			{
				if (fireToggle>0)
				{
					fireToggle-=Time.deltaTime;
				}
				else
				{
					//fireworkFactory.GetFirework(flightPath.Straight, VisualEffect.Star,  Vector3(Random.Range(-10,10),-10,0),  Vector3(Random.Range(-8,8),Random.Range(5,8),0),Random.Range(3,6));
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(1.0,2.0),0),Random.Range(2.5,3.5),3);
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(-9.5,-8.5),-11,0),  Vector3(Random.Range(3.0,4.0),Random.Range(0.0,1.0),0),Random.Range(2.5,3.0));
					fireworkFactory.GetFirework(flightPath.Bow, VisualEffect.Star,  Vector3(Random.Range(9.5,8.5),-10,0),  Vector3(Random.Range(-3.5,-3.0),Random.Range(-2.0,1.0),0),Random.Range(2.5,3.5),1.5);
					fireToggle=5.5;
		
				}
			}
		}
		else if (stage6_flag==3 && scrollingText.dialogOver)
		{	
			if (NumFireWorksOnScreen()==0)
			{
				//Stage6 finished
				scrollingText.SetDialog(dialog,128,140,5.0);
				stage6_flag=4;
			}


		}
		else if (stage6_flag==4 && scrollingText.dialogOver)
		{	
			//Set the clock to Stage7.
			tutorialStage=TutorialStage.Idle;
			o_countdownTimer.setStartTime(1);
			o_countdownTimer.setTimerState(true);
			o_countdownTimer.setTimerDoneAction(timerDone_GotoStage7);

		}
	}
	else if (tutorialStage==TutorialStage.Stage7 ) 
	{
		if (stage7_flag==0)
		{
			if ( pm.GetVibration() == true )
    		{
    			Handheld.Vibrate();
    		}
			audioManager.PlayOneShotAudio(audioManager.masterVoice[0],audioManager.voiceVol);
			audioManager.PlayAudioDelay(audioManager.masterVoice[1],audioManager.voiceVol,(audioManager.masterVoice[0].length+0.5));
			scrollingText.SetDialog(dialog,141,146);
			stage7_flag=1;
			
			
		}
		else if (stage7_flag==1 && scrollingText.dialogOver)
		{
			tutorialStage=TutorialStage.Idle;
			o_countdownTimer.setStartTime(3);
			o_countdownTimer.setTimerState(true);
			o_countdownTimer.setTimerDoneAction(timerDone_GotoGame);
		}
	}
}


function timerDone_GotoArrivalAtCastle()
{
	
	//tutorialStage=TutorialStage.ArrivalAtCastle;
	
	
	cameraFade.FadeTo(this.gameObject,"timerDone_GotoTutorialStory", 2.5);
}


function timerDone_GotoTutorialStory() 
{
	arrivalatCastle.gameObject.SetActiveRecursively(false);
	yield WaitForSeconds(2);
	
	var storyDialog=new Dialog[66];
	for (var i:int=0;i<storyDialog.Length;i++)
	{
		storyDialog[i]=new Dialog();
	}
	
	storyDialog[0].character=Character.Toto;
	storyDialog[0].face=Face.Sad;
	storyDialog[0].text="Miaow......,\nJavi, where have you been ? ";
	storyDialog[1].character=Character.Toto;
	storyDialog[1].face=Face.Normal;
	storyDialog[1].text="You are sooooooo Late !! Everybody is already waiting for us at the Ceremonial ground..Miaow";
	storyDialog[2].character=Character.Toto;
	storyDialog[2].face=Face.Normal;
	storyDialog[2].text="We have to hurry, Master will not be pleased, ohh..not again miaowwwww...!!!";
	storyDialog[3].character=Character.Javi;
	storyDialog[3].face=Face.Happy;
	storyDialog[3].text="Hey..!\nRelax Toto, relax.";
	storyDialog[4].character=Character.Javi;
	storyDialog[4].face=Face.Normal;
	storyDialog[4].text="Sorry about that, I am here now, I just needed a moment to clear my Head.";
	storyDialog[5].character=Character.Broom;
	storyDialog[5].face=Face.Sad;
	storyDialog[5].text="Ha..clear your Head ? Could you clear your Head not riding on me next time ?! My back still hurts Ow ow...!";
	storyDialog[6].character=Character.Toto;
	storyDialog[6].face=Face.Normal;
	storyDialog[6].text="Miaow...., Relax ??? ";
	storyDialog[7].character=Character.Toto;
	storyDialog[7].face=Face.Sad;
	storyDialog[7].text="Javi, how can I relax ? This is You we are talking about. And this is not just some Party, this is the Magical Concert !!";
	storyDialog[8].character=Character.Toto;
	storyDialog[8].face=Face.Normal;
	storyDialog[8].text="The Anniversary of the Battle of the Spheres, 2000 years ago, the Legendary Sorcerers Apprentice Bo";
	storyDialog[9].character=Character.Toto;
	storyDialog[9].face=Face.Happy;
	storyDialog[9].text="fought Graveloft and his Evil Shadow Minions and Sealed them away behind the Eternal Gate !";
	storyDialog[10].character=Character.Toto;
	storyDialog[10].face=Face.Normal;
	storyDialog[10].text="Today is the Day where a young Sorcerers Apprentice takes Bo's place in the Ceremony, renews the Energy";
	storyDialog[11].character=Character.Toto;
	storyDialog[11].face=Face.Happy;
	storyDialog[11].text="of the Seal and keeps the Evil banished for another Circle of Light. And with this the Kingdom in Peace.";
	storyDialog[12].character=Character.Toto;
	storyDialog[12].face=Face.Normal;
	storyDialog[12].text="It's The most important Day of the Year , every Year since anybody can remember !";
	storyDialog[13].character=Character.Toto;
	storyDialog[13].face=Face.Sad;
	storyDialog[13].text="And all this wouldn't be a problem, if it wouldn't be you...ooooooohhh Miaaaaaaooooowww";
	storyDialog[14].character=Character.Javi;
	storyDialog[14].face=Face.Sad;
	storyDialog[14].text="By Bubbledot Dots Beard, sometimes you really Sound more and more like Master Walch himself.";
	storyDialog[15].character=Character.Javi;
	storyDialog[15].face=Face.Sad;
	storyDialog[15].text="His talk about the Hero, The Battle of the Spheres, Javi learn this, do that, you can't do a thing right...bla bla bla !";
	storyDialog[16].character=Character.Javi;
	storyDialog[16].face=Face.Normal;
	storyDialog[16].text="Is it so hard to believe in Me ?";
	storyDialog[17].character=Character.Javi;
	storyDialog[17].face=Face.Happy;
	storyDialog[17].text="I wish Graveloft would be here, a single Spell.....WUUSHHH and I would kick his Pepos !";
	storyDialog[18].character=Character.Javi;
	storyDialog[18].face=Face.Normal;
	storyDialog[18].text="Show him what I am made of...ha..Show them all who I really am, and the Concert...,";
	storyDialog[19].character=Character.Javi;
	storyDialog[19].face=Face.Happy;
	storyDialog[19].text=" I can do all that riding backwards on my Broom and with my eyes closed.";
	storyDialog[20].character=Character.Broom;
	storyDialog[20].face=Face.Happy;
	storyDialog[20].text="Sure, as I do the flying and carry your fat P...";
	storyDialog[21].character=Character.Javi;
	storyDialog[21].face=Face.Sad;
	storyDialog[21].text="B ..!!!";
    storyDialog[22].character=Character.Toto;
	storyDialog[22].face=Face.Happy;
	storyDialog[22].text="Miaow...I know exactly what you can do with closed eyes and just a single Spell..Miaow ! ";
	storyDialog[23].character=Character.Toto;
	storyDialog[23].face=Face.Sad;
	storyDialog[23].text="A poor little piggy named Alfons comes to mind, Masters favorite pet…ohoh,I don’t want even to think of it !.";
	storyDialog[24].character=Character.Toto;
	storyDialog[24].face=Face.Sad;
	storyDialog[24].text="And we both know as well what happened after it, Masters Army of Brooms after us, that last Spanking...au";
	storyDialog[25].character=Character.Toto;
	storyDialog[25].face=Face.Sad;
	storyDialog[25].text="Hmm..... just thinking of it alone hurts ... Miaow";
	storyDialog[26].character=Character.Javi;
	storyDialog[26].face=Face.Sad;
	storyDialog[26].text="eh...!!!!!";
    storyDialog[27].character=Character.Javi;
	storyDialog[27].face=Face.Happy;
	storyDialog[27].text="So now it’s my fault ? Have you ever considered to stop eating that much, and lose some weight Toto? ";
	storyDialog[28].character=Character.Javi;
	storyDialog[28].face=Face.Happy;
	storyDialog[28].text="So you could run faster and not always get the beats cause you are falling to far behind?";
	storyDialog[29].character=Character.Toto;
	storyDialog[29].face=Face.Sad;
	storyDialog[29].text="And have you ever considered waiting for Me, not just ride away all by your self, and using me as a shield Miaow ?";
	storyDialog[30].character=Character.Broom;
	storyDialog[30].face=Face.Happy;
	storyDialog[30].text="Haha...and have you both ever considered to just stop eating that much ? Would make my live a lot easier as well.";
	storyDialog[31].character=Character.Javi;
	storyDialog[31].face=Face.Sad;
	storyDialog[31].text="BBBB !!!!";
	storyDialog[32].character=Character.Toto;
	storyDialog[32].face=Face.Sad;
	storyDialog[32].text="Miaooowww...!!!";;
	storyDialog[33].character=Character.Toto;
	storyDialog[33].face=Face.Normal;
	storyDialog[33].text="Javi,this all does not matter now, tonight is your Night, this is it, your Final test !";
	storyDialog[34].character=Character.Toto;
	storyDialog[34].face=Face.Sad;
	storyDialog[34].text="You finally can earn your Wizards Hat, and become a true Wizard. Please don't blow it this Time, Miaow";
	storyDialog[35].character=Character.Javi;
	storyDialog[35].face=Face.Normal;
	storyDialog[35].text="Toto, B...., I know I can do it, you should believe in Me !";
    storyDialog[36].character=Character.Toto;
	storyDialog[36].face=Face.Normal;
	storyDialog[36].text="Miaow, we do Javi,\njust sometimes you make it so Hard !";
	storyDialog[37].character=Character.Broom;
	storyDialog[37].face=Face.Sad;
	storyDialog[37].text="Yes, listen to him,I have a backpain that can confirm that !";
	storyDialog[38].character=Character.Javi;
	storyDialog[38].face=Face.Sad;
	storyDialog[38].text="You know, even if I wouldn't be Masters first choice, if he could choose, but I know I can do it, I was born for this !";
	storyDialog[39].character=Character.Javi;
	storyDialog[39].face=Face.Normal;
	storyDialog[39].text="Magic... Fighting Evil creatures, Monsters, and those little BM’s...Hehe";
	storyDialog[40].character=Character.Javi;
	storyDialog[40].face=Face.Happy;
	storyDialog[40].text="...Hm...*especially* those pesky pesky little BM's by Crom !!";
	storyDialog[41].character=Character.Javi;
	storyDialog[41].face=Face.Normal;
	storyDialog[41].text="I can feel the Music of my Soul. My Adventure just begins here and now..and you Guys are with Me,";
	storyDialog[42].character=Character.Javi;
	storyDialog[42].face=Face.Happy;
	storyDialog[42].text="Tonight is the Night, In which the Story of Javi, Toto and Mister Broom began.";
	storyDialog[43].character=Character.Javi;
	storyDialog[43].face=Face.Happy;
	storyDialog[43].text="As they are about to become known as 'He..greatest Sorcerer of them all, and his...eh ? (looking at toto)";
	storyDialog[44].character=Character.Toto;
	storyDialog[44].face=Face.Happy;
	storyDialog[44].text=".........!!!!!!";
	storyDialog[45].character=Character.Javi;
	storyDialog[45].face=Face.Normal;
	storyDialog[45].text="AS THEY are about to become known as the greatest Sorcerer of them all, and his Brave but eh...";
	storyDialog[46].character=Character.Javi;
	storyDialog[46].face=Face.Happy;
	storyDialog[46].text="fat little,eh...no ,I mean big little Cat...friend and companion,and the one and only Mr.B..the Magnificent!";
	storyDialog[47].character=Character.Toto;
	storyDialog[47].face=Face.Normal;
	storyDialog[47].text="......!";
	storyDialog[48].character=Character.Broom;
	storyDialog[48].face=Face.Normal;
	storyDialog[48].text="....!!!";
	storyDialog[49].character=Character.Toto;
	storyDialog[49].face=Face.Happy;
	storyDialog[49].text="(Yawn)\nMiaow, I definitely feel hungry now,...Miaow";
	storyDialog[50].character=Character.Broom;
	storyDialog[50].face=Face.Normal;
	storyDialog[50].text="Me too ! We should go to Paul's Diner. The Pie there is the best !";
	storyDialog[51].character=Character.Javi;
	storyDialog[51].face=Face.Happy;
	storyDialog[51].text="(Dreaming On)\nThey will sing Songs of us Toto, write books about our Adventures..Yeah !";
	storyDialog[52].character=Character.Javi;
	storyDialog[52].face=Face.Happy;
	storyDialog[52].text="They will mention us in the same lines as they are talking about Locomalito the Great Drageons Slayer, ";
	storyDialog[53].character=Character.Javi;
	storyDialog[53].face=Face.Normal;
	storyDialog[53].text="the Hero of Hydorah, who fought on the Island of Issyos, the one of two..who survived the real BM Attack, ";
	storyDialog[54].character=Character.Javi;
	storyDialog[54].face=Face.Happy;
	storyDialog[54].text="who dived into the depths of Scylla and...";
	storyDialog[55].character=Character.Toto;
	storyDialog[55].face=Face.Normal;
	storyDialog[55].text="...and was never seen again. Miaow !!!";
	storyDialog[56].character=Character.Javi;
	storyDialog[56].face=Face.Sad;
	storyDialog[56].text="Gulp.....!!!!!";
	storyDialog[57].character=Character.Toto;
	storyDialog[57].face=Face.Normal;
	storyDialog[57].text="Miaow, Javi we have to go! They are waiting..ohohoh, Master will definitely not be Happy this Time !!";
	storyDialog[58].character=Character.Toto;
	storyDialog[58].face=Face.Sad;
	storyDialog[58].text="We have to hurry, the Ceremony is about to begin, Miaow !!!";
	storyDialog[59].character=Character.Javi;
	storyDialog[59].face=Face.Normal;
	storyDialog[59].text="Don’t worry, I got this...I can do this,\nTonight, I will earn my Wizards Hat,";
	storyDialog[60].character=Character.Javi;
	storyDialog[60].face=Face.Normal;
	storyDialog[60].text="and Show them a Concert they never will forget !";
	storyDialog[61].character=Character.Toto;
	storyDialog[61].face=Face.Sad;
	storyDialog[61].text="Miaow, when you say 'don't worry' thats normally the moment when my Nightmares just begin, Miaow!";
	storyDialog[62].character=Character.Broom;
	storyDialog[62].face=Face.Sad;
	storyDialog[62].text="Ohoh... mine as well, and the real bad thing about it is, they become true. I think, sniff..I have to Cry !!!";
	storyDialog[63].character=Character.Toto;
	storyDialog[63].face=Face.Happy;
	storyDialog[63].text="Miaow...Yeah, thats it Javi, you are right. Let's Show them what we can do...Haha!";
	storyDialog[64].character=Character.Toto;
	storyDialog[64].face=Face.Happy;
	storyDialog[64].text="Ok, so lets go through the basics one more Time.\nAre You ready ?";
    storyDialog[65].character=Character.Javi;
	storyDialog[65].face=Face.Happy;
	storyDialog[65].text="Popi Pot ready !";
	
	
	scrollingText.SetDialog(storyDialog,0,65);



	tutorialStage=TutorialStage.TutorialStory;
}

function timerDone_ShowTitle()
{
	
	bgmManager.FadeBGM(bgmManager.inGameBGM,BGM.TUTORIAL);
	titleText.gameObject.SetActiveRecursively(true);
	subTitleText.gameObject.SetActiveRecursively(true);
	titleText.text=sm.stageInfo[0].title;
	subTitleText.text=sm.stageInfo[0].subTitle;
	
	titleText.GetComponent(FadeFont).FadeIn(1,0);
	titleText.GetComponent(FadeFont).FadeOut(1,4);
	
	subTitleText.GetComponent(FadeFont).FadeIn(1,1.5);
	subTitleText.GetComponent(FadeFont).FadeOut(1,4);

	
	subTitleText.transform.localScale.x=1;
	subTitleText.transform.localScale.y=1;
	iTween.ScaleFrom(subTitleText.gameObject,iTween.Hash("time",0.4,"x",2,"y",0,"easetype",iTween.EaseType.easeInOutQuad,"delay",1.5) );	
	
	GameObject.Destroy(arrivalatCastle.gameObject);
	GameObject.Destroy(tutorialStory.gameObject);
	GameObject.Destroy(wizardOnBroom.gameObject);
	
	GC.Collect();
	Resources.UnloadUnusedAssets();
	//Set to the next timer.
	o_countdownTimer.setStartTime(6.0);
	o_countdownTimer.setTimerState(true);
	o_countdownTimer.setTimerDoneAction(timerDone_GotoStage1);
	//o_countdownTimer.setTimerDoneAction(timerDone_GotoStage4);
	yield WaitForSeconds(5);
	titleText.gameObject.SetActiveRecursively(false);
	subTitleText.gameObject.SetActiveRecursively(false);
}

function ShowTitle()
{
	cameraFade.FadeTo(this.gameObject,"timerDone_ShowTitle");
}

function timerDone_GotoStage1() 
{
	ResumeFireworks();	
	audienceBar.isLock=true;
	wizard.freeze=false;
	fireToggle=3.2;
	scrollingText.SetDialog(dialog,147,165);
	tutorialStage=TutorialStage.Stage1;


}


function timerDone_GotoStage2() 
{
	gm.ShowChainCount();
	ResumeFireworks();
	missCount=0;
	fireToggle=2.4;
	
	
	var normalDialog=new Dialog[20];
	for (var i:int=0;i<normalDialog.Length;i++)
	{
		normalDialog[i]=new Dialog();
	}
	normalDialog[0].character=Character.Toto;
	normalDialog[0].face=Face.Normal;
	normalDialog[0].text="Miaow, alright ! Lets go on with something else now !";
	normalDialog[1].character=Character.Toto;
	normalDialog[1].face=Face.Normal;
	normalDialog[1].text="I will send a few more Fireworks up,try not to miss any,ok ?";
	normalDialog[2].character=Character.Javi;
	normalDialog[2].face=Face.Happy;
	normalDialog[2].text="Yeah!!!!";
	
	scrollingText.SetDialog(normalDialog,0,2);
	tutorialStage=TutorialStage.Stage2;

}

function timerDone_GotoStage3()
{
    if ( Wizards.Utils.DEBUG ) Debug.Log("RESUME FIREWORKS");
	ResumeFireworks();
	
	fireToggle=2.4;
    if ( Wizards.Utils.DEBUG ) Debug.Log("SET DIALOG");
	scrollingText.SetDialog(dialog,37,42);
    if ( Wizards.Utils.DEBUG ) Debug.Log("FINSHED SETTING DIALOG");
	tutorialStage=TutorialStage.Stage3;

}

function timerDone_GotoStage4()
{
	ResumeFireworks();
	//TODO: Show starcoin
	//guiStarCoins.gameObject.active=true;
	comboNum=0;
	fireToggle=2.4;
	scrollingText.SetDialog(dialog,51,55);
	tutorialStage=TutorialStage.Stage4;
}

function timerDone_GotoStage5()
{
	ResumeFireworks();
	fireToggle=2.4;
	scrollingText.SetDialog(dialog,85,91);
	tutorialStage=TutorialStage.Stage5;
}

function timerDone_GotoStage6()
{
	ResumeFireworks();
	audienceBar.maxhealth=50;
	audienceBar.health=0;
	fireToggle=2.4;
	scrollingText.SetDialog(dialog,100,103);
	tutorialStage=TutorialStage.Stage6;
}

function timerDone_GotoStage7()
{
	fireToggle=2.4;
	tutorialStage=TutorialStage.Stage7;
}	

function timerDone_GotoGame()
{
	
	pm.SetPlayTutorial(false);
	
	//goto game
	cameraFade.FadeTo(this.gameObject,"GotoGame");
	
	//iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.5,"ignoretimescale",true));
	
	//pm.SetNextLevelToLoad("DragonHeadApproach");
	//Application.backgroundLoadingPriority = ThreadPriority.Low;
	//var async : AsyncOperation = Application.LoadLevelAsync ("DragonHeadApproach");
}

function GotoGame()
{
	pm.SetNextLevelToLoad("DragonHeadApproach");
	Application.LoadLevel("LevelLoader");
}

function SetState(_gameState:GameState)
{
	gameState=_gameState;
}

function GamePause()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GamePause");
	Time.timeScale=0;
}

function GameResume()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("GameResume");
	Time.timeScale=1;
}

function NumFireWorksOnScreen() : int
{
	var numFireworks : int = 0;
	
	var fw : GameObject[] = GameObject.FindGameObjectsWithTag("Firework");
	var glitter : GameObject[] = GameObject.FindGameObjectsWithTag("Glitter");
	var sfw:GameObject[]=GameObject.FindGameObjectsWithTag("SFW");
	var starCoin:GameObject[]=GameObject.FindGameObjectsWithTag("StarCoin");
	
	for ( var glit in glitter )
	{
		if ( glit.GetComponent.<Renderer>().isVisible )
		{
			numFireworks++;
		}	
	}
	
	numFireworks += fw.Length;
	numFireworks+= sfw.Length;
	numFireworks+= starCoin.Length;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("num fws : " + numFireworks + " @: " + Time.time);
	return ( numFireworks );
}

function PauseFireworks()
{
	fireWorksPaused = true;
	if ( inputMan != null )
	{
		inputMan.disableInput = true;
	}
}

function ResumeFireworks()
{
	fireWorksPaused = false;
	if ( inputMan != null )
	{
		inputMan.disableInput = false;
	}
}

