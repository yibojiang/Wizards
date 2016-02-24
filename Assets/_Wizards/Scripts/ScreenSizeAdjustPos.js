#pragma strict

var tallScreenPos : Vector3;
var useLocalPos : boolean = false;
private var pm : ProfileManager;

function Awake()
{
	pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	
	if ( pm != null )
	{
		if ( pm.IsUsingTallScreen() )
		{
			if ( useLocalPos )
			{
				transform.localPosition = tallScreenPos;
			}
			else
			{
				transform.position = tallScreenPos;
			}
		}
	}
}