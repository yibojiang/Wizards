static var customWidth : float = 640; //Set this value to the Width of your Game Tab in the Editor
static var customHeight : float = 960; //Set this value to the Height of your Game Tab in the Editor

static function scaledRect (x : float, y : float, width : float, height : float) {
    var returnRect : Rect;
    x = (x*Screen.width) / customWidth;
    y = (y*Screen.height) / customHeight;
    width = (width*Screen.width) / customWidth;
    height = (height*Screen.height) / customHeight;
    
    returnRect = Rect(x,y,width,height);
    return returnRect;
}

static function Position(_x : float, _y : float ) : Vector3
{
	_x = (_x * Screen.width) / customWidth;
    _y = (_y * Screen.height) / customHeight;
    
    return ( Vector3(_x, _y, 0.0) );
    
}
