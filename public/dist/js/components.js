class Base
{    
	constructor() {        
	   this.builderEditComponents = {};
	   this.elementId =  this.getShortUUID();
	}

	Test(){
	  const objConfig = {}; 
	  objConfig.group = this.group;
	  objConfig.name = this.name;
	  objConfig.version = this.version;
	  objConfig.config = this.config;     
	  console.log(JSON.stringify(objConfig));
	}

	createElement(elementType, attrs={})
	{
		const el = document.createElement(elementType);
		this.appendAttr(el, attrs);
		return el;
	}

	appendAttr(el, attrs = {})
	{
		for (const [k, v] of Object.entries(attrs)) {
			el.setAttribute(k, v);
		}
		return el;
	}

	appendChildren(el, children = [])
	{
		for (const child of children) {
			el.appendChild(child);
		}
		return el;
	}

	getUUID()
	{
	  return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	getShortUUID(length = 8) {
		let uuid = '';
		const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		
		// Generate the first character (alphabet)
		uuid = alphabet[Math.floor(Math.random() * alphabet.length)];

		for (let i = 0; i < length; i++) {                  
		  uuid += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
		}
		
		return uuid;
	
	}

	showTooltip(element) {
		const tooltipText = element.getAttribute('data-tooltip');
		
		// Create tooltip element
		const tooltip = document.createElement('div');
		
		tooltip.classList.add('tooltip');
		tooltip.textContent = tooltipText;
	  
		// Calculate tooltip position
		const rect = element.getBoundingClientRect();
		tooltip.style.top = `${ rect.top + window.scrollY - tooltip.offsetHeight}px`;
		tooltip.style.left = `${rect.left + window.scrollX + (element.offsetWidth - tooltip.offsetWidth) / 2}px`;
		tooltip.style.position = 'absolute';
		tooltip.style.margin = '0 1rem 1rem 1rem';
		//console.log (tooltip.style.top);
		// Append tooltip to the body
		document.body.appendChild(tooltip);
	  
		//Remove the tooltip after a delay
		setTimeout(() => {
		  tooltip.remove();
		}, 2000); // Adjust the delay as needed
	}

	isPropExists(obj, propName){
	  return (obj.hasOwnProperty(propName) && obj[propName]!==null && obj[propName]!==undefined)
	}

	isNullOrEmpty(value) {
	  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);
	}

	renderBuilderEditComponent(){        

	  // return `<div data-noattach="true" class="component-btn-group">
	  //   <div ref="removeComponent" class="btn btn-xxs btn-danger component-settings-button component-settings-button-remove" tabindex="-1" aria-label="Remove button. Click to remove component from the form" role="button">
	  //     <i class="fa fa-remove bi bi-trash"></i>
	  //   </div>       
	  //   <div ref="editComponent" class="btn btn-xxs btn-secondary component-settings-button component-settings-button-edit" tabindex="-1" aria-label="Edit button. Click to open component settings modal window" role="button">
	  //     <i class="fa fa-cog bi bi-gear"></i>
	  //   </div>
	  // </div>`
	  const divGroup = this.createElement("div", {"class":"component-btn-group"})
	  const divRemoveComponent = this.createElement("div",{"ref":"removeComponent", "class":"btn btn-xxs btn-danger component-settings-button component-settings-button-remove", "tabindex":"-1", "aria-label":"Remove button. Click to remove component from the form", "role":"button"});
	  divRemoveComponent.appendChild(this.createElement("i",{"class":"fa fa-remove bi bi-trash"}));

	  const divEditComponent = this.createElement("div",{"ref":"editComponent", "class":"btn btn-xxs btn-success component-settings-button component-settings-button-edit", "tabindex":"-1", "aria-label":"Edit button. Click to open component from the form", "role":"button"});
	  divEditComponent.appendChild(this.createElement("i",{"class":"fa fa-cog bi bi-sliders"}));

	  divGroup.appendChild(divRemoveComponent);
	  divGroup.appendChild(divEditComponent);

	  this.builderEditComponents["edit"] = divEditComponent;
	  this.builderEditComponents["remove"] = divRemoveComponent;
	  return divGroup;
	}

	
	getBuilderEditComponent(btnType){
	  return this.builderEditComponents[btnType];
	}
   
	trueTypeOf(obj){
	  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	};


	renderDomElement(){
		let config = this.config;

		const elementId = this.elementId;
		//Main div component
		let div = this.createElement('div', {"id":elementId,"tabindex":"-1","ref":"dragComponent", "class":"builder-component"});

		
		//Edit component
		//div.appendChild(this.getBuilderEditComponent());
		if (config.formBuilderMode){
			const dragGrouper = this.createElement("div",{"class":"drag-helper"});
			dragGrouper.appendChild(this.createElement("i",{"class":"fa fa-arrows-move bi bi-arrows-move"}));
			div.appendChild(dragGrouper);
			div.appendChild(this.renderBuilderEditComponent());
		}

		//div component
		//<div ref="component" class="mb-2 formio-form-group has-feedback formio-component formio-component-textfield formio-component-textField limau, ice" id="enuyfr7">
		let componentDiv = this.createElement('div',{"id": "component-" + elementId,"ref":"component", "class":"mb-2", "data-component-type":this.config.type});

		div.appendChild(componentDiv);
	  
	  	const mainElement = this.renderElement(config, elementId);

		//label position
		if ((!this.isNullOrEmpty(config.label)) && (config.labelPosition.toLowerCase()!=='none')){
			const label = this.renderLabel(elementId, config.label);
			
			if (this.isPropExists(config, "tooltip"))
			{
				label.appendChild(this.renderTooltip(config.tooltip));
			}
			
			//console.log(config.labelPosition)
			if (config.labelPosition.toLowerCase()=='top') 
			{       
				componentDiv.appendChild(label);
				componentDiv.appendChild(mainElement);
			}
			else if (config.labelPosition.toLowerCase()=='left-left') 
			{
				const divFieldLabel = this.renderFieldDiv(config.labelWidth, config.labelMargin);        
				divFieldLabel.appendChild(label);       
			
				const divFieldContent = this.renderFieldDiv(100 - (config.labelWidth + config.labelMargin));
				divFieldContent.appendChild(mainElement);
						
				const divFieldWrapper = this.createElement("div", {"style":"display:flex"});
				divFieldWrapper.appendChild(divFieldLabel);
				divFieldWrapper.appendChild(divFieldContent);
				componentDiv.appendChild(divFieldWrapper);
			}
		}
		else{
			// console.log("in")
			// console.log(mainElement)
			componentDiv.appendChild(mainElement);
		}
	  
		//==============================================================
		//Display behavior
		//===============================================================
		if (config.display==='none')
		{
			div.style.display='none';
		}
		// if (!this.isNullOrEmpty(config.displayBehavior))
		// {
		// 	eval(`${this.type}.${config.displayBehavior}()`)
		// }
	  	return div;
	}  

	renderLabel(elementId, labelText){
	  const label = this.createElement('label');
	  const labelId = `label-${elementId}`;
	  const targetElement = `${this.name}-${elementId}`;
	  const cssClass = "col-form-label";
	  this.appendAttr(label, {"id":labelId,"for":targetElement, "class":cssClass, "ref":"label"});
	  label.innerHTML = labelText;
	  return label;
	}

	renderTooltip = (tooltipText) =>{
	  //<i data-tooltip="tooltip" class="fa fa-question-sign bi bi-question-circle text-muted" tabindex="0" ref="tooltip" aria-expanded="false"></i>
	  const i = this.createElement('i');
	  const cssClass = "fa fa-question-sign bi bi-question-circle text-muted";
	  this.appendAttr(i, {"data-tooltip":tooltipText, "aria-expanded":"false", "tabindex":"0", "class":cssClass, "ref":"tooltip"});
	  i.addEventListener('mouseover', (e) => {
		this.showTooltip(i);
	  });

	  i.addEventListener('mouseleave', () => {
		this.removeTooltip(i);
	  });
	  return i;
	}

	renderFieldDiv = (labelWidth, marginPercent) =>{
	  //<div style="flex: 30; margin-right: 3%;" class="field-label"></div>
	  let style = `flex: ${labelWidth};`
	  if (marginPercent>0) {
		style +=`margin-right: ${marginPercent}%`
	  };

	  return this.createElement('div',{"style":style, "class":"field-label"});

	}

	createInstance(classNameString, json)
	{
	  var obj = new (eval(classNameString))(json);
	  return obj
	}

	//=============================================================================================
	// Edit Form
	//=============================================================================================
	renderEditForm = () =>{
		const formData = this.getEditFormJson();
        //<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        const ulTabHeader = this.createElement("ul", {"class":"nav nav-pills mb-3", "id":"pills-tab", "role":"tablist"})
        // <div class="tab-content" id="pills-tabContent">
        //     <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">...</div>
        //     <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">...</div>
        //     <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">...</div>
        //   </div>
        const divTabContentContainer = this.createElement("div", {"class":"tab-content", "id":"pills-tabContent"});
    
        let i = 0;
        formData.tabs.forEach(tab => {
            let active = i==0? true:false;

            // console.log("Tab Label:", tab.tabLabel);
            // console.log("Tab ID:", tab.tabId);
            //Render tab header
            ulTabHeader.innerHTML += this.renderTabHeader(tab.tabId, tab.tabLabel, active);

            const tabContainer = this.renderTabContentContainer(tab.tabId, active);
            // Loop through components in the tab
            tab.components.forEach(component => {
                //console.log("Type:", component.type);
                const el = this.createInstance(component.type, JSON.stringify(component));
                tabContainer.appendChild(el.renderDomElement());
            });

            divTabContentContainer.appendChild(tabContainer);
            i++;
        });
        const container = this.createElement("div", {"ref":"tabContainer"});
        container.appendChild(ulTabHeader);
        container.appendChild(divTabContentContainer);

        return container;
    }

	attachComponentEventListener = (thisEl)=>{

	}

	executeButtonSave(){
		return;
	}
	
    attachEditFormEvent(){
        const formData = this.getEditFormJson();
        formData.tabs.forEach(tab => {
           
            tab.components.forEach(component => {
				if (component.hasOwnProperty("events"))
				{
					const events = component.events;
					events.forEach(ev =>{                                                  
						//console.log(`${component.type}.${ev.handler}('${ev.event}', '${ev.target}', '${component.propertyId}')`);
						eval(`${component.type}.${ev.handler}('${ev.event}', '${ev.target}', '${component.propertyId}')`);
					});
				}
               
            });
        });
      
    }
    
    renderTabHeader(tabId, tabLabel, active){
        let activeStr ="";
        if (active)
        {
            activeStr = "active";
        }
        return `<li class="nav-item" role="presentation">
                    <button class="nav-link ${activeStr}" id="pills-${tabId}-tab" data-bs-toggle="pill" data-bs-target="#pills-${tabId}" type="button" role="tab" aria-controls="pills-${tabId}" aria-selected="${active}">${tabLabel}</button>
                </li>`;
    }

    renderTabContentContainer=(tabId, active)=>{
        let activeStr ="";
        if (active)
        {
            activeStr = "show active";
        }
        //<div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">...</div>;
        return this.createElement("div", {"class":"tab-pane fade " + activeStr, "id":`pills-${tabId}`, "role":"tabpanel", "aria-labelledby":`pills-${tabId}-tab`})
    }

	//=============================================================================================
	//Static methods
	//=============================================================================================
	static removeListeners = (targetElement, eventType)=>
	{
		const listeners = targetElement.cloneNode(true).listeners;
		
		if (listeners) {
			listeners[eventType] = [];
		}
		// Iterate through the list and remove each listener
		// if (listeners) {
		// 	listeners.forEach(listener => {
		// 		element.removeEventListener(eventType, listener.listener);
		// 	});
		// }
	}
	static trueTypeOf =  (obj)=> {
	  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	};
}


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
                "propertyName":"buttonClass",
                "label": "Button Color Type",
                "value":this.config.buttonClass,       
                "description": "Select the type for the button", 
                "options":[
                {"primary":"primary"},
                {"secondary":"secondary"},
                {"success":"success"},
                {"danger":"danger"},
                {"warning":"warning"},
                {"info":"info"},
                {"light":"light"},
                {"dark":"dark"}
                ],    
                "type": "Select"
              },        
              {
                "propertyName":"buttonSize",
                "label": "Button Size",
                "value":this.config.buttonSize,       
                "description": "Select the size for the button", 
                "options":[
                {"md":"Medium"},
                {"lg":"Large"},
                {"sm":"Small"}
                ],    
                "type": "Select"
              },        
              {
                "propertyName":"position",
                "label": "Header Position",
                "value":this.config.position,       
                "description": "Select the position for the header", 
                "options":[
                {"left":"left"},
                {"center":"center"},
                {"right":"right"}
                ],    
                "type": "Select"
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
       
        const divInputGroup = this.createElement("div", {"class":"d-flex"});       
        if (config.position ==='center')
        {
          divInputGroup.classList.add("justify-content-center", "align-items-center")
        }
        else if (config.position ==='right')
        {
          divInputGroup.classList.add("justify-content-end", "align-items-right")
        }
        
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

      const inputEl =  this.createElement("button", {"id":`${this.name}-${elementId}`, "class":"btn", "type":"text", "ref":"button"});
      inputEl.classList.add(`btn-${config.buttonClass}`)

      inputEl.classList.add(`btn-${config.buttonSize}`)

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

class CardImage extends Base
{    
	constructor(jsonConfig) {   
		super();     
		this.group = "Basic"
		this.name = "CardImage";
		this.version = "v1";
		if (jsonConfig!== void 0)        
		  this.config = JSON.parse(jsonConfig);        
		else
		  this.config =  {};       
	 
		//console.log(this.config)
		let config = this.config;
		if (config.propertyName === void 0) { config.propertyName = ''; }
		if (config.type === void 0) { config.type = 'CardImage'; }
		if (config.position === void 0) { config.position = 'left'; }
		if (config.image === void 0) { config.image = ""; }
		if (config.letterCase === void 0) { config.letterCase = "none"; }
		if (config.bodyText === void 0) { config.bodyText = ""; }
		if (config.headerText === void 0) { config.headerText = ""; }
		if (config.imageWidth === void 0) { config.imageWidth = ""; }
		
		if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
		//this.editFormJson = this.getEditFormJson();
	}

	getEditFormJson = () =>{
	  return {
		"label": "Card Image Component Edit Form",
		"tabs": [
		   {"tabLabel": "Display",
			 "tabId":"home",
			"components": [   
				{
					"propertyId" : "cardImageUpload",
					"propertyName":"image",
					"label": "Image",
					"description": "Select Image",
					"image":this.config.image,
					"type": "ImageUpload"
				},           
				{
					"propertyName":"bodyText",
					"label": "Image Body Text (optional)",
					"placeholder": "Image body text",
					"description": "Enter the text for this image card (optional)",
					"value":this.config.bodyText,           
					"type": "Textarea"
				},
				{
					"propertyName":"position",
					"label": "Header Position",
					"value":this.config.position,       
					"description": "Select the position for the header", 
					"options":[
					{"left":"left"},
					{"center":"center"},
					{"right":"right"}
					],    
					"type": "Select"
				}, 
				{ 
					"propertyName":"imageWidth",
					"label": "Image Width",  
					"type": "Numberbox",
					"suffix":"rem",
					"value": this.config.imageWidth
				},
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
	   
		const divInputGroup = this.createElement("div", {"class":"card d-flex"});       

		if (config.position ==='center')
		{
			divInputGroup.classList.add("justify-content-center", "align-items-center")
		}
		else if (config.position ==='right')
		{
			divInputGroup.classList.add("justify-content-end", "align-items-right")
		}
		const inputEl = this.renderRawElement(config, elementId);
		
		divInputGroup.appendChild(inputEl);

	 
		if (!this.isNullOrEmpty(config.bodyText))
		{
			//<div class="form-text text-muted" id="d-egxfg08-checkbox">testew er ewrewr ewrewr ewre w</div>
			const cardBody = this.createElement("div", {"class":"card-body"});
			const pbody = this.createElement("p", {"class":"card-text d-flex"});     
			if (config.position ==='center')
			{
				pbody.classList.add("justify-content-center", "align-items-center")
			}
			else if (config.position ==='right')
			{
				pbody.classList.add("justify-content-end", "align-items-right")
			}

			switch (config.letterCase)
			{
				case "upper":
					pbody.classList.add("text-uppercase");
				break;
				case "lower":
					pbody.classList.add("text-lowercase");
				break;
				case "capital":
					pbody.classList.add("text-capitalize");
				break;
			}

			pbody.innerHTML = config.bodyText;
			cardBody.appendChild(pbody);
			divInputGroup.appendChild(cardBody);
		}

		return divInputGroup;
		//===================================================================================
		//end render Input Group
		//===================================================================================
	}

	renderRawElement = (config, elementId)=>{   
		const propertyName = config.propertyName;

		const inputEl =  this.createElement("img", {"id":`${this.name}-${elementId}`, "class":"card-image-top img-fluid", "src":config.image, "ref":"input"});
		
		if (!this.isNullOrEmpty(config.imageWidth))
		{
			inputEl.style.width = config.imageWidth + "rem";
		}
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

	executeButtonSave = async ()=>{
		//const imageUrl = "blob:http://localhost:8080/8db60f95-ed66-4a48-8820-0adc648d403c";

		const imageUpload = document.querySelector('[data-id="cardImageUpload"]');
		//console.log(imageUpload)
		const preview = document.getElementById(`${imageUpload.id}-preview`);
		//console.log(preview)
		const anchor = preview.querySelector("a");
		if (anchor)
		{
			const blobImageUrl = anchor.getAttribute("href");
			//console.log (imageUrl);
			this.config.blobImageUrl = blobImageUrl;

			const publicImgUrl =  await this.uploadImageToApi(blobImageUrl, "/api/v1/upload");
			this.config.image =  location.protocol + '//' + location.host + "/" + publicImgUrl;
			
			console.log (publicImgUrl);
			return publicImgUrl;
		}
		else{
			const img = preview.querySelector("img");
			this.config.image = img.src
			//console.log(this.config.image)
			return this.config.image;
		}

	}

	uploadImageToApi(imageUrl, apiEndpoint) {

		return fetch(imageUrl)
		.then((response) => response.blob())
		.then((blob) => {
			const formData = new FormData();
			formData.append("image", blob, blob.name);
			
			return fetch(apiEndpoint, {
				method: "POST",
				body: formData,
				})
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					//console.log("uploading image");
					return response.json(); // You can handle the API response here
				})
				.then((data) => {
					//console.log("Image uploaded successfully:", data);
					return data.img;
				})
				.catch((error) => {
					console.error("Error uploading image:", error);
				});
		});
	  }

}

class Checkbox extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Checkbox";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = 'Checkbox'; }
        if (config.type === void 0) { config.type = 'Checkbox'; }
        if (config.label === void 0) { config.label = 'My Checkbox'; }
        if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
        if (config.labelWidth === void 0) { config.labelWidth = 30; }
        if (config.labelMargin === void 0) { config.labelMargin = 3; }
        if (config.value === void 0) { config.value = ""; }
       
        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
        
    }

    getEditFormJson = () =>{
      return {
        "label": "Checkbox Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [
              {
                "propertyName":"label",
                "label": "Label",
                "labelPosition":"Left-Left",
                "description": "Enter the label the checkbox",     
                "validate": {
                  "mandatory": true,
                  "lengthCheck":{"min":0, "max":0}
                },
                "value":this.config.label,           
                "type": "Textbox"
              }
            ]
          },
          {
            "tabLabel": "Data",
            "tabId":"Data",
            "components": [
              {
                "propertyName":"value",
                "label": "Checked by default",
                "type": "Checkbox",
                "value":this.config.value
              }
            ]
          }
        ]
      };
      
    }

    renderDomElement = ()=>{
      let config = this.config;

      const elementId = this.elementId;
      //Main div component
      let div = this.createElement('div', {"id":elementId,"tabindex":"-1","ref":"dragComponent", "class":"builder-component"});

       //Edit component
      //div.appendChild(this.getBuilderEditComponent());
      if (config.formBuilderMode){
        div.appendChild(this.renderBuilderEditComponent());
      }

      //div component
      //<div ref="component" class="mb-2 formio-form-group has-feedback formio-component formio-component-textfield formio-component-textField limau, ice" id="enuyfr7">
      let componentDiv = this.createElement('div',{"id": "component-" + elementId,"ref":"component", "class":"mb-2"});

      div.appendChild(componentDiv);

      //label position
      //const label = this.renderLabel(elementId, config.label);
      const mainElement = this.renderElement(config, elementId);
      if (this.isPropExists(config, "tooltip"))
      {
        label.appendChild(this.renderTooltip(config.tooltip));
      }
      
     
      componentDiv.appendChild(mainElement);
      return div;
    }  


    renderElement = (config, elementId)=>{
        //propertyName, elementId, placeholder, options, required
       
        const desc = config.description;
        //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"form-check"});       

        const inputEl = this.renderRawElement(config, elementId);        
        divInputGroup.appendChild(inputEl);

        const chkLabel = this.createElement("label", {"class":"form-check-label", "for":`${this.name}-${elementId}`});
        const span = this.createElement("span");
        span.innerHTML = config.label;
        chkLabel.appendChild(span);
        divInputGroup.appendChild(chkLabel);

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
      const defaultValue = config.value;
      const inputEl = this.createElement("input", {"data-property":propertyName,"id":`${this.name}-${elementId}`, "class":"form-check-input", "type":"checkbox", "ref":"input"});
      if (!this.isNullOrEmpty(config.propertyId))
      {
        inputEl.setAttribute("data-id", config.propertyId);
      }

      if (!this.isNullOrEmpty(defaultValue)) {this.setCheckboxState(inputEl, defaultValue)}
      return inputEl;
    }

    setCheckboxState(checkboxElement, checked) {
      
      if (checkboxElement) {
        checkboxElement.checked = checked;
      }
    }
}

