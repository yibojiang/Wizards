var startAlpha:float;
var endAlpha:float;
var exsprite:exSprite;
var lerpSpeed:float=1.0;
function Awake()
{
	exsprite=this.GetComponent(exSprite);
	//exsprite.color.r=1.0;
}
function Update () {
	//exsprite.color.r =startAlpha+Mathf.PingPong(lerpSpeed*Time.time, endAlpha-startAlpha);
	exsprite.color.r =startAlpha+Mathf.PingPong(lerpSpeed*Time.time, endAlpha-startAlpha);
	exsprite.color.g =startAlpha+Mathf.PingPong(lerpSpeed*Time.time, endAlpha-startAlpha);
	exsprite.color.b =startAlpha+Mathf.PingPong(lerpSpeed*Time.time, endAlpha-startAlpha);
}