

function Start()
{
	var timeRandom:float=Random.Range(0.8,1);
	var heightRandom:float=Random.Range(0.4,0.6);
	iTween.MoveBy(this.gameObject,iTween.Hash("time",timeRandom,"y",timeRandom,"easetype",iTween.EaseType.easeInQuad,"looptype",iTween.LoopType.pingPong) );

}

function Update()
{
	
}