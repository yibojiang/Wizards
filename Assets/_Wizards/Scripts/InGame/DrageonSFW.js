var pe : ParticleEmitter;

var em : ExplosionManager;

function Awake()
{
	pe = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
	em = GameObject.Find("ExplosionManager").GetComponent(ExplosionManager) as ExplosionManager;
}

function Start()
{
	ProcessDrageon();
}

function ProcessDrageon()
{
	yield WaitForSeconds(1.0);
	
	while ( pe.minSize < 4.0 )
	{
		pe.minSize += Time.deltaTime * 0.5;
		pe.maxSize += Time.deltaTime;
		yield;
	}
	
	yield WaitForSeconds(1.0);
	
	
	var glitPos : Vector3;
	
	var modPos : float = 2.0;
	
	for ( var i : int = 0; i < 4; ++i )
	{
		glitPos.x = transform.position.x + Random.Range(-modPos, modPos);
		glitPos.y = transform.position.y + Random.Range(-modPos, modPos); 
		
		em.FireNormalPerfect(glitPos);
	}
	
	
	Destroy(this.gameObject);
}