var myTransform:Transform;
var text:exSpriteFont;

function Awake()
{	
	myTransform=transform;
	text=GetComponent(exSpriteFont);
}

function SetCount(_value:int)
{
	text.text="+"+_value;
	text.topColor.a=1;
	text.botColor.a=1;
	text.outlineColor.a=1;
	myTransform.localScale.x=1;
	myTransform.localScale.y=1;
}

function Update () 
{
	text.topColor.a-=2*Time.deltaTime;
	text.botColor.a-=2*Time.deltaTime;
	text.outlineColor.a-=2*Time.deltaTime;
	myTransform.localScale.x+=5*Time.deltaTime;
	myTransform.localScale.y+=5*Time.deltaTime;
}