class Column extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.version = "v1";
        this.name = "Column";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        let config = this.config;
		if (config.columns === void 0) {config.columns = [];}
        if (config.propertyName === void 0) { config.propertyName = 'Column'; }
        if (config.type === void 0) { config.type = 'Column'; }
        if (config.numOfColumns === void 0) { config.numOfColumns = 3; }
        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
        
    }

    getEditFormJson = () =>{
      return {
        "label": "Column Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [ 
              {
                "propertyName":"position",
                "label": "Position",
                "description": "Set the position of the label", 
                "options":[
					{"left":"left"},
					{"center":"center"},
					{"right":"right"}
				],
                "value": this.config.position,           
                "type": "Select"
              },
			  {
                "propertyName":"numOfColumns",
                "label": "Number of Columns",
                "description": "Set number of columns", 
                "options":["1","2","3","4","5","6","7","8","9","10"],
                "value": this.config.numOfColumns,           
                "type": "Select"
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
      //propertyName, elementId, prefix, suffix, placeholder, letterCase, rows, required
     
    
      //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"d-flex"});  

		if (config.position ==='center')
        {
          divInputGroup.classList.add("justify-content-center", "align-items-center")
        }
        else if (config.position ==='right')
        {
          divInputGroup.classList.add("justify-content-end", "align-items-right")
        }

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
		const componentId = `${this.name}-${elementId}`;
		const container =  this.createElement("div", {"data-property":propertyName,"id":componentId, "class":"container", "ref":"input"});
		
		if (!this.isNullOrEmpty(config.propertyId))
		{
			container.setAttribute("data-id", config.propertyId);
		}
      
        const row =  this.createElement("div", {"id":`row-${elementId}-0`,"data-parent":componentId, "class":"row", "ref":"row"});

		config.columns = [];
		for (let i =0;i<config.numOfColumns;i++)
		{
			const colContainerId = `col-${elementId}-${i}`;
			const col = this.createElement("div", {"class":"col form-column","data-parent":componentId, "ref":"col"});
			const colDropContainer = this.createElement("div", {"id":colContainerId, "data-parent":componentId, "class":"col-drop-container builder-components","ref":"container", "data-col":i});
			//<div data-position="0" data-noattach="true" role="alert" style="text-align:center;" class="builder-component drag-and-drop-alert alert alert-info no-drop">
			//Drag and Drop a form component
			//</div>

      if (config.formBuilderMode){
        const div = this.createElement("div",{"data-position":"0", "data-noattach":"true", "role":"alert", "style":"text-align:center;", "class":"builder-component drag-and-drop-alert alert alert-info no-drop"})
        div.innerHTML = "Drag and Drop a form component";
        colDropContainer.appendChild(div);
      }
			col.appendChild(colDropContainer);
			row.appendChild(col);

			config.columns.push({"element-type":"container","components":[]});
		}
		
		container.appendChild(row);

		this.dropZonEventHandler(container);
      	return container;
    }

	dropZonEventHandler(container){
		const dropzones = container.querySelectorAll(".col-drop-container");
		dropzones.forEach((zone) => {
			zone.addEventListener("dragover", (e) => {
			  dropZoneDragoverEventHandler(zone, e);
			});
	
			zone.addEventListener("dragenter", (e) => { });
	
			zone.addEventListener("dragleave", (e) => {  
			  dropZoneDragleaveEventHandler(zone, e);
			});
	
			zone.addEventListener("drop", (e) => {
			  console.log("drop");
			  //curZone = zone;
			  elementDropped(zone, e);  
			 
			});
	
		});
	}

}

class DateTimeInput extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "DateTimeInput";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'DateTimeInput'; }
        if (config.label === void 0) { config.label = 'My DateTimeInput'; }
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
        "label": "Date Time Input Field Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"label",
                "label": "Label",
                "placeholder": "My Date/Time text",
                "description": "Enter the label for this date/time field", 
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

      const inputEl =  this.createElement("input", {"id":`${this.name}-${elementId}`, "class":"form-control", "type":"date", "ref":"input"});
      
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

