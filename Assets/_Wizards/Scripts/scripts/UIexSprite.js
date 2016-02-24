var button:UIButton;
var exsprite:exSprite;
var color:Color;
var tapColor:Color;
var setColor:boolean;

function Awake()
{
	exsprite=this.GetComponent(exSprite);
	button=exsprite.transform.parent.GetComponent(UIButton);
	color=exsprite.color;
	if (!setColor)
	{
		
		
		var hsb:HSBColor=HSBColor.FromColor(color);
		hsb.b=hsb.b*0.5;
		
		tapColor=HSBColor.ToColor(hsb);
	}
	
}

function Update () 
{

	if (button.controlState==UIButton.CONTROL_STATE.ACTIVE)
	{
		exsprite.color=tapColor;
	}
	else
	{
		exsprite.color=color;
	}
}