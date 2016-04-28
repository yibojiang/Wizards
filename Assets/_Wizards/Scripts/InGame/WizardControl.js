var moveSpeed : float ;


var actualAccel : Vector3;

 
var moveValue : Vector3;

private var spriteAnimation:exSpriteAnimation;
var outLineSpriteAnimation:exSpriteAnimation;
private var outlineSprite:exSprite;

var pm : ProfileManager;

var TextStarCoinsCount:exSpriteFont;

var gameState:GameState;

private var tm:TutorialLevelManager;

private var am : AudioManager;

var rotateAmount:float=0;

var glowEnabled:boolean=true;
var alphaChangeRate:float=1.0;

//Broom trail
var broomTrail:exSprite;


var freeze:boolean=true;
var tiltOn:boolean=true;


var flare:Transform;
var wandSparker:ParticleEmitter;

var standIdle:AnimationPosInfo;
var standTap:AnimationPosInfo;
var standYeahpose:AnimationPosInfo;

var sitIdle:AnimationPosInfo;
var sitTap:AnimationPosInfo;
var sitYeahpose:AnimationPosInfo;

var myTransform:Transform;

var starcoin:GameObject;

var doubleStarcoins:boolean;

var totoAnimation:exSpriteAnimation;

class AnimationPosInfo
{
	var position:Vector2[];
}

enum CharacterState
{
	Stand,
	Broom,
	OnBroom
}

var characterState:CharacterState;

function Awake()
{	
	myTransform=transform;
	spriteAnimation=GetComponent(exSpriteAnimation);

	if ( GameObject.Find("TutorialLevelManager") != null )
	{
		tm=GameObject.Find("TutorialLevelManager").GetComponent(TutorialLevelManager) as TutorialLevelManager;
	}
	
	outlineSprite=outLineSpriteAnimation.GetComponent(exSprite) as exSprite;
	
	if ( GameObject.Find("Text_StarCoins") != null )
	{
		TextStarCoinsCount=GameObject.Find("Text_StarCoins").GetComponent(exSpriteFont);
	}
	
	if ( GameObject.Find("AudioManager") != null )
	{
		am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	}
	
	
	starcoin=GameObject.Find("StarCoinCount");
	
	if (flare!=null)
	{
		SetupFlarePosition();
	}
	
	
	
}

function Start ()
{
	tiltOn=true;
	
	if (gameState==GameState.InGame)
	{
		TextStarCoinsCount.text=""+ pm.GetTempRecord(Record.StarCoins);
		
	}
	else
	{
		TextStarCoinsCount.text=""+"0";
	}
	
	CalcMoveSpeed();
	
	
	var wandCode:int=pm.GetWandBitmask();
	var starcoinMask:int=WandMask.Starcoin;
	if (wandCode & starcoinMask)
	{
		doubleStarcoins=true;
	}
	else
	{
		doubleStarcoins=false;
	}
}

