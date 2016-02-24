private var _transform : Transform;
public var emit : boolean = true;
public var particleSettings : OSParticleSettings = new OSParticleSettings();
public var particleAmmount : int = 10;
public var emissionArea : float = 5;
public var particleObject : GameObject;
    
function Start() {
    _transform = transform;
        
    if ( particleObject == null ) {
        if ( Wizards.Utils.DEBUG ) Debug.LogError("You must assign a GameObject as Particle");
        return;
    }
    StartCoroutine( Emit() );
}
    
private function Emit() : IEnumerator {
    var timeStep : float = (particleSettings.lifeMin / particleSettings.lifeMax + particleSettings.lifeMin) / particleAmmount;
    while (true){
        if ( emit ) 
        {
            var myRotation : Quaternion = (particleSettings.billboard) ? Quaternion.LookRotation(Camera.main.transform.position, Camera.main.transform.up) : Quaternion.identity;
            (Instantiate(particleObject,_transform.position + Random.onUnitSphere * emissionArea, myRotation) as GameObject).AddComponent.<OSParticleController>().InitParticleSettings(particleSettings, _transform);
            yield WaitForSeconds( timeStep );
        } else yield;
    }
}


class OSParticleSettings {
    public var lifeMin : float = 2;
    public var lifeMax : float = 2;
    public var localVelocity : Vector3;
    public var rndVelocity : Vector3;
    public var particleMinSize : float = 1;
    public var particleMaxSize : float = 1;
    public var animateColor : boolean = false;
    public var animationColor : Color[] = new Color[5];
    public var billboard : boolean = true;
    public var angularVelocity : float;
}