class Header extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Header";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Header'; }
        if (config.label === void 0) { config.label = ''; }
        //if (this.isPropExists(config, 'labelPosition')) { config.labelPosition = 'top'; }
        if (config.labelWidth === void 0) { config.labelWidth = 30; }
        if (config.labelMargin === void 0) { config.labelMargin = 3; }
        if (config.value === void 0) { config.value = ""; }
        if (config.leftterCase === void 0) { config.leftterCase = "none"; }
       
        
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
                "propertyName":"headerType",
                "label": "Header Type",
                "value":this.config.headerType,       
                "description": "Select the header type", 
                "options":[
                {"h1":"H1"},
                {"h2":"H2"},
                {"h3":"H3"},
                {"h4":"H4"},
                {"h5":"H5"}
                ],    
                "type": "Select"
              },        
              {
                "propertyName":"position",
                "label": "Header Position",
                "value":this.config.position,       
                "description": "Select the position for the header", 
                "options":[
                {"left":"left"},
                {"center":"center"},
                {"right":"right"}
                ],    
                "type": "Select"
              },        
              {
                "propertyName":"value",
                "label": "My Header",
                "description": "Enter the header",
                "value":this.config.value,           
                "type": "Textbox"
              },
              {
                "propertyName":"letterCase",
                "label": "Lettercase",
                "description": "Select the letter case for the header",
                "value":this.config.letterCase, 
                "options":[
                  {"none":"None"},
                  {"upper":"Uppercase"},
                  {"lower":"Lowercase"},
                  {"capital":"Capital"}
                ],    
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
  
      const desc = config.description;
      //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"d-flex"});       
        if (config.position ==='center')
        {
          divInputGroup.classList.add("justify-content-center", "align-items-center")
        }
        else if (config.position ==='right')
        {
          divInputGroup.classList.add("justify-content-end", "align-items-right")
        }
        //<input aria-required="true" aria-labelledby="l-epx0fbk-textField d-epx0fbk-textField" id="epx0fbk-textField" value="" spellcheck="true" placeholder="Placeholder" autocomplete="off" lang="en" class="form-control" type="text" name="data[textField]" ref="input">
       
        const inputEl = this.renderRawElement(config, elementId);
        
        divInputGroup.appendChild(inputEl);

       
       
        const divElement = this.createElement("div", {"ref":"element"});
        divElement.appendChild(divInputGroup);

        if (!this.isNullOrEmpty(desc))
        {
          //<div class="form-text text-muted" id="d-egxfg08-checkbox">testew er ewrewr ewrewr ewre w</div>
          const divDesc = this.createElement("div", {"class":"d-flex form-text text-muted"});
          if (config.position ==='center')
          {
            divDesc.classList.add("justify-content-center", "align-items-center")
          }
          else if (config.position ==='right')
          {
            divDesc.classList.add("justify-content-end", "align-items-right")
          }
          //const pDesc = this.createElement("p", {"class":"form-text text-muted"});
          divDesc.innerHTML = desc;
          //divDesc.appendChild(pDesc);
          divElement.appendChild(divDesc);
        }

        return divElement;
        //===================================================================================
        //end render Input Group
        //===================================================================================
    }

    renderRawElement = (config, elementId)=>{   
      const propertyName = config.propertyName;
      const letterCase = config.letterCase;    
      const val = config.value;

      const inputEl =  this.createElement(this.config.headerType, {"id":`${this.name}-${elementId}`, "class":"mb-3", "ref":"input"});
      
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
        inputEl.innerHTML= val;
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

      return inputEl;
    }

    //============================================================================
    //Custom Event Listener
    //===========================================================================

}

