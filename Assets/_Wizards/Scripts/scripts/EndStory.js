var pm:ProfileManager;
var cameraFade:CameraFade;

function Start()
{
	#if UNITY_IPHONE
	if (pm.GetSkipMovieClip())
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("skip");
		//iPhoneUtils.PlayMovie("EndStory.mov", Color.black, iPhoneMovieControlMode.CancelOnTouch);
		Handheld.PlayFullScreenMovie("70.mp4", Color.black, FullScreenMovieControlMode.CancelOnInput);
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("no skip");
		//iPhoneUtils.PlayMovie( "EndStory.mov", Color.black, iPhoneMovieControlMode.Hidden);
		Handheld.PlayFullScreenMovie( "70.mp4", Color.black, FullScreenMovieControlMode.Hidden);
		
	}
	#endif
	
	cameraFade.FadeTo(this.gameObject,"GotGameOver");
}




function GotGameOver()
{
	pm.SetNextLevelToLoad("SecrectEnding");
	Application.LoadLevel("LevelLoader");
}