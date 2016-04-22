private static var instance : ExplosionManager;
 
public static function Instance() : ExplosionManager{
    if (instance == null)
        instance =GameObject.FindObjectOfType.<ExplosionManager>();
    return instance;
}

private var firework : GameObject;

var numberFireworks : int = 10;

var force : float = 100;

var currentFirework : int = 0;

var fireworksPoor : GameObject[];
var fireworksGood : Explosion[];
var fireworksGoodInUse:int;

var fireworksSpecial : GameObject[];


var glitter : GameObject[];
var glitterPool : GameObject[];
var maxGlitter : int = 200;

var goodExplodePoolIndex:int=0;
var goodExplodePool: Array;
var maxGoodExplosion : int=30;


var glitterAmount : int = 10;



private var tm:TutorialLevelManager;
private var pm:ProfileManager;

var orangeExplosionPool:Explosion[];
var blueExplosionPool:Explosion[];

var maxGiltterExplision:int;
var glitterExplosion:Explosion[];


var chanceOfSFW:float=0.2;

var flash : FlashControl;
private var am:AudioManager;

var numSFXUnlocked : int = 0;

private var gm : GameManager;



enum ExplosionType
{
	Poor,
	Good,
	Perfect,
	Special,
	Glitter,
	GlitterExplosionBlue,
	GlitterExplosionOrange

}



function Awake()
{
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("NOTE : Need to write cleanup code for the SFW base GO's");
	tm=TutorialLevelManager.Instance();
	pm=ProfileManager.Instance();
	am=AudioManager.Instance();
	gm=GameManager.Instance();
	BuildGlitterExpPool();
	BuildGlitterPool();
	BuildGoodExpPool();
	
	if ( gm.gameState==GameState.InGame )
	{
		numSFXUnlocked = pm.GetNumSFXUnlocked();
	}
	else
	{
		numSFXUnlocked = 1;
	}
}

function BuildGlitterExpPool()
{
	orangeExplosionPool=new Explosion[maxGiltterExplision];
	blueExplosionPool=new Explosion[maxGiltterExplision];
	
	for (var i : int = 0;i<maxGiltterExplision;i++)
	{
		var blueGlitterExp : Explosion = Instantiate(glitterExplosion[0], transform.position, Quaternion.identity);
		blueGlitterExp.gameObject.SetActiveRecursively(false);
		
		blueExplosionPool[i] = blueGlitterExp;
		
		var orangeGlitterExp : Explosion = Instantiate(glitterExplosion[1], transform.position, Quaternion.identity);
		orangeGlitterExp.gameObject.SetActiveRecursively(false);
		
		orangeExplosionPool[i] = orangeGlitterExp;
	}
}

function BuildGlitterPool()
{
	glitterPool = new GameObject[maxGlitter];
	
	for (var i : int = 0; i < maxGlitter; i += 1)
	{
		var glit : GameObject = Instantiate(glitter[Random.Range(0, glitter.length)], transform.position, Quaternion.identity);
		glit.SetActiveRecursively(false);
		
		glitterPool[i] = glit;
	}
}

function BuildGoodExpPool()
{	
	
	
	fireworksGoodInUse=0;
	goodExplodePool=new Array();

	if (tm.gameState==GameState.InGame)
	{
		for (var i=0;i<fireworksGood.length;i++)
		{	
			if (pm.GetFireworkExplosionEnable(i))
			{
				
				fireworksGoodInUse++;		
			}
		}
		
		for (var j=0;j<fireworksGood.length;j++)
		{
			if (pm.GetFireworkExplosionEnable(j))
			{
				AddExplosion(j,maxGoodExplosion/fireworksGoodInUse,false);
			}
		}
		
		//First time play.
		if (fireworksGoodInUse<=0)
		{
			AddExplosion(FireworkExplosion.FWsBurst02,maxGoodExplosion,false);
			pm.SetFireworkExplosion(FireworkExplosion.FWsBurst02,1);
			pm.SetFireworkExplosionEnable(FireworkExplosion.FWsBurst02,1);
			//pm.SetFireworkExplosion(FireworkExplosion.FWsBurst12,1);
			//AddExplosion(FireworkExplosion.FWsBurst12,maxGoodExplosion,false);
		
		}
	}
	else if (tm.gameState==GameState.Tutorial)
	{
		AddExplosion(FireworkExplosion.FWsBurst02,maxGoodExplosion,false);
	}
	

	//if ( Wizards.Utils.DEBUG ) Debug.Log(goodExplodePool.length);
	Shuffle(goodExplodePool);


	
}

