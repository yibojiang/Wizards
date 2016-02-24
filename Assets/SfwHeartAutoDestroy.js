#pragma strict

var pE : ParticleEmitter;

function Start ()
{
	pE = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
}

function Update ()
{
	if ( pE == null )
	{
		Destroy(this.gameObject);
	}
}