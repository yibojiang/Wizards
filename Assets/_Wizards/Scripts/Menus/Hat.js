var wing1:exSprite;
var wing2:exSprite;

function ShowWings()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("SHOWING WINGS");
	wing1.GetComponent.<Renderer>().enabled=true;
	wing2.GetComponent.<Renderer>().enabled=true;
}

function HideWings()
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("HIDING WINGS");
	wing1.GetComponent.<Renderer>().enabled=false;
	wing2.GetComponent.<Renderer>().enabled=false;
}

function Update () 
{
}