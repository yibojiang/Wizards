// ======================================================================================
// File         : exLayerMng.cs
// Author       : Wu Jie 
// Last Change  : 11/06/2011 | 17:23:35 PM | Sunday,November
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
/// A component to manage draw order
/// 
///////////////////////////////////////////////////////////////////////////////

[ExecuteInEditMode]
[AddComponentMenu("ex2D Helper/Layer Manager")]
public class exLayerMng : exLayer {

    ///////////////////////////////////////////////////////////////////////////////
    // static
    ///////////////////////////////////////////////////////////////////////////////

    public static int CompareByIndentLevel ( exLayer _a, exLayer _b ) {
        return _a.indentLevel - _b.indentLevel;
    }

    ///////////////////////////////////////////////////////////////////////////////
    // non-serialized
    ///////////////////////////////////////////////////////////////////////////////

    List<exLayer> dirtyLayers = new List<exLayer>();
    bool updateAll = false;

    ///////////////////////////////////////////////////////////////////////////////
    // functions
    ///////////////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    protected new void Awake () {
        base.Awake();
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void OnPreRender () {
        UpdateLayers ();
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    public void UpdateLayers () {
        if ( updateAll ) {
            updateAll = false;

            //
            List<exLayer> layerList = new List<exLayer>();
            List<exLayer> specialLayerList = new List<exLayer>();
            float totalDepth = GetComponent<Camera>().farClipPlane - GetComponent<Camera>().nearClipPlane;
            totalDepth -= 0.2f; // we leave 1.0 for both near and far clip
            float startFrom = transform.position.z + GetComponent<Camera>().nearClipPlane + 0.1f;

            int totalNormalLayerCount = 0;
            for ( int i = 0; i < children.Count; ++i ) {
                exLayer childLayer = children[i];
                childLayer.indentLevel = 1;
                totalNormalLayerCount += AddLayerRecursively ( childLayer, true, ref totalDepth, ref layerList );
            }

            //
            float unitLayer = totalDepth/totalNormalLayerCount;

            // normal layer depth calcualte
            const int MAX_INDENT = 99999;
            int specialIndentLevel = MAX_INDENT;
            float curDepth = startFrom + unitLayer; // skip layerMng
            for ( int i = 0; i < layerList.Count; ++i ) {
                exLayer layer = layerList[i];
                layer.depth = curDepth;

                if ( layer.type != exLayer.Type.Normal ) {
                    specialLayerList.Add (layer);

                    specialIndentLevel = layer.indentLevel;
                    if ( layer.type == exLayer.Type.Dynamic )
                        curDepth += layer.range; 
                    else if ( layer.type == exLayer.Type.Abstract )
                        curDepth += unitLayer;
                }
                else {
                    if ( layer.indentLevel <= specialIndentLevel ) {
                        // Debug.Log( layer.gameObject.name + " curDepth = " + curDepth + " , " + specialIndentLevel );
                        specialIndentLevel = MAX_INDENT;
                        curDepth += unitLayer; 
                    }
                }
            }

            // special layer depth calculate 
            for ( int i = 0; i < specialLayerList.Count; ++i ) {
                exLayer layer = specialLayerList[i];

                if ( layer.type == exLayer.Type.Dynamic )
                    CalculateDepthForDynamicLayer ( layer );
                else if ( layer.type == exLayer.Type.Abstract )
                    CalculateDepthForAbstractLayer ( layer );
            }

            // assignment
            for ( int i = 0; i < layerList.Count; ++i ) {
                exLayer layer = layerList[i];
                if ( layer.isDirty == false )
                    continue;

                RecursivelyUpdateLayer ( layer.transform.root, false );
            }
        }
        else {
            List<exLayer> layerList = new List<exLayer>();

            // re-update special layers
            for ( int i = 0; i < dirtyLayers.Count; ++i ) {
                exLayer layer = dirtyLayers[i];
                if ( layer.type == exLayer.Type.Dynamic )
                    layerList.AddRange ( CalculateDepthForDynamicLayer ( layer ) );
                else if ( layer.type == exLayer.Type.Abstract )
                    layerList.AddRange ( CalculateDepthForAbstractLayer ( layer ) ) ;
            }

            // assignment
            for ( int i = 0; i < layerList.Count; ++i ) {
                exLayer layer = layerList[i];
                if ( layer.isDirty == false )
                    continue;

                RecursivelyUpdateLayer ( layer.transform.root, true );
            }
        }

        dirtyLayers.Clear();
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void RecursivelyUpdateLayer ( Transform _trans, bool _force ) {
        //
        exLayer layer = _trans.GetComponent<exLayer>(); 
        if ( layer != null && (_force || layer.isDirty) ) {
            layer.isDirty = false;
            _trans.position = new Vector3 ( _trans.position.x, _trans.position.y, layer.depth );
        }

        //
        foreach ( Transform child in _trans ) {
            RecursivelyUpdateLayer ( child, _force );
        }
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    int AddLayerRecursively ( exLayer _curLayer, 
                              bool _doCount, 
                              ref float _totalDepth,
                              ref List<exLayer> _layerList ) {
        int count = 1;
        bool doCount = _doCount;

        //
        _curLayer.isDirty = true;
        _layerList.Add ( _curLayer );

        //
        if ( _curLayer.type != exLayer.Type.Normal ) {
            doCount = false;
            if ( _curLayer.type == exLayer.Type.Dynamic ) {
                _totalDepth -= _curLayer.range;
            }
        }

        //
        for ( int i = 0; i < _curLayer.children.Count; ++i ) {
            exLayer childLayer = _curLayer.children[i];
            childLayer.indentLevel = _curLayer.indentLevel + 1;
            count += AddLayerRecursively ( childLayer, doCount, ref _totalDepth, ref _layerList );
        }

        if ( doCount == false )
            return 1;

        return count;
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void SetLayerDepthRecursively ( exLayer _curLayer, float _depth ) {
        _curLayer.depth = _depth;

        for ( int i = 0; i < _curLayer.children.Count; ++i ) {
            SetLayerDepthRecursively ( _curLayer.children[i], _depth );
        }
    } 

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    List<exLayer> CalculateDepthForDynamicLayer ( exLayer _curLayer ) {
        float totalDepth = 0.0f;
        List<exLayer> layerList = new List<exLayer>();
        AddLayerRecursively ( _curLayer, true, ref totalDepth, ref layerList );

        if ( layerList.Count > 1 ) {
            float unitLayer = (float)_curLayer.range/(float)(layerList.Count-1);
            float curDepth = _curLayer.depth;

            for ( int i = 0; i < layerList.Count; ++i ) {
                exLayer layer = layerList[i];
                layer.depth = curDepth;
                layer.isDirty = true;
                if ( layer.type == exLayer.Type.Normal ) {
                    curDepth += unitLayer; 
                }
            }
        }
        return layerList;
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    List<exLayer> CalculateDepthForAbstractLayer ( exLayer _curLayer ) {
        float totalDepth = 0.0f;
        List<exLayer> layerList = new List<exLayer>();
        AddLayerRecursively ( _curLayer, true, ref totalDepth, ref layerList );
        float curDepth = _curLayer.depth;

        for ( int i = 0; i < layerList.Count; ++i ) {
            exLayer layer = layerList[i];
            layer.depth = curDepth;
            layer.isDirty = true;
        }
        return layerList;
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    public void AddDirtyLayer ( exLayer _layer ) {
        if ( _layer.type == exLayer.Type.Normal ) {
            updateAll = true;
        }
        else {
            dirtyLayers.Add (_layer);
            _layer.isDirty = true;
        }
    }
}
