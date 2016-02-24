var minTime : float = 0.4;
var maxTime : float = 0.6;

var minScaleUP : float = 1.1;
var maxScaleUP : float = 1.3;

var minScaleDOWN : float = 0.7;
var maxScaleDOWN : float = 0.9;

var easeType : iTween.EaseType;

function Start()
{
	DoScaleUp();
}

function DoScaleUp()
{
	var timeRandom : float = Random.Range(minTime, maxTime);
	var scaleAmount : float = Random.Range(minScaleUP, maxScaleUP);
	var scaleTo : Vector3 = Vector3(scaleAmount, scaleAmount, 1.0);
	iTween.ScaleTo(this.gameObject,iTween.Hash("scale", scaleTo, "time",timeRandom, "easetype", easeType, "ignoretimescale", true , "oncomplete", "DoScaleDown"));
}

function DoScaleDown()
{
	var timeRandom : float = Random.Range(minTime, maxTime);
	var scaleAmount : float = Random.Range(minScaleDOWN, maxScaleDOWN);
	var scaleTo : Vector3 = Vector3(scaleAmount, scaleAmount, 1.0);
	iTween.ScaleTo(this.gameObject,iTween.Hash("scale", scaleTo, "time",timeRandom, "easetype", easeType, "ignoretimescale", true , "oncomplete", "DoScaleUp"));
}

function OnEnable()
{
	iTween.Stop(this.gameObject);
	DoScaleUp();
}