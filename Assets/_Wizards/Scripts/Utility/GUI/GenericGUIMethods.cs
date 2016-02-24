using UnityEngine;
using System.Collections;

public class GenericGUIMethods : MonoBehaviour
{

//Init User Controlled Variables
public bool VisibleOnAwake = true;
public bool DontDestroyOnSceneLoad = false;
public Color ButtonDisabledColor;
public bool ButtonEnabled = true;
public Texture TextureMouseSelected = null;
public Texture TextureMouseOver = null;
public Texture TextureMouseNormal = null;
public GameObject ContextHelpText = null;
public GameObject TopLevelParent = null;
public GameObject LinkToGUITextGameObject = null;
public bool ObjectGlow = false;
public bool ButtonSelected = false;
public bool Frozen = false;
public int TextFieldTabCount = 0;
public int TextFieldTabActive = 1;


public enum SelectGUI_ObjectType
    {
        Panel,
        Button,
        Checkbox,
        RadioButton,
        Textbox,
        Icon
    }
public SelectGUI_ObjectType m_SelectGUI_ObjectType = SelectGUI_ObjectType.Panel;

public enum SelectScreenPosition
    {
        NoChange,
        Centered,
        TopMiddle,
        BottomMiddle
    }
public SelectScreenPosition m_SelectScreenPosition = SelectScreenPosition.NoChange;

//---Init Private Variables
private bool MouseIsOver = false;
private float CurrentOpacity = 0.5f;
private int CurrentGlowDirection = 1;
private int FadeDirection = 0;


//--- SCREEN ALIGNMENT SCRIPT
//Notes: need to add other basic screen positioning options (Top/Bottom Left, Top/Bottom Right etc) 
void fncAlignToScreen () {
    Rect rctCurrentPosition = GetComponent<GUITexture>().pixelInset;
    int intThisHeight = (int)Mathf.Abs((rctCurrentPosition.yMax - rctCurrentPosition.yMin));
    int intThisWidth = (int)Mathf.Abs((rctCurrentPosition.xMax - rctCurrentPosition.xMin));
    float fltScreenUnitsWidth = 1.0f/Screen.width;
    float fltScreenUnitsHeight = 1.0f/Screen.height;
    float fltInsetAmount = 0.0f;
    switch(m_SelectScreenPosition)
    {
    case SelectScreenPosition.Centered:

        transform.position = new Vector3(0.5f,0.5f,transform.position.z);
      break;
    case SelectScreenPosition.TopMiddle:
      fltInsetAmount = 1 - ((intThisHeight/2.0f) * fltScreenUnitsHeight);
      transform.position = new Vector3(0.5f,fltInsetAmount,transform.position.z);
        break;
    case SelectScreenPosition.BottomMiddle:
      fltInsetAmount = (intThisHeight/2.0f) * fltScreenUnitsHeight;
      transform.position = new Vector3(0.5f,fltInsetAmount,transform.position.z);

        break;
    case SelectScreenPosition.NoChange:
        //Do Nothing
        break;
    default:
        //Do Nothing
        break;
    }
}
//--- FIXED UPDATE SCRIPT
//Notes: move glow script into IEnumerator function
void FixedUpdate(){
    //Do Glow
    if(ObjectGlow==true){
        if(CurrentOpacity < 0.5f && CurrentGlowDirection == 1){
            GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,CurrentOpacity);
            CurrentOpacity += 0.006f;
        }else{
            CurrentGlowDirection = 0;
        }
        if(CurrentOpacity > 0.15f && CurrentGlowDirection == 0){
            GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,CurrentOpacity);
            CurrentOpacity -= 0.006f;
        }else{
            CurrentGlowDirection = 1;
        }

    }
}

//--- AWAKE SCRIPT
void Awake () {
    TextFieldTabActive = 1;
    //Set Dont Destroy on Load Flag
    if(DontDestroyOnSceneLoad==true) DontDestroyOnLoad (this);
    //Init Button States
    fncInitButton();
    //Init Screen Alignement function
    fncAlignToScreen();
    //Set visibility based on inspector flag
    if(VisibleOnAwake==true){
        GetComponent<GUITexture>().enabled=true;
    }else{
        GetComponent<GUITexture>().enabled=false;
    }
}

