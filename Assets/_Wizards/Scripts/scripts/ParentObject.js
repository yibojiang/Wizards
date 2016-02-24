var lifeTime:float;
function Update () {
	if (lifeTime>0)
	{
		lifeTime-=Time.deltaTime;
	}
	else
	{
		Destroy(this.gameObject);
	}
}