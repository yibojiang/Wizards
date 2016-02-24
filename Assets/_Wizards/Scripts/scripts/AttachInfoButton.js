var button : UIButton;

var target : MonoBehaviour;

function Start()
{
	// grab link to UIButton
	button=this.GetComponent(UIButton) as UIButton;
	
	if ( transform.parent.tag == "BroomItem" )
	{
		target = transform.parent.GetComponent(BroomItem) as BroomItem;
	}
	else if ( transform.parent.tag == "WandItem" )
	{
		target = transform.parent.GetComponent(WandItem) as WandItem;
	}
	else if ( transform.parent.tag == "FireworkItem" )
	{
		target = transform.parent.GetComponent(FireworkItem) as FireworkItem;
	}
	else if ( transform.parent.tag == "SpecialItem" )
	{
		target = transform.parent.GetComponent(SpecialItem) as SpecialItem;
	}
	
	// setup function to call when button is pressed.
	button.scriptWithMethodToInvoke=target;
	
	button.methodToInvoke="InfoButtonPressed";
}