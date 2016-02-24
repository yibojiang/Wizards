var lifeTime : float = 1.0;

var pE : ParticleEmitter;

function Awake()
{
	pE = GetComponent(ParticleEmitter);
}

function Start()
{
	FadeOut();
}

function FadeOut()
{
	yield WaitForSeconds(lifeTime);
	
	pE.emit = false;
	
	while ( pE.particleCount > 0 )
	{
		yield;
	}
	
	Destroy(this.gameObject);
}