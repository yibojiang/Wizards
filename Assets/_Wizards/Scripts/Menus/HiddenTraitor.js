var achievementManager:AchievementManagerMainMenu;
var ray : Ray;
var hit : RaycastHit;

function Update () 
{
	ProcessInput();
}

function ProcessInput()
{
	if ( Input.GetMouseButtonDown(0) )
	{
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(ray, hit, 1000.0) )
		{
		    if ( hit.transform.name == "HiddenTraitor" )
		    {
		    	
		    	if (achievementManager!=null)
		    	{
		    		if (achievementManager.achievementArray[Achievement.Sherlock]==0)
					{
						achievementManager.UnlockAchievement(Achievement.Sherlock);
					}
		    	}
		    	
		    	
		    
		    }
		}
	}

	
}