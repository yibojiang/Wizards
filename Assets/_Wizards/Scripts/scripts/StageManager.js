var stageInfo:StageInfo[];

var pm : ProfileManager;

function Awake()
{
	if ( GameObject.Find("ProfileManager") != null )
	{
		pm = GameObject.Find("ProfileManager").GetComponent(ProfileManager) as ProfileManager;
	}
	
	if ( Application.loadedLevelName == "Game" )
	{
		if ( pm.IsUsingTallScreen() )
		{
			stageInfo[8].startHeight = 2147.0;
			stageInfo[8].endHeight = 2147.0;
		}
		else
		{
			stageInfo[8].startHeight = 2152.0;
			stageInfo[8].endHeight = 2152.0;
		}
	}
}

function SetStageNum(_num:int)
{
	stageInfo=new StageInfo[_num];
	for (var i:int=0;i<_num;i++)
	{
		stageInfo[i]=new StageInfo();
	}
}

function SetStageLayerImageInfoNum(_index:int,_num:int)
{
	stageInfo[_index].layerImageInfo=new LayerImageInfo[_num];
	for (var i:int=0;i<_num;i++)
	{
		stageInfo[_index].layerImageInfo[i]=new LayerImageInfo();
	}
}

function SetStageLayerObjInfoNum(_index:int,_num:int)
{
	stageInfo[_index].layerObjInfo=new LayerObjInfo[_num];
	for (var i:int=0;i<_num;i++)
	{
		stageInfo[_index].layerObjInfo[i]=new LayerObjInfo();
	}
}

function SetStageLayerInfoNum(_index:int,_num:int)
{
	stageInfo[_index].layerInfo=new LayerInfo[_num];
	for (var i:int=0;i<_num;i++)
	{
		stageInfo[_index].layerInfo[i]=new LayerInfo();
	}
}