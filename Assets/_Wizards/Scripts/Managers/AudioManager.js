private static var instance : AudioManager;
 
public static function Instance() : AudioManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<AudioManager>();
    return instance;
}

var miss : AudioClip[];
var poor : AudioClip[];
var good : AudioClip[];
var perfect : AudioClip[];
var fireworkLaunch : AudioClip[];
var starCoinCollect : AudioClip[];
var masterVoice:AudioClip[];
var javiVoice:AudioClip[];
var totoVoice:AudioClip[];
var jesterVoice:AudioClip[];
var glitter:AudioClip;
var catBoardAudio:AudioClip[];
var pageFlip:AudioClip[];

var audience:AudioClip[];

var shopboard:AudioClip[];

var fairySounds:AudioClip[];

var sfx : AudioClip[];

var stamp:AudioClip;
var pointCounting:AudioSource;
var multiTap : AudioSource;
var magicButton:AudioSource;
var fairyAudio:AudioSource;
var starCoinCollectSource : AudioSource;

var timerController:TimerController;
var voiceVol:float=1;
var FXVol:float=1;//for catboard FX and starcoins
var expVol:float=1;
var fwVol:float=1;
var audienceVol:float=1;


var registerCash:AudioClip;

var sfxFactor:float=1.0;

var _voiceVol:float=1;
var _FXVol:float=1;//for catboard FX and starcoins
var _expVol:float=1;
var _fwVol:float=1;
var _audienceVol:float=1;
var fairyMaxVolume : float = 0.2;

var dragonSounds : AudioClip[];

enum SoundEffect
{
	Miss,
	Poor,
	Good,
	Perfect,
	FireWorkLaunch,
	StarCoinCollect,


}

enum AudioEffect
{
	CrowdIO,
	SmallApplause,
	MediumApplause,
	LargeApplause	
}

enum SFX
{
	OptionsFlameOn,
	OptionsFlameOff
}

function Awake()
{
	timerController=GameObject.Find("TimerController").GetComponent(TimerController);
	
}

function Start()
{	
	_voiceVol=1;
	_FXVol=0.6;
	_expVol=1;
	_fwVol=0.5;
	_audienceVol=0.2;
	
	sfxFactor=ProfileManager.Instance().GetSFXVolume();
    if ( Wizards.Utils.DEBUG ) Debug.Log("SFX VOLUME FACTOR = " + sfxFactor);
	voiceVol=_voiceVol*sfxFactor;
	FXVol=_FXVol*sfxFactor;
	expVol=_expVol*sfxFactor;
	fwVol=_fwVol*sfxFactor;
	audienceVol=_audienceVol*sfxFactor;
	
	if (pointCounting!=null)
	{
		pointCounting.volume=FXVol;
	}
	if (multiTap!=null)
	{
		multiTap.volume=FXVol;
	}
	
	if (magicButton!=null)
	{
		magicButton.volume=FXVol;
	}
	if ( fairyAudio != null )
	{
		fairyAudio.volume = fairyMaxVolume * FXVol; 
	}
}

function Update()
{
	voiceVol=_voiceVol*sfxFactor;
	FXVol=_FXVol*sfxFactor;
	expVol=_expVol*sfxFactor;
	fwVol=_fwVol*sfxFactor;
	audienceVol=_audienceVol*sfxFactor;
	
	if (pointCounting!=null)
	{
		pointCounting.volume=FXVol;
	}
	if (multiTap!=null)
	{
		//multiTap.volume=FXVol;
	}
	
	if (magicButton!=null)
	{
		magicButton.volume=FXVol;
	}
	
	if ( fairyAudio != null )
	{
		fairyAudio.volume = fairyMaxVolume * FXVol;
	}
	
}

function PlayFairySound()
{
	var index : int = Random.Range(0, fairySounds.length);
	if ( Wizards.Utils.DEBUG ) Debug.Log("Playing FairySound : " + index);
	var sound : AudioClip = fairySounds[index];
	
	fairyAudio.PlayOneShot(sound);
}

function PlayPageFlip()
{
	var index : int = Random.Range(0, pageFlip.length);
	if ( Wizards.Utils.DEBUG ) Debug.Log("Playing PageFlipSound : " + index);
	var sound : AudioClip = pageFlip[index];
	
	GetComponent.<AudioSource>().PlayOneShot(sound, FXVol);
}

function PlayOneShotAudio(_audioClip:AudioClip,_volume:float)
{
	GetComponent.<AudioSource>().PlayOneShot(_audioClip,_volume);
}

function PlayOneShotAudioParams(_params:Hashtable)
{
	var _audioClip:AudioClip;
	var _volume:float;
	_audioClip=_params["audio"];
	_volume=_params["volume"];;
	GetComponent.<AudioSource>().PlayOneShot(_audioClip,_volume);
}


