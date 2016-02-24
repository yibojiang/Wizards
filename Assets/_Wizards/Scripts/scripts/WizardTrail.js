private var trail:TrailRenderer;
private var pe:ParticleEmitter;

function Awake()
{
	trail=this.GetComponent(TrailRenderer);
	pe=this.GetComponent(ParticleEmitter);
}

function Update () {
	pe.maxSize=Mathf.Abs(this.transform.parent.localScale.x);
	pe.minSize=Mathf.Abs(this.transform.parent.localScale.x);
	trail.startWidth=Mathf.Abs(this.transform.parent.localScale.x);
}