//--- INIT BUTTONS
//Notes: init scripts for other UI types should be added
void fncInitButton(){
        //Init Button Textures
    switch(m_SelectGUI_ObjectType)
    {
    case SelectGUI_ObjectType.Button:
        GetComponent<GUITexture>().texture=TextureMouseNormal;
        if(ButtonEnabled==false){
            GetComponent<GUITexture>().color=ButtonDisabledColor;
        }
        break;
    case SelectGUI_ObjectType.Checkbox:
        GetComponent<GUITexture>().texture=TextureMouseNormal;
        if(ButtonEnabled==false){
            GetComponent<GUITexture>().color=ButtonDisabledColor;
        }
        break;
    case SelectGUI_ObjectType.RadioButton:
        GetComponent<GUITexture>().texture=TextureMouseNormal;
        if(ButtonEnabled==false){
            GetComponent<GUITexture>().color=ButtonDisabledColor;
        }
        break;
    default:
        //Do Nothing
        break;
    }
}

//--- MESSAGE RECEIVER
//Notes: Freeze GUITexture settings should not be hard coded - move to Public members later...
void fncMessageReceiver (string strInternalCommand) {


switch(strInternalCommand)
    {
    case "DisableSelectedButtons":

        if(ButtonSelected==true && MouseIsOver != true){
            fncSetButtonState("Normal");
            ButtonSelected=false;
        }
      break;
    case "FadeIn":

        StartCoroutine ("fncFadeInOut", "FadeIn");
      break;
    case "FadeOut":

        StartCoroutine ("fncFadeInOut", "FadeOut");
      break;
    case "MouseOverTextField":

        if(m_SelectGUI_ObjectType == SelectGUI_ObjectType.Textbox) fncSetButtonState("Over");
      break;    
    case "MouseExitTextField":

        if(m_SelectGUI_ObjectType == SelectGUI_ObjectType.Textbox) fncSetButtonState("Normal");
      break;
    case "ToggleFreeze":
      if(Frozen==false){
            GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,0.1f);
        }else{
            GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,0.5f);
        }
        Frozen = !Frozen;
      break;
    case "ToggleGuiEnabled":
      GetComponent<GUITexture>().enabled = !GetComponent<GUITexture>().enabled;
      break;
    default:
        //Do Nothing
        break;
    }
}

//--- FADE IN/OUT FUNCTION
//Notes: the fading and glowing script could probably be merged - later...
IEnumerator fncFadeInOut(string strFadeType){
int intRunFade = 1;
float fltFadeOpacity = 0.0f;
float fltMaxOpacity = 0.5f;
bool RestartGlow = false;
if(ObjectGlow==true){
    RestartGlow=true;
    ObjectGlow=false;
}
if(strFadeType=="FadeIn"){
    fltFadeOpacity = 0.0f;
    GetComponent<GUITexture>().enabled=true;
    if(ButtonEnabled==false) fltMaxOpacity = 0.15f;
}
    
if(strFadeType=="FadeOut"){
    fltFadeOpacity=GetComponent<GUITexture>().color.a;
    ObjectGlow=false;
}
while (intRunFade!=0)
        {
            switch (strFadeType)
            {
                case "FadeIn":
                    if(fltFadeOpacity <= fltMaxOpacity){
                        GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,fltFadeOpacity);
                        fltFadeOpacity += 0.008f;
                    }else{
                        intRunFade=0;
                        fncInitButton();
                        if(RestartGlow==true){
                            ObjectGlow=true;
                        }   
                    }
                    break;
                case "FadeOut":
                    if(fltFadeOpacity >= 0.0f){
                        GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,fltFadeOpacity);
                        fltFadeOpacity -= 0.008f;
                    }else{
                        intRunFade=0;
                    }
                    
                    break;
            
            }
            yield return 0;
        }
if(strFadeType=="FadeIn"){ 
    GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,fltMaxOpacity);
}
    if(strFadeType=="FadeOut"){
        GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,0.0f);
        GetComponent<GUITexture>().enabled=false;
    }
}

