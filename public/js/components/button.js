class Button extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Button";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Button'; }
        if (config.buttonLabel === void 0) { config.buttonLabel = 'My Button'; }
        if (config.buttonPostUrl === void 0) { config.buttonPostUrl = ''; }
        if (config.buttonActionType=== void 0) { config.buttonActionType = 'Submit'; }
       
        if (config.validation === void 0) {
          config.validation = {}
          config.validation.mandatory = false;

          if (config.validation.lengthCheck === void 0) {
            config.validation.lengthCheck = {};
            config.validation.lengthCheck.min = 0;
            config.validation.lengthCheck.max = 0;
          };
        };
        
      
        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
        //this.editFormJson = this.getEditFormJson();
    }

    getEditFormJson = () =>{
      return {
        "label": "Text Field Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"buttonLabel",
                "label": "Button Label",
                "placeholder": "My Button label",
                "description": "Enter the label for this Button", 
                "validation":{"mandatory": true, "lengthCheck": {"min": 0, "max":0}},
                "value":this.config.buttonLabel,           
                "type": "Textbox"
              },
              {
                "propertyName":"customCss",
                "label": "Custom CSS",
                "placeholder": "custom css",
                "description": "Set the custom css, for ex: form-control form-item", 
                "type": "Textbox",
                "value": this.config.customCss
              }
            ]
          },           
          {
            "tabLabel": "Behavior",
            "tabId":"behavior",
            "components": [
              {
                "propertyId":"editFormButtonActionType",
                "propertyName":"buttonActionType",
                "label": "Button Action", 
                "options":[
                  {"Submit":"Submit"},
                  {"Reset":"Reset"},
                  {"Post":"Post"},
                  {"Navigate":"Navigate"}
                ],
                "value": this.config.buttonActionType,           
                "type": "Select"
              },
              {
                "propertyId":"editFormButtonActionPostUrlTextbox",
                "propertyName":"buttonPostUrl",
                "label": "Post Url",
                "value": this.config.buttonPostUrl, 
                "type": "Textbox",
                "display":"none", 
                "prefix":"https://",
                "description":"ex: <pre>api.alliancelugin.io/dynamicform/xsddsse</pre>",               
                "events":[
                  {
                    "type":"editFormDisplay",                    
                    "target":"editFormButtonActionType",
                    "event":"change",
                    "handler":"editFormButtonActionTypeChangeListener"
                  }
                ]
              }
            ]
          },
          {
            "tabLabel": "Data",
            "tabId":"data",
            "components": [
              {
                "propertyName":"propertyName",
                "label": "Data Property",
                "value": this.config.propertyName, 
                "type": "Textbox"
              }
            ]
          }
        ]
      };
    }

    renderElement = (config, elementId)=>{

      //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"input-group"});       

        
        //<input aria-required="true" aria-labelledby="l-epx0fbk-textField d-epx0fbk-textField" id="epx0fbk-textField" value="" spellcheck="true" placeholder="Placeholder" autocomplete="off" lang="en" class="form-control" type="text" name="data[textField]" ref="input">
       
        const inputEl = this.renderRawElement(config, elementId);
        
        divInputGroup.appendChild(inputEl);
       
        const divElement = this.createElement("div", {"ref":"element"});
        divElement.appendChild(divInputGroup);

        return divElement;
        //===================================================================================
        //end render Input Group
        //===================================================================================
    }

    renderRawElement = (config, elementId)=>{   
      const propertyName = config.propertyName;

      const inputEl =  this.createElement("button", {"id":`${this.name}-${elementId}`, "class":"btn btn-primary btn-md", "type":"text", "ref":"button"});
      
      inputEl.innerHTML = config.buttonLabel;

      //Must implement!
      if (!this.isNullOrEmpty(config.propertyId))
      {
        inputEl.setAttribute("data-id", config.propertyId);
      }

      if (!this.isNullOrEmpty(propertyName))
      {
        inputEl.setAttribute("data-property",propertyName);
      }
      
      
       
      return inputEl;
    }



}
//export default Textboxv1;