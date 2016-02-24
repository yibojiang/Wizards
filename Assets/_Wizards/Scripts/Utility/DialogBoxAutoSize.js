
var exBorder : exSpriteBorder;
var exFont : exSpriteFont;
var box : BoxCollider;

var widthPadding : float = 5.0;
var heightPadding : float = 5.0;

var applyText : boolean = false;

var targetWidth : float = 0.0;
var targetHeight : float = 0.0;

var resizeTime : float = 1.0;

var lerpVal : float = 0.0;

var easeType : iTween.EaseType;

var hideFont : boolean = false;

var textIndex : int = 0;

var text : String[];

var useLowerAnchor : boolean = false;
var lowerAnchorPos : float;

var startY : float = 0.0;

var typeWriterText : boolean = false;
var typeDelay : float = 0.05;

var updateSizeRealTime : boolean = false;

var minWidth : float;
var minHeight : float;

var showingText : boolean = false;

var maxTextWidth : int = 30;

var charCount : int = 0;

var marker : GameObject;

function Awake()
{
	exBorder = GetComponent(exSpriteBorder) as exSpriteBorder;
	exFont = GetComponentInChildren(exSpriteFont) as exSpriteFont;
	box = GetComponentInChildren(BoxCollider) as BoxCollider;
	
	if ( useLowerAnchor )
	{
		lowerAnchorPos = transform.position.y - (exBorder.height * 0.5);
		
		var pos : Vector3 = transform.position;
		pos.y = lowerAnchorPos;
		
		Instantiate(marker, pos, Quaternion.identity);
		
		startY = transform.position.y;
	}
	
	HideFont();
}

function HideFont()
{
	exFont.botColor.a = 0.0;
	exFont.topColor.a = 0.0;
	exFont.outlineColor.a = 0.0;
}

function ShowFont()
{
	exFont.botColor.a = 1.0;
	exFont.topColor.a = 1.0;
	exFont.outlineColor.a = 1.0;
}


function Update ()
{
	if ( hideFont )
	{
		HideFont();
		hideFont = false;
	}
	
	if ( applyText )
	{
		if ( textIndex < text.length && text.length > 0)
		{
			HideFont();
			exFont.text = text[textIndex];
			
			StartApplyText();
			applyText = false;
		}
	}
}

function UpdateLerpValue(_val : float)
{
	lerpVal = _val;
}

function StartApplyText()
{
	yield;
	if ( typeWriterText )
	{
		//updateSizeRealTime = true;
		ShowFontTypeWriter();
	}
	else
	{
		targetWidth = box.size.x + widthPadding;
		targetHeight = box.size.y + heightPadding;
		lerpVal = 0.0;
		iTween.ValueTo(this.gameObject, iTween.Hash("from", 0.0, "to", 1.0, "time", resizeTime, "easetype", easeType, "onupdate", "UpdateLerpValue"));
		DoNormalText();
	}
}

function Say(_text : String)
{
	if ( showingText )
	{
		return;
	}
	
	if ( useLowerAnchor )
	{
		lowerAnchorPos = transform.position.y - (exBorder.height * 0.5);
		
		var pos : Vector3 = transform.position;
		pos.y = lowerAnchorPos;
		
		Instantiate(marker, pos, Quaternion.identity);
		
		startY = transform.position.y;
	}
	
	showingText = true;
	
	textIndex = 0;
	
	text[textIndex] = FormatText(_text);
	
	HideFont();
	if ( typeWriterText	)
	{
		ShowFontTypeWriter();
	}
	else
	{
		exFont.text = text[textIndex];
		yield;
		
		targetWidth = box.size.x + widthPadding;
		targetHeight = box.size.y + heightPadding;
		lerpVal = 0.0;
		iTween.ValueTo(this.gameObject, iTween.Hash("from", 0.0, "to", 1.0, "time", resizeTime, "easetype", easeType, "onupdate", "UpdateLerpValue"));
		DoNormalText();
	}
}

function DoNormalText()
{
	//var lerpVal : float = 0.0;
	
	var currentWidth : float = exBorder.width;
	var currentHeight : float = exBorder.height;
	
	var currentYPos : float = transform.position.y;
	
	while ( lerpVal < 1.0 )
	{
		exBorder.width = Mathf.Lerp(currentWidth, targetWidth, lerpVal);
		exBorder.height = Mathf.Lerp(currentHeight, targetHeight, lerpVal);
		
		//LimitBoxMinSize();
		
		if ( useLowerAnchor	)
		{
			transform.position.y = lowerAnchorPos + (exBorder.height * 0.5);
		}
		
		yield;
	}

	exBorder.width = targetWidth;
	exBorder.height = targetHeight;
	//LimitBoxMinSize();
	
	ShowFontImmediate();
}

function ShowFontImmediate()
{
	ShowFont();
	NextText();
	showingText = false;
}

function ShowFontTypeWriter()
{
	exFont.text = "";
	
	ShowFont();
	
	var currentChar = 0;
	
	yield;
	
	while ( currentChar < text[textIndex].Length )
	{
		exFont.text += text[textIndex][currentChar];
		
		currentChar++;
		
		
		if ( Input.GetMouseButtonDown(0) == true )
		{
			exFont.text = text[textIndex];
			currentChar = text[textIndex].Length;
			yield;
		}
		
		exBorder.width = box.size.x + widthPadding;
		exBorder.height = box.size.y + heightPadding;
		
		LimitBoxMinSize();
		
		if ( useLowerAnchor	)
		{
			transform.position.y = lowerAnchorPos + (exBorder.height * 0.5);
		}
		
		if ( typeDelay > 0.0 )
		{
			yield WaitForSeconds(typeDelay);
		}
		else
		{
			yield;
		}
	}
	
	NextText();
	showingText = false;
}

function NextText()
{
	textIndex++;
	if ( textIndex == text.Length )
	{
		textIndex = 0;
	}
}

function LimitBoxMinSize()
{
	if ( exBorder.width < minWidth )
	{
		exBorder.width = minWidth;
	}
	
	if ( exBorder.height < minHeight )
	{
		exBorder.height = minHeight;
	}
}

function FormatText(_text : String ) : String
{
	var myString : String = "";
	
	if ( maxTextWidth < 1 )
	{
		if ( Wizards.Utils.DEBUG ) Debug.LogWarning("MAX TEXT WIDTH IS LESS THAN 1");
		return;
	}
	
	if ( _text.length < maxTextWidth )
	{
		// length is ok, do nothing
		if ( Wizards.Utils.DEBUG ) Debug.Log("String less than max line length, not changing");
		myString = _text;
	}
	else
	{
		if ( Wizards.Utils.DEBUG ) Debug.Log("trimming");
		if ( Wizards.Utils.DEBUG ) Debug.Log("length " + _text.length);
		 
		charCount = 0;
		
		myString = "";
		
		for ( var i : int = 0; i < _text.length; ++i )
		{
			if ( Wizards.Utils.DEBUG ) Debug.Log("charcount " + charCount);
			if ( charCount >= maxTextWidth && _text[i] == ' ' )
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("found new line");
				charCount = 0;
				//myString.Insert(i, '\n');
				myString += "\n";
			}
			else
			{
				if ( Wizards.Utils.DEBUG ) Debug.Log("continuing line");
				//myString.Insert(i, _text[i].ToString());
				myString += _text[i].ToString();
				charCount++;
			} 
		}
	}
	if ( Wizards.Utils.DEBUG ) Debug.Log("STRING: " + myString);
	return ( myString );
}