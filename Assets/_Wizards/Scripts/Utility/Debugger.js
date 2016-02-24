var isPaused : boolean = false;
var step : boolean = false;

function Update ()
{
	if ( step ) 
	{
		Time.timeScale = 0.0;
		step = false;
	}
	
	if ( Input.GetKeyDown(KeyCode.Space) == true )
	{
		isPaused = !isPaused;
		
		if ( isPaused )
		{
			Time.timeScale = 0.0;
		}
		else
		{
			Time.timeScale = 1.0;
		}
		step = false;
	}	
	
	if ( isPaused )
	{
		if ( Input.GetKeyDown(KeyCode.RightBracket) == true )
		{
			step = true;
			Time.timeScale = 1.0;
		}
		
		if ( Input.GetKey(KeyCode.Period) == true )
		{
			step = true;
			Time.timeScale = 1.0;
		}
	}	
}