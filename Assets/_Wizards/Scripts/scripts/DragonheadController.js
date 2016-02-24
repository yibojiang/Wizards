var pm:ProfileManager;
var cameraFade:CameraFade;

function Update () {
	ProcessInput();
}

function ProcessInput()
{
	if ( Input.touchCount > 0 || Input.GetMouseButtonDown( 0 ) )
	{
		DoTransition();
	}
}

function DoTransition()
{
	cameraFade.FadeTo(this.gameObject,"GotoGame");
}

function GotoGame()
{
	pm.SetShowTips(true);
	pm.SetNextLevelToLoad("Game");
	Application.LoadLevel("LevelLoader");
}