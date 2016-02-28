// ======================================================================================
// File         : exScreenPosition.cs
// Author       : Wu Jie 
// Last Change  : 08/06/2011 | 10:15:15 AM | Saturday,August
// Description  : 
// ======================================================================================

///////////////////////////////////////////////////////////////////////////////
// usings
///////////////////////////////////////////////////////////////////////////////

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

///////////////////////////////////////////////////////////////////////////////
/// 
/// A component to position a plane in screen space
/// 
///////////////////////////////////////////////////////////////////////////////

[ExecuteInEditMode]
[AddComponentMenu("ex2D Helper/Screen Position")]
public class exScreenPosition : MonoBehaviour {

    ///////////////////////////////////////////////////////////////////////////////
    // properties
    ///////////////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------ 
    [SerializeField] protected float x_;
    /// the screen position x
    // ------------------------------------------------------------------ 

    public float x {
        get { return x_; }
        set {
            if ( value != x_ )
                x_ = value;
        }
    }

    // ------------------------------------------------------------------ 
    [SerializeField] protected float y_;
    /// the screen position y
    // ------------------------------------------------------------------ 

    public float y {
        get { return y_; }
        set {
            if ( value != y_ )
                y_ = value;
        }
    }

    // ------------------------------------------------------------------ 
    [SerializeField] protected exPlane.Anchor anchor_ = exPlane.Anchor.BotLeft;
    /// the anchor (start from point) for the screen position
    // ------------------------------------------------------------------ 

    public exPlane.Anchor anchor {
        get { return anchor_; }
        set {
            if ( value != anchor_ )
                anchor_ = value;
        }
    }

    ///////////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------ 
    /// The cached plane component
    // ------------------------------------------------------------------ 

    [System.NonSerialized] public exPlane plane;

    ///////////////////////////////////////////////////////////////////////////////
    // functions
    ///////////////////////////////////////////////////////////////////////////////

    // DISABLE { 
    // // ------------------------------------------------------------------ 
    // // Desc: 
    // //  example: CalculateWorldPosition(Camera.main, Screen.width, Screen.height) 
    // // ------------------------------------------------------------------ 

    // Vector3 CalculateWorldPosition ( Camera _camera, float _screenWidth, float _screenHeight ) {
    //     float s = 1.0f;
    //     if ( _camera.orthographic ) {
    //         s =  2.0f * _camera.orthographicSize / _screenHeight;
    //     }
    //     else {
    //         float ratio = 2.0f * Mathf.Tan(Mathf.Deg2Rad * _camera.fov * 0.5f) / _screenHeight;
    //         s = ratio * ( transform.position.z - _camera.transform.position.z );
    //     }

    //     return new Vector3( (x_ - 0.5f * _screenWidth) * s,
    //                         (y_ - 0.5f * _screenHeight) * s,
    //                         transform.position.z );
    // }
    // } DISABLE end 

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void Awake () {
        plane = GetComponent<exPlane>();
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void OnEnable () {
        if ( plane == null ) {
            plane = GetComponent<exPlane>();
        }
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void LateUpdate () {
        //
        Vector3 newPos = Vector3.zero;
        newPos.z = transform.position.z;

        //
        if ( plane && plane.renderCamera ) {
            newPos = plane.ScreenToWorldPoint ( plane.renderCamera, anchor_, x_, y_ );
        }
        else if ( Camera.main ) {
            newPos = Camera.main.ScreenToWorldPoint( new Vector3(x_, y_, transform.position.z) );
            newPos.z = transform.position.z;
        }

        //
        if ( newPos != transform.position ) {
            transform.position = newPos;
        }
    }
}