function Shuffle(a:Array)
{
    // Knuth shuffle algorithm :: courtesy of Wikipedia :)
    for (var i:int = 0; i < a.length; i++ )
    {
        var tmp:Object = a[i];
        var j:int  = Random.Range(i, a.length);
        a[i] = a[j];
        a[j] = tmp;

    }

}

function AddExplosion(_explosion:FireworkExplosion,_amount:int,_shuffle:boolean)
{
	if ( Wizards.Utils.DEBUG ) Debug.Log("Adding " + _amount + " of " + _explosion + ". SHUFFLE: " + _shuffle);
	for (var i:int=0;i<_amount;i++)
	{
		var goodExp : Explosion = Instantiate(fireworksGood[_explosion], transform.position, Quaternion.identity);
		goodExp.gameObject.SetActiveRecursively(false);
		goodExplodePool.Add(goodExp);
		
	}
	if (_shuffle)
	{
		Shuffle(goodExplodePool);
	}
}

function DoNormalExplosion(_type : ExplosionType, _position : Vector3,_visualEffect:VisualEffect)
{
	switch ( _type )
	{
		case ExplosionType.Poor:
			FireNormalPoor(_position);
		break;
		
		case ExplosionType.Good:
			FireNormalGood(_position,_visualEffect);
		break;
		case ExplosionType.Special:
			if ( numSFXUnlocked == 0 )
			{
			    if ( Wizards.Utils.DEBUG ) Debug.Log("SPECIAL TRIGGERED - BUT NOT UNLOCKED YET - DOING NORMAL");
				FireNormalPerfect(_position,_visualEffect);
			}
			else
			{
			    if ( Wizards.Utils.DEBUG ) Debug.Log("SPECIAL TRIGGERED - FIRING SPECIAL - TOTAL SFX UNLOCKED : " + numSFXUnlocked);
				FireSpecialExplosion(_position,_visualEffect);
			}
		break;
		case ExplosionType.Perfect:
			FireNormalPerfect(_position,_visualEffect);
		break;
	}
	
	if ( _type != ExplosionType.Poor && flash!=null)
	{
		flash.doFlash();
	}
}

function GetRandomColor():VisualEffect
{
	var randomColor:int=Random.Range(0,5);
	if (randomColor==0)
	{
		return VisualEffect.Star;
	}
	else if (randomColor==1)
	{
		return VisualEffect.RedStar;
	}
	else if (randomColor==2)
	{
		return VisualEffect.GreenStar;
	}
	else if (randomColor==3)
	{
		return VisualEffect.PurpleStar;
	}
	else if (randomColor==4)
	{
		return VisualEffect.OrangeStar;
	}
	else 
	{
		return VisualEffect.Star;
	}
}

function DoCelebralationExplosion(_amount:int,_time:float)
{
	for (var i:int=0;i<_amount;i++)
	{
		DoNormalExplosionDelay(ExplosionType.Perfect,Vector3(Random.Range(-8,8),Random.Range(-5,10),0 ),Random.Range(0.0,_time) );
	}
}


function DoCircleExplosion(_position:Vector3,_amount:int)
{
	for (var i:int=0;i<_amount;i++)
	{
		DoNormalExplosionDelay(ExplosionType.Perfect,Vector3(Random.Range(_position.x-4,_position.x+4),Random.Range(_position.y-4,_position.y+4),31 ),Random.Range(0.0,_amount/2) );
	}
}

function DoNormalExplosionDelay(_type : ExplosionType, _position : Vector3,_delay:float)
{
	yield WaitForSeconds(_delay);
	DoNormalExplosion(_type , _position ,GetRandomColor());
	
}

