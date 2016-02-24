var missMessage : GameObject;
var poorMessage : GameObject;
var goodMessage : GameObject;
var perfectMessage : GameObject;

var fwTutorialMessage : GameObject;

enum FwMessageType
{
	Miss,
	Poor,
	Good,
	Perfect
}

function ShowMessage(_type : FwMessageType, _position : Vector3, _count : int)
{
	var message : GameObject;
	
	switch ( _type )
	{
		case FwMessageType.Miss:
			message = Instantiate(missMessage, _position, Quaternion.identity);	
		break;
		
		case FwMessageType.Poor:
			message = Instantiate(poorMessage, _position, Quaternion.identity);	
		break;
		
		case FwMessageType.Good:
			message = Instantiate(goodMessage, _position, Quaternion.identity);	
		break;
		
		case FwMessageType.Perfect:
			message = Instantiate(perfectMessage, _position, Quaternion.identity);	
		break;
	}
	if ( _type != FwMessageType.Miss )
	{
		//message.SendMessage("SetChainCount", _count);
		message.GetComponent(fireworkrating).SetChainCount(_count);
	}
}

function GetFireworkTutorialMessage() : GameObject
{
	var go : GameObject = Instantiate(fwTutorialMessage, Vector3.zero, Quaternion.identity);
	
	return ( go );
}