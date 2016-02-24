// ======================================================================================
// File         : exSpriteAnimationEditor.cs
// Author       : Wu Jie 
// Last Change  : 07/07/2011 | 17:20:42 PM | Thursday,July
// Description  : 
// ======================================================================================

///////////////////////////////////////////////////////////////////////////////
// usings
///////////////////////////////////////////////////////////////////////////////

using UnityEngine;
using UnityEditor;
using System.Collections;
using System.IO;

///////////////////////////////////////////////////////////////////////////////
// defines
///////////////////////////////////////////////////////////////////////////////

[CustomEditor(typeof(exSpriteAnimation))]
public class exSpriteAnimationEditor : Editor {

    ///////////////////////////////////////////////////////////////////////////////
    // properties
    ///////////////////////////////////////////////////////////////////////////////

    private exSpriteAnimation editSpAnim;
    private bool showAnimations = true;

    ///////////////////////////////////////////////////////////////////////////////
    // functions
    ///////////////////////////////////////////////////////////////////////////////

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

    void OnEnable () {
        if ( target != editSpAnim ) {
            editSpAnim = target as exSpriteAnimation;
        }
    }

    // ------------------------------------------------------------------ 
    // Desc: 
    // ------------------------------------------------------------------ 

	public override void OnInspectorGUI () {
        exSprite sprite = editSpAnim.GetComponent<exSprite>();
        bool checkDefaultSprite = (sprite != null) && string.IsNullOrEmpty(sprite.textureGUID);

        EditorGUIUtility.LookLikeInspector ();
        EditorGUILayout.Space ();
        EditorGUI.indentLevel = 1;

        // ======================================================== 
        // Play Automatically 
        // ======================================================== 

        editSpAnim.playAutomatically = EditorGUILayout.Toggle ( "Play Automatically", editSpAnim.playAutomatically );

        // ======================================================== 
        // Default Animation 
        // ======================================================== 

        GUILayout.BeginHorizontal();
        editSpAnim.defaultAnimation = (exSpriteAnimClip)EditorGUILayout.ObjectField( "Default Animation"
                                                                                   , editSpAnim.defaultAnimation
                                                                                   , typeof(exSpriteAnimClip)
                                                                                   , false 
                                                                                 );
        if ( GUILayout.Button("Edit...", GUILayout.Width(40), GUILayout.Height(15) ) ) {
            exSpriteAnimClipEditor editor = exSpriteAnimClipEditor.NewWindow();
            editor.Edit(editSpAnim.defaultAnimation);
        }
        if ( editSpAnim.defaultAnimation != null ) {
            int idx = editSpAnim.animations.IndexOf(editSpAnim.defaultAnimation);
            if ( idx == -1 ) {
                editSpAnim.animations.Add(editSpAnim.defaultAnimation);
            }
        }
        GUILayout.EndHorizontal();

        // ======================================================== 
        // Animations
        // ======================================================== 

        Rect lastRect = new Rect( 0, 0, 1, 1 );
        Rect dropRect = new Rect( 0, 0, 1, 1 );

        EditorGUI.indentLevel = 0;
        showAnimations = EditorGUILayout.Foldout(showAnimations, "Animations");
        if ( showAnimations ) {
            EditorGUI.indentLevel = 2;
            // int count = EditorGUILayout.IntField ( "Size", editSpAnim.animations.Count );
            int count = exEditorHelper.IntField ( "Size", editSpAnim.animations.Count );
            lastRect = GUILayoutUtility.GetLastRect ();  
            dropRect.height =  lastRect.yMax - dropRect.y;
            count = Mathf.Max ( count, 0 );

            if ( count != editSpAnim.animations.Count ) {
                //
                if ( count > editSpAnim.animations.Count ) {
                    int num = count - editSpAnim.animations.Count;
                    for ( int i = 0; i < num; ++i )
                        editSpAnim.animations.Add( null );
                }
                else {
                    editSpAnim.animations.RemoveRange( count, editSpAnim.animations.Count - count );
                }

                //
                GUI.changed = true;
            }

            int idxRemoved = -1;
            for ( int i = 0; i < editSpAnim.animations.Count; ++i ) {
                GUILayout.BeginHorizontal();
                editSpAnim.animations[i] = 
                    (exSpriteAnimClip)EditorGUILayout.ObjectField( "[" + i + "]"
                                                                 , editSpAnim.animations[i]
                                                                 , typeof(exSpriteAnimClip)
                                                                 , false 
                                                               );
                if ( GUILayout.Button("-", GUILayout.Width(15), GUILayout.Height(15) ) ) {
                    idxRemoved = i;
                }
                if ( GUILayout.Button("Edit...", GUILayout.Width(40), GUILayout.Height(15) ) ) {
                    exSpriteAnimClipEditor editor = exSpriteAnimClipEditor.NewWindow();
                    editor.Edit(editSpAnim.animations[i]);
                }
                // TODO: I think we can instantiate animation state { 
                // EditorGUI.indentLevel += 1;
                // // TODO:
                // EditorGUI.indentLevel -= 1;
                // } TODO end 
                GUILayout.EndHorizontal();
            }

            // if we have item to remove
            if ( idxRemoved != -1 ) {
                exSpriteAnimClip animClip = editSpAnim.animations[idxRemoved];
                editSpAnim.animations.RemoveAt(idxRemoved);
                if ( animClip == editSpAnim.defaultAnimation ) {
                    editSpAnim.defaultAnimation = null;
                }
            }

            EditorGUI.indentLevel = 1;
            EditorGUILayout.Space ();

            lastRect = GUILayoutUtility.GetLastRect ();  
            dropRect.x = lastRect.x + 30;
            dropRect.y = lastRect.yMax;
            dropRect.width = lastRect.xMax - 30 - 4;
            dropRect.height = 20;

            exEditorHelper.DrawRect( dropRect, new Color( 0.2f, 0.2f, 0.2f, 1.0f ), new Color( 0.5f, 0.5f, 0.5f, 1.0f ) );
            GUILayout.Space (20);

            // ======================================================== 
            // drag and drop 
            // ======================================================== 

            if ( dropRect.Contains(Event.current.mousePosition) ) {
                if ( Event.current.type == EventType.DragUpdated ) {
                    // Show a copy icon on the drag
                    foreach ( Object o in DragAndDrop.objectReferences ) {
                        if ( o is exSpriteAnimClip ) {
                            DragAndDrop.visualMode = DragAndDropVisualMode.Copy;
                            break;
                        }
                    }
                }
                else if ( Event.current.type == EventType.DragPerform ) {
                    DragAndDrop.AcceptDrag();
                    foreach ( Object o in DragAndDrop.objectReferences ) {
                        if ( o is exSpriteAnimClip ) {
                            editSpAnim.animations.Add( o as exSpriteAnimClip );
                        }
                    }
                    GUI.changed = true;
                }
            }
        }
        EditorGUILayout.Space ();

        // TODO: FIXME { 
        // ======================================================== 
        // 
        // ======================================================== 

        if ( checkDefaultSprite && 
             editSpAnim.animations.Count > 0 &&
             editSpAnim.animations[0] != null &&
             editSpAnim.animations[0].frameInfos.Count > 0 ) 
        {
            exSpriteAnimClip.FrameInfo fi = editSpAnim.animations[0].frameInfos[0];
            sprite.textureGUID = fi.textureGUID;
            sprite.SetSprite(fi.atlas, fi.index);
            sprite.Build();
        }
        // } TODO end 

        // ======================================================== 
        // set dirty if anything changed
        // ======================================================== 

        if ( GUI.changed ) {
            EditorUtility.SetDirty(editSpAnim);
        }
    }
}