function DoNormalExplosion(_type : ExplosionType, _position : Vector3)
{
	switch ( _type )
	{
		case ExplosionType.Poor:
			FireNormalPoor(_position);
		break;
		
		case ExplosionType.Good:
			FireNormalGood(_position);
		break;
		
		case ExplosionType.Perfect:
			FireNormalPerfect(_position);
		break;
		
		case ExplosionType.Special:
			if ( numSFXUnlocked == 0 )
			{
			    if ( Wizards.Utils.DEBUG ) Debug.Log("SPECIAL TRIGGERED - BUT NOT UNLOCKED YET - DOING NORMAL");
				FireNormalPerfect(_position);
			}
			else
			{
			    if ( Wizards.Utils.DEBUG ) Debug.Log("SPECIAL TRIGGERED - FIRING SPECIAL - TOTAL SFX UNLOCKED : " + numSFXUnlocked);
				FireSpecialExplosion(_position);
			}
			
		break;
		
		case ExplosionType.Glitter:
			FireGlitter(_position);
		break;
		case ExplosionType.GlitterExplosionBlue:
			FireGlitterExp(GlitterType.Blue,_position);
		break;
		case ExplosionType.GlitterExplosionOrange:
			FireGlitterExp(GlitterType.Orange,_position);
		break;

	}
	
	if ( _type != ExplosionType.Poor && flash!=null )
	{
		flash.doFlash();
	}
	
}



function GetGlitter() : GameObject
{
	for ( var glit in glitterPool )
	{
		if ( glit.active == false )
		{
			return ( glit );
		}
	}
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("All out of glitter");
	
	return ( glitterPool[Random.Range(0, glitterPool.length)] );

}

function GetGlitterExp(_type:GlitterType):Explosion
{
	if (_type==GlitterType.Blue)
	{
		for ( var exp in blueExplosionPool )
		{
			if ( exp.gameObject.active == false )
			{
				return ( exp );
			}
		}
		return ( blueExplosionPool[Random.Range(0, blueExplosionPool.length)] );
	
	}
	else if (_type==GlitterType.Orange)
	{
		for ( var exp in orangeExplosionPool )
		{
			if ( exp.gameObject.active == false )
			{
				return ( exp );
			}
		}
		return ( orangeExplosionPool[Random.Range(0, orangeExplosionPool.length)] );
	
	}
	else 
	{
		return ( blueExplosionPool[Random.Range(0, blueExplosionPool.length)] );
	}
	
	
}

function FireGlitterExp(_type:GlitterType,_position:Vector3)
{
	var f :Explosion;
	if (_type==GlitterType.Blue)
	{
		f = GetGlitterExp(_type);
	}
	else if (_type==GlitterType.Orange)
	{
		f  = GetGlitterExp(_type);
	}
	
	f.Init(ExplosionType.Good);
	f.transform.position = _position+f.offset;
	f.gameObject.SetActiveRecursively(true);
}

function GetGoodExplosion() : Explosion
{
	var i:int=0;
	var index:int=0;
	while (i<goodExplodePool.length)
	{
		index=goodExplodePoolIndex % goodExplodePool.length;
		if ( (goodExplodePool[index] as Explosion).gameObject.active==false )
		{
			goodExplodePoolIndex++;
			return goodExplodePool[index];
		}
		goodExplodePoolIndex++;
		i++;	
	}
	return goodExplodePool[index];

	
}

function FireSpecialExplosion(_position : Vector3)
{
	am.PlayAudio(SoundEffect.Perfect);
	
	firework = fireworksSpecial[Random.Range(0,numSFXUnlocked)];
	var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
	
	f.transform.Rotate(Vector3(0.0,0.0,Random.Range(-35.0, 35.0)));
	
	//Destroy(f, 8.0);
	
	if (tm.stage6_flag==2)
	{
		tm.SFWCount++;
	}
	/*
	am.PlayAudio(SoundEffect.Perfect);
	if ( Random.value < chanceOfSFW)
	{
		firework = fireworksSpecial[Random.Range(0,fireworksSpecial.Length)];
	
		var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
		
		if (tm.stage6_flag==2)
		{
			tm.SFWCount++;
		}
	}
	else
	{
		FireNormalGood(_position);
		//FireNormalPerfect(_position);
	}
	*/
}

