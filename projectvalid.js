*/
function Validator(frmname)
{
  this.formobj=document.forms[frmname];
    if(!this.formobj)
    {
      alert("Error: couldnot get Form object "+frmname);
        return;
    }
    if(this.formobj.onsubmit)
    {
     this.formobj.old_onsubmit = this.formobj.onsubmit;
     this.formobj.onsubmit=null;
    }
    else
    {
     this.formobj.old_onsubmit = null;
    }
    this.formobj._sfm_form_name=frmname;
    this.formobj.onsubmit=form_submit_handler;
    this.addValidation = add_validation;
    this.setAddnlValidationFunction=set_addnl_vfunction;
    this.clearAllValidations = clear_all_validations;
    this.disable_validations = false;//new
    document.error_disp_handler = new sfm_ErrorDisplayHandler();
    this.EnableOnPageErrorDisplay=validator_enable_OPED;
    this.EnableOnPageErrorDisplaySingleBox=validator_enable_OPED_SB;
    this.show_errors_together=true;
    this.EnableMsgsTogether=sfm_enable_show_msgs_together;
    document.set_focus_onerror=true;
    this.EnableFocusOnError=sfm_validator_enable_focus;

}

function sfm_validator_enable_focus(enable)
{
    document.set_focus_onerror = enable;
}

function set_addnl_vfunction(functionname)
{
  this.formobj.addnlvalidation = functionname;
}

function sfm_set_focus(objInput)
{
    if(document.set_focus_onerror)
    {
        objInput.focus();
    }
}

function sfm_enable_show_msgs_together()
{
    this.show_errors_together=true;
    this.formobj.show_errors_together=true;
}
function clear_all_validations()
{
    for(var itr=0;itr < this.formobj.elements.length;itr++)
    {
        this.formobj.elements[itr].validationset = null;
    }
}

function form_submit_handler()
{
   var bRet = true;
    document.error_disp_handler.clear_msgs();
    for(var itr=0;itr < this.elements.length;itr++)
    {
        if(this.elements[itr].validationset &&
       !this.elements[itr].validationset.validate())
        {
          bRet = false;
        }
        if(!bRet && !this.show_errors_together)
        {
          break;

        }
    }

    if(this.addnlvalidation)
    {
      str =" var ret = "+this.addnlvalidation+"()";
      eval(str);

     if(!ret)
     {
       bRet=false;
     }

    }

   if(!bRet)
    {
      document.error_disp_handler.FinalShowMsg();
      return false;
    }
    return true;
}

function add_validation(itemname,descriptor,errstr)
{
    var condition = null;
    if(arguments.length > 3)
    {
     condition = arguments[3];
    }
  if(!this.formobj)
    {
        alert("Error: The form object is not set properly");
        return;
    }//if
    var itemobj = this.formobj[itemname];
    if(itemobj.length && isNaN(itemobj.selectedIndex) )
    //for radio button; don't do for 'select' item
    {
        itemobj = itemobj[0];
    }
  if(!itemobj)
    {
        alert("Error: Couldnot get the input object named: "+itemname);
        return;
    }
    if(!itemobj.validationset)
    {
        itemobj.validationset = new ValidationSet(itemobj,this.show_errors_together);
    }
    itemobj.validationset.add(descriptor,errstr,condition);
    itemobj.validatorobj=this;
}
function validator_enable_OPED()
{
    document.error_disp_handler.EnableOnPageDisplay(false);
}

function validator_enable_OPED_SB()
{
    document.error_disp_handler.EnableOnPageDisplay(true);
}
function sfm_ErrorDisplayHandler()
{
  this.msgdisplay = new AlertMsgDisplayer();
  this.EnableOnPageDisplay= edh_EnableOnPageDisplay;
  this.ShowMsg=edh_ShowMsg;
  this.FinalShowMsg=edh_FinalShowMsg;
  this.all_msgs=new Array();
  this.clear_msgs=edh_clear_msgs;
}
function edh_clear_msgs()
{
    this.msgdisplay.clearmsg(this.all_msgs);
    this.all_msgs = new Array();
}
function edh_FinalShowMsg()
{
    this.msgdisplay.showmsg(this.all_msgs);
}
function edh_EnableOnPageDisplay(single_box)
{
    if(true == single_box)
    {
        this.msgdisplay = new SingleBoxErrorDisplay();
    }
    else
    {
        this.msgdisplay = new DivMsgDisplayer();
    }
}
function edh_ShowMsg(msg,input_element)
{

   var objmsg = new Array();
   objmsg["input_element"] = input_element;
   objmsg["msg"] =  msg;
   this.all_msgs.push(objmsg);
   
