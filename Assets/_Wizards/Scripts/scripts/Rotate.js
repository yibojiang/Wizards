function Start()
{
	var time:int=Random.Range(8,12);
	iTween.RotateAdd(this.gameObject,iTween.Hash("time",time,"z",360,"easetype",iTween.EaseType.linear,"looptype",iTween.LoopType.loop) );

}
function Update () {
}