function FireSpecialExplosion(_position : Vector3,_visual:VisualEffect)
{
	/*
	am.PlayAudio(SoundEffect.Perfect);
	if ( Random.value < chanceOfSFW)
	{
		firework = fireworksSpecial[Random.Range(0,fireworksSpecial.Length)];
	
		var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
		
		if (tm.stage6_flag==2)
		{
			tm.SFWCount++;
		}
	}
	else
	{
		FireNormalPerfect(_position,_visual);
		//FireNormalPerfect(_position);
	}
	*/
	
	am.PlayAudio(SoundEffect.Perfect);
	firework = fireworksSpecial[Random.Range(0,numSFXUnlocked)];
	var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
	
	f.transform.Rotate(Vector3(0.0,0.0,Random.Range(-35.0, 35.0)));
	
	//Destroy(f, 8.0);
	if (tm.stage6_flag==2)
	{
		tm.SFWCount++;
	}
}

function FireNormalPoor(_position : Vector3)
{
	am.PlayAudio(SoundEffect.Poor);
	firework = fireworksPoor[Random.Range(0,fireworksPoor.Length)];
	
	for ( var i : int = 0; i < numberFireworks; i += 1 )
	{
		var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
				
		var vel : Vector3 = Vector3.zero;

		vel.x = Random.Range(-0.2,0.2);
				
		vel.y = Random.Range(0.1,0.5);
		
		f.GetComponent.<Rigidbody>().AddForce(vel * force * Random.Range(0.2,0.5));
	}
}

function FireBossHitExplosion(_position : Vector3)
{
	am.PlayAudio(SoundEffect.Good);
	var f : Explosion = GetGoodExplosion();
	//f.SetColor(Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),1.0));
	f.Init(ExplosionType.Perfect);
	f.transform.position = _position+f.offset;
	f.transform.position.z += 10.0;
	f.gameObject.SetActiveRecursively(true);
}

function FireNormalGood(_position : Vector3)
{
	am.PlayAudio(SoundEffect.Good);
	var f : Explosion = GetGoodExplosion();
	//f.SetColor(Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),1.0));
	f.Init(ExplosionType.Good);
	f.transform.position = _position+f.offset;
	f.gameObject.SetActiveRecursively(true);
}

function FireNormalPerfect(_position : Vector3)
{
	am.PlayAudio(SoundEffect.Perfect);
	var f : Explosion = GetGoodExplosion();

	f.Init(ExplosionType.Perfect);
	f.transform.position = _position+f.offset;
	f.gameObject.SetActiveRecursively(true);
}

function FireNormalGood(_position : Vector3,_visualEffect:VisualEffect)
{

	am.PlayAudio(SoundEffect.Good);
	var f : Explosion = GetGoodExplosion();
	
	f.SetColor(_visualEffect);
	f.Init(ExplosionType.Good);
	
	/*
	if (_visualEffect==VisualEffect.Star)
	{
		//f.SetColor(Color(0,0,1,1.0));
		f.SetColor(Color(0,0,Random.Range(0.9, 1.0),1.0));
	}
	else if (_visualEffect==VisualEffect.GreenStar || _visualEffect==VisualEffect.Torus)
	{
		//f.SetColor(Color(0,1,0,1.0));
		f.SetColor(Color(0,Random.Range(0.9, 1.0),0,1.0));
	}
	else if (_visualEffect==VisualEffect.OrangeStar || _visualEffect==VisualEffect.ButterFly)
	{
		//f.SetColor(Color(1,0.44,0,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),Random.Range(0.4, 0.5),0,1.0));
	}
	else if (_visualEffect==VisualEffect.PurpleStar || _visualEffect==VisualEffect.Skull)
	{
		//f.SetColor(Color(1,0,0.65,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),0,Random.Range(0.6, 0.7),1.0));
	}
	else if (_visualEffect==VisualEffect.RedStar || _visualEffect==VisualEffect.Phoenix)
	{
		//f.SetColor(Color(1,0,0,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),0,0,1.0));
	}
	*/
	
	//f.SetColor(Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),1.0));
	
	f.transform.position = _position+f.offset;
	f.gameObject.SetActiveRecursively(true);
}

