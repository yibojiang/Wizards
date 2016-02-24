var rotateSpeed : float = 1.0;

var rotatedir : float = 0.0;


function Start()
{
	Reset();
}

function Reset()
{
	if ( Random.value < 0.5 )
	{
		rotatedir = -1.0;
	}
	else
	{
		rotatedir = -1.0;
	}
	
	rotateSpeed = Random.Range(90, 90.0);
}

function Update ()
{
	//transform.Rotate(Vector3(0.0, 0.0, rotateSpeed * Time.deltaTime) );
	//transform.localEulerAngles += Vector3(0.0, 0.0, rotateSpeed * Time.deltaTime);
	//this.transform.eulerAngles += Vector3(0.0, 0.0, rotateSpeed * Time.deltaTime);
	this.transform.localEulerAngles.z += rotatedir * rotateSpeed * Time.deltaTime;
}

function IncreaseRotationSpeed(_amount : float )
{
	rotateSpeed += _amount;
}