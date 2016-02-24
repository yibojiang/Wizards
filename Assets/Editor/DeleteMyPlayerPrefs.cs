using UnityEditor;
using UnityEngine;
using System.Collections;

public class DeleteMyPlayerPrefsTool : MonoBehaviour {
    
    [MenuItem("Tools/DeleteMyPlayerPrefs")] 
    static void DeleteMyPlayerPrefs() { 
        PlayerPrefs.DeleteAll();
    } 
}