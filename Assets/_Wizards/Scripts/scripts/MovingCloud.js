var scrollSpeedX : float = 5.0;
var scrollSpeedY : float = 0.0;

var scrollMaterial : Material;

private var secretSpeedScale = 0.01; // To keep the users scroll speed human readable...dont have to use tiny values for it..

function Awake()
{
	if ( GetComponent.<Renderer>() == null )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("No renderer found on this object");
	}
	
	scrollMaterial = GetComponent.<Renderer>().material;
	
	if ( scrollMaterial == null )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogError("No material found on this object");
	}
	
	 scrollMaterial.mainTextureOffset.x=Random.Range(0.0,1.0);
}

function Start()
{
	//scrollSpeedX=1.0;
	scrollSpeedX=Random.Range(1.0,1.2);
}

function Update ()
{
	scrollMaterial.mainTextureOffset.x -= Time.deltaTime * scrollSpeedX * secretSpeedScale;
	scrollMaterial.mainTextureOffset.y -= Time.deltaTime * scrollSpeedY * secretSpeedScale;
	
	if ( scrollMaterial.mainTextureOffset.x <= 0.0 )
	{
		scrollMaterial.mainTextureOffset.x = 1.0;
	}
	
	
	if ( scrollMaterial.mainTextureOffset.y <= 0.0 )
	{
		scrollMaterial.mainTextureOffset.y = 1.0;
	}
	
	if ( scrollMaterial.mainTextureOffset.x > 1.0 )
	{
		scrollMaterial.mainTextureOffset.x = 0.0;
	}
	
	
	if ( scrollMaterial.mainTextureOffset.y > 1.0 )
	{
		scrollMaterial.mainTextureOffset.y = 0.0;
	}
}