var offset:Vector3;

private var initLifeTime:float=1.2;
private var lifeTime : float;

private var poorSize:float=5;
private var goodSize:float=12;
private var perfectSize:float=14;

private var pr:ParticleRenderer;
private var pe:ParticleEmitter;

var useColor:boolean;
var colorMaterial:Material[];
var alphaMaterial:Material;


function Awake()
{
	pr=this.GetComponent(ParticleRenderer);
	pe=this.GetComponent(ParticleEmitter);

	InitMaterial();
}

function Start()
{

}

function Init(_type:ExplosionType)
{
	lifeTime=initLifeTime;
	
	switch ( _type )
	{
		case ExplosionType.Poor:
			SetSize(poorSize);
			break;
		case ExplosionType.Good:
			SetSize(goodSize);
			break;
		case ExplosionType.Perfect:
			SetSize(perfectSize);
			break;
	}
}


function SetSize(_size:float)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_size);
	pe.minSize=_size-2;
	pe.maxSize=_size;
}

function SetColor(_visual:VisualEffect)
{
	if (colorMaterial[_visual]!=null && (useColor))
	{
		var newMaterials=new Material[2];
		newMaterials[0]=colorMaterial[_visual];
		newMaterials[1]=alphaMaterial;
		pr.sharedMaterials=newMaterials;
	}
}

function InitMaterial()
{
	colorMaterial=new Material[10];
	
	for (var i:int=0;i<colorMaterial.length;i++)
	{
		colorMaterial[i]=new Material(pr.sharedMaterials[0]);
	}

	
	alphaMaterial=pr.sharedMaterials[1];
	
	colorMaterial[VisualEffect.Star].SetColor("_TintColor",Color(0,0,Random.Range(0.9, 1.0),1.0) );
	
	colorMaterial[VisualEffect.GreenStar].SetColor("_TintColor",Color(0,Random.Range(0.9, 1.0),0,1.0) );
	colorMaterial[VisualEffect.Torus].SetColor("_TintColor",Color(0,Random.Range(0.9, 1.0),0,1.0) );
	
	colorMaterial[VisualEffect.OrangeStar].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),Random.Range(0.2, 0.3),0,1.0) );
	colorMaterial[VisualEffect.ButterFly].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),Random.Range(0.2, 0.3),0,1.0) );
	
	
	colorMaterial[VisualEffect.PurpleStar].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),0,Random.Range(0.6, 0.7),1.0) );
	colorMaterial[VisualEffect.Skull].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),0,Random.Range(0.6, 0.7),1.0) );
	
	colorMaterial[VisualEffect.RedStar].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),0,0,1.0) );
	colorMaterial[VisualEffect.Phoenix].SetColor("_TintColor",Color(Random.Range(0.9, 1.0),0,0,1.0) );
	
	
}

function SetColor(_color:Color)
{
	if (pr.materials.length>2)
	{
		pr.materials[0].SetColor("_TintColor",_color);
		pr.materials[1].SetColor("_TintColor",_color);
	}
}

function Update()
{
	
	if ( lifeTime > 0.0 )
	{
		lifeTime -= Time.deltaTime;
	}
	else
	{
		pe.ClearParticles();
		this.gameObject.SetActiveRecursively(false);
		
	}
}

