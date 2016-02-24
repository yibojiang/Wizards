var levels:GameObject[];
var pm:ProfileManager;
var lm:LevelManager;

function Awake()
{	
	pm=GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	var levelObj:GameObject=Instantiate(levels[0],Vector3(0,0,0),Quaternion.identity);
	levelObj.name="LevelManager";
	lm=levelObj.GetComponent(LevelManager) as LevelManager;
}

function Update () 
{


}