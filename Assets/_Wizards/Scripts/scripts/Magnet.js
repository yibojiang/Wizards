
var fairy:Transform;

function Update () {
}


function OnTriggerEnter(hit : Collider)
{
	
	if ( hit.transform.tag == "StarCoin" )
	{
		(hit.gameObject.GetComponent(StarCoin) as StarCoin).target=fairy;
	}
	
}