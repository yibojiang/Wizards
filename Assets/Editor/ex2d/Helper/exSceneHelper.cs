// ======================================================================================
// File         : exSceneHelper.cs
// Author       : Wu Jie 
// Last Change  : 08/31/2011 | 17:54:44 PM | Wednesday,August
// Description  : 
// ======================================================================================

///////////////////////////////////////////////////////////////////////////////
// usings
///////////////////////////////////////////////////////////////////////////////

using UnityEditor;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;

///////////////////////////////////////////////////////////////////////////////
/// 
/// a helper class to operate scene objects 
/// 
///////////////////////////////////////////////////////////////////////////////

public static class exSceneHelper {

    // ------------------------------------------------------------------ 
    /// change transform.scale to Scale
    // ------------------------------------------------------------------ 

    [MenuItem ("Edit/ex2D/Normalize Scene Sprite Scales")]
    public static void NormalizeSceneSpriteScale () {
        try {
            EditorUtility.DisplayProgressBar( "Normalize Scene Sprite Scales...", 
                                              "Normalize Scene Sprite Scales...", 
                                              0.5f );    

            Transform[] transforms = GameObject.FindObjectsOfType(typeof(Transform)) as Transform[];
            for ( int i = 0; i < transforms.Length; ++i ) {
                // NOTE: only doing normalize from the root
                Transform trans = transforms[i]; 
                if ( trans.root != trans )
                    continue;

                trans.RecursivelyNormalizeScale ();
            }
            EditorUtility.ClearProgressBar();
        }
        catch ( System.Exception ) {
            EditorUtility.ClearProgressBar();
            throw;
        }
    }

    // DELME, TODO: change to a update button in exLayerMng { 
    // // ------------------------------------------------------------------ 
    // /// update GameObject with exLayer2D component in the current scene
    // // ------------------------------------------------------------------ 

    // [MenuItem ("Edit/ex2D/Update Scene Layers %&l")]
    // public static void UpdateSceneSpriteLayers () {
    //     EditorUtility.DisplayProgressBar( "Update Scene Layers...", 
    //                                       "Update Scene Layers...", 
    //                                       0.5f );    

    //     exLayer2D[] layerObjs = GameObject.FindObjectsOfType(typeof(exLayer2D)) as exLayer2D[];
    //     for ( int i = 0; i < layerObjs.Length; ++i ) {
    //         exLayer2D layerObj = layerObjs[i]; 
    //         layerObj.RecursivelyUpdateLayer ();
    //     }
    //     EditorUtility.ClearProgressBar();
    // }
    // } DELME end 

    // DISABLE: no use, just can locate the missing component, but can't delete it. { 
    // // ------------------------------------------------------------------ 
    // // Desc: 
    // // ------------------------------------------------------------------ 

    // [MenuItem ("Edit/ex2D/Remove Missing Components")]
    // static void RemoveMissingComponents () {
    //     EditorUtility.DisplayProgressBar( "Remove Missing Components...", 
    //                                       "Remove Missing Components...", 
    //                                       0.5f );    

    //     Transform[] trans = GameObject.FindObjectsOfType(typeof(Transform)) as Transform[];
    //     for ( int i = 0; i < trans.Length; ++i ) {
    //         Transform t = trans[i];
    //         Component[] comps = t.GetComponents<Component>();
    //         for ( int j = 0; j < comps.Length; ++j ) {
    //             Component c = comps[j];
    //             if ( c == null ) {
    //                 Debug.Log("Remove Missing Component from " + t.name);
    //                 GameObject.DestroyImmediate(c);
    //             }
    //         }
    //     }
    //     EditorUtility.ClearProgressBar();
    // }
    // } DISABLE end 

    // ------------------------------------------------------------------ 
    /// rebuild the sprites in the current scene
    // ------------------------------------------------------------------ 

