var photo:exSpriteAnimation;
var text:SpriteText;
var showing:boolean;
var secrectTarget:GameObject;
var socratehead:exSpriteAnimation;
var pm:ProfileManager;

var nameText:SpriteText;

var autoDialog : DialogBoxAutoSize;
//var speechLink : GameObject;

function Awake()
{
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	this.transform.localScale.x=0;
	this.transform.localScale.y=0;
	secrectTarget=GameObject.Find("SecrectTarget");
	
	photo.transform.localScale.x=0.8;
	photo.transform.localScale.y=0.8;
}

function Show()
{
	transform.position.y=secrectTarget.transform.position.y-10;
	showing=true;
	//iTween.Stop(this.gameObject);
	iTween.ScaleTo(this.gameObject,iTween.Hash("x",1,"y",1,"time",0.2,"easeType",iTween.EaseType.spring));
	iTween.ScaleTo(autoDialog.gameObject,iTween.Hash("x",1,"y",1,"time",0.6,"easeType",iTween.EaseType.spring));
	//iTween.ScaleTo(speechLink,iTween.Hash("x",1,"y",1,"time",0.2,"easeType",iTween.EaseType.spring));
}


function Hide()
{
	//iTween.Stop(this.gameObject);
	iTween.ScaleTo(this.gameObject,iTween.Hash("x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeInQuad,"oncompletetarget",this.gameObject,"oncomplete","Hideit"));
	iTween.ScaleTo(autoDialog.gameObject,iTween.Hash("x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeInQuad,"oncompletetarget",this.gameObject,"oncomplete","Hideit"));
	//iTween.ScaleTo(speechLink,iTween.Hash("x",0,"y",0,"time",0.2,"easeType",iTween.EaseType.easeInQuad,"oncompletetarget",this.gameObject,"oncomplete","Hideit"));
}



function Hideit()
{
	showing=false;
}



function Say(_text:String)
{
	Show();
	photo.GetComponent.<Renderer>().enabled=false;
	text.transform.localPosition.x=-18;
	//text.transform.localPosition.y=;
	text.maxWidth=40;
	text.Text=_text;
	nameText.Text="";
	
	autoDialog.Say(text.Text);
	
}

function Say(_secrect:Secrect,_text:String)
{
	if (pm.GetSecrect(_secrect)==0)
	{
		return;
	}
	Show();
	photo.Play("Secrect");
	photo.SetFrame("Secrect",_secrect);
	photo.Pause();
	photo.GetComponent.<Renderer>().enabled=true;
	text.transform.localPosition.x=-8;
	
	text.maxWidth=30;
	text.Text=pm.secrectArray[_secrect].description;
	nameText.Text=pm.secrectArray[_secrect].title;
	
	autoDialog.Say(text.Text);
}