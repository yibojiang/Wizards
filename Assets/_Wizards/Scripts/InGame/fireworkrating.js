private var displayTime : float = 1.0;
private var flySpeed : float = 12.0;

function Start()
{
	flySpeed = 1.5;
	displayTime = 1.0;
}	

function Update ()
{
	displayTime -= Time.deltaTime;
	
	transform.position.y += flySpeed * Time.deltaTime;
	
	if ( displayTime <= 0.0 )
	{
		Destroy(this.gameObject);
	}
	
	GetComponent(exSprite).color.a -= 0.02;
}

function SetChainCount(_count : int)
{
	if ( _count > 0 )
	{
		//guiText.text = "" + _count;
	}
}

// TODO = Align the chain count correctly