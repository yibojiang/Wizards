private var layerSL:LayerSaveAndLoad;
var layerManager:LayerManager;

function Awake()
{
	layerSL=GameObject.Find("LayerSaveAndLoad").GetComponent(LayerSaveAndLoad);
	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager);

}

function Update () 
{
	if (Input.GetKeyDown(KeyCode.A))
	{
		layerManager.Play(layerManager.initYSpeed+10);
	}
	
	if (Input.GetKeyDown(KeyCode.S))
	{
		layerManager.Pause();
	}
	
	if (Input.GetKeyDown(KeyCode.D))
	{
		layerManager.Play(layerManager.initYSpeed-10);
	}
	
	if (Input.GetKeyDown(KeyCode.Q))
	{
		layerManager.Play(layerManager.initYSpeed+100);
	}
	
	if (Input.GetKeyDown(KeyCode.E))
	{
		layerManager.Play(layerManager.initYSpeed-100);
	}
}

function OnGUI()
{
	if ( GUI.Button(Rect(10,80,100,60), "Save") )
	{
		layerSL.SaveStages(layerSL._FileName);
	}	
	/*
	if ( GUI.Button(Rect(200,150,100,60), "Save Tutorial") )
	{
		layerSL.SaveStages(layerSL._TutorialFileName);
	}	
	
	if ( GUI.Button(Rect(10,150,100,60), "Play") )
	{
		layerManager.Play(layerManager.initYSpeed+10);
	}
	
	if ( GUI.Button(Rect(10,220,100,60), "Stop") )
	{
		layerManager.Pause();
	}
	
	*/
	if ( GUI.Button(Rect(200,80,100,60), "Load") )
	{
		layerSL.LoadDefaultStages();
	}
	/*
	
	if ( GUI.Button(Rect(200,220,100,60), "Load Tutorial") )
	{
		layerSL.LoadTutorialStages();
	}
	*/

}