function ImageProcessor(imagePreview, fileSelector) {
	this.refs = {};
	// this.refs.imagePreviews = document.querySelector('#previews');
	// this.refs.fileSelector = document.querySelector('input[type=file]');
	this.refs.imagePreviews =imagePreview;
	this.refs.fileSelector = fileSelector;
}
  
ImageProcessor.prototype.addImageBox = function (container) {
	container.innerHTML = "";
	let imageBox = document.createElement("div");
	let progressBox = document.createElement("progress");
	imageBox.appendChild(progressBox);
	container.appendChild(imageBox);
	return imageBox;
};
  
ImageProcessor.prototype.processFile = function (file) {
	if (!file) {
	  	return;
	}
	//console.log(file);
  
	let imageBox = this.addImageBox(this.refs.imagePreviews);
  
	// Load the data into an image
	new Promise(function (resolve, reject) {
		let rawImage = new Image();

		rawImage.addEventListener("load", function () {
			resolve(rawImage);
		});

		rawImage.src = URL.createObjectURL(file);
	}).
	then(function (rawImage) {
	  // Convert image to webp ObjectURL via a canvas blob
		return new Promise(function (resolve, reject) {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext("2d");

			canvas.width = rawImage.width;
			canvas.height = rawImage.height;
			ctx.drawImage(rawImage, 0, 0);

			canvas.toBlob(function (blob) {
				resolve(URL.createObjectURL(blob));
			}, "image/webp");
		});
	}).
	then(function (imageURL) {
		// Load image for display on the page
		return new Promise(function (resolve, reject) {
			let scaledImg = new Image();

			scaledImg.addEventListener("load", function () {
				resolve({ imageURL, scaledImg });
			});

			scaledImg.setAttribute("src", imageURL);
			scaledImg.classList.add("img-thumbnail");
		});
	}).
	then(function (data) {
		// Inject into the DOM
		let imageLink = document.createElement("a");

		imageLink.setAttribute("href", data.imageURL);
		imageLink.setAttribute('download', `${file.name}.webp`);
		imageLink.appendChild(data.scaledImg);

		imageBox.innerHTML = "";
		imageBox.appendChild(imageLink);
	});
  };
  
