var velocity : Vector3;
var gravity : Vector3;
var maxlifeTime : float = 4.0;
private var lifeTime : float = 4.0;

var pMin : float = 0.0;
var pMax : float = 0.0;

var em : ExplosionManager;
var gm : GameManager;
var am : AudioManager;
//var dm : _DebugManager;
var glitterType:GlitterType;



enum GlitterType
{
	Orange,
	Blue
}

function Start()
{
	em = GameObject.Find("ExplosionManager").GetComponent("ExplosionManager") as ExplosionManager;
	gm = GameObject.Find("GameManager").GetComponent("GameManager") as GameManager;
	am = GameObject.Find("AudioManager").GetComponent("AudioManager") as AudioManager;
	
	//dm = GameObject.Find("DebugManager").GetComponent("_DebugManager") as _DebugManager;
	//pMin = particleEmitter.minEmission;
	//pMax = particleEmitter.maxEmission;
	
	//Debug.LogWarning("DISABLING LAYER - NEW VERSION OF EX2D doesnt have layer");
	//GetComponentInChildren(exLayer).SetLayer(1, 0.0);
	//GetComponentInChildren(exLayer).depth = 0.0;
}

function Init()
{
	//transform.position = _position;
	GetComponent.<ParticleEmitter>().ClearParticles();
	GetComponent.<ParticleEmitter>().Simulate(1.0);
	lifeTime = maxlifeTime;
	velocity.x = Random.Range(-3.0, 3.0);
	velocity.y = Random.Range(4.0, 6.0);
	gameObject.layer = 0;
	
	transform.localScale.x=1;
	transform.localScale.y=1;
	
	
}

function Update ()
{

	velocity += gravity * Time.deltaTime;
	transform.position += (velocity * Time.deltaTime);

	transform.localScale.x+=Time.deltaTime*0.2;
	transform.localScale.y+=Time.deltaTime*0.2;
	
	lifeTime -= Time.deltaTime;
	
	
	if (gm.autoTap)
	{
		if (lifeTime<maxlifeTime-2)
		{
			Explode();
		}
	}
	
	if ( lifeTime < 0.0 )
	{
		this.gameObject.SetActiveRecursively(false);

		

		//Destroy(this.gameObject);
	}
	
	//var particleCountModifier : float = dm.GetParticleMultiplier();
	
	//particleEmitter.minEmission = pMin * particleCountModifier;
	//particleEmitter.maxEmission = pMax * particleCountModifier;
	//if ( Wizards.Utils.DEBUG ) Debug.Log("pMin: " + particleEmitter.minEmission );
	//if ( Wizards.Utils.DEBUG ) Debug.Log("pMax: " + particleEmitter.maxEmission );
}

function Explode()
{
	
	if (glitterType==GlitterType.Blue)
	{
		em.DoNormalExplosion(ExplosionType.GlitterExplosionBlue, transform.position);
	}
	else if (glitterType==GlitterType.Orange)
	{
		em.DoNormalExplosion(ExplosionType.GlitterExplosionOrange, transform.position);
	}	
	
	am.PlayAudio(SoundEffect.Good);

	gameObject.layer = 2;
		
	//gm.ReportHit(HitRanking.Good, flightPath.GlitterRain, transform.position);
	gm.ReportGlitters();
	
	this.gameObject.SetActiveRecursively(false);
	//Destroy(this.gameObject);
}

function ExplodePefect()
{
	//var randomDelay:float=Random.Range(0.1,0.5);
	//yield WaitForSeconds(randomDelay);

	
	if (glitterType==GlitterType.Blue)
	{
		em.DoNormalExplosion(ExplosionType.GlitterExplosionBlue, transform.position);
	}
	else if (glitterType==GlitterType.Orange)
	{
		em.DoNormalExplosion(ExplosionType.GlitterExplosionOrange, transform.position);
	}	
	
	am.PlayAudio(SoundEffect.Good);
	
	this.gameObject.SetActiveRecursively(false);
}