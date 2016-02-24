
function Update ()
{
	var boxes : Component[] = GetComponentsInChildren(BoxCollider);
	
	for ( var box : BoxCollider in boxes )
	{
		box.size.z = 40.0;
	}
}