ImageProcessor.prototype.processFiles = function (files) {
	for (let file of files) {
		this.processFile(file);
	}
};
  
ImageProcessor.prototype.fileSelectorChanged = function () {
	this.processFiles(this.refs.fileSelector.files);
	this.refs.fileSelector.value = "";
};
  
ImageProcessor.prototype.setDragDrop = function (area) {
	area.addEventListener("dragenter", this.dragenter, false);
	area.addEventListener("dragover", this.dragover, false);
	area.addEventListener("drop", (e) => this.drop(e), false);
};
  
ImageProcessor.prototype.dragenter = function (e) {
	e.stopPropagation();
	e.preventDefault();
};
  
ImageProcessor.prototype.dragover = function (e) {
	e.stopPropagation();
	e.preventDefault();
};
  
ImageProcessor.prototype.drop = function (e) {
	e.stopPropagation();
	e.preventDefault();
	this.processFiles(e.dataTransfer.files);
};
  
// const imageProcessor = new ImageProcessor();
// imageProcessor.setDragDrop(document.documentElement);
// imageProcessor.refs.fileSelector.addEventListener("change", () => imageProcessor.fileSelectorChanged());
class ImageUpload extends Base
{    
	constructor(jsonConfig) {   
		super();     
		this.group = "Basic"
		this.name = "ImageUpload";
		this.version = "v1";
		if (jsonConfig!== void 0)        
		  this.config = JSON.parse(jsonConfig);        
		else
		  this.config =  {};       
	 
		//console.log(this.config)
		let config = this.config;
		if (config.propertyName === void 0) { config.propertyName = ''; }
		if (config.type === void 0) { config.type = 'ImageUpload'; }
		if (config.label === void 0) { config.label = 'My Image Upload'; }
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
		const val = config.value;

		const inputEl =  this.createElement("input", {"id":`${this.name}-${elementId}`, "class":"form-control", "type":"file", "accept":"image/*", "ref":"input"});
		
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

		if (this.isPropExists(config,"validation"))
		{
			
			if (this.isPropExists(config.validation, "mandatory"))
			{
			inputEl.classList.add("mandatory");
			}      
		}
		
		const divPreview = this.createElement("div",{"id":`${this.name}-${elementId}-preview`});

		if (!this.isNullOrEmpty(config.image))
		{
			divPreview.appendChild(this.createElement("img", {"class":"img-thumbnail", "src":config.image, "ref":"img"}));
		
		}
		const divGroup = this.createElement("div",{"class":"layout"});
		divGroup.appendChild(inputEl);
		divGroup.appendChild(divPreview);

		const imageProcessor = new ImageProcessor(divPreview, inputEl);
		imageProcessor.setDragDrop(divPreview);
		//console.log(imageProcessor.refs.fileSelector)
		imageProcessor.refs.fileSelector.addEventListener("change", () => imageProcessor.fileSelectorChanged());
		return divGroup;
	}

	
}

