var myTransform:Transform;
var spawnAreaStart:Vector3;
var spawnAreaEnd:Vector3;
var trail:TrailRenderer;
var speed:float;

function Awake()
{
	trail=this.GetComponent(TrailRenderer);
	spawnAreaStart=Vector3(-100.0,300.0,0);
	spawnAreaEnd=Vector3(600.0,500.0,0);
	myTransform=transform;
	Reset();
}

function Reset()
{
	trail.time=0;
	myTransform.position.x=Random.Range(spawnAreaStart.x,spawnAreaEnd.x);
	myTransform.position.y=Random.Range(spawnAreaStart.y,spawnAreaEnd.y);
	speed=Random.Range(50,100);
}

function Update () 
{
	if (myTransform.position.y<-200  )
	{
		
		Reset();
	}
	else
	{
		trail.time=Random.Range(0.5,1.0);
		myTransform.position.x-=speed*Time.deltaTime;
		myTransform.position.y-=speed*Time.deltaTime;
	}
}