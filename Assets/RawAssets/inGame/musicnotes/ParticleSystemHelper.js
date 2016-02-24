private var lastRealTime:float;
var deltaTime:float;
private var pe:ParticleEmitter;
function Awake()
{
	lastRealTime = Time.realtimeSinceStartup;
	pe=this.GetComponent.<ParticleEmitter>();
}
function Update () {
	deltaTime=(Time.realtimeSinceStartup - lastRealTime);
	pe.Simulate(deltaTime);
	lastRealTime=Time.realtimeSinceStartup;
}