function FireNormalPerfect(_position : Vector3,_visualEffect:VisualEffect)
{
	//if ( Wizards.Utils.DEBUG ) Debug.Log(_visualEffect);
	am.PlayAudio(SoundEffect.Perfect);
	var f : Explosion = GetGoodExplosion();
	
	/*
	if (_visualEffect==VisualEffect.Star)
	{
		//f.SetColor(Color(0,0,1,1.0));
		f.SetColor(Color(0,0,Random.Range(0.9, 1.0),1.0));
	}
	else if (_visualEffect==VisualEffect.GreenStar || _visualEffect==VisualEffect.Torus)
	{
		//f.SetColor(Color(0,1,0,1.0));
		f.SetColor(Color(0,Random.Range(0.9, 1.0),0,1.0));
	}
	else if (_visualEffect==VisualEffect.OrangeStar || _visualEffect==VisualEffect.ButterFly)
	{
		//f.SetColor(Color(1,0.44,0,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),Random.Range(0.4, 0.5),0,1.0));
	}
	else if (_visualEffect==VisualEffect.PurpleStar || _visualEffect==VisualEffect.Skull)
	{
		//f.SetColor(Color(1,0,0.65,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),0,Random.Range(0.6, 0.7),1.0));
	}
	else if (_visualEffect==VisualEffect.RedStar || _visualEffect==VisualEffect.Phoenix)
	{
		//f.SetColor(Color(1,0,0,1.0));
		f.SetColor(Color(Random.Range(0.9, 1.0),0,0,1.0));
	}
	*/
	//f.SetColor(Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),1.0));
	f.SetColor(_visualEffect);
	f.Init(ExplosionType.Perfect);
	f.transform.position = _position+f.offset;
	f.gameObject.SetActiveRecursively(true);
}

function FireGlitter(_position : Vector3)
{
	//var mod : float = dm.GetParticleMultiplier();
	
	//var fCount : float = 20 * mod;
	
	//var actual : int = Mathf.Ceil(fCount);
	
	//if ( Wizards.Utils.DEBUG ) Debug.Log("Emitting Glitter, count: " + actual);
	
	for ( var j : int = 0; j < glitterAmount; j += 1 )
	{
		var f : GameObject = GetGlitter();
		f.SetActiveRecursively(true);
		f.transform.position = _position;
		f.SendMessage("Init");
	
		//var aGlitter : GameObject = Instantiate(glitter, _position, Quaternion.identity);
		//aGlitter.SendMessage("Init");
	}
	
}

function ToggleSFXChance()
{
	if ( chanceOfSFW == 1.0 )
	{
		chanceOfSFW = 0.2;
	}
	else
	{
		chanceOfSFW = 1.0;
	}
}