function SetupFlarePosition()
{
	standIdle.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Stand_Idle").clip.frameInfos.Count];
	standTap.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Stand_Tap").clip.frameInfos.Count];
	standYeahpose.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Stand_Yeahpose").clip.frameInfos.Count];
	sitIdle.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Sit_Idle").clip.frameInfos.Count];
	sitTap.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Sit_Tap").clip.frameInfos.Count];
	sitYeahpose.position=new Vector2[spriteAnimation.GetAnimation("Wizard_Sit_Yeahpose").clip.frameInfos.Count];

	standIdle.position[0].x=4.5;
	standIdle.position[0].y=5.6;
	standIdle.position[1].x=4.25;
	standIdle.position[1].y=5;
	standIdle.position[2].x=4;
	standIdle.position[2].y=4.4;
	standIdle.position[3].x=3.7;
	standIdle.position[3].y=3.8;
	standIdle.position[4].x=3.4;
	standIdle.position[4].y=3.2;
	standIdle.position[5].x=3;
	standIdle.position[5].y=3.2;
	standIdle.position[6].x=2.6;
	standIdle.position[6].y=3.2;
	standIdle.position[7].x=2.3;
	standIdle.position[7].y=3.2;
	standIdle.position[8].x=1.9;
	standIdle.position[8].y=3.3;
	standIdle.position[9].x=1.6;
	standIdle.position[9].y=3.3;
	standIdle.position[10].x=1.3;
	standIdle.position[10].y=3.4;
	standIdle.position[11].x=1;
	standIdle.position[11].y=3.9;
	standIdle.position[12].x=0.68;
	standIdle.position[12].y=4;
	standIdle.position[13].x=0.3;
	standIdle.position[13].y=4.5;
	standIdle.position[14].x=0;
	standIdle.position[14].y=4.8;
	standIdle.position[15].x=0.3;
	standIdle.position[15].y=4.6;
	standIdle.position[16].x=0.65;
	standIdle.position[16].y=4.4;
	standIdle.position[17].x=0.95;
	standIdle.position[17].y=4;
	standIdle.position[18].x=1.3;
	standIdle.position[18].y=3.9;
	standIdle.position[19].x=1.6;
	standIdle.position[19].y=3.6;
	standIdle.position[20].x=1.8;
	standIdle.position[20].y=3.5;
	standIdle.position[21].x=2;
	standIdle.position[21].y=3.3;
	standIdle.position[22].x=2.2;
	standIdle.position[22].y=3.1;
	standIdle.position[23].x=2.5;
	standIdle.position[23].y=3.4;
	standIdle.position[24].x=3;
	standIdle.position[24].y=3.6;
	standIdle.position[25].x=3.5;
	standIdle.position[25].y=3.7;
	standIdle.position[26].x=3.7;
	standIdle.position[26].y=4.1;
	standIdle.position[27].x=4;
	standIdle.position[27].y=4.6;
	standIdle.position[28].x=4.2;
	standIdle.position[28].y=4.9;
	standIdle.position[29].x=4.3;
	standIdle.position[29].y=5.3;
	
	for (var i:int=0;i<spriteAnimation.GetAnimation("Wizard_Stand_Idle").clip.frameInfos.Count;i++)
	{
		standIdle.position[i].x*=0.58;
		standIdle.position[i].y*=0.58;
	}


	sitIdle.position[0].x=4.5;
	sitIdle.position[0].y=5.6;
	sitIdle.position[1].x=4.25;
	sitIdle.position[1].y=5;
	sitIdle.position[2].x=4;
	sitIdle.position[2].y=4.4;
	sitIdle.position[3].x=3.7;
	sitIdle.position[3].y=3.8;
	sitIdle.position[4].x=3.4;
	sitIdle.position[4].y=3.2;
	sitIdle.position[5].x=3;
	sitIdle.position[5].y=3.2;
	sitIdle.position[6].x=2.6;
	sitIdle.position[6].y=3.2;
	sitIdle.position[7].x=2.3;
	sitIdle.position[7].y=3.2;
	sitIdle.position[8].x=1.9;
	sitIdle.position[8].y=3.3;
	sitIdle.position[9].x=1.6;
	sitIdle.position[9].y=3.3;
	sitIdle.position[10].x=1.3;
	sitIdle.position[10].y=3.4;
	sitIdle.position[11].x=1;
	sitIdle.position[11].y=3.9;
	sitIdle.position[12].x=0.68;
	sitIdle.position[12].y=4;
	sitIdle.position[13].x=0.3;
	sitIdle.position[13].y=4.5;
	sitIdle.position[14].x=0;
	sitIdle.position[14].y=4.8;
	sitIdle.position[15].x=0.3;
	sitIdle.position[15].y=4.6;
	sitIdle.position[16].x=0.65;
	sitIdle.position[16].y=4.4;
	sitIdle.position[17].x=0.95;
	sitIdle.position[17].y=4;
	sitIdle.position[18].x=1.3;
	sitIdle.position[18].y=3.9;
	sitIdle.position[19].x=1.6;
	sitIdle.position[19].y=3.6;
	sitIdle.position[20].x=1.8;
	sitIdle.position[20].y=3.5;
	sitIdle.position[21].x=2;
	sitIdle.position[21].y=3.3;
	sitIdle.position[22].x=2.2;
	sitIdle.position[22].y=3.1;
	sitIdle.position[23].x=2.5;
	sitIdle.position[23].y=3.4;
	sitIdle.position[24].x=3;
	sitIdle.position[24].y=3.6;
	sitIdle.position[25].x=3.5;
	sitIdle.position[25].y=3.7;
	sitIdle.position[26].x=3.7;
	sitIdle.position[26].y=4.1;
	sitIdle.position[27].x=4;
	sitIdle.position[27].y=4.6;
	sitIdle.position[28].x=4.2;
	sitIdle.position[28].y=4.9;
	sitIdle.position[29].x=4.3;
	sitIdle.position[29].y=5.3;
	
	for (var l:int=0;l<spriteAnimation.GetAnimation("Wizard_Sit_Idle").clip.frameInfos.Count;l++)
	{
		sitIdle.position[l].x*=0.58;
		sitIdle.position[l].y*=0.58;
		sitIdle.position[l].x+=0.2;
		sitIdle.position[l].y-=0.2;
	}	
	
	standTap.position[0].x=1.35;
	standTap.position[0].y=3;
	standTap.position[1].x=0.75;
	standTap.position[1].y=4.5;
	standTap.position[2].x=0;
	standTap.position[2].y=4.75;
	standTap.position[3].x=0.35;
	standTap.position[3].y=4.6;
	standTap.position[4].x=0.7;
	standTap.position[4].y=4.45;
	standTap.position[5].x=1;
	standTap.position[5].y=4.2;
	standTap.position[6].x=1.45;
	standTap.position[6].y=4;
	standTap.position[7].x=2.5;
	standTap.position[7].y=3;

	
	standYeahpose.position[0].x=-0.65;
	standYeahpose.position[0].y=-2.25;
	standYeahpose.position[1].x=0;
	standYeahpose.position[1].y=2.7;
	standYeahpose.position[2].x=1.2;
	standYeahpose.position[2].y=3.4;
	standYeahpose.position[3].x=1.9;
	standYeahpose.position[3].y=1.3;
	standYeahpose.position[4].x=1.76;
	standYeahpose.position[4].y=3.2;
	standYeahpose.position[5].x=1.68;
	standYeahpose.position[5].y=3.1;
	standYeahpose.position[6].x=1.5;
	standYeahpose.position[6].y=3;
	standYeahpose.position[7].x=1.5;
	standYeahpose.position[7].y=3;
	standYeahpose.position[8].x=1.5;
	standYeahpose.position[8].y=3.2;
	standYeahpose.position[9].x=1.7;
	standYeahpose.position[9].y=3.25;
	standYeahpose.position[10].x=1.3;
	standYeahpose.position[10].y=3.2;
	standYeahpose.position[11].x=-0.6;
	standYeahpose.position[11].y=2.3;
	standYeahpose.position[12].x=0;
	standYeahpose.position[12].y=2.65;
	
	
	
	
	sitTap.position[0].x=2;
	sitTap.position[0].y=4.25;
	sitTap.position[1].x=1.2;
	sitTap.position[1].y=5.1;
	sitTap.position[2].x=0.28;
	sitTap.position[2].y=5.53;
	sitTap.position[3].x=0.73;
	sitTap.position[3].y=5.3;
	sitTap.position[4].x=1.2;
	sitTap.position[4].y=5.1;
	sitTap.position[5].x=1.65;
	sitTap.position[5].y=5;
	sitTap.position[6].x=2.1;
	sitTap.position[6].y=4.7;

	for (var m:int=0;m<spriteAnimation.GetAnimation("Wizard_Sit_Tap").clip.frameInfos.Count;m++)
	{
		sitTap.position[m].x*=0.8;
		sitTap.position[m].y*=0.8;
	}	
	
	sitYeahpose.position[0].x=0.55;
	sitYeahpose.position[0].y=4;
	sitYeahpose.position[1].x=1.27;
	sitYeahpose.position[1].y=3.85;
	sitYeahpose.position[2].x=1.9;
	sitYeahpose.position[2].y=3.7;
	sitYeahpose.position[3].x=2.5;
	sitYeahpose.position[3].y=3.35;
	sitYeahpose.position[4].x=2.56;
	sitYeahpose.position[4].y=3.35;
	sitYeahpose.position[5].x=2.5;
	sitYeahpose.position[5].y=3.35;
	sitYeahpose.position[6].x=2.5;
	sitYeahpose.position[6].y=3.38;
	sitYeahpose.position[7].x=2.6;
	sitYeahpose.position[7].y=3.3;
	sitYeahpose.position[8].x=2.78;
	sitYeahpose.position[8].y=3.35;
	sitYeahpose.position[9].x=2.95;
	sitYeahpose.position[9].y=3.3;
	sitYeahpose.position[10].x=3;
	sitYeahpose.position[10].y=3.25;	
	for (var n:int=0;n<spriteAnimation.GetAnimation("Wizard_Sit_Yeahpose").clip.frameInfos.Count;n++)
	{
		sitYeahpose.position[n].x*=0.8;
		sitYeahpose.position[n].y*=0.8;
	}	
}

