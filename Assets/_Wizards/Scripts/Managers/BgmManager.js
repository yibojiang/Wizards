private static var instance : BgmManager;
 
public static function Instance() : BgmManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<BgmManager>();
    return instance;
}

var bgm:AudioClip[];
private var nextBgm:AudioClip;
private var fadeIn:boolean=false;
private var fadeOut:boolean=false;
private var fadeTime:float=0.03;



var inGameBGM:AudioSource;
var pauseMenuBGM:AudioSource;
var menuBGM:AudioSource;
var secretBGM:AudioSource;


var bgmVol:float=1.0;
var _bgmVol:float=1.0;

var bgmFactor:float=1.0;
enum BGM
{
	STORY,//0
	TUTORIAL,//1
	PAUSE_MENU,//2
	STAGE01,//3
	AREA1,//4
	AREA2,//5
	AREA3,//6
	MainMenuMain,//7
	Shop,//8
	Submenu,//9
	Credits,//10
	FINAL,//11
	WIND,//12
}



function Start()
{
	_bgmVol=0.6;
	bgmFactor=ProfileManager.Instance().GetMusicVolume();
	bgmVol=_bgmVol*bgmFactor;
	if (inGameBGM!=null)
	{
		inGameBGM.volume=bgmVol;
	}
	if (pauseMenuBGM!=null)
	{
		pauseMenuBGM.volume=bgmVol;
	}
	if (menuBGM!=null)
	{
		menuBGM.volume=bgmVol;
	}
}

function Update () 
{
	bgmVol=_bgmVol*bgmFactor;
	if (inGameBGM!=null)
	{
		inGameBGM.volume=bgmVol;
	}
	if (pauseMenuBGM!=null)
	{
		pauseMenuBGM.volume=bgmVol;
	}
	if (menuBGM!=null)
	{
		menuBGM.volume=bgmVol;
	}
}

function FadeBGM(_source:AudioSource,_bgm:BGM)
{
	
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",0.5,"volume",0,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","ChangeBgm","oncompleteparams",iTween.Hash("source",_source,"bgm",_bgm) ) );
}


function FadeOutBGM(_source:AudioSource)
{	
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",0.5,"volume",0,"ignoretimescale",true) );
}


function FadeOutAndPauseBGM(_source:AudioSource)
{
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",0.5,"volume",0,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","PauseBgm","oncompleteparams",_source) );
}

function FadeOutAndStopBGM(_source:AudioSource)
{
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",0.5,"volume",0,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","StopBGM","oncompleteparams",_source) );
}

function FadeOutAndStopBGMEndCredits(_source:AudioSource)
{
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",3.0,"volume",0,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","StopBGM","oncompleteparams",_source) );
}

function StopBGM(_source:AudioSource)
{
	_source.Stop();
}

function PauseBGM(_source:AudioSource)
{
	_source.Pause();
}

function FadeInBGM(_source:AudioSource,_volume:float)
{
	_source.Play();
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",0.5,"volume",_volume,"ignoretimescale",true) );
}

function FadeInBGM(_source:AudioSource,_volume:float, _time : float)
{
	_source.Play();
	iTween.AudioTo(_source.gameObject,iTween.Hash("time",_time,"volume",_volume,"ignoretimescale",true) );
}


function ChangeBgm(_params:Hashtable)
{
	var newbgm:BGM;
	newbgm=_params["bgm"];
	var source:AudioSource;
	source=_params["source"];
	
	source.clip=bgm[newbgm];
	/*
	switch(newbgm)
	{
	case BGM.STORY:	
		source.clip=bgm[0];
		break;
	case BGM.TUTORIAL:
		
		source.clip=bgm[1];
		break;
	case BGM.PAUSE_MENU:
		source.clip=bgm[2];
		break;
	case BGM.STAGE01:
		source.clip=bgm[3];
		
		break;
	case BGM.AREA1:
		source.clip=bgm[4];
		break;
	case BGM.AREA2:
		
		source.clip=bgm[5];
		break;
	case BGM.AREA3:
		
		source.clip=bgm[6];
		break;
	}
	*/
	iTween.AudioTo(source.gameObject,iTween.Hash("time",1,"volume",bgmVol,"ignoretimescale",true) );
	source.Play();
	
}