/*
function GetExplode() : GameObject
{
	for ( var exp in explodePool )
	{
		if ( exp.active == false )
		{
			return ( exp );
		}
	}
	
	return ( explodePool[Random.Range(0, explodePool.length)] );
	//if ( Wizards.Utils.DEBUG ) Debug.LogWarning("All out of explode");
	
	//return ( explodePool[Random.Range(0, explodePool.length)] );
}


function FireNormalPerfect(_position : Vector3)
{

	//EllipsoidExplosion(_position);
	//RoundExplosion(10,Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0)),false,10,10,Random.Range(0,Mathf.PI/2),_position);
	//RoundExplosion(10,Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0)),false,7,7,Random.Range(0,Mathf.PI/2),_position);
	//RoundExplosion(10,Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0)),false,4,4,Random.Range(0,Mathf.PI/2),_position);
	RoundExplosion(10,Color(Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0),Random.Range(0.0,1.0)),false,Random.Range(4,7),Random.Range(3,6),Random.Range(0,Mathf.PI/2),_position);
	return;
	//firework = fireworksPerfect[Random.Range(0,fireworksPerfect.Length)];
	
	
//	for ( var j:int = 0;j<10;j++)
//	{
//		var position:Vector3;
//		var offset:Vector3;
//		offset.x=Random.Range(-1.0,1.0);
//		offset.y=Random.Range(-1.0,1.0);
//		offset.z=Random.Range(-1.0,1.0);
//		offset.Normalize();
//		position=_position+offset*5;
		
	for ( var i : int = 0; i < 10; i += 1 )
	{
		//var f : GameObject = Instantiate(firework, _position, Quaternion.identity);
	
		var f : GameObject = GetExplode();
		f.transform.position = _position;
		f.SetActiveRecursively(true);	
		f.GetComponent(fw_autodestroy).initLifeTime = Random.Range(1.2, 1.5);
		f.GetComponent(fw_autodestroy).Init();				
		var vel : Vector3 = Vector3.zero;
	
		vel.x = Random.Range(-1.0, 1.0);
					
		vel.y = Random.Range(-1.0,1.0);
		
		vel.z = Random.Range(-1.0,1.0);
		
		vel.Normalize();

		var randVal = Random.Range(1.0, 10.0);
		
		vel *= randVal;
						
		//f.rigidbody.AddForce(vel * force);
		f.GetComponent(fw_autodestroy).velocity = vel * force;		
	}
	
//	}
}

//Random explosion.
function EllipsoidExplosion(_position : Vector3)
{

	var vx:float=Random.Range(4,7);
	var vy:float=Random.Range(3,6);
	var th:float=Random.Range(0,Mathf.PI/2);
	
	for ( var i : int = 0; i < numberFireworksPerfect; i += 1 )
	{
		var f : GameObject = GetExplode();
		
		f.transform.position = _position;
		f.SetActiveRecursively(true);	
		f.GetComponent(fw_autodestroy).initLifeTime = Random.Range(1.2, 1.8);
		f.GetComponent(fw_autodestroy).Init();			

		var vel : Vector3 = Vector3.zero;
		
		
		var x:float= vx* Mathf.Cos(Mathf.Deg2Rad * (360/numberFireworksPerfect)*i) ;
		var y:float= vy* Mathf.Sin(Mathf.Deg2Rad * (360/numberFireworksPerfect)*i) ;
		
		vel.x = x*Mathf.Cos(th)-y*Mathf.Sin(th);
		vel.y = y*Mathf.Cos(th)+x*Mathf.Sin(th);
		
			
		
		
		//vel.Normalize();
		
		//vel *= 5;
			
		f.GetComponent(fw_autodestroy).velocity = vel * force;
		
		
	}
}

//Round explosion.
function RoundExplosion(_number:int,_color:Color,_willExplosion:boolean,_xRadius:float,_yRadius:float,_th:float,_position : Vector3)
{

	var vx:float=_xRadius;
	var vy:float=_yRadius;
	var th:float=_th;
	
	for ( var i : int = 0; i < _number; i += 1 )
	{
		var f : GameObject = GetExplode();
		
		f.transform.position = _position;
		f.SetActiveRecursively(true);	
		f.GetComponent(fw_autodestroy).initLifeTime = Random.Range(1.0, 2.0);
		f.GetComponent(fw_autodestroy).color=_color;
		f.GetComponent(fw_autodestroy).willExplosion=_willExplosion;
		f.GetComponent(fw_autodestroy).Init();			
		
		var vel : Vector3 = Vector3.zero;
		
		
		var x:float= vx* Mathf.Cos(Mathf.Deg2Rad * (360/numberFireworksPerfect)*i) ;
		var y:float= vy* Mathf.Sin(Mathf.Deg2Rad * (360/numberFireworksPerfect)*i) ;
		
		vel.x = x*Mathf.Cos(th)-y*Mathf.Sin(th);
		vel.y = y*Mathf.Cos(th)+x*Mathf.Sin(th);
		
			
		
		
		//vel.Normalize();
		
		//vel *= 5;
			
		f.GetComponent(fw_autodestroy).velocity = vel * force;
		
		
	}
}
*/

function SetNumSFXUnlocked(_totalUnlocked : int)
{
	numSFXUnlocked = _totalUnlocked;
}