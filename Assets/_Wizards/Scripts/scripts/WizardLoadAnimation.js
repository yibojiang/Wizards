var spriteAnimation:exSpriteAnimation;

function Awake()
{
	spriteAnimation=this.GetComponent(exSpriteAnimation);
}
function Update () {
	if (spriteAnimation.GetCurFrameIndex()==29 )
	{
		spriteAnimation.SetFrame("Wizard_Stand_Idle",0);
		spriteAnimation.Play("Wizard_Stand_Idle");
	}
}