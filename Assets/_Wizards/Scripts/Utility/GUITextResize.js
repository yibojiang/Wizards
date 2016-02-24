var fontSmall : Font;
var fontBig : Font;

function Start()
{
	if ( Screen.width > 480 )
	{
		GetComponent.<GUIText>().font = fontBig;
	}
	else
	{
		GetComponent.<GUIText>().font = fontSmall;
	}
}