private var AccelerometerUpdateInterval : float = 1.0 / 60.0;
var LowPassKernelWidthInSeconds : float = 1.0;

private var LowPassFilterFactor : float = AccelerometerUpdateInterval / LowPassKernelWidthInSeconds; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;

var dir : Vector3;

var accelInput : Vector3;
var tiltMoveScale : float = 10.0;
var calibrationOffset : Vector3;

function Start ()
{
	//QualitySettings.currentLevel = QualityLevel.Simple;

	lowPassValue = Input.acceleration;
	//calibrationOffset = Input.acceleration * -1.0;
	calibrationOffset = Vector3(0.0, 0.5, 0.0);
	
	if ( Application.platform == RuntimePlatform.IPhonePlayer )
	{
		tiltMoveScale *= 2;
	}
	
}


function Update () 
{
	
}

function LateUpdate()
{
/*
	var xOffset : float;	
	var yOffset: float;

	var actualAccel : Vector3= LowPassFilterAccelerometer()*10;
	//actualAccel.y+=0.5;
	
	#if UNITY_EDITOR
	//actualAccel.x = Input.GetAxis("Horizontal");
	//actualAccel.y = Input.GetAxis("Vertical");
	transform.localPosition.x=actualAccel.x;
	transform.localPosition.y=actualAccel.y;
	
	#endif
	
	
	#if UNITY_IPHONE
	transform.localPosition.x=actualAccel.x;
	transform.localPosition.y=actualAccel.y;
	#endif
	
*/
	//transform.parent.transform.position.z+=Time.deltaTime;
	
	/*
	accelInput = LowPassFilterAccelerometer();
	dir = accelInput;
	dir += calibrationOffset;
	dir *= tiltMoveScale;
	dir.z = 0.0;
	dir.y = 0.0;

	this.transform.localPosition = dir;
	*/
}

function LowPassFilterAccelerometer() : Vector3 {
	lowPassValue = Vector3.Lerp(lowPassValue, Input.acceleration, LowPassFilterFactor);
	return lowPassValue;
}