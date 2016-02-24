var title:exSpriteFont;
var description:exSpriteFont;
var type:Achievement;
var pm:ProfileManager;
var submenu:SubmenuController;
function Awake()
{
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
}

function Start()
{
	title.text=pm.achievementArray[type].title;
	description.text=pm.achievementArray[type].description;
	submenu=GameObject.Find("Submenu").GetComponent(SubmenuController) as SubmenuController;
	if (!pm.GetAchievement(type))
	{
		title.topColor=Color(0.2,0.2,0.2,1);
		title.botColor=Color(0.2,0.2,0.2,1);
	}
	else 
	{
		title.topColor=Color(1,1,1,1);
		title.botColor=Color(1,1,1,1);
	}
	

}



function Reset()
{
	title.topColor=Color(0.2,0.2,0.2,1);
	title.botColor=Color(0.2,0.2,0.2,1);
}

function Update () {
	if (submenu.submenuState!=SubmenuState.Achievement)
	{
		title.text="";
		description.text="";
	}
	else
	{
		title.text=pm.achievementArray[type].title;
		description.text=pm.achievementArray[type].description;
	}
}