function SetFlarePosition()
{
	if (flare!=null)
	{	
		//var frame:int=-spriteAnimation.GetCurFrameIndex()-1;
		var frame:int=spriteAnimation.GetCurFrameIndex()-1;
		if	(frame>=0)
		{
			if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Stand_Idle")
			{
				
				flare.localPosition.x=standIdle.position[frame].x;
				flare.localPosition.y=standIdle.position[frame].y;
			}
			else if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Stand_Tap")
			{
				flare.localPosition.x=standTap.position[frame].x;
				flare.localPosition.y=standTap.position[frame].y;
			}
			else if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Stand_Yeahpose")
			{	
				flare.localPosition.x=standYeahpose.position[frame].x;
				flare.localPosition.y=standYeahpose.position[frame].y;
			}
			else if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Sit_Idle")
			{
				flare.localPosition.x=sitIdle.position[frame].x;
				flare.localPosition.y=sitIdle.position[frame].y;
			}
			else if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Sit_Tap")
			{
				flare.localPosition.x=sitTap.position[frame].x;
				flare.localPosition.y=sitTap.position[frame].y;
			}
			else if (spriteAnimation.GetCurrentAnimation().clip.name=="Wizard_Sit_Yeahpose")
			{
				flare.localPosition.x=sitYeahpose.position[frame].x;
				flare.localPosition.y=sitYeahpose.position[frame].y;
			}
		}
	}
	
}

