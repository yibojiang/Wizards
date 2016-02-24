var startAlpha:float;
var endAlpha:float;
var exsprite:exSprite;
var lerp:boolean=false;
var lerpSpeed:float=1.0;

var notRandom:boolean;

function Awake()
{
	exsprite=this.GetComponent(exSprite);
	
	if (notRandom)
	{
		
	}
	else
	{
		exsprite.color.a=Random.Range(startAlpha,endAlpha);
	}
}

function Update () {
	if (lerp)
	{
		exsprite.color.a=startAlpha+Mathf.PingPong(lerpSpeed*Time.time, endAlpha-startAlpha);
	}
	else
	{
		exsprite.color.a=Random.Range(startAlpha,endAlpha);
	}
}