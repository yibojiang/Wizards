var cc : CreditsCamera;

function Awake()
{
	cc = GameObject.Find("Main Camera").GetComponent(CreditsCamera) as CreditsCamera;
}

function ToggleSpeed()
{
	if ( cc.speed == 10 )
	{
		cc.speed = 300;
	}
	else
	{
		cc.speed = 10;
	}
}