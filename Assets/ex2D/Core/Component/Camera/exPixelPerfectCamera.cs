// ======================================================================================
// File         : exPixelPerfectCamera.cs
// Author       : Wu Jie 
// Last Change  : 10/05/2011 | 15:02:39 PM | Wednesday,October
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
/// A component to handle pixel perfect in camera
/// 
///////////////////////////////////////////////////////////////////////////////

[ExecuteInEditMode]
public class exPixelPerfectCamera : MonoBehaviour {

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    public bool customResolution = false;
    public int width = 480;
    public int height = 320;

    public bool fixOrthographicSize = false;
    public float orthographicSize = 100.0f;

    [System.NonSerialized] public float scale = -1.0f;
    [System.NonSerialized] public float ratio = -1.0f;

    ///////////////////////////////////////////////////////////////////////////////
    // private
    ///////////////////////////////////////////////////////////////////////////////

    protected int lastScreenWidth = 0;
    protected int lastScreenHeight = 0;
    protected float lastOrthographicSize = 0.0f;
    protected float lastFieldOfView = 0.0f;
    protected bool lastOrthographic = false;

    ///////////////////////////////////////////////////////////////////////////////
    // functions
    ///////////////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void Awake () {
        lastScreenWidth         = Screen.width;
        lastScreenHeight        = Screen.height;
        lastOrthographicSize    = GetComponent<Camera>().orthographicSize;
        lastFieldOfView         = GetComponent<Camera>().fieldOfView;
        lastOrthographic        = GetComponent<Camera>().orthographic;

        CalculateScaleAndRatio ();
        exPixelPerfect[] ppfs = GameObject.FindObjectsOfType ( typeof(exPixelPerfect) ) as exPixelPerfect[];
        for ( int i = 0; i < ppfs.Length; ++i ) {
            exSpriteBase sprite = ppfs[i].GetComponent<exSpriteBase>();
            if ( sprite == null || sprite.renderCamera != GetComponent<Camera>() )
                continue;

            CalculatePixelPerfectScale ( sprite, sprite.transform.position - transform.position );
            sprite.Commit();
        }
    }
    
    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void OnPreRender () {
        bool changed = false;

        // check if we need to update pixel perfect scale
        if ( customResolution ) {
            if ( lastScreenWidth != width || lastScreenHeight != height ) {
                lastScreenWidth = width;
                lastScreenHeight = height;
                changed = true;
            }
        }
        else {
            if ( lastScreenWidth != Screen.width || lastScreenHeight != Screen.height ) {
                lastScreenWidth = Screen.width;
                lastScreenHeight = Screen.height;
                changed = true;
            }
        }

        //
        if ( GetComponent<Camera>().orthographic ) {
            if ( fixOrthographicSize ) {
                if ( lastOrthographicSize != orthographicSize ) {
                    lastOrthographicSize = orthographicSize;
                    changed = true;
                }
            }
            else {
                if ( lastOrthographicSize != GetComponent<Camera>().orthographicSize ) {
                    lastOrthographicSize = GetComponent<Camera>().orthographicSize;
                    changed = true;
                }
            }
        }
        else {
            if ( lastFieldOfView != GetComponent<Camera>().fieldOfView ) {
                lastFieldOfView = GetComponent<Camera>().fieldOfView;
                changed = true;
            }
        }

        //
        if ( lastOrthographic != GetComponent<Camera>().orthographic ) {
            lastOrthographic = GetComponent<Camera>().orthographic;
            changed = true;
        }

        //
        if ( changed ) {
            CalculateScaleAndRatio ();
            exPixelPerfect[] ppfs = GameObject.FindObjectsOfType ( typeof(exPixelPerfect) ) as exPixelPerfect[];
            for ( int i = 0; i < ppfs.Length; ++i ) {
                exSpriteBase sprite = ppfs[i].GetComponent<exSpriteBase>();
                if ( sprite == null || sprite.renderCamera != GetComponent<Camera>() )
                    continue;

                CalculatePixelPerfectScale ( sprite, sprite.transform.position - transform.position );
                sprite.Commit();
            }
        }
    }

    // ------------------------------------------------------------------ 
    /// calculate the pixel perfect for this sprite
    // ------------------------------------------------------------------ 

    public void CalculateScaleAndRatio () {
        if ( lastOrthographic )
            scale = 2.0f * lastOrthographicSize / lastScreenHeight;
        else
            ratio = 2.0f * Mathf.Tan(Mathf.Deg2Rad * lastFieldOfView * 0.5f) / lastScreenHeight;
    }

    // ------------------------------------------------------------------ 
    /// \param _sprite the in sprite
    /// \param _toSprite the vector from camera to sprite
    // ------------------------------------------------------------------ 

    public void CalculatePixelPerfectScale ( exSpriteBase _sprite, Vector3 _toSprite ) {
        if ( (lastOrthographic && scale <= 0.0f) || ratio <= 0.0f )
            CalculateScaleAndRatio ();

        float s = scale;
        if ( lastOrthographic == false ) {
            float angle = Vector3.Angle(transform.forward, _toSprite);
            float depth = Mathf.Cos( angle * Mathf.Deg2Rad ) * _toSprite.magnitude;
            s = ratio * depth;
        }

        _sprite.ppfScale = new Vector2( s, s );
    }
}
