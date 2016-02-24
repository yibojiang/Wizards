function Awake()
{
	InitGameCenter();
}

function InitGameCenter()
{
	/*
	if (GameCenterBinding.isGameCenterAvailable())
	{
		GameCenterBinding.authenticateLocalPlayer();
	}
	*/
	var async : AsyncOperation = Application.LoadLevelAsync ("MainMenu");
    yield async;
}

function Update () 
{

}