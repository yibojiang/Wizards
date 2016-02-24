var button:UIButton;
var text:exSpriteFont;
var color:Color;
var tapColor:Color;
var setColor:boolean;
function Awake()
{
	text=this.GetComponent(exSpriteFont);
	button=text.transform.parent.GetComponent(UIButton);
	color=text.topColor;
	if (!setColor)
	{
		tapColor=Color(1-color.r,1-color.g,1-color.b,text.botColor.a);
	}
}

function Update () 
{

	if (button.controlState==UIButton.CONTROL_STATE.ACTIVE)
	{
	
		text.topColor=tapColor;
		text.botColor=tapColor;
	}
	else
	{
		text.topColor=color;
		text.botColor=color;
	}
}