class Textbox extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Textbox";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Textbox'; }
        if (config.label === void 0) { config.label = 'My Textbox'; }
        if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
        //if (this.isPropExists(config, 'labelPosition')) { config.labelPosition = 'top'; }
        if (config.labelWidth === void 0) { config.labelWidth = 30; }
        if (config.labelMargin === void 0) { config.labelMargin = 3; }
        if (config.value === void 0) { config.value = ""; }
        if (config.case === void 0) { config.case = "none"; }
       
        if (config.validation === void 0) {
          config.validation = {}
          config.validation.mandatory = false;

          if (config.validation.lengthCheck === void 0) {
            config.validation.lengthCheck = {};
            config.validation.lengthCheck.min = 0;
            config.validation.lengthCheck.max = 0;
          };
        };
        
      
        if (config.visibility === void 0) {
          config.visibility = {};

          if (config.visibility.simple === void 0) {
            config.visibility.simple = {};
            config.visibility.simple.target = "";
            config.visibility.simple.value = "";
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
                "propertyName":"label",
                "label": "Label",
                "placeholder": "My Textbox label",
                "description": "Enter the label for this text field", 
                "validation":{"mandatory": true, "lengthCheck": {"min": 0, "max":0}},
                "value":this.config.label,           
                "type": "Textbox"
              },
              {
                "propertyName":"labelPosition",
                "label": "Label Position",
                "placeholder": "Label Position",
                "description": "Set the position of the label", 
                "options":[
                  {"Top":"Top"},
                  {"Left-Left":"Left"}
                ],
                "value": this.config.labelPosition,           
                "type": "Select"
              },
              {
                "propertyName":"description",
                "label": "Descriptions (Optional)",
                "description": "Description for the textbox", 
                "type": "Textbox",
                "value": this.config.description
              },
              {
                "propertyName":"placeholder",
                "label": "Placeholder (Optional)",
                "placeholder": "Placeholder on the textbox",
                "type": "Textbox",
                "value": this.config.placeholder
              },
              {
                "propertyName":"prefix",
                "label": "Prefix (Optional)",
                "placeholder": "Prefix",
                "description": "Set the prefix infront of the text field, for ex: {RM} [textbox]", 
                "type": "Textbox",
                "value": this.config.prefix
              },
              {
                "propertyName":"suffix",
                "label": "Suffix (Optional)",
                "placeholder": "Suffix",
                "description": "Set the prefix infront of the text field, for ex: [textbox] {RM}", 
                "type": "Textbox",
                "value": this.config.suffix
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
            "tabLabel": "Validation",
            "tabId":"validate",
            "components": [
              {
                "propertyGroup":"validation",
                "propertyType":"mandatory",
                "propertyName":"validation-mandatory",
                "label": "This is mandatory field?",
                "value":this.config.validation.mandatory, 
                "type": "Checkbox"
              },
              {
                "propertyGroup":"validation",
                "propertyType":"lengthCheck",
                "propertyName":"validation-lengthCheck-min",
                "label": "Minimum Length (Optional)",
                "placeholder": "Minimum Length",  
                "type": "Numberbox",
                "value": this.config.validation.lengthCheck.min
              },
              {
                "propertyGroup":"validation",
                "propertyType":"lengthCheck",
                "propertyName":"validation-lengthCheck-max",
                "label": "Maximum Length (Optional)",
                "placeholder": "Maximum Length",
                "type": "Numberbox",
                "value": this.config.validation.lengthCheck.max
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
              },
              {
                "propertyName":"value",
                "label": "Default Value",
                "value": this.config.value, 
                "type": "Textbox"
              }
            ]
          },
          {
            "tabLabel": "Visibility",
            "tabId":"visibility",
            "components": [
              {
                "propertyName":"visibility-simple-target",
                "label": "Visibile only when element",
                "value": this.config.visibility.simple.target, 
                "type": "Select",
                "options":[],
                "render":{
                  "options":"all_elements_on_form"
                }
              },
              {
                "propertyName":"visibility-simple-value",
                "label": "has the value of",
                "value": this.config.visibility.simple.value, 
                "type": "Textbox"
              }
            ]
          }
        ]
      };
    }

    renderElement = (config, elementId)=>{
      //propertyName, elementId, prefix, suffix, placeholder, letterCase, required, val
      const prefix = config.prefix;
      const suffix = config.suffix;     
      const desc = config.description;
      //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"input-group"});       

        if (!this.isNullOrEmpty(prefix)){
          const divPrefix = this.createElement("div", {"ref":"prefix", "class":"input-group-text"})  //<div ref="prefix" class="input-group-text">prefix</div>
          divPrefix.innerHTML = prefix;
          divInputGroup.appendChild(divPrefix);
        }
        
        //<input aria-required="true" aria-labelledby="l-epx0fbk-textField d-epx0fbk-textField" id="epx0fbk-textField" value="" spellcheck="true" placeholder="Placeholder" autocomplete="off" lang="en" class="form-control" type="text" name="data[textField]" ref="input">
       
        const inputEl = this.renderRawElement(config, elementId);
        
        divInputGroup.appendChild(inputEl);

        if (!this.isNullOrEmpty(suffix))
        {
          const divSuffix = this.createElement("div", {"ref":"suffix", "class":"input-group-text"})  //<div ref="prefix" class="input-group-text">prefix</div>
          divSuffix.innerHTML = suffix;
          divInputGroup.appendChild(divSuffix);
        }

       
        const divElement = this.createElement("div", {"ref":"element"});
        divElement.appendChild(divInputGroup);

        if (!this.isNullOrEmpty(desc))
        {
          //<div class="form-text text-muted" id="d-egxfg08-checkbox">testew er ewrewr ewrewr ewre w</div>
          const divDesc = this.createElement("div", {"class":"form-text text-muted"});
          divDesc.innerHTML = desc;
          divElement.appendChild(divDesc);
        }

        return divElement;
        //===================================================================================
        //end render Input Group
        //===================================================================================
    }

    renderRawElement = (config, elementId)=>{   
      const propertyName = config.propertyName;
      const placeholder = config.placeholder;
      const letterCase = config.case;    
      const val = config.value;

      const inputEl =  this.createElement("input", {"id":`${this.name}-${elementId}`, "class":"form-control", "type":"text", "ref":"input"});
      
      //Must implement!
      if (!this.isNullOrEmpty(config.propertyId))
      {
        inputEl.setAttribute("data-id", config.propertyId);
      }

      if (!this.isNullOrEmpty(propertyName))
      {
        inputEl.setAttribute("data-property",propertyName);
      }
      
      if (!this.isNullOrEmpty(val))
      {
        inputEl.setAttribute("value",val);
      }

      switch (letterCase)
      {
        case "upper":
          inputEl.classList.add("text-uppercase");
          break;
        case "lower":
          inputEl.classList.add("text-lowercase");
          break;
        case "capital":
          inputEl.classList.add("text-capitalize");
          break;
      }

      if (!this.isNullOrEmpty(placeholder))
      {
        inputEl.setAttribute("placeholder", placeholder);
      }

       
      if (this.isPropExists(config,"validation"))
      {
        
        if (this.isPropExists(config.validation, "mandatory"))
        {
          inputEl.classList.add("mandatory");
        }
        if (this.isPropExists(config.validation, "lengthCheck"))
        {
          
          if (typeof Number(config.validation.lengthCheck.min) == 'number'){
            if (+config.validation.lengthCheck.min > 0)
              inputEl.setAttribute("minLength", config.validation.lengthCheck.min);
          }

          if (typeof Number(config.validation.lengthCheck.max) == 'number'){
            
            if (+config.validation.lengthCheck.max > 0){
              inputEl.setAttribute("maxLength", config.validation.lengthCheck.max);
            }
          }
        }

      }
       
      return inputEl;
    }

    //============================================================================
    //Custom Event Listener
    //===========================================================================
    static editFormButtonActionTypeChangeListener=(listenEvent, targetElementId, sourceElementId)=>{
      const targetElement = document.querySelector(`[data-id="${targetElementId}"]`);
      //if (targetElement==null) throw `[data-id=${ev.target}] not found! Did renderEditForm execute before attach events?`;
      const sourceElement = document.querySelector(`[data-id="${sourceElementId}"]`);
      //if (sourceElement==null) throw `[data-id=${component.propertyId}] not found! Did renderEditForm execute before attach events?`;
      //targetElement.addEventListener(listenEvent, Textbox.editFormButtonActionTypeChangeHandler(targetElement,sourceElement));
     
      targetElement.addEventListener(listenEvent, function(e){
          Textbox.editFormButtonActionTypeChangeHandler(targetElement, sourceElement);          
      });
      targetElement.dispatchEvent(new Event('change'));
    }

    static editFormButtonActionTypeChangeHandler =(targetElement, sourceElement)=>{
      const souceComponent = sourceElement.closest("div.builder-component");
        
        if (targetElement.value==='Post')
        {
          souceComponent.style.display = 'block';
        }
        else
        {
          souceComponent.style.display = 'none';
        }
    }
}