function DoTap()
{
	alphaChangeRate=10.0;
	switch(characterState)
	{
	case CharacterState.Broom:

		break;
	case CharacterState.Stand:
		if (!spriteAnimation.IsPlaying("Wizard_Stand_Yeahpose"))
		{
			spriteAnimation.Play("Wizard_Stand_Tap");
			outLineSpriteAnimation.Play("Wizard_Outline_Stand_Tap");
			if (wandSparker!=null)
			{
				wandSparker.emit=true;
			}	
		
		}
		
		if (totoAnimation!=null)
		{
			if (!totoAnimation.IsPlaying("Toto_Yeahpose"))
			{
				totoAnimation.Play("Toto_Tap");
			}
			
		}
		
		break;
	case CharacterState.OnBroom:
		spriteAnimation.Play("Wizard_Sit_Tap");
		outLineSpriteAnimation.Play("Wizard_Outline_Sit_Tap");
		if (wandSparker!=null)
		{
			wandSparker.emit=true;
		}
		break;
	}
	
}

function SetCharacterState(_characterState:CharacterState)
{

	characterState=_characterState;
	switch(characterState)
	{
	case CharacterState.Broom:
		iTween.MoveBy(this.gameObject,iTween.Hash("islocal",true,"time",0.8,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong) );
		broomTrail.gameObject.active=true;
		//spriteAnimation.Play("Broom_Idle");
		break;
	case CharacterState.Stand:
		broomTrail.gameObject.active=false;
		spriteAnimation.Play("Wizard_Stand_Idle");
		outLineSpriteAnimation.Play("Wizard_Outline_Stand_Idle");
		SetFlarePosition();
		spriteAnimation.Pause();
		outLineSpriteAnimation.Pause();
		break;
	case CharacterState.OnBroom:
		iTween.MoveBy(this.gameObject,iTween.Hash("islocal",true,"time",0.8,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong) );
		broomTrail.gameObject.active=true;
		spriteAnimation.Play("Wizard_Sit_Idle");
		outLineSpriteAnimation.Play("Wizard_Outline_Sit_Idle");
		SetFlarePosition();
		outLineSpriteAnimation.transform.position.x=myTransform.position.x-0.15;
		outLineSpriteAnimation.transform.position.y=myTransform.position.y+0.4;
		spriteAnimation.Pause();
		outLineSpriteAnimation.Pause();
		break;
	}
	
}

