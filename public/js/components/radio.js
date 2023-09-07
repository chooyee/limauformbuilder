class Radio extends Base
{    
	constructor(jsonConfig) {   
		super();     
		this.group = "Basic"
		this.name = "Radio";
		this.version = "v1";
		if (jsonConfig!== void 0)        
			this.config = JSON.parse(jsonConfig);        
		else
			this.config =  {};       
	 
		let config = this.config;
		if (config.propertyName === void 0) { config.propertyName = ''; }
		if (config.type === void 0) { config.type = 'Radio'; }
		if (config.label === void 0) { config.label = 'My Radio'; }
		if (config.labelPosition === void 0) { config.labelPosition = 'top'; }
		if (config.labelWidth === void 0) { config.labelWidth = 30; }
		if (config.labelMargin === void 0) { config.labelMargin = 3; }
		if (config.options === void 0) { config.options = ["option 1", "option 2", "option 3"]; }
		if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
		if (config.value === void 0) { config.value = ""; }
		if (config.validation === void 0) {
			config.validation = {}
			config.validation.mandatory = false;

		};
	    
		//this.editFormJson = this.getEditFormJson();
	}

	getEditFormJson = () =>{
		return {
		  "label": "Radio component",
		  "tabs": [
		  {
			  "tabLabel": "Display",
			  "tabId":"home",
			  "components": [
				{
				  "propertyName":"label",
				  "label": "Label",
				  "placeholder": "Label for this element",
				  "description": "Enter the label for this element",     
				  "validate": {"mandatory": true},          
				  "value": this.config.label, 
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
				  "label": "Descriptions",
				  "type": "Textbox",
				  "value": this.config.description
				}
			  ]
			},
			{
			  "tabLabel": "Data",
			  "tabId":"data",
			  "components": [
				{                
				  "propertyId":"targetEditFormOptions",
				  "propertyName":"options",
				  "label": "Dropdown Options",
				  "description": "Enter the dropdown options",
				  "type": "Textarea",
				  "value":this.optionsToText(this.config.options)
				},
				{
				  "propertyId":"SourceEditFormOptions",                
				  "propertyName":"value",
				  "label": "Default Select",
				  "description": "Enter the dropdown default",
				  "type": "Select",
				  "options":"No default\n" + this.optionsToText(this.config.options),
				  "value":this.config.value,
				  "events":[
					  {
						  "type":"listenToTarget",                    
						  "target":"targetEditFormOptions",
						  "event":"input",
						  "handler":"editFormDefaultValueListener"
					  }
				  ]
				}
			  ]
			}
		  ]
		};
	}


	optionsToText = function(options)
	{
		if (Array.isArray(options))
			return options.join("\n");
		else 
		{
			return options;
		}
	}


	renderElement = (config, elementId)=>{
		//propertyName, elementId, placeholder, options, required
	   
		const desc = config.description;
		//===================================================================================
		//render Input Group
		//===================================================================================
	   
		const divInputGroup = this.createElement("div", {"class":"input-group"});       

		const inputEl = this.renderRawElement(config, elementId);
	   
		divInputGroup.appendChild(inputEl);
	  
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
		let options = config.options;
		const defaultValue = config.value;
		const inputEl = this.createElement("select", {"data-property":propertyName,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"text", "ref":"input"});
		
		if (!this.isNullOrEmpty(config.propertyId))
		{
		inputEl.setAttribute("data-id", config.propertyId);
		}

		if (this.trueTypeOf(options)=="string")
		{
			options = options.split("\n");
		}

		options.forEach(option => {
			if (this.trueTypeOf(option)=="string")
			{
				inputEl.add(new Option(option, option));  
			}
			else{
				const key = Object.keys(option)[0];
				inputEl.add(new Option(option[key],key));  
			}
		});

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
		}

		if (!this.isNullOrEmpty(defaultValue)) {this.setDefaultOption(inputEl, defaultValue)}
		return inputEl;
	}

	setDefaultOption(selectElement, defaultValue) {
	 
	  	if (selectElement) {
			for (let i = 0; i < selectElement.options.length; i++) {
				const option = selectElement.options[i];
				if (option.value === defaultValue) {
					option.selected = true;
					option.setAttribute("selected", true);
					break;
				}
			}
	  	}
	}

	//========================================================================
	//Custom Event Handler
	//=========================================================================
	static editFormDefaultValueListener=function(listenEvent, targetElementId, sourceElementId){
	 
		const targetElement = document.querySelector(`[data-id="${targetElementId}"]`);
		//if (targetElement==null) throw `[data-id=${ev.target}] not found! Did renderEditForm execute before attach events?`;
		const sourceElement = document.querySelector(`[data-id="${sourceElementId}"]`);
		//if (sourceElement==null) throw `[data-id=${component.propertyId}] not found! Did renderEditForm execute before attach events?`;
		Select.removeListeners(targetElement, listenEvent);
		
		targetElement.addEventListener(listenEvent, function(e){
			let options = e.target.value;
			sourceElement.innerHTML = "";
			sourceElement.add(new Option("No default", "No default"));
			if (Select.trueTypeOf(options)=="string")
			{
				options = options.split("\n");
			}
			options.forEach(option => {
				if (Select.trueTypeOf(option)=="string")
				{
					sourceElement.add(new Option(option, option));  
				}
				else{
					const key = Object.keys(option)[0];
					sourceElement.add(new Option(option[key],key));  
				}
			});
		});
  }



}
//export default Textboxv1;