using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
 
/// <summary>
/// If you want to replace the UMA.dll with the source code from https://github.com/huika/UMA, Unity3d will loose references to essential scripts such as SlotData.cs, OverlayData.cs ...
/// 1. remove UMA.dll from your project
/// 2. add source code of the dll to the project (https://github.com/huika/UMA)
/// 3. press the menu "UMA/Replace UMA DLL"
///
/// Good read how fileID and guid work with DLLs:
/// http://forum.unity3d.com/threads/reducing-script-compile-time-or-a-better-workflow-to-reduce-excessive-recompiling.148078/#post-1026639
/// 
/// Hint: This is script is not optimized for performance, because you only run it onces <img src="https://timmlotter.com/blog/wp-includes/images/smilies/icon_wink.gif" alt=";-)" class="wp-smiley"> 
/// </summary>
public class ReplaceUmaDll 
{
    [MenuItem("UMA/Replace UMA DLL")]
    static void Replace()
    {
        List<UnityReference> r = new List<UnityReference>();

        

        

        
        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-894469397", "795d9b1dd78d242239e476cce3eec843", "11500000")); // exSpriteMng.cs

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-1958963152", "09f38919b6f744cff80277400a5c790c", "11500000"));//exPixelPerfect Camera

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1155214310", "787cfc6a93c63433e92e033e697a4771", "11500000")); // exAtlas.cs
        r.Add(new UnityReference("77f72665dddd347bba153c5cb5a2df66", "-2055322909", "583664a9335f546d68094cae24bafd03", "11500000")); // exAtlasInfo.cs


        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1318968151", "77d4bd815af5f443ab8f83def6d20555", "11500000")); // exViewportPosition.cs

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "152183940", "6efb0ef87aebc4c07b8b80265a0bc1cf", "11500000")); // exSprite.cs

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-997644103", "c3a0cbac84cb34542b67eec34fc207eb", "11500000")); // exBitmapFont.cs

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1837739921", "9d88982ee844c401b939d3e5e710bde7", "11500000"));//exGUIBorder

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1436349420", "360861cf57c644f53aae8c5771924922", "11500000"));//exSpriteBorder

		r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-1904263217", "85b5f7b0a2a864acba9975dc5a28e546", "11500000"));//exPixelPerfect

		r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-1965115596", "4ac8bceb52a204a38bba4d120567f54f", "11500000"));//exSpriteAnimation

		r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1310270934", "fdaee45eecfdc471fa1e39093bc7656f", "11500000"));//exSpriteAnimHelper

		r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "49051723", "bf5697e911dcb4f8389232e24eea42a6", "11500000"));//exSpriteAnimClip

		r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "-640569473", "1d72d188a05d64509b3055231146e979", "11500000"));//exSpriteFont

        r.Add(new UnityReference("86da5fbf2fdd742fabee71203cfbdca4", "1714840765", "72222ffe19081477d86ab95ffdc1793a", "11500000"));//exCollisionHelper

        


        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-335686737", "0255b874991cce440bf9d7aeb881d411", "11500000")); // RaceData.cs
        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-1571472132", "e7c16015bfeffbf46a4f40de1f687493", "11500000")); // UMADefaultMeshCombiner.cs
        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-946187639", "fd3c35f1684963b4c8693ace7a4e9751", "11500000")); // UMALegacyMeshCombiner.cs
        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-1550055707", "8c8e9aa6f57f2fb4ab4808b7dd814787", "11500000")); // UMAData.cs
        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-1708169498", "ca64bee1dd859ab498a3045e0e682a1a", "11500000")); // UmaTPose.cs
        //r.Add(new UnityReference("e20699a64490c4e4284b27a8aeb05666", "-1175167296", "a4beb7632b1d45f44b433df8b2d28f9a", "11500000")); // TextureMerge.cs
 
        ReplaceReferences(Application.dataPath, r);
    }
 
    static void ReplaceReferences(string assetFolder, List<UnityReference> r)
    {
        string[] files = Directory.GetFiles(assetFolder, "*", SearchOption.AllDirectories);
        for (int i = 0; i < files.Length; i++)
        {
            string file = files[i];
 
            if (EditorUtility.DisplayCancelableProgressBar("Replace UMA DLL", file, i/(float)files.Length))
            {
                EditorUtility.ClearProgressBar();
                return;
            }
 
            if (file.EndsWith(".asset") || file.EndsWith(".prefab") || file.EndsWith(".unity"))
            {
                ReplaceFile(file, r);
                FindNotReplacedFiles(file, "e20699a64490c4e4284b27a8aeb05666");
            }
        }
 
        EditorUtility.ClearProgressBar();
    }
 
    static void ReplaceFile(string filePath, List<UnityReference> references)
    {
        var fileContents = System.IO.File.ReadAllText(filePath);
         
        bool match = false;
         
        foreach(UnityReference r in references)
        {
            Regex regex = new Regex(@"fileID: " + r.srcFileId + ", guid: " + r.srcGuid);
            if (regex.IsMatch(fileContents))
            {
                fileContents = regex.Replace(fileContents, "fileID: " + r.dstFileId + ", guid: " + r.dstGuid);
                match = true;
                Debug.Log("Replaced: " + filePath);
            }
        }
         
        if (match)
        {
            System.IO.File.WriteAllText(filePath, fileContents); 
        }
    }
 
    /// <summary>
    /// Just to make sure that all references are replaced.
    /// </summary>
    static void FindNotReplacedFiles(string filePath, string guid)
    {
        var fileContents = System.IO.File.ReadAllText(filePath);
         
        // -?        number can be negative
        // [0-9]+    1-n numbers
        Regex.Replace(fileContents, @"fileID: -?[0-9]+, guid: " + guid, 
            (match) =>
                {
                if (match.Value != "fileID: 11500000, guid: " + guid)
                {
                    Debug.LogWarning("NotReplaced: " + match.Value + "  " + filePath);
                }
                return match.Value;
            });
    }
 
    class UnityReference
    {
        public UnityReference(string srcGuid, string srcFileId, string dstGuid, string dstFileId)
        {
            this.srcGuid = srcGuid;
            this.srcFileId = srcFileId;
            this.dstGuid = dstGuid;
            this.dstFileId = dstFileId;
        }
         
        public string srcGuid;
        public string srcFileId;
        public string dstGuid;
        public string dstFileId;
    }
}