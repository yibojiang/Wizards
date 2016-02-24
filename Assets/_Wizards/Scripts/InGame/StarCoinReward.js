var target : Vector3;

var explosionPos : Vector3;
var explosionForce : float;
var explosionRadius : float;
var upwardsModifier : float;
var mode : ForceMode;

// movement
var maxSpeed : float;
var maxSpeedSqr : float;
var radius : float;
var timeToTarget : float = 0.25;

var steeringVelocity : Vector3;

var randomStartOffset : float = 0.25;

var starcoinCollect : GameObject;

var velocity : Vector3;

var randomStartVelocityRange : float;

var isActive : boolean = false;

var drag : float = 0.99;

var startDelay : float = 2.0;
var canProcess : boolean = false;

var destroyDelay : float = 0.2;

private var wc : WizardControl;
private var am : AudioManager;

function Awake()
{
	maxSpeedSqr = maxSpeed * maxSpeed;
	wc = GameObject.Find("Wizard").GetComponent(WizardControl) as WizardControl;
	am = GameObject.Find("AudioManager").GetComponent(AudioManager) as AudioManager;
	
	transform.position.x += Random.Range(-randomStartOffset, randomStartOffset);
	transform.position.y += Random.Range(-randomStartOffset, randomStartOffset);
}

function Start()
{
	//rigidbody.AddExplosionForce(explosionForce, explosionPos, explosionRadius, upwardsModifier, mode);
	//velocity.x = Random.Range(-randomStartVelocityRange, randomStartVelocityRange);
	//velocity.y = Random.Range(-randomStartVelocityRange, randomStartVelocityRange);
	
	velocity.x = Random.Range(-randomStartVelocityRange, randomStartVelocityRange);
	velocity.y = Random.Range(-randomStartVelocityRange, randomStartVelocityRange);
	
	
	
	velocity.Normalize();
	
	velocity = (velocity * maxSpeed) * (0.1 + (Random.value * 0.6));
	
	DelayActivate();
}

function DelayActivate()
{
	//yield WaitForSeconds(startDelay);
	canProcess = true;
	yield WaitForSeconds(startDelay * 0.5);
	isActive = true;
	drag = 0.99;
}

function Update ()
{
	if ( isActive )
	{
		steeringVelocity = target - transform.position;
		
		if ( steeringVelocity.magnitude	< radius )
		{
			DoDestroy();
			//return;
		}
		
		steeringVelocity /= timeToTarget;
		
		if ( steeringVelocity.sqrMagnitude	> maxSpeedSqr )
		{
			steeringVelocity.Normalize();
			steeringVelocity *= maxSpeed;
		}
		
	}
	
	if ( canProcess )
	{
		velocity += steeringVelocity * Time.deltaTime;// * Time.deltaTime;
		
		transform.position += ( velocity * Time.deltaTime);
		
		velocity *= ( drag);
	}
	
	//rigidbody.velocity = steeringVelocity;
}

function DoDestroy()
{
	yield WaitForSeconds(destroyDelay);
	isActive = false;
	canProcess = false;
	//renderer.enabled = false;
	wc.AddStarCoin();
	//yield;
	//TODO - Dont play if already playing
	if ( !am.PlayStarCoinCollect() )
	{
		Instantiate(starcoinCollect, transform.position, Quaternion.identity);
	}
	//yield;
	
	//yield;
	Destroy(this.gameObject);
}