class Numberbox extends Base
{    
	constructor(jsonConfig) {   
		super();     
		this.group = "Basic"
		this.name = "Numberbox";
		this.version = "v1";
		if (jsonConfig!== void 0)        
		  this.config = JSON.parse(jsonConfig);        
		else
		  this.config =  {};       
	 
		//console.log(this.config)
		let config = this.config;
		if (config.propertyName === void 0) { config.propertyName = ''; }
		if (config.type === void 0) { config.type = 'Numberbox'; }
		if (config.label === void 0) { config.label = 'My Number box'; }
		if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
		//if (this.isPropExists(config, 'labelPosition')) { config.labelPosition = 'top'; }
		if (config.labelWidth === void 0) { config.labelWidth = 30; }
		if (config.labelMargin === void 0) { config.labelMargin = 3; }
		if (config.value === void 0) { config.value = ""; }
		if (config.pattern === void 0) { config.pattern = "/[^0-9]/g"; }
	   
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
		"label": "Number Field Component Edit Form",
		"tabs": [
		   {"tabLabel": "Display",
			 "tabId":"home",
			"components": [              
			  {
				"propertyName":"label",
				"label": "Label",
				"placeholder": "My Numberbox label",
				"description": "Enter the label for this number field", 
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
				  {"Left-Left":"Left"},
				  {"None":"None"}
				],
				"value": this.config.labelPosition,           
				"type": "Select"
			  },
			  {
				"propertyName":"description",
				"label": "Descriptions (Optional)",
				"description": "Description for the number field", 
				"type": "Textbox",
				"value": this.config.description
			  },
			  {
				"propertyName":"placeholder",
				"label": "Placeholder (Optional)",
				"placeholder": "Placeholder on the number field",
				"type": "Textbox",
				"value": this.config.placeholder
			  },
			  {
				"propertyName":"prefix",
				"label": "Prefix (Optional)",
				"placeholder": "Prefix",
				"description": "Set the prefix infront of the text field, for ex: {RM} [numberbox]", 
				"type": "Textbox",
				"value": this.config.prefix
			  },
			  {
				"propertyName":"suffix",
				"label": "Suffix (Optional)",
				"placeholder": "Suffix",
				"description": "Set the prefix infront of the text field, for ex: [numberbox] {RM}", 
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
				"type": "Numberbox"
			  },
			  {
				"propertyName":"pattern",
				"label": "Regex Pattern",
				"value": this.config.pattern, 
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
		const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
		divInputGroup.appendChild(divFormFloat);

		const inputEl = this.renderRawElement(config, elementId);
		
		divFormFloat.appendChild(inputEl);
		const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
		label.innerHTML = config.label;
		divFormFloat.appendChild(label);

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
	  const val = config.value;

	  const inputEl =  this.createElement("input", {"placeholder":config.label,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"text", "ref":"input"});
	  inputEl.setAttribute("data-pattern", config.pattern);
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
	   
	  this.attachComponentEventListener(inputEl);
	  return inputEl;
	}

	attachComponentEventListener=(inputEl)=>{
		inputEl.removeEventListener("input",this.numberFuncHandler);
		inputEl.addEventListener("input",this.numberFuncHandler);
	}

	numberFuncHandler=(event)=>{
		event.preventDefault();
		const currentValue = event.target.value;

		// Remove all non-numeric characters from the value
		///[^0-9]/g
		const pattern = event.target.getAttribute("data-pattern");
		const numericValue = currentValue.replace(eval(pattern), '');
		//console.log(numericValue)
		// Update the input's value with the numeric value
		event.target.value = numericValue;
	}


}

class Occupation extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Custom"
        this.name = "Occupation";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Occupation'; }
        if (config.label === void 0) { config.label = 'Occupation'; }
        if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
        //if (this.isPropExists(config, 'labelPosition')) { config.labelPosition = 'top'; }
        if (config.labelWidth === void 0) { config.labelWidth = 30; }
        if (config.labelMargin === void 0) { config.labelMargin = 3; }
        if (config.value === void 0) { config.value = ""; }
        if (config.case === void 0) { config.case = "none"; }
        if (config.apiUrl===void 0) {config.apiUrl ="https://occ.chooyee.co/api/query/"};
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
        "label": "Occupation Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"label",
                "label": "Label",
                "placeholder": "Occupation label",
                "description": "Enter the label for this element", 
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
                  {"Left-Left":"Left"},
				  {"None":"None"}
                ],
                "value": this.config.labelPosition,           
                "type": "Select"
              },
              {
                "propertyName":"description",
                "label": "Descriptions (Optional)",
                "description": "Description for the element", 
                "type": "Textbox",
                "value": this.config.description
              },
              {
                "propertyName":"placeholder",
                "label": "Placeholder (Optional)",
                "placeholder": "Placeholder on the element",
                "type": "Textbox",
                "value": this.config.placeholder
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
                "propertyName":"apiUrl",
                "label": "API URL",
                "value": this.config.apiUrl, 
                "placeholder": "https://api.allianceplugin.io/occ/autocomplete",
                "description": "Set the api url for the occupation", 
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
		const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
		divInputGroup.appendChild(divFormFloat);

        const inputEl = this.renderRawElement(config, elementId);
        
        divFormFloat.appendChild(inputEl);
		const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
		label.innerHTML = config.label;
		divFormFloat.appendChild(label);

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
		const val = config.value;

		const inputEl =  this.createElement("input", {"placeholder":config.label,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"text", "ref":"input"});
		
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
       
		//Attach Autocmplete event
		autocomplete(inputEl,config.apiUrl) ;
      	return inputEl;
    }
  }

    //============================================================================
    //Custom Event Listener
    //===========================================================================

	let autocomplete = (inp, url) => {
		/*the autocomplete function takes two arguments,
		the text field element and an array of possible autocompleted values:*/
		let currentFocus;
		/*execute a function when someone writes in the text field:*/
		inp.addEventListener("input", function(e) {
			
		});
		
		/*execute a function presses a key on the keyboard:*/
		inp.addEventListener("keydown", function(e){
		  var x = document.getElementById(this.id + "autocomplete-list");
		  if (x) x = x.getElementsByTagName("div");
		  if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			  increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		  } else if (e.keyCode == 38) {
			//up
			/*If the arrow UP key is pressed,
			  decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		  } else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
			  /*and simulate a click on the "active" item:*/
			  if (x) x[currentFocus].click();
			}

			let a, //OUTER html: variable for listed content with html-content
			b, // INNER html: filled with array-Data and html
			i, //Counter
			val = this.value;
		
			/*close any already open lists of autocompleted values*/
			closeAllLists();
		
			if (!val) {return false;}
	  
		  	currentFocus = -1;
	  
			/*create a DIV element that will contain the items (values):*/
			a = document.createElement("DIV");
			
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items list-group text-left");
			
			/*append the DIV element as a child of the autocomplete container:*/
			this.parentNode.appendChild(a);
		
			//const arr =  fetch(url + this.value);
			fetch(url + this.value)
			.then((response) => {
				// Check if the response status is OK (200)
				if (!response.ok) {
					console.log(response.status);
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				// Parse the response JSON		
				return response.json();
			})
			.then((arr)=>{
				//console.log(arr.length);
				for (i = 0; i < arr.length; i++) {
					/*check if the item starts with the same letters as the text field value:*/
					//if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
						/*create a DIV element for each matching element:*/
						b = document.createElement("DIV");
						b.setAttribute("class","list-group-item list-group-item-action");
						/*make the matching letters bold:*/
						b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
						b.innerHTML += arr[i].substr(val.length);
						/*insert a input field that will hold the current array item's value:*/
						b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
						/*execute a function when someone clicks on the item value (DIV element):*/
						b.addEventListener("click", function(e) {
							/*insert the value for the autocomplete text field:*/
							inp.value = this.getElementsByTagName("input")[0].value;
							/*close the list of autocompleted values,
								(or any other open lists of autocompleted values:*/
							closeAllLists();
						});
						a.appendChild(b);
						console.log(a);
					//}
				}
			})
			.catch((error) => {
				console.error('Fetch error:', error);
				throw error; // Rethrow the error to propagate it to the caller
			});
			
			/*for each item in the array...*/
			
		  }
		});
		
		let addActive = (x) => {
		  	/*a function to classify an item as "active":*/
			if (!x) return false;
			/*start by removing the "active" class on all items:*/
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = x.length - 1;
			/*add class "autocomplete-active":*/
			x[currentFocus].classList.add("active");
		}
		
		let removeActive = (x) => {
			/*a function to remove the "active" class from all autocomplete items:*/
			for (let i = 0; i < x.length; i++) {
				x[i].classList.remove("active");
			}
		}
		
		let closeAllLists = (elmnt) => {
			/*close all autocomplete lists in the document,
			except the one passed as an argument:*/
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != inp) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		}
		
		/*execute a function when someone clicks in the document:*/
		document.addEventListener("click", function(e) {
			closeAllLists(e.target);
		});
		
	  };

