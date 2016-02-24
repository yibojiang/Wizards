var timerText:exSpriteFont;



function Update () {
	timerText.text="Time: "+Time.time;
	if (Input.GetKeyDown(KeyCode.A))
	{
		Time.timeScale+=0.5;
	}
	
	if (Input.GetKeyDown(KeyCode.S))
	{
		Time.timeScale=1;
	}
	
	if (Input.GetKeyDown(KeyCode.D))
	{
		Time.timeScale-=0.5;
	}
	
	if (Input.GetKeyDown(KeyCode.Q))
	{
		Time.timeScale+=1;
	}
	
	if (Input.GetKeyDown(KeyCode.E))
	{
		Time.timeScale-=1;
	}
}