//get 6 or more combo
function DoCircle()
{
	if (characterState==CharacterState.OnBroom)
	{
		iTween.RotateAdd(this.gameObject,iTween.Hash("time",0.5,"z",360,"easetype",iTween.EaseType.easeInOutSine) );
	}
}

function Jump()
{
	switch(characterState)
	{
	case CharacterState.Broom:
		//spriteAnimation.Play("Broom_Idle");
		break;
	case CharacterState.Stand:
		spriteAnimation.Play("Wizard_Stand_Yeahpose");
		outLineSpriteAnimation.Play("Wizard_Outline_Stand_Yeahpose");
		
		if (totoAnimation!=null)
		{
			totoAnimation.Play("Toto_Yeahpose");
			
		}
		break;
	case CharacterState.OnBroom:

		spriteAnimation.Play("Wizard_Sit_Yeahpose");
		outLineSpriteAnimation.Play("Wizard_Outline_Sit_Yeahpose");
		break;
	}
}

function EnableGlow()
{
	if (!glowEnabled)
	{
		glowEnabled=true;
		SetOutlineColor(Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),1.0));
	}
}

function DisableGlow()
{
	if (glowEnabled)
	{
		glowEnabled=false;
	}
	
}
function SetOutlineColor(_color:Color)
{
	outlineSprite.color=_color;

}

