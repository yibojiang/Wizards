private var fw:fw_main;

function Awake()
{
	fw=this.GetComponent(fw_main);
}
function Update () 
{

	var v1:Vector2;
	v1.x=fw.currentVelocity.x;
	v1.y=fw.currentVelocity.y;
	var angle:float=Vector2.Angle(Vector2.up,v1);
	if (v1.x>0)
	{
		angle=-angle;
	}
	
	fw.head.transform.rotation =  Quaternion.Euler (0, 0, angle);

}