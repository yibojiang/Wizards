var spriteFont:exSpriteFont;
var topLerpSpeed:float;
var botLerpSpeed:float;
var targetRGB:float;
function Awake()
{
	spriteFont=this.GetComponent(exSpriteFont);
}

function Update () 
{
	spriteFont.botColor=Color(Mathf.PingPong(botLerpSpeed*Time.time,targetRGB),Mathf.PingPong(botLerpSpeed*Time.time,targetRGB),Mathf.PingPong(botLerpSpeed*Time.time,targetRGB),1);
	spriteFont.topColor=Color(Mathf.PingPong(topLerpSpeed*Time.time,targetRGB),Mathf.PingPong(topLerpSpeed*Time.time,targetRGB),Mathf.PingPong(topLerpSpeed*Time.time,targetRGB),1);
}