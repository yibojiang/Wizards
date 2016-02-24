var isLoop : boolean = false;
var spawnHeight : float;
var deadHeight: float;

var tiltXOffset:float;
var tiltYOffset:float;

var scrollSpeed:float;

var tiltValue:float;

var travelHeight:float=0.0;

var layerType:LayerType;

private var layerManager:LayerManager;

var myTransform : Transform;

var AccelerometerUpdateInterval : float = 1.0 / 60.0;
var LowPassKernelWidthInSeconds : float = 1.0;
private var LowPassFilterFactor : float = AccelerometerUpdateInterval / LowPassKernelWidthInSeconds; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;

function Awake()
{
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager);
	myTransform=transform;
	

}

function Start()
{

}

function LowPassFilterAccelerometer() : Vector3 {
	lowPassValue = Vector3.Lerp(lowPassValue, Input.acceleration, LowPassFilterFactor);
	return lowPassValue;
}

function Update () 
{

	var xOffset : float;	
	var yOffset: float;

	//var actualAccel : Vector3= Input.acceleration;
	var actualAccel : Vector3= LowPassFilterAccelerometer();
	actualAccel.y+=0.5;
	
	#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
	//actualAccel.x = Input.GetAxis("Horizontal")/3;
	//actualAccel.y = Input.GetAxis("Vertical")/3;
	#endif

	//back > layer 10, front < layer 10
	if (layerManager.tiltOn)
	{

		xOffset=-actualAccel.x*layerManager.tiltSpeed*Time.deltaTime*(tiltValue );
		yOffset=-actualAccel.y*layerManager.tiltSpeed*Time.deltaTime*(tiltValue );
	}
	else
	{
		xOffset=0;
		yOffset=0;
	}
	
	xOffset-=tiltXOffset*6*Time.deltaTime;
	yOffset-=tiltYOffset*6*Time.deltaTime;

	/*
	tiltXOffset+=xOffset*transform.localScale.x;
	transform.position.x+=xOffset*transform.localScale.x;

	tiltYOffset+=yOffset*transform.localScale.x;
	transform.position.y+=yOffset*transform.localScale.x;
	*/
	if (Mathf.Abs( xOffset)>0.001)
	{
		myTransform.localPosition.x+=xOffset;
		tiltXOffset+=xOffset;
	}
	
	if (Mathf.Abs( yOffset)>0.001)
	{
		tiltYOffset+=yOffset;
		myTransform.localPosition.y+=yOffset;
	}
	//transform.position.x= tiltXOffset;
	//transform.position.y= tiltYOffset;
	
	travelHeight+=Time.deltaTime*layerManager.initYSpeed*scrollSpeed;

}