var text:exSpriteFont;
var fadeRate:float;
private var ignoreTimescale:boolean;
function Awake()
{
	text=this.GetComponent(exSpriteFont);
	fadeRate=0.0;
	ignoreTimescale=false;
	
}

function SetAlpha(_value:float)
{
	text.topColor.a=_value;
	text.botColor.a=_value;
	text.outlineColor.a=_value;
	fadeRate=0.0;
}

function FadeIn(_time:float,_delay:float)
{
	if (_delay>0)
	{
		yield WaitForSeconds(_delay);
	}
	text.topColor.a=0;
	text.botColor.a=0;
	text.outlineColor.a=0;
	fadeRate=1.0/_time;
	
	ignoreTimescale=false;
}

function FadeOut(_time:float,_delay:float)
{
	if (_delay>0)
	{
		yield WaitForSeconds(_delay);
	}
	text.topColor.a=1;
	text.botColor.a=1;
	text.outlineColor.a=1;
	fadeRate=-1.0/_time;
	ignoreTimescale=false;
}

function FadeIn(_time:float,_delay:float,_ignoreTimescale:boolean)
{

	if (_delay>0)
	{
		yield WaitForSeconds(_delay);
	}
	text.topColor.a=0;
	text.botColor.a=0;
	text.outlineColor.a=0;
	fadeRate=1.0/_time;
	ignoreTimescale=_ignoreTimescale;
	
}

function FadeOut(_time:float,_delay:float,_ignoreTimescale:boolean)
{
	if (_delay>0)
	{
		yield WaitForSeconds(_delay);
	}
	text.topColor.a=1;
	text.botColor.a=1;
	text.outlineColor.a=1;
	fadeRate=-1.0/_time;
	ignoreTimescale=_ignoreTimescale;
}

function Update () 
{
	if (fadeRate!=0 )
	{
		if (ignoreTimescale)
		{
			text.topColor.a+=fadeRate*TimerController.realDeltaTime;
			text.botColor.a+=fadeRate*TimerController.realDeltaTime;
			text.outlineColor.a+=fadeRate*TimerController.realDeltaTime;
		}
		else 
		{
			text.topColor.a+=fadeRate*Time.deltaTime;
			text.botColor.a+=fadeRate*Time.deltaTime;
			text.outlineColor.a+=fadeRate*Time.deltaTime;
		}
	}
	
}