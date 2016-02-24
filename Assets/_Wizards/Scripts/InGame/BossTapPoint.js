var db : DrageonBoss;

var tapPointID : int = 0;

var tapPos : Vector3;

var worldPos : Vector3;

var ray : Ray;

var rayHit : RaycastHit;

var isActive : boolean = false;

var successTapEffect : GameObject;

function Awake()
{
	
}

function Start()
{
	db = GameObject.Find("DrageonBoss").GetComponent(DrageonBoss) as DrageonBoss;
	SetTapPointActive(false);
}

function Update ()
{
	if ( isActive )
	{
		if ( Input.GetMouseButtonDown(0) == true )
		{
			tapPos = Input.mousePosition;
			worldPos = Camera.main.ScreenToWorldPoint(tapPos);
			ray.origin = worldPos;
			ray.direction = Vector3(0.0, 0.0, 1.0);
			
			if ( Physics.Raycast(ray, rayHit, 100.0) == true )
			{
				if ( rayHit.collider == this.GetComponent.<Collider>() )
				{
					db.HitSuccess(tapPointID);
					//Instantiate(successTapEffect, transform.position, Quaternion.identity);
					CancelInvoke();
				}
			}
		}
	}
}

function SetTapPointActive(_isActive : boolean)
{
	isActive = _isActive;
	GetComponent.<Renderer>().enabled = _isActive;
	GetComponent.<Collider>().enabled = _isActive;
}

function SetTapDelay(_delay : float)
{
	//yield WaitForSeconds(_delay);
	
	Invoke("TapFailed", _delay);
}

function TapFailed()
{
	isActive = false;
	db.TapFailed(tapPointID);
}