//--- SET BUTTON STATE
//Notes: buttons with no GUITextures use hardcoded alpha values - should be user controlled
void fncSetButtonState (string strState) {
    switch(strState)
    {
    case "Normal":

        if(TextureMouseNormal!=null){
            GetComponent<GUITexture>().texture=TextureMouseNormal;
        }
        GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,0.5f);
      break;
    case "Over":

        if(TextureMouseOver!=null){
            GetComponent<GUITexture>().texture=TextureMouseOver;
        }else{
            GetComponent<GUITexture>().color = new Color(0.6f,0.6f,0.6f,0.6f);  
        }
      break;
    case "Selected":

        if(TextureMouseSelected!=null){
            GetComponent<GUITexture>().texture=TextureMouseSelected;
            GetComponent<GUITexture>().color = new Color(0.5f,0.5f,0.5f,0.5f);
        }
      break;
    case "Active":
            GetComponent<GUITexture>().color = new Color(0.8f,0.8f,0.8f,0.5f);
      break;
    default:
      //No Action
      break;

    }
}
    
//--- MOUSE ENTER
void OnMouseEnter(){
if(Frozen==false){
    MouseIsOver = true;
    if(ContextHelpText != null){
    ContextHelpText.GetComponent<GUITexture>().enabled = true;
    }
    switch(m_SelectGUI_ObjectType)
    {
    case SelectGUI_ObjectType.Button:
        fncSetButtonState("Over");
        break;
    case SelectGUI_ObjectType.Panel:
        //No Action
        break;
    case SelectGUI_ObjectType.Checkbox:
        fncSetButtonState("Over");
        break;
    case SelectGUI_ObjectType.RadioButton:
        if(ButtonSelected==false){
        fncSetButtonState("Over");
        }
        break;
    case SelectGUI_ObjectType.Textbox:
        fncSetButtonState("Over");
        break;    
    default:
        //No Action
        break;  
    }
}
}   

//--- MOUSE EXIT
void OnMouseExit(){
if(Frozen==false){
    MouseIsOver = false;
    if(ContextHelpText != null){
    ContextHelpText.GetComponent<GUITexture>().enabled = false;
    }
    switch(m_SelectGUI_ObjectType)
    {
    case SelectGUI_ObjectType.Button:
        fncSetButtonState("Normal");
        break;
    case SelectGUI_ObjectType.Panel:
        //No Action
        break;
    case SelectGUI_ObjectType.Checkbox:
        if(ButtonSelected==false){
            fncSetButtonState("Normal");
        }else{
            fncSetButtonState("Selected");
        }
        break;
    case SelectGUI_ObjectType.RadioButton:
        if(ButtonSelected==false){
        fncSetButtonState("Normal");
        }
        break;
    case SelectGUI_ObjectType.Textbox:
        fncSetButtonState("Normal");
        break;    
    default:
        //No Action
        break;  
    }
}
}

//--- MOUSE DOWN
void OnMouseDown(){
    switch(m_SelectGUI_ObjectType)
    {
    case SelectGUI_ObjectType.Button:
        fncSetButtonState("Active");
        break;
    case SelectGUI_ObjectType.Panel:
        //No Action
        break;
    case SelectGUI_ObjectType.Checkbox:
        //No Action
        break;
    case SelectGUI_ObjectType.RadioButton:
        //No Action
        break;
    default:
        //No Action
        break;  
    }
}

//--- MOUSE UP
//Bug: If users mouse downs over a button, moves off and mouse ups, things get messy - probably can be solved by checking Mouse down instead
void OnMouseUp(){
    switch(m_SelectGUI_ObjectType)
    {
    case SelectGUI_ObjectType.Button:
        fncSetButtonState("Normal");
        break;
    case SelectGUI_ObjectType.Panel:
        //No Action
        break;
    case SelectGUI_ObjectType.Checkbox:
        if(ButtonSelected==false){
           fncSetButtonState("Selected");
           ButtonSelected=true;
        }else{ 
           fncSetButtonState("Normal");
           ButtonSelected=false;
        }
        break;
    case SelectGUI_ObjectType.RadioButton:
        if(ButtonSelected==false){
           fncSetButtonState("Selected");
           ButtonSelected=true;
            TopLevelParent.BroadcastMessage("fncMessageReceiver","DisableSelectedButtons"); 
        }
        break;
    case SelectGUI_ObjectType.Textbox:
        GenericTextFieldMethods genericTextFieldMethods = (GenericTextFieldMethods)LinkToGUITextGameObject.GetComponent(typeof(GenericTextFieldMethods));
        genericTextFieldMethods.fncSetActiveTabID("This");
        break;
    default:
        //DoNothing
        break;  
    }
}
///////////END OF GENERIC GUI METHODS CLASS
}


 