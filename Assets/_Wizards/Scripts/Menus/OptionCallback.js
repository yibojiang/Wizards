var tutorialCB:UIStateToggleBtn;
var vibrationCB:UIStateToggleBtn;

var musicSlider:UISlider;
var soundSlider:UISlider;

var musicVol:exSprite;
var soundVol:exSprite;

var pm:ProfileManager;

var bgmManager:BgmManager;
var am:AudioManager;

var tutorialCBfire:ParticleEmitter;
var vibrationCBfire:ParticleEmitter;


var tutorialCBglow:exSprite;
var vibrationCBglow:exSprite;

var tutorialOn:boolean;
var vibrationOn:boolean;



var soundSliderUI:UISlider;

private var init:boolean=false;


function Init()
{
	if (!init)
	{
		init=true;
		soundSliderUI.AddValueChangedDelegate(SlideSound);	
	}
	
}

function Start()
{
	musicSlider.defaultValue=pm.GetMusicVolume();
	musicVol.scale.x=musicSlider.Value*24;
	
	var soundVolVal:float=pm.GetSFXVolume();
	soundSlider.defaultValue=soundVolVal;
	soundVol.scale.x=soundVolVal*24;
	
	if (pm.doPlayTutorial())
	{
		SetTutorial(true);
	}
	else
	{
		SetTutorial(false);
	}
	
	if (pm.GetVibration())
	{
		SetVibration(true);
	}
	else
	{
		SetVibration(false);
	}
}

function SetTutorial(_tutorial:boolean)
{
	tutorialOn=_tutorial;
	tutorialCBfire.emit=_tutorial;
	tutorialCBglow.GetComponent.<Renderer>().enabled=_tutorial;
}

function SetVibration(_vibration:boolean)
{
	vibrationOn=_vibration;
	vibrationCBfire.emit=_vibration;
	vibrationCBglow.GetComponent.<Renderer>().enabled=_vibration;
	
	if ( vibrationOn == true )
	{
		Handheld.Vibrate();
	}
}

function TutorialOnOff()
{

	if ( tutorialOn )
	{
		am.PlaySFX(SFX.OptionsFlameOff);
	}
	else
	{
		am.PlaySFX(SFX.OptionsFlameOn);
	}
	
	SetTutorial(!tutorialOn);
}

function VibrationOnOff()
{
	if ( vibrationOn )
	{
		am.PlaySFX(SFX.OptionsFlameOff);
	}
	else
	{
		am.PlaySFX(SFX.OptionsFlameOn);
	}
	
	SetVibration(!vibrationOn);
}

function ApplySetting()
{
	pm.SetMusicVolume(musicSlider.Value);
	pm.SetSFXVolume(soundSlider.Value);
	pm.SetVibration(vibrationOn);
	pm.SetPlayTutorial(tutorialOn);
}


function SlideMusic()
{
	musicVol.scale.x=musicSlider.Value*24;
	bgmManager.bgmFactor=musicSlider.Value;
}

function SlideSound()
{
	soundVol.scale.x=soundSlider.Value*24;
	am.sfxFactor=soundSlider.Value;
    if ( Wizards.Utils.DEBUG ) Debug.Log("SFX VALUE = " + am.sfxFactor);
	am.magicButton.volume=am.FXVol;
	am.magicButton.Stop();
	am.magicButton.Play();
}