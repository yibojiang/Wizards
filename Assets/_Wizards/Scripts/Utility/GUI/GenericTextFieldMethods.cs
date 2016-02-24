using UnityEngine;
using System.Collections;

public class GenericTextFieldMethods : MonoBehaviour {

//Init Public Variables
    public GameObject TopLevelParent = null;
    public int TabID = 0;
    public int MaximumWithInPixels = 100;
    public string strDefaultText = "";
    public bool IsPasswordField = false;
    public string PasswordMaskingCharacter = "*";
    public bool IsLabel = false;
    public string strRealText = "";

//Init Private Variables
    private int intCurrentActiveTab = 0;
    private bool blnIsFrozen = false;
    
// AWAKE
    void Awake () {
    GetComponent<GUIText>().text = strDefaultText;
    }

// GET ACTIVE TABID
    int fncGetActiveTabID(){
        GenericGUIMethods genericGUIMethods = (GenericGUIMethods)TopLevelParent.GetComponent(typeof(GenericGUIMethods));
        return genericGUIMethods.TextFieldTabActive;
    }

// SET ACTIVE TABID
//Bug: currently using the TAB key to change fields doesnt work - will be fixed ASAP
    public void fncSetActiveTabID(string strFunction){
        if(IsLabel!=true){
            if(GetComponent<GUIText>().text == strDefaultText) GetComponent<GUIText>().text = "";
            GenericGUIMethods genericGUIMethods = (GenericGUIMethods)TopLevelParent.GetComponent(typeof(GenericGUIMethods));
            switch(strFunction)
            {
            case "This":
                genericGUIMethods.TextFieldTabActive=TabID;
                break;
            /*case "Next": //TO BE FIXED
                if(TabID < genericGUIMethods.TextFieldTabCount){
                    genericGUIMethods.TextFieldTabActive++;
                }else{
                    genericGUIMethods.TextFieldTabActive=1;
                }
                break;*/
            }
        }
    }

// UPDATE
    void Update () {
        if(fncGetActiveTabID()==TabID && IsLabel!=true){    
            foreach(char c in Input.inputString) {
            if(GetComponent<GUIText>().text == strDefaultText) GetComponent<GUIText>().text = "";   
                switch(c)
                {
                case '\b':  // Backspace - Remove the last character
                    if (strRealText.Length != 0){
                        strRealText = strRealText.Substring(0,strRealText.Length - 1);
                    }
                    if (GetComponent<GUIText>().text.Length != 0){
                        GetComponent<GUIText>().text = GetComponent<GUIText>().text.Substring(0, GetComponent<GUIText>().text.Length - 1);
                    }
                    break;
                case '\t':  // Tab
                    //fncSetActiveTabID("Next");
                    break;
                case '\n':  // Enter
                    //No Action
                    break;
                default: //normal character input
                    //if the text will overflow, ignore further user input
                    Rect tbRect = GetComponent<GUIText>().GetScreenRect();
                    if(tbRect.width < MaximumWithInPixels){
                        if(IsPasswordField==true){
                            GetComponent<GUIText>().text += PasswordMaskingCharacter;
                            strRealText += c;
                        }else{
                            GetComponent<GUIText>().text += c;
                            strRealText += c;
                        }
                    }
                    break;
                }
            }
        }
    }
    
    void OnMouseUp () {
        if(IsLabel!=true) fncSetActiveTabID("This");        
    }
    
    void OnMouseOver () {
        if(IsLabel!=true) gameObject.SendMessageUpwards ("fncMessageReceiver", "MouseOverTextField");   
    }
    void OnMouseExit () {
        if(IsLabel!=true) gameObject.SendMessageUpwards ("fncMessageReceiver", "MouseExitTextField");   
    }
//--- MESSAGE RECEIVER
    void fncMessageReceiver (string strInternalCommand) {

    
    switch(strInternalCommand)
        {

        case "ToggleFreeze":
          GetComponent<GUIText>().enabled = !GetComponent<GUIText>().enabled;
          if(GetComponent<GUIText>().enabled==true){ 
            blnIsFrozen=false;
          }else{
            blnIsFrozen=true;
          }
         break;
        case "ToggleGuiEnabled":
            if(blnIsFrozen==false) GetComponent<GUIText>().enabled = !GetComponent<GUIText>().enabled;
          break;
        default:
            //No Action
            break;
        }
    }

// END OF GENERIC TEXT FIELD METHODS CLASS
}