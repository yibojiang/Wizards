var exsprite:exSprite;
var start:float;
var end:float;
function Awake()
{
	exsprite=this.GetComponent(exSprite);
}
function Update () {
	exsprite.color.a=Random.Range(start,end);
}