#pragma strict
var renderqueue:int;

function Start () {
	this.GetComponent.<Renderer>().material.renderQueue=renderqueue;
}