class Password extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Password";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Password'; }
        if (config.label === void 0) { config.label = 'My Password'; }
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
        
      
        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
        //this.editFormJson = this.getEditFormJson();
    }

    getEditFormJson = () =>{
      return {
        "label": "Password Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"label",
                "label": "Label",
                "placeholder": "My Password label",
                "description": "Enter the label for this Password field", 
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
                  {"Left-Left":"Left"},
                  {"None":"None"}
                ],
                "value": this.config.labelPosition,           
                "type": "Select"
              },
              {
                "propertyName":"description",
                "label": "Descriptions (Optional)",
                "description": "Description for the Password", 
                "type": "Textbox",
                "value": this.config.description
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
        const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
        divInputGroup.appendChild(divFormFloat);
        const inputEl = this.renderRawElement(config, elementId);
        
        divFormFloat.appendChild(inputEl);
        const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
        label.innerHTML = config.label;
        divFormFloat.appendChild(label);

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
      const val = config.value;

      const inputEl =  this.createElement("input", {"placeholder":config.label,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"password", "ref":"input"});
      
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



}

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
		if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
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
				  "description": "Description for the element", 
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
		let options = config.options;
		const defaultValue = config.value;
		const inputEl = this.createElement("div", {"data-property":propertyName,"id":`${this.name}-${elementId}`, "class":"form-radio radio", "ref":"radioGroup"});
		
		if (!this.isNullOrEmpty(config.propertyId))
		{
		inputEl.setAttribute("data-id", config.propertyId);
		}

		if (this.trueTypeOf(options)=="string")
		{
			options = options.split("\n");
		}

		let radioRequired = "";
		if (this.isPropExists(config,"validation"))
		{		
			if (this.isPropExists(config.validation, "mandatory"))
			{
				//inputEl.classList.add("mandatory");
				radioRequired = "required";
			}
		}

		options.forEach(option => {
			if (this.trueTypeOf(option)=="string")
			{
				//inputEl.add(new Option(option, option));  
				inputEl.appendChild(this.renderRadioComponent(option, option, elementId, radioRequired));
			}
			else{
				const key = Object.keys(option)[0];
				//inputEl.add(new Option(option[key],key));  
				inputEl.appendChild(this.renderRadioComponent(option[key], key, elementId, radioRequired));
			}
		});

		
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

	renderRadioComponent=(label, optionValue, elementId, radioRequired)=>{
		const divRadioWrapper = this.createElement("div", {"class":"radio form-check", "ref":"wrapper"});

		const radioOptionId = `Radio-${elementId}-${this.getShortUUID()}`;
		//<input role="radio" id="egz1rha-ehjhwoh--apple" value="apple" lang="en" class="form-check-input" type="radio" name="data[radio][egz1rha-ehjhwoh]" ref="input">
		const radio = this.createElement("input", {"id":radioOptionId,"name":`radio[${elementId}]`, "value":optionValue, "class":"form-check-input", "type": "radio","ref":"input"});
	
		if (!this.isNullOrEmpty(radioRequired))
		{
			radio.setAttribute("required", true);
		}
		//<label for="egz1rha-ehjhwoh--apple" class="form-check-label label-position-right"><span>apple</span></label>
		const labelElement = this.createElement("label",{"for":radioOptionId, "class":"form-check-label label-position-right"});
		const span = this.createElement("span",{});
		span.innerHTML = label;

		divRadioWrapper.appendChild(radio);
		divRadioWrapper.appendChild(labelElement);
		labelElement.appendChild(span);

		return divRadioWrapper;

	}

	setDefaultOption(selectElement, defaultValue) {

		const allRadios = selectElement.querySelectorAll("[ref='input']");
		allRadios.forEach((radio)=>{
			if (radio.value===defaultValue)
			{
				radio.checked=true;
				radio.setAttribute("checked", "checked");
			}
			else{
				radio.removeAttribute("checked");
			}
		})
	}

	//========================================================================
	//Custom Event Handler
	//=========================================================================
	


}

class Select extends Base
{    
	constructor(jsonConfig) {   
		super();     
		this.group = "Basic"
		this.name = "Select";
		this.version = "v1";
		if (jsonConfig!== void 0)        
			this.config = JSON.parse(jsonConfig);        
		else
			this.config =  {};       
	 
		let config = this.config;
		if (config.propertyName === void 0) { config.propertyName = 'Select'; }
		if (config.type === void 0) { config.type = 'Select'; }
		if (config.label === void 0) { config.label = 'My Dropdown'; }
		if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
		if (config.labelWidth === void 0) { config.labelWidth = 30; }
		if (config.labelMargin === void 0) { config.labelMargin = 3; }
		if (config.options === void 0) { config.options = ["option 1", "option 2", "option 3"]; }
		if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
		if (config.value === void 0) { config.value = ""; }
		if (config.validation === void 0) {
			config.validation = {}
			config.validation.mandatory = false;

		 	if (config.validation.lengthCheck === void 0) {
				config.validation.lengthCheck = {};
				config.validation.lengthCheck.min = 0;
				config.validation.lengthCheck.max = 0;
		  	};
		};
	    
		//this.editFormJson = this.getEditFormJson();
	}

	getEditFormJson = () =>{
		return {
		  "label": "Text Field",
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
					{"Left-Left":"Left"},
					{"None":"None"}
				  ],
				  "value": this.config.labelPosition,           
				  "type": "Select"
				},
				{
				  "propertyName":"description",
				  "label": "Descriptions",
				  "description": "Description for the element", 
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

		const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
		divInputGroup.appendChild(divFormFloat);
		const inputEl = this.renderRawElement(config, elementId);

		divFormFloat.appendChild(inputEl);
		const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
		label.innerHTML = config.label;
		divFormFloat.appendChild(label);
	  
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
		const inputElementId = `${this.name}-${elementId}`;
		const propertyName = config.propertyName;
		const placeholder = config.placeholder;
		let options = config.options;
		const defaultValue = config.value;
		const inputEl = this.createElement("select", {"placeholder":config.label,"data-property":propertyName,"id":inputElementId, "class":"form-control", "type":"text", "ref":"input"});
		
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

		
		// if (!this.isNullOrEmpty(config.render))
		// {			
		// 	if (config.render.options=='all_elements_on_form')
		// 	{				
		// 		inputEl.add(new Option("Not selected", ""));

		// 		const mainContainer = document.getElementById(formElementJsonConfig[0]["element-id"]);				
		// 		const allComponents = [...mainContainer.querySelectorAll('[ref="component"]')];
				
		// 		allComponents.forEach((component)=>{
		// 			const label = component.querySelector("label");
		// 			const elementType = component.getAttribute("data-component-type");
		// 			const elementId = label.getAttribute("for");
		// 			inputEl.add(new Option(`${label.innerHTML} (${elementType})`, elementId));  
					
		// 		})
		// 	}
		// }

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

class Text extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.name = "Text";
        this.version = "v1";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        //console.log(this.config)
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = ''; }
        if (config.type === void 0) { config.type = 'Text'; }
        if (config.position === void 0) { config.position = 'left'; }
       
