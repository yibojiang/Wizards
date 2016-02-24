var scrollSpeedX : float = 5.0;
var scrollSpeedY : float = 0.0;

var scrollMaterial : Material;

private var secretSpeedScale = 0.01; // To keep the users scroll speed human readable...dont have to use tiny values for it..

private var uvOffset : Vector2 = Vector2.zero;

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
}

function Update ()
{
	/* NEW METHOD - CAUSING CLOUD SHAKING?
	var mesh : Mesh = GetComponent(MeshFilter).mesh;
	var uvs : Vector2[]  = mesh.uv;
	
	var xMove : float = Time.deltaTime * scrollSpeedX * secretSpeedScale;
	var yMove : float = Time.deltaTime * scrollSpeedY * secretSpeedScale;
	
 
	for(var k : int = 0; k < uvs.Length; k++)
	{
	    var uv : Vector2 = uvs[k];
	    uvs[k] = new Vector2(uv.x - xMove, uv.y - yMove);
	}
	 
	mesh.uv = uvs;
	*/
	
	
	/*
	scrollMaterial.SetTextureOffset("_MainTex", uvOffset);
	
	uvOffset.x -= Time.deltaTime * scrollSpeedX * secretSpeedScale;
	uvOffset.y -= Time.deltaTime * scrollSpeedY * secretSpeedScale;
	*/
	
	
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