    [MenuItem ("Edit/ex2D/Rebuild Scene Sprites %&b")]
    public static void RebuildSceneSprites () {
        exSpriteBase[] sprites = GameObject.FindObjectsOfType(typeof(exSpriteBase)) as exSpriteBase[];
        exEditorHelper.RebuildSprites (sprites);
        EditorUtility.UnloadUnusedAssets();
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    [MenuItem ("Assets/ex2D/Rebuild Sprites In Selected Scenes")]
    public static void RebuildSpritesInSelectedScenes () {
        string curEditScene = EditorApplication.currentScene;

        Object[] objs = Selection.GetFiltered( typeof(Object), SelectionMode.DeepAssets);
        foreach ( Object obj in objs ) {
            string assetPath = AssetDatabase.GetAssetPath(obj);
            if ( Path.GetExtension (assetPath) == ".unity" ) {
                Debug.Log( "Rebuild sprite in " + Path.GetFileNameWithoutExtension (assetPath));
                EditorApplication.OpenScene(assetPath);
                RebuildSceneSprites ();
                EditorApplication.SaveScene( EditorApplication.currentScene );
            }
        }
        EditorApplication.OpenScene(curEditScene);
    }

    // ------------------------------------------------------------------ 
    /// \param _atlasInfoGUIDs the list of atlas info guid
    /// update sprites in current scene and in prefab by atlas info list
    // ------------------------------------------------------------------ 

    public static void UpdateSprites ( List<string> _atlasInfoGUIDs ) {
        if ( _atlasInfoGUIDs.Count == 0 )
            return;

        try {
            EditorUtility.DisplayProgressBar( "Update Scene Sprites With Changed Atlas...", "Scanning...", 0.0f );    
            // exSpriteBase[] sprites = GameObject.FindObjectsOfType(typeof(exSpriteBase)) as exSpriteBase[];
            exSpriteBase[] sprites = Resources.FindObjectsOfTypeAll(typeof(exSpriteBase)) as exSpriteBase[];
            for ( int i = 0; i < sprites.Length; ++i ) {
                exSpriteBase spBase = sprites[i]; 

                // ======================================================== 
                // exSprite
                // ======================================================== 

                if ( spBase is exSprite ) {
                    exSprite sp = spBase as exSprite;
                    exAtlasDB.ElementInfo elInfo = exAtlasDB.GetElementInfo(sp.textureGUID);
                    bool needRebuild = false;

                    // NOTE: we test sp.index is -1 or not instead of test atlas is null, because it is possible we delete an atlas and it will always be null
                    if ( elInfo != null ) {
                        if ( sp.index == -1 ) {
                            needRebuild = true;
                        }
                        else {
                            // find if the sp's atalsInfo need rebuild
                            foreach ( string guidAtlasInfo in _atlasInfoGUIDs ) {
                                if ( elInfo.guidAtlasInfo == guidAtlasInfo ) {
                                    needRebuild = true;
                                    break;
                                }
                            }
                        }

                    }
                    else {
                        if ( sp.index != -1 ) {
                            needRebuild = true;
                        }
                    }

                    //
                    if ( needRebuild ) {
                        exSpriteEditor.UpdateAtlas( sp, elInfo );
#if UNITY_3_4
                        bool isPrefab = (EditorUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#else
                        bool isPrefab = (PrefabUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#endif
                        if ( isPrefab == false ) {
                            Texture2D texture = null;
                            if ( sp.index == -1 ) {
                                texture = exEditorHelper.LoadAssetFromGUID<Texture2D>(sp.textureGUID );
                            }
                            sp.Build(texture);
                        }
                        EditorUtility.SetDirty(sp);
                    }
                }

#if !(EX2D_EVALUATE)
                // ======================================================== 
                // exSpriteFont
                // ======================================================== 

                if ( spBase is exSpriteFont ) {
                    exSpriteFont spFont = spBase as exSpriteFont;

                    //
                    bool needRebuild = false;
                    if ( spFont.fontInfo == null ) {
                        needRebuild = true;
                    }
                    else {
                        foreach ( string guidAtlasInfo in _atlasInfoGUIDs ) {
                            exAtlasInfo atlasInfo = exEditorHelper.LoadAssetFromGUID<exAtlasInfo>(guidAtlasInfo);
                            // NOTE: it is possible we process this in delete stage
                            if ( atlasInfo == null )
                                continue;

                            foreach ( exBitmapFont bmfont in atlasInfo.bitmapFonts ) {
                                if ( spFont.fontInfo == bmfont ) {
                                    needRebuild = true;
                                    break;
                                }
                            }
                        }
                    }

                    //
                    if ( needRebuild ) {
                        spFont.Build();
                    }
                }

                // ======================================================== 
                // exSpriteBorder
                // ======================================================== 

                if ( spBase is exSpriteBorder ) {
                    exSpriteBorder spBorder = spBase as exSpriteBorder;
                    if ( spBorder.guiBorder != null ) {
                        exAtlasDB.ElementInfo elInfo = exAtlasDB.GetElementInfo(spBorder.guiBorder.textureGUID);
                        bool needRebuild = false;

                        // NOTE: we test spBorder.index is -1 or not instead of test atlas is null, because it is possible we delete an atlas and it will always be null
                        if ( elInfo != null ) {
                            if ( spBorder.index == -1 ) {
                                needRebuild = true;
                            }
                            else {
                                // find if the spBorder's atalsInfo need rebuild
                                foreach ( string guidAtlasInfo in _atlasInfoGUIDs ) {
                                    if ( elInfo.guidAtlasInfo == guidAtlasInfo ) {
                                        needRebuild = true;
                                        break;
                                    }
                                }
                            }

                        }
                        else {
                            if ( spBorder.index != -1 ) {
                                needRebuild = true;
                            }
                        }

                        //
                        if ( needRebuild ) {
                            exSpriteBorderEditor.UpdateAtlas( spBorder, elInfo );
#if UNITY_3_4
                            bool isPrefab = (EditorUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#else
                            bool isPrefab = (PrefabUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#endif
                            if ( isPrefab == false ) {
                                Texture2D texture = null;
                                if ( spBorder.index == -1 ) {
                                    texture = exEditorHelper.LoadAssetFromGUID<Texture2D>(spBorder.guiBorder.textureGUID);
                                }
                                spBorder.Build(texture);
                            }
                            EditorUtility.SetDirty(spBorder);
                        }
                    }
                }
#endif // !(EX2D_EVALUATE)

                // DISABLE: it is too slow { 
                // float progress = (float)i/(float)sprites.Length;
                // EditorUtility.DisplayProgressBar( "Update Scene Sprites...", 
                //                                   "Update Sprite " + spBase.gameObject.name, progress );    
                // } DISABLE end 
            }
            EditorUtility.ClearProgressBar();    
        }
        catch ( System.Exception ) {
            EditorUtility.ClearProgressBar();    
            throw;
        }
    }

    // ------------------------------------------------------------------ 
    /// \param _guiBorderList the list of gui-borders 
    /// update sprite borders in current scene and in prefab by gui-border list
    // ------------------------------------------------------------------ 

    public static void UpdateSpriteBorders ( List<exGUIBorder> _guiBorderList ) {
        if ( _guiBorderList.Count == 0 )
            return;

        try {
            EditorUtility.DisplayProgressBar( "Update Scene Sprites With Changed GUIBorders...", "Scanning...", 0.0f );    
            // exSpriteBase[] sprites = GameObject.FindObjectsOfType(typeof(exSpriteBase)) as exSpriteBase[];
            exSpriteBase[] sprites = Resources.FindObjectsOfTypeAll(typeof(exSpriteBase)) as exSpriteBase[];
            for ( int i = 0; i < sprites.Length; ++i ) {
                exSpriteBase spBase = sprites[i]; 

#if !(EX2D_EVALUATE)
                // ======================================================== 
                // exSpriteBorder
                // ======================================================== 

                if ( spBase is exSpriteBorder ) {
                    exSpriteBorder spBorder = spBase as exSpriteBorder;
                    bool needRebuild = false;

                    // find if the spBorder's atalsInfo need rebuild
                    foreach ( exGUIBorder guiBorder in _guiBorderList ) {
                        if ( spBorder.guiBorder == guiBorder ) {
                            needRebuild = true;
                            break;
                        }
                    }

                    //
                    if ( needRebuild ) {
                        exAtlasDB.ElementInfo elInfo = exAtlasDB.GetElementInfo(spBorder.guiBorder.textureGUID);
                        exSpriteBorderEditor.UpdateAtlas( spBorder, elInfo );
#if UNITY_3_4
                        bool isPrefab = (EditorUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#else
                        bool isPrefab = (PrefabUtility.GetPrefabType(spBase) == PrefabType.Prefab); 
#endif
                        if ( isPrefab == false ) {
                            Texture2D texture = null;
                            if ( spBorder.useAtlas == false ) {
                                texture = exEditorHelper.LoadAssetFromGUID<Texture2D>(spBorder.guiBorder.textureGUID);
                            }
                            spBorder.Build(texture);
                        }
                        EditorUtility.SetDirty(spBorder);
                    }
                }
#endif // !(EX2D_EVALUATE)

            }
            EditorUtility.ClearProgressBar();    
        }
        catch ( System.Exception ) {
            EditorUtility.ClearProgressBar();    
            throw;
        }
    }
}