function Update ()
{
	#if UNITY_IPHONE
	actualAccel = Input.acceleration;
	#endif
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	actualAccel.x = Input.GetAxis("Horizontal")/3;
	#endif
	
	SetFlarePosition();
	
	
	if (characterState==CharacterState.Broom)
	{
		outlineSprite.color.a=0;
	}
	else
	{
		if(glowEnabled)
		{
			if (outlineSprite.color.a<=0.1)
			{
				alphaChangeRate=1;
			}
			
			if (outlineSprite.color.a>=0.9)
			{
				alphaChangeRate=-1;
			}	
		}
		else
		{
			alphaChangeRate=-1;
		}
		
		outlineSprite.color.a+=alphaChangeRate*Time.deltaTime;
	}
	
	
	switch(characterState)
	{
		case CharacterState.Broom:
			//iTween.MoveBy(this.gameObject,iTween.Hash("time",0.8,"y",0.5,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong) );

			if (tm!=null){
				if (tm.stage4_flag==2 && tm.scrollingText.dialogOver && Mathf.Abs(myTransform.position.x)>0.1)
			{
				//fly
				
				myTransform.position.x-=Mathf.Lerp(0,myTransform.position.x,Time.deltaTime);
				if (Mathf.Abs(myTransform.position.x-myTransform.parent.position.x)<0.1)
				{
					tm.stage4_flag=3;
					tm.canTilt=true;
				}
				}
				else if (tm.canTilt && gameState==GameState.Tutorial || gameState==GameState.InGame )
				{
					if (tm.stage4_flag==4 && Mathf.Abs(myTransform.position.x-myTransform.parent.position.x)>5)
					{
						tm.stage4_flag=5;
					}
					
					if ( tm.stage4_flag == 4 )
					{
						tm.stage4_flag=5;
					}
					
					#if UNITY_EDITOR
					if (tm.stage4_flag==4 )
					{
						tm.stage4_flag=5;
					}
					#endif
					
					myTransform.rotation = Quaternion.Slerp(myTransform.rotation, Quaternion.Euler (0, 0, 0), 3*Time.deltaTime);
					if (actualAccel.x < -0.05 && myTransform.position.x >= -8.0 )
					{
						rotateAmount=-actualAccel.x*150*Time.deltaTime;				
						myTransform.Rotate(0,0,rotateAmount);
						myTransform.position.x += Time.deltaTime * actualAccel.x * moveSpeed;
					}
					
					if ( actualAccel.x > 0.05 && myTransform.position.x <= 8.0 )
					{
						rotateAmount=-actualAccel.x*150*Time.deltaTime;				
						myTransform.Rotate(0,0,rotateAmount);
						myTransform.position.x += Time.deltaTime * actualAccel.x * moveSpeed;
					}
				}
			}
			
			break;
		
		
		case CharacterState.Stand:	
			
			if (totoAnimation!=null)
			{
				if (totoAnimation.IsPlaying("Toto_Tap") && totoAnimation.GetCurFrameIndex()==6 || totoAnimation.IsPlaying("Toto_Yeahpose") && totoAnimation.GetCurFrameIndex() ==12 )
				{
					totoAnimation.Play("Toto_Idle");
				}
				
				if ( totoAnimation.IsPlaying("Toto_Idle") && (totoAnimation.GetCurFrameIndex()==29 ) )
				{
					totoAnimation.SetFrame("Toto_Idle",0);
					totoAnimation.Play("Toto_Idle");
				}
				
			}
			
			
			
			if (spriteAnimation.IsPlaying("Wizard_Stand_Tap") && spriteAnimation.GetCurFrameIndex()==7 || spriteAnimation.IsPlaying("Wizard_Stand_Yeahpose") && spriteAnimation.GetCurFrameIndex() ==12 )
			{				
				spriteAnimation.SetFrame("Wizard_Stand_Idle",0);
				outLineSpriteAnimation.SetFrame("Wizard_Outline_Stand_Idle",0);
				spriteAnimation.Play("Wizard_Stand_Idle");
				outLineSpriteAnimation.Play("Wizard_Outline_Stand_Idle");


				
				SetFlarePosition();
				if (freeze) 
				{
					spriteAnimation.Pause();
					outLineSpriteAnimation.Pause();
				}
				if (wandSparker!=null)
				{
					wandSparker.emit=false;
				}
			}

			if ( spriteAnimation.IsPlaying("Wizard_Stand_Idle") && (spriteAnimation.GetCurFrameIndex()==29 ) )
			{
				if (!freeze) 
				{
					spriteAnimation.SetFrame("Wizard_Stand_Idle",0);
					outLineSpriteAnimation.SetFrame("Wizard_Outline_Stand_Idle",0);
					
					spriteAnimation.Play("Wizard_Stand_Idle");
					outLineSpriteAnimation.Play("Wizard_Outline_Stand_Idle");
				}
			}
			if (spriteAnimation.IsPaused("Wizard_Stand_Idle") )
			{
				if (!freeze) 
				{
					spriteAnimation.Play("Wizard_Stand_Idle");
					outLineSpriteAnimation.Play("Wizard_Outline_Stand_Idle");
				}
				
			}
			

			break;
		case CharacterState.OnBroom:
			
			
			
			myTransform.rotation = Quaternion.Slerp(myTransform.rotation, Quaternion.Euler (0, 0, 0), 3*Time.deltaTime);
			
			if (spriteAnimation.IsPlaying("Wizard_Sit_Tap") && spriteAnimation.GetCurFrameIndex()==6 ||  spriteAnimation.IsPlaying("Wizard_Sit_Yeahpose") && spriteAnimation.GetCurFrameIndex() ==12)
			{
				spriteAnimation.SetFrame("Wizard_Sit_Idle",0);
				outLineSpriteAnimation.SetFrame("Wizard_Outline_Sit_Idle",0);
				spriteAnimation.Play("Wizard_Sit_Idle");
				outLineSpriteAnimation.Play("Wizard_Outline_Sit_Idle");
				SetFlarePosition();
				if (freeze) 
				{
					spriteAnimation.Pause();
					outLineSpriteAnimation.Pause();
				}
				if (wandSparker!=null)
				{
					wandSparker.emit=false;
				}
			}
			
			if ( spriteAnimation.IsPlaying("Wizard_Sit_Idle") && (spriteAnimation.GetCurFrameIndex()==29 ) )
			{
				if (!freeze) 
				{
					spriteAnimation.SetFrame("Wizard_Sit_Idle",0);
					outLineSpriteAnimation.SetFrame("Wizard_Outline_Sit_Idle",0);
					
					spriteAnimation.Play("Wizard_Sit_Idle");
					outLineSpriteAnimation.Play("Wizard_Outline_Sit_Idle");
				}
			}
			if (spriteAnimation.IsPaused("Wizard_Sit_Idle") )
			{
				if (!freeze) 
				{
					spriteAnimation.Play("Wizard_Sit_Idle");
					outLineSpriteAnimation.Play("Wizard_Outline_Sit_Idle");
				}
				
			}
			
			
			if (tiltOn)
			{
				if (actualAccel.x < -0.05 && myTransform.position.x >= -8.0 )
				{
					rotateAmount=-actualAccel.x*150*Time.deltaTime;				
					myTransform.Rotate(0,0,rotateAmount);
					myTransform.position.x += Time.deltaTime * actualAccel.x * moveSpeed;
				}
				else if ( actualAccel.x > 0.05 && myTransform.position.x <= 8.0 )
				{
					rotateAmount=-actualAccel.x*150*Time.deltaTime;
					myTransform.Rotate(0,0,rotateAmount);
					myTransform.position.x += Time.deltaTime * actualAccel.x * moveSpeed;
				}
				else
				{
					
				}
			}
			break;
	}	
}

