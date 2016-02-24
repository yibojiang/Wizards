var layerManager:LayerManager;
var layers : Component[];
var layerImages:Component[];
var layerObjs:Component[];
var title:String;
var subTitle:String;

function Awake()
{

	layerManager=GameObject.Find("LayerManager").GetComponent(LayerManager);
	layers =this.gameObject.GetComponentsInChildren(Layer);
	layerImages=this.gameObject.GetComponentsInChildren(LayerImage);
	layerObjs=this.gameObject.GetComponentsInChildren(LayerObject);
	
	var sprite:exSprite;
	
	//Set basic properties for each layer and layerImage and layerObj
	for ( var layer : Layer in layers )
	{
		//layer.gameObject.name = "test";
		
	}
	
	for (var i:int=0;i<layerImages.length;i++)
	{
		
		var layerImage:LayerImage=layerImages[i] as LayerImage;
		
		var layer:Layer=layerImage.transform.parent.GetComponent(Layer);
		layerImage.layerType=layer.layerType;
		layerImage.gameObject.name=this.gameObject.name+"_"+layerImage.layerType+"_"+i;
		layerImage.layer=layerImage.transform.parent.gameObject.GetComponent(Layer);		
		
		
		//fit the background in editor
		if (layerImage.layer.scrollSpeed>=0.5 && layerImage.transform.position.y>=15)
		{
			layerImage.transform.position.y*=layerImage.layer.scrollSpeed;
		}
		
		layerImage.position=layerImage.transform.localPosition;	

		sprite=layerImage.GetComponent(exSprite);
		layerImage.width=sprite.width*sprite.scale.x;
		layerImage.height=sprite.height*sprite.scale.y;
		layerImage.scale.x=layerImage.transform.localScale.x;
		layerImage.scale.y=layerImage.transform.localScale.y;
		layerImage.eulerAngles=sprite.transform.eulerAngles.z;
		
		
		
		
		if (sprite.atlas!=null)
		{
			layerImage.atlas=sprite.atlas.texture.name;
			layerImage.atlasIndex=sprite.index;
		}
		else 
		{
			layerImage.atlas="none";
			layerImage.atlasIndex=-1;
		}
		
	}
	
	for (var j:int=0;j<layerObjs.length;j++)
	{
	
		var layerObj:LayerObject=layerObjs[j] as LayerObject;
		
		layerObj.parentName=layerObj.transform.parent.name;
		//layerObj.transform.position.z=layerObj.transform.parent.position.z-(j+1)*0.01;
		//layerObj.position=layerObj.transform.position-layerObj.transform.parent.position;
		layerObj.position=layerObj.transform.localPosition;
		
		//sprite=layerObj.GetComponent(exSprite);
		
		//layerObj.width=sprite.width*sprite.scale.x;
		//layerObj.height=sprite.height*sprite.scale.y;
		layerObj.scale.x=layerObj.transform.localScale.x;
		layerObj.scale.y=layerObj.transform.localScale.y;
		layerObj.eulerAngles=layerObj.transform.eulerAngles.z;
		//layerObj.gameObject.name=layerObj.parentName+"_LayerObject_"+j;
		
	}
}

function Start()
{
	
	for (var layerImage:LayerImage in layerImages)
	{
		layerManager.layers.Add(layerImage);
	}
	

}
function Update () 
{
	
}