function PlayAudioDelay(_audioClip:AudioClip,_volume,_delay:float)
{
	//iTween.MoveAdd(this.gameObject,iTween.Hash("time",_delay,"x",1,"oncomplete","PlayAudio","oncompleteparams",iTween.Hash,"ignoretimescale",true) );
	timerController.AddTimer(_delay,this.gameObject,"PlayOneShotAudioParams",iTween.Hash("audio",_audioClip,"volume",_volume),true);
}


function PlayAudio(_type : SoundEffect)
{

	switch ( _type )
	{
		case SoundEffect.Miss:
			PlayMiss();
		break;
		
		case SoundEffect.Poor:
			PlayPoor();
		break;
		
		case SoundEffect.Good:
			PlayGood();
		break;
		
		case SoundEffect.Perfect:
			PlayPerfect();
		break;
		
		//case SoundEffect.FireWorkLaunch:
			//PlayFireWorkLaunch();
		break;
		
		case SoundEffect.StarCoinCollect:
			PlayStarCoinCollect();
		break;
		
		
	}
}

function PlayDragonAppear()
{
	GetComponent.<AudioSource>().PlayOneShot(dragonSounds[0], Mathf.Clamp01(FXVol * 1.2));
}

function PlayDragonHit()
{
	var pickSound : int = Random.Range(1, dragonSounds.length);
	GetComponent.<AudioSource>().PlayOneShot(dragonSounds[pickSound], Mathf.Clamp01(FXVol * 1.2));
}

function PlayGlitterRain()
{
	
	GetComponent.<AudioSource>().PlayOneShot(glitter,0.9*expVol);
}

function PlayMiss()
{
	
	var i : int = Random.Range(0, miss.length);
	//print("playing version: " + i);

	GetComponent.<AudioSource>().PlayOneShot(miss[i],2*fwVol);
	//if ( Wizards.Utils.DEBUG ) Debug.Log(3*fwVol);
}


function PlayPoor()
{
	//audio.volume=0.6;
	var i : int = Random.Range(0, poor.length);
	//print("playing version: " + i);
	
	GetComponent.<AudioSource>().PlayOneShot(poor[i],0.6*expVol);
}


function PlayGood()
{
	//audio.volume=0.8;
	var i : int = Random.Range(0, good.length);
	//print("playing version: " + i);
	
	GetComponent.<AudioSource>().PlayOneShot(good[i],0.8*expVol);
}


function PlayPerfect()
{
	//audio.volume=1.0;
	var i : int = Random.Range(0, perfect.length);
	//print("playing version: " + i);
	
	GetComponent.<AudioSource>().PlayOneShot(perfect[i],1.0*expVol);
}


/*
function PlayStarCoinCollect()
{
	//audio.volume=0.75;
	var i : int = Random.Range(0, starCoinCollect.length);
	audio.PlayOneShot(starCoinCollect[i],0.75*FXVol);
}
*/

function PlayAudio(_audioSource:AudioSource,_forceRestart:boolean,_volume)
{
	GetComponent.<AudioSource>().volume=_volume;
	if ( _forceRestart	)
	{
		_audioSource.Stop();
		_audioSource.Play();
	}
	else
	{
		if ( !_audioSource.isPlaying )
		{
			_audioSource.Play();
		}
	}

}

function PlayAudioEffect(_effect : AudioEffect, _volume : float )
{
	GetComponent.<AudioSource>().PlayOneShot(audience[_effect] , _volume);
}

function PlayMultiTap(_pitch : int)
{
	var pitchMod:float = _pitch * 0.2;
	multiTap.pitch = 1.0 + pitchMod;
	
	var volMod:float=_pitch*0.1;
	multiTap.volume=fwVol*volMod;
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log(multiTap.volume);
	if ( multiTap.isPlaying == false )
	{
		multiTap.Play();
	}
}

function PlaySFX(_sfx : SFX)
{
	GetComponent.<AudioSource>().PlayOneShot(sfx[_sfx], FXVol);
}

function PlayBirdLaunch()
{
	GetComponent.<AudioSource>().PlayOneShot(fireworkLaunch[0], 1.0);
}

function PlayStarCoinCollect() : boolean
{
	var isPlaying : boolean = starCoinCollectSource.isPlaying;
	if ( !isPlaying )
	{
		starCoinCollectSource.volume = 0.75*FXVol;
		starCoinCollectSource.clip = starCoinCollect[Random.Range(0,starCoinCollect.length)];
		starCoinCollectSource.Play();
	}
	//Debug.LogWarning("ISPLAYING = " + isPlaying);
	return ( isPlaying );
}