function AddStarCoin()
{
	if (doubleStarcoins)
	{
		pm.IncrementStarCoins(2);
	}
	else
	{
		pm.IncrementStarCoins(1);
	}
	//TextStarCoinsCount.text=""+ pm.GetGameStarCoinsCount();
	TextStarCoinsCount.text=""+ pm.GetTempRecord(Record.StarCoins);
	
	//iTween.Stop(starcoin);
	starcoin.transform.localScale.x=1;
	starcoin.transform.localScale.y=1;
	starcoin.transform.rotation.eulerAngles.z=0;
	//iTween.PunchScale(starcoin,iTween.Hash("x",1.1,"y",1.1,"time",1));
	//iTween.PunchRotation(starcoin,iTween.Hash("z",360,"time",2));
	
	//am.PlayAudio(SoundEffect.StarCoinCollect);
}

function OnTriggerEnter(hit : Collider)
{
	switch(gameState)
	{
	case GameState.InGame:
		if (characterState==CharacterState.Broom || characterState==CharacterState.OnBroom)	
		{
			if ( hit.transform.tag == "StarCoin" )
			{
				//hit.transform.gameObject.SendMessage("Hit");
				hit.gameObject.GetComponent(StarCoin).Hit();
				//pm.IncrementGameStarCoins(1);
				//AddStarCoin();
				
			}
		}
		else if (characterState==CharacterState.Stand)
		{
		
		}
		break;
	case GameState.Tutorial: 
		if (characterState==CharacterState.Broom || characterState==CharacterState.OnBroom)	
		{
			if ( hit.transform.tag == "StarCoin" )
			{
				hit.gameObject.GetComponent(StarCoin).BroomHit();
				//hit.transform.gameObject.SendMessage("Hit");
				if (tm.tutorialStage==TutorialStage.Stage4)
	        	{
	        		tm.starCoinCount++;
	        		TextStarCoinsCount.text=""+tm.starCoinCount;

	        	}
	        	
	        	iTween.Stop(starcoin);
				starcoin.transform.localScale.x=1;
				starcoin.transform.localScale.y=1;
				starcoin.transform.rotation.eulerAngles.z=0;
				iTween.PunchScale(starcoin,iTween.Hash("x",1.1,"y",1.1,"time",1));
				iTween.PunchRotation(starcoin,iTween.Hash("z",360,"time",2));
			}
		}
		else if (characterState==CharacterState.Stand)
		{
		
		}
		
		break;
	}
}

function CalcMoveSpeed()
{

	
	if (gameState==GameState.InGame)
	{
		moveSpeed=10.5+(pm.GetBroomLevel()*2.5);
	}
	else
	{
		moveSpeed=10.5;
	}
}


function SetState(_gameState:GameState)
{
	gameState=_gameState;
}