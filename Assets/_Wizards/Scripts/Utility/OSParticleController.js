private var _transform : Transform;
private var mainCamera : Camera;
private var emitter : Transform;
private var particleSize : Vector3;
private var particleDir : Vector3;
private var particleLife : float;
private var animateColor : boolean;
private var animationColor : Color[];
private var billboard : boolean;
private var angularVelocity : float;
private var _material : Material;
private var myAngular : float;
    
function Start() {
    mainCamera = Camera.main;
    _transform.localScale = particleSize;
    if ( animateColor )
        StartCoroutine(InitiateAnimation());
    Destroy ( _transform.gameObject, particleLife );
}
    
function Update() {     
    _transform.Translate( particleDir * Time.deltaTime, emitter );
    myAngular += angularVelocity * Time.deltaTime;
    _transform.rotation = (billboard) ? mainCamera.transform.rotation * Quaternion.Euler(myAngular,-90,90) : Quaternion.identity * Quaternion.Euler(myAngular,0,0);
}
    
private function InitiateAnimation() : IEnumerator {

    var timeStep : float = particleLife / animationColor.Length;
    for ( var i = 0; i < animationColor.Length; i++ ) {
        if(i < animationColor.Length - 1) {
            var thisStep : float = 0;
            while(thisStep < timeStep) {
                _material.SetColor("_TintColor", Color.Lerp(animationColor[i], animationColor[i+1], thisStep));
                _material.color = Color.Lerp(animationColor[i], animationColor[i+1], thisStep);
                thisStep += Time.deltaTime;
                yield;
            }
        } else yield WaitForSeconds(timeStep);
    }
}
    
public function InitParticleSettings( particleSettings : OSParticleSettings, _emitter : Transform ) {
    emitter = _emitter;
    _material = GetComponent.<Renderer>().material;
    _transform = transform;
    particleSize = _transform.localScale;
    var pSize : float = Random.Range(particleSettings.particleMinSize, particleSettings.particleMaxSize);
    particleSize *= pSize;
    var rndVelocity : Vector3 = particleSettings.rndVelocity;
    var localVelocity : Vector3 = particleSettings.localVelocity;
        
    particleDir.x = Random.Range(-rndVelocity.x + localVelocity.x, rndVelocity.x + localVelocity.x);
    particleDir.y = Random.Range(-rndVelocity.y + localVelocity.y, rndVelocity.y + localVelocity.y);
    particleDir.z = Random.Range(-rndVelocity.z + localVelocity.z, rndVelocity.z + localVelocity.z);
        
    particleLife = Random.Range(particleSettings.lifeMin, particleSettings.lifeMax);
    animateColor = particleSettings.animateColor;
    animationColor = particleSettings.animationColor;
    billboard = particleSettings.billboard;
    angularVelocity = particleSettings.angularVelocity;
    gameObject.hideFlags = HideFlags.HideInHierarchy;
        
}