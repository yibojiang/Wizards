function Awake()
{
 	iTween.CameraFadeAdd();
	//iTween.CameraFadeTo(1,0);
	//iTween.CameraFadeTo(1,0);
	iTween.CameraFadeFrom(1,1);
	
}
function FadeTo(_completeTarget:GameObject,_function:String)
{
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",0.5,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","FadeIn","oncompleteparams",iTween.Hash("target",_completeTarget,"function",_function)) );
}

function FadeTo(_completeTarget:GameObject,_function:String,_time:float)
{
	iTween.CameraFadeTo(iTween.Hash("amount",1,"time",_time,"ignoretimescale",true,"oncompletetarget",this.gameObject,"oncomplete","FadeIn","oncompleteparams",iTween.Hash("target",_completeTarget,"function",_function)) );
}

function FadeIn(_params:Hashtable)
{
	var _completeTarget:GameObject;
	var _function:String;
	_completeTarget=_params["target"];
	_function=_params["function"];
	_completeTarget.SendMessage(_function);
	iTween.CameraFadeTo(iTween.Hash("amount",0,"time",0.5,"ignoretimescale",true));
}