        if (config.value === void 0) { config.value = ""; }
        if (config.letterCase === void 0) { config.letterCase = "none"; }
       
      

        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
        //this.editFormJson = this.getEditFormJson();
    }

    getEditFormJson = () =>{
      return {
        "label": "Text Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"value",
                "label": "Text",
                "placeholder": "My Textbox label",
                "description": "Enter the text",
                "value":this.config.value,           
                "type": "Textarea"
              },
              {
                "propertyName":"position",
                "label": "Text Position",
                "description": "Set the position of the text", 
                "options":[
                    {"left":"left"},
                    {"center":"center"},
                    {"right":"right"}
                ],    
                "value": this.config.position,           
                "type": "Select"
              },
              {
                "propertyName":"letterCase",
                "label": "Lettercase",
                "description": "Select the letter case for the header",
                "value":this.config.letterCase, 
                "options":[
                  {"none":"None"},
                  {"upper":"Uppercase"},
                  {"lower":"Lowercase"},
                  {"capital":"Capital"}
                ],    
                "type": "Select"
              },    
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
  
        const desc = config.description;
        //===================================================================================
          //render Input Group
          //===================================================================================
         
          const divInputGroup = this.createElement("div", {"class":"d-flex"});       
          if (config.position ==='center')
          {
            divInputGroup.classList.add("justify-content-center", "align-items-center")
          }
          else if (config.position ==='right')
          {
            divInputGroup.classList.add("justify-content-end", "align-items-right")
          }
          
          const inputEl = this.renderRawElement(config, elementId);
          
          divInputGroup.appendChild(inputEl);
  
          const divElement = this.createElement("div", {"ref":"element"});
          divElement.appendChild(divInputGroup);
  
          if (!this.isNullOrEmpty(desc))
          {
            //<div class="form-text text-muted" id="d-egxfg08-checkbox">testew er ewrewr ewrewr ewre w</div>
            const divDesc = this.createElement("div", {"class":"d-flex form-text text-muted"});
            if (config.position ==='center')
            {
              divDesc.classList.add("justify-content-center", "align-items-center")
            }
            else if (config.position ==='right')
            {
              divDesc.classList.add("justify-content-end", "align-items-right")
            }
            //const pDesc = this.createElement("p", {"class":"form-text text-muted"});
            divDesc.innerHTML = desc;
            //divDesc.appendChild(pDesc);
            divElement.appendChild(divDesc);
          }
  
          return divElement;
          //===================================================================================
          //end render Input Group
          //===================================================================================
      }
  
      renderRawElement = (config, elementId)=>{   
        const propertyName = config.propertyName;
        const letterCase = config.letterCase;    
        const val = config.value;
  
        const inputEl =  this.createElement("p", {"id":`${this.name}-${elementId}`, "ref":"input"});
        
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
          inputEl.innerHTML= val;
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
  
        return inputEl;
      }
  
    
}

class Textarea extends Base
{    
    constructor(jsonConfig) {   
        super();     
        this.group = "Basic"
        this.version = "v1";
        this.name = "Textarea";
        if (jsonConfig!== void 0)        
          this.config = JSON.parse(jsonConfig);        
        else
          this.config =  {};       
     
        let config = this.config;
        if (config.propertyName === void 0) { config.propertyName = 'textarea'; }
        if (config.type === void 0) { config.type = 'Textarea'; }
        if (config.label === void 0) { config.label = 'My Text Area'; }
        if (config.labelPosition === void 0) { config.labelPosition = 'Left-Left'; }
        if (config.labelWidth === void 0) { config.labelWidth = 30; }
        if (config.labelMargin === void 0) { config.labelMargin = 3; }
        if (config.rows === void 0) { config.rows = 3; }
        if (config.letterCase === void 0) { config.letterCase = "none"; }
        if (config.value === void 0) { config.value = ""; }
        if (config.required === void 0) { config.required = false; }
        config.required = config.required=='on'?true:false;
        if (config.minLength === void 0) { config.minLength = 0; }
        if (config.maxLength === void 0) { config.maxLength = 0; }
        if (config.formBuilderMode === void 0) { config.formBuilderMode = false; }
       
        if (config.validation === void 0) {
          config.validation = {}
          config.validation.mandatory = false;

          if (config.validation.lengthCheck === void 0) {
            config.validation.lengthCheck = {};
            config.validation.lengthCheck.min = 0;
            config.validation.lengthCheck.max = 0;
          };
        };
        
    }

    getEditFormJson = () =>{
      return {
        "label": "Text Area Component Edit Form",
        "tabs": [
           {"tabLabel": "Display",
             "tabId":"home",
            "components": [              
              {
                "propertyName":"label",
                "label": "Label",
                "placeholder": "My Text Area label",
                "description": "Enter the label for this text area", 
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
                  {"Left-Left":"Left"},
                  {"None":"None"}
                ],
                "value": this.config.labelPosition,           
                "type": "Select"
              },
              {
                "propertyName":"description",
                "label": "Descriptions (Optional)",
                "description": "Description for text area", 
                "type": "Textbox",
                "value": this.config.description
              },
              {
                "propertyName":"rows",
                "label": "Rows",
                "type": "Textbox",
                "value": this.config.rows
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
                "type": "Textbox",
                "value": this.config.validation.lengthCheck.min
              },
              {
                "propertyGroup":"validation",
                "propertyType":"lengthCheck",
                "propertyName":"validation-lengthCheck-max",
                "label": "Maximum Length (Optional)",
                "placeholder": "Maximum Length",
                "type": "Textbox",
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
                "type": "Textarea"
              }
            ]
          }
        ]
      };
    }
    
    renderElement = (config, elementId)=>{
      //propertyName, elementId, prefix, suffix, placeholder, letterCase, rows, required
     
      const desc = config.description;
      //===================================================================================
        //render Input Group
        //===================================================================================
       
        const divInputGroup = this.createElement("div", {"class":"input-group"});       

        const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
		    divInputGroup.appendChild(divFormFloat);
        const inputEl = this.renderRawElement(config, elementId);

        divFormFloat.appendChild(inputEl);
        const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
        label.innerHTML = config.label;
        divFormFloat.appendChild(label);

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
      const val = config.value;
      const rows = config.rows;
      const inputEl =  this.createElement("textarea", {"style":"height:100%","placeholder":config.label,"data-property":propertyName,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"textarea", "rows":rows, "ref":"input"});
      
      if (!this.isNullOrEmpty(config.propertyId))
      {
        inputEl.setAttribute("data-id", config.propertyId);
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
       
      if (!this.isNullOrEmpty(val)) inputEl.innerHTML = val;

      switch (config.letterCase)
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

      return inputEl;
    }



}

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
		if (config.letterCase === void 0) { config.letterCase = "none"; }
	   
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
				  {"Left-Left":"Left"},
				  {"None":"None"}
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
		const divFormFloat = this.createElement("div", {"class":"form-floating"}); 
		divInputGroup.appendChild(divFormFloat);

		const inputEl = this.renderRawElement(config, elementId);
	
		divFormFloat.appendChild(inputEl);
		const label = this.createElement("label",{"for":`${this.name}-${elementId}`});
		label.innerHTML = config.label;
		divFormFloat.appendChild(label);

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
		const letterCase = config.letterCase;    
		const val = config.value;

		const inputEl =  this.createElement("input", {"placeholder":config.label,"id":`${this.name}-${elementId}`, "class":"form-control", "type":"text", "ref":"input"});
		
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

		// if (!this.isNullOrEmpty(placeholder))
		// {
		// 	inputEl.setAttribute("placeholder", placeholder);
		// }

		
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
