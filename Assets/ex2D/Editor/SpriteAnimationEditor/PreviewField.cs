// ======================================================================================
// File         : PreviewField.cs
// Author       : Wu Jie 
// Last Change  : 07/07/2011 | 00:18:14 AM | Thursday,July
// Description  : 
// ======================================================================================

///////////////////////////////////////////////////////////////////////////////
// usings
///////////////////////////////////////////////////////////////////////////////

using UnityEditor;
using UnityEngine;
using System.IO;
using System.Collections;
using System.Collections.Generic;

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////

partial class exSpriteAnimClipEditor {

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void PreviewField ( Rect _rect ) {

        // ======================================================== 
        // preview 
        // ======================================================== 

        int borderSize = 1;
        int boxWidth = (int)_rect.width + 2 * borderSize; // box border
        int boxHeight = (int)_rect.height + 2 * borderSize; // box border
        Texture2D texCheckerboard = exEditorHelper.CheckerboardTexture();

        GUI.BeginGroup( _rect );
            int col = Mathf.CeilToInt( _rect.width / texCheckerboard.width );
            int row = Mathf.CeilToInt( _rect.height / texCheckerboard.height );

            for ( int j = 0; j < row; ++j ) {
                for ( int i = 0; i < col; ++i ) {
                    Rect size = new Rect( i * texCheckerboard.width,
                                          j * texCheckerboard.height,
                                          texCheckerboard.width,
                                          texCheckerboard.height );
                    GUI.DrawTexture( size, texCheckerboard );
                }
            }
        GUI.EndGroup();

        Color oldBGColor = GUI.backgroundColor;
        GUI.backgroundColor = Color.black;
        GUI.Box ( new Rect( _rect.x - borderSize, _rect.y - borderSize, boxWidth, boxHeight), 
                  GUIContent.none, 
                  exEditorHelper.RectBorderStyle() );
        GUI.backgroundColor = oldBGColor;

        // ======================================================== 
        // draw frame
        // ======================================================== 

        if ( curEdit != null ) {
            // draw the preview
            exSpriteAnimClip.FrameInfo fi = curEdit.GetFrameInfoBySeconds(curSeconds, curEdit.wrapMode);
            if ( fi != null ) {
                exAtlasDB.ElementInfo elInfo = exAtlasDB.GetElementInfo (fi.textureGUID);

                if ( elInfo != null ) {
                    exAtlasInfo atlasInfo = exEditorHelper.LoadAssetFromGUID<exAtlasInfo>(elInfo.guidAtlasInfo);
                    exAtlasInfo.Element el = atlasInfo.elements[elInfo.indexInAtlasInfo];  

                    if ( el.texture != null ) {
                        float width = el.texture.width;
                        float height = el.texture.height;
                        float offsetX = (width - el.trimRect.width) * 0.5f - el.trimRect.x;
                        float offsetY = (height - el.trimRect.height) * 0.5f - el.trimRect.y;

                        // DELME { 
                        // Rect frameRect = new Rect( -el.trimRect.x * previewScale, 
                        //                            -el.trimRect.y * previewScale, 
                        //                            width * previewScale, 
                        //                            height * previewScale );
                        // } DELME end 
                        Rect rect2 = new Rect ( (_rect.width - el.trimRect.width * previewScale) * 0.5f - offsetX * previewScale,
                                                (_rect.height - el.trimRect.height * previewScale) * 0.5f - offsetY * previewScale,
                                                el.trimRect.width * previewScale, 
                                                el.trimRect.height * previewScale );


                        // DISABLE: because we can't make sure all texture have same size, so ScaleToFit may play large texture { 
                        // GUI.BeginGroup( _rect );
                        //     GUI.DrawTexture( new Rect( 0.0f, 0.0f, _rect.width, _rect.height ), 
                        //                      el.texture, 
                        //                      ScaleMode.ScaleToFit );
                        // GUI.EndGroup();
                        // } DISABLE end 

                        GUI.BeginGroup( _rect );
                            // DELME { 
                            // draw background
                            // Color old = GUI.color;
                            // GUI.color = new Color( 1.0f, 0.0f, 0.85f, 0.2f );
                            //     GUI.DrawTexture( rect2, exEditorHelper.WhiteTexture() );
                            // GUI.color = old;

                            // // draw texture
                            // GUI.BeginGroup( rect2 );
                            //     GUI.BeginGroup( new Rect( (rect2.width - el.trimRect.width * previewScale) * 0.5f,
                            //                               (rect2.height - el.trimRect.height * previewScale) * 0.5f,
                            //                               el.trimRect.width * previewScale, 
                            //                               el.trimRect.height * previewScale ) );
                            //         GUI.DrawTexture( frameRect, el.texture );
                            //     GUI.EndGroup();
                            // GUI.EndGroup();
                            // } DELME end 

                            Graphics.DrawTexture ( rect2, 
                                                   el.texture,  
                                                   new Rect( el.trimRect.x/el.texture.width, 
                                                             (el.texture.height - el.trimRect.y - el.trimRect.height)/el.texture.height,
                                                             el.trimRect.width/el.texture.width,
                                                             el.trimRect.height/el.texture.height ) ,
                                                   0, 0, 0, 0,
                                                   Color.white/2.0f );

                            // DELME { 
                            // draw border
                            // Color oldBGColor = GUI.backgroundColor;
                            // GUI.backgroundColor = Color.black;
                            //     GUI.Box ( rect2, GUIContent.none, exEditorHelper.RectBorderStyle() );
                            // GUI.backgroundColor = oldBGColor;
                            // } DELME end 
                        GUI.EndGroup();
                    }
                }
                else {
                    string texturePath = AssetDatabase.GUIDToAssetPath(fi.textureGUID);
                    Texture2D tex2D = (Texture2D)AssetDatabase.LoadAssetAtPath( texturePath, typeof(Texture2D));
                    if ( tex2D != null ) {
                        Rect size = new Rect( 0.0f, 
                                              0.0f, 
                                              tex2D.width * previewScale, 
                                              tex2D.height * previewScale );
                        Rect rect2 = new Rect ( (_rect.width - size.width) * 0.5f,
                                                (_rect.height - size.height) * 0.5f,
                                                size.width, 
                                                size.height );

                        GUI.BeginGroup( _rect );
                            GUI.BeginGroup( rect2 );
                                GUI.DrawTexture( size, tex2D );
                            GUI.EndGroup();
                        GUI.EndGroup();
                    }
                }
            }
        }

        GUILayoutUtility.GetRect ( _rect.width, _rect.height );
    }
}

