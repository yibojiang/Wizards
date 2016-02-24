var pm:ProfileManager;
var secrect:Secrect;
var exsprite:exSprite;
var button:UIButton;
var socrates:secrectDialog;
var exbutton:UIexSprite;
var question:GameObject;
var got:boolean;

function Awake()
{
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager);
	socrates=GameObject.Find("socrates").GetComponent(secrectDialog);
	exsprite=this.GetComponent(exSprite);
	button=exsprite.transform.parent.GetComponent(UIButton);
	exbutton=GetComponent(UIexSprite) as UIexSprite;
	
	button.scriptWithMethodToInvoke=this;
	button.methodToInvoke="ShowDescription";
	
	question=Resources.Load("Prefab/SecrectMark");
}


function ShowDescription()
{
	socrates.Say(secrect,"Hello, my name is "+this.name+", and I'm losing weight right now !");
	//if ( Wizards.Utils.DEBUG ) Debug.Log(this.name);
}

function Start()
{
	
	
	if (pm.GetSecrect(secrect)==0)
	{
	
		exbutton.enabled=false;
		exsprite.color=Color(0,0,0,255);
		Instantiate(question,transform.position,Quaternion.identity);
		got=false;
		//if ( Wizards.Utils.DEBUG ) Debug.Log("not got");
	}
	else
	{
		exbutton.enabled=true;
		exsprite.color=Color(255,255,255,255);
		got=true;
		//if ( Wizards.Utils.DEBUG ) Debug.Log("got");
	}
	
}

function Update () 
{



}