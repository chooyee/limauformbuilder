const modalBox = document.getElementById("myModal"); 
const modalTitle = document.getElementById("modalLongTitle"); 
const modalBody = document.querySelector(".modal-body");  
const closeModals = document.querySelectorAll('[data-dismiss="modal"]');
const editModalBox = new bootstrap.Modal(modalBox);
const btnRemove = document.getElementById("btnRemove"); 
const btnCancel = document.getElementById("btnCancel"); 
const btnSave = document.getElementById("btnSave"); 
const btnSaveFormBuilder  = document.getElementById("btnSaveFormBuilder");
const btnResetFormBuilder  = document.getElementById("btnResetFormBuilder");
const draggables = [...document.querySelectorAll(".draggable")];
const dropzones = [...document.querySelectorAll(".dropzone")];

var curMirrorElement;
var curZone;
var editor = ace.edit("form-json");
var formElementJsonConfig = [];

document.addEventListener('DOMContentLoaded', function () {
	const mainContainer = document.querySelector('[ref="container"]');  
	const mainContainerJson = {};
	mainContainerJson["element-id"] = mainContainer.id;
	mainContainerJson["element-group"] = "default"
	mainContainerJson["element-version"] = "v1";
	mainContainerJson["element-type"] = "container";
	mainContainerJson["element-parent"] = "";
	mainContainerJson["components"] = [];
	formElementJsonConfig.push(mainContainerJson);

	//editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/json");
	editor.session.setUseWrapMode(true);
	editor.setHighlightActiveLine(false);
	
	btnSaveFormBuilder.addEventListener('click',(e)=>{
		e.preventDefault();
		const jsonForm = editor.getValue();		
		const apiEndpoint = "/api/v1/saveformjson";		
		fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: jsonForm,
		})		
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			
			return response.json(); // You can handle the API response here
		})
		.then((data) => {
			
			alert(data.message);
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("Error: " + error);
		});
	})

	btnResetFormBuilder.addEventListener('click',(e)=>{
		e.preventDefault();
		mainContainer.innerHTML = "";
		refreshEditor();
	})

	modalBox.addEventListener('hidden.bs.modal', function (event) {
		// do something...
		const _component_edit_mode = document.querySelector(".modal-edit-mode");
		if (_component_edit_mode){  
			_component_edit_mode.classList.remove("modal-edit-mode");
		}
	})

  	closeModals.forEach((close)=>{
		close.addEventListener("click",(e)=>{
			e.preventDefault();
			const _mirror = document.querySelector(".drag-mirror");  
			if (_mirror){
				const buttonRef = e.target.getAttribute("ref");
				if (_mirror.getAttribute("ref")==="sidebar-component"|| buttonRef=='modal-remove')
				{
					//curZone.removeChild(_mirror);
					_mirror.remove();				
				}
			}

	  		const _component_edit_mode = document.querySelector(".modal-edit-mode");  
			if (_component_edit_mode){
				const buttonRef = e.target.getAttribute("ref");
				if (buttonRef=='modal-remove')
				{
					_component_edit_mode.remove();				
				}
			}
	  		editModalBox.hide();
	  
		});
  	});

	btnSave.addEventListener("click", (e)=>{
		e.preventDefault();
		let editComponents = document.querySelectorAll(".drag-mirror,div.modal-edit-mode"); 
		if (editComponents.length>0)
		{
			const editComponent = editComponents[0];
			//if (curEl) curZone.removeChild(curEl);
			btnModalSaveEventHandler(editComponent.dataset.type, editComponent);
		}      
	})

	draggables.forEach((draggable) => {
		draggableHandler(draggable);
	});

	dropzones.forEach((zone) => {
		zone.addEventListener("dragover", (e) => {
			dropZoneDragoverEventHandler(zone, e);
		});

		zone.addEventListener("dragenter", (e) => { });

		zone.addEventListener("dragleave", (e) => {  
			dropZoneDragleaveEventHandler(zone, e);
		});

		zone.addEventListener("drop", (e) => {
			elementDropped(zone, e);
		});
  	});//end dropzones
  
});

//=========================================================================
//Event Listener Handler
 //=========================================================================
draggableHandler=(draggable)=>
{
  draggable.setAttribute('draggable', true);

  draggable.addEventListener("dragstart", (e) => {
	if (e.target.getAttribute("ref")==='sidebar-component')
	{
	  draggable.classList.add("drag-transit");        
	}
	else{
	  const dragComponent = e.target.closest("div.builder-component");
	  dragComponent.classList.add("drag-transit", "drag-highlight");    
	}
  });

  draggable.addEventListener("dragend", (e) => {
	draggable.classList.remove("drag-transit", "drag-highlight");
	elementDropped(e);
	
  });//dragend
}

dragComponentEventListeners=(el)=>
{       

  if (el.getAttribute("ref")==='dragComponent')
  {
	const becRemove = el.querySelector('[ref="removeComponent"]');      
	becRemove.addEventListener("click", becRemoveEventHandler);

	const becEdit = el.querySelector('[ref="editComponent"]');      
	becEdit.addEventListener("click", becEditEventHandler);
	draggableHandler(el);
  }
}

becRemoveEventHandler=(e)=>{
  const thisEl = e.target.closest('div.builder-component');
  thisEl.remove();
  formElementJsonConfig = removeJsonElement(formElementJsonConfig, "component-" + thisEl.id);
  refreshEditor();
}

becEditEventHandler=(e)=>{
  const thisEl = e.target.closest('div.builder-component');
  const jsonConfig = getFormElementJsonConfig("component-" + thisEl.id);
  thisEl.classList.add("modal-edit-mode");
  thisEl.setAttribute("data-type", jsonConfig["element-type"])
  const el = CreateInstance(jsonConfig["element-type"], JSON.stringify(jsonConfig));

  modalTitle.innerHTML = `${el.group} - ${el.name} - ${el.version}`;
  modalBody.innerHTML = '';
  modalBody.appendChild(el.renderEditForm());
  el.attachEditFormEvent();
  
  editModalBox.show();     
}

btnModalSaveEventHandler=async (domElementType, curDomElement)=>{
  const elementsWithRefInput = modalBox.querySelectorAll('[ref="input"]');

  // Now you can work with the selected elements
  let config = {};
  for (const element of elementsWithRefInput) {          
	const propName = element.dataset.property;
   
	if (element.type=='checkbox' && !element.checked)
	{
	  continue;
	}

	const propNameBuilder = propName.split('-');
	if (propNameBuilder.length>1)
	{
	  let currentObj = config;
	  for(let i =0; i<propNameBuilder.length;i++)
	  {
		const part = propNameBuilder[i];
		if (!currentObj.hasOwnProperty(part)) {
		  currentObj[part]={};              
		}   
		if (i < propNameBuilder.length - 1) {
			currentObj = currentObj[part];
		  }         
	  }

	  
	  eval(`config.${propNameBuilder.join(".")} = '${element.value}'`);
	
	}
	else{
	  //currentObj
	  config[propNameBuilder[0]] = element.value;
	}
   
  }

  config.formBuilderMode = true;
		
  const el =  CreateInstance(domElementType, JSON.stringify(config)); 

  config=el.config;
  //Execute element custom button save event before render
  await el.executeButtonSave();

  const zone = curDomElement.closest('[ref="container"]');
  
  zone.insertBefore(el.renderDomElement(), curDomElement);      
  zone.removeChild(curDomElement);
 
  //el.attachComponentEventListener();
	//assign event to buildereditcomponents
	//Prepare for Json
  config["element-id"] = "component-" + el.elementId;
  config["element-group"] = el.group;
  config["element-version"] = el.version;
  config["element-type"] = el.config.type;

  const newDomEl = document.getElementById(el.elementId)
  config["element-parent"] = newDomEl.closest('[ref="container"]').id;

  document.getElementById("component-" + el.elementId).setAttribute("data-container", newDomEl.closest('[ref="container"]').id);

  formElementJsonConfig.push(config);

  dragComponentEventListeners(newDomEl);

  refreshEditor();

  editModalBox.hide();
}

dropZoneDragoverEventHandler=(zone, e)=>{
  e.preventDefault();
  let _mirror = document.querySelector(".drag-mirror");  
  if (!_mirror){     

	//e,target is drop container
	const targetEl  = document.querySelector(".drag-transit");
	
	_mirror = targetEl.cloneNode(true);
	_mirror.classList.add("drag-mirror");
	_mirror.classList.remove("drag-transit");
	const y = event.clientY;
	const x = event.clientX;
	const item = getReference(zone, _mirror, x,y);
	
	curMirrorElement = item;
	zone.insertBefore(_mirror, item);
	curZone=zone;
  }
}

dropZoneDragleaveEventHandler=(zone, e)=>{
  e.preventDefault();
  const _mirror = document.querySelector(".drag-mirror");  
  if (_mirror){   
	const y = event.clientY;
	const x = event.clientX;
	const item = getReference(zone, _mirror, x,y);
	if (item!=curMirrorElement && item!=_mirror)
	{
	  curMirrorElement = "";          
	  _mirror.remove();
	}
  }
}
elementDropped=(zone, e)=>{
  const _mirror = document.querySelector(".drag-mirror");
  
  hide(document.querySelector(".drag-and-drop-alert"));
  if (_mirror){     
  
	const componentType = _mirror.getAttribute("ref");        
	if (componentType==='sidebar-component'){          
	  
	  const el = CreateInstance(_mirror.dataset.type, '{"formBuilderMode":true}');
	  el.Test();
	  modalTitle.innerHTML = `${el.group} - ${el.name} - ${el.version}`;
	  modalBody.innerHTML = '';
	  modalBody.appendChild(el.renderEditForm());
	  el.attachEditFormEvent();
	  editModalBox.show();     
	}
	else{
		const element = document.querySelector(`#${_mirror.id}:not(.drag-mirror)`);
		const dropZone = _mirror.closest('[ref="container"]');	
		dropZone.insertBefore(element, _mirror);
		document.getElementById("component-" + element.id).setAttribute("data-container",dropZone.id);	
		
		_mirror.remove();
	}
	refreshEditor();
  }
}
//=========================================================================
//End Event Listener Handler
 //=========================================================================


function getReference (dropTarget, target, x, y) {
  const horizontal = false;
  var reference = outside();
  return reference;

  function outside () { // slower, but able to figure out any position
	var len = dropTarget.children.length;
	var i;
	var el;
	var rect;
	for (i = 0; i < len; i++) {
	  el = dropTarget.children[i];
	  rect = el.getBoundingClientRect();
	  //if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
	  if ((rect.left + rect.width / 3) > x && (rect.top + rect.height / 3) > y) { return el; }
	}
	return null;
  }
}

function CreateInstance(classNameString, json)
{
  var obj = new (eval(classNameString))(json);
  return obj
}

function removeJsonElement(jsonComponent, elementId) {
  if (Array.isArray(jsonComponent)) {
	for (let i = 0; i < jsonComponent.length; i++) {
	  const com = jsonComponent[i];
	  if (com["element-type"] === 'Column') {
		com["columns"].forEach((e) => {
		  e["components"] = removeJsonElement(e["components"], elementId);
		});
	  } else {
		if (com["element-id"] === elementId) {
		  jsonComponent.splice(i, 1);
		 
		  i--; // Decrement i to account for the removed element
		}
	  }
	}
  }
 
  return jsonComponent;
}

function getFormElementJsonConfig(elementId) {
  const jsonObj = formElementJsonConfig;
  if (Array.isArray(jsonObj)) {
	for (let i = 0; i < jsonObj.length; i++) {
	  if (jsonObj[i]["element-id"]===elementId)
	  {
		return jsonObj[i];
	  }
	}
	return null;
  }     
  return null;
}

function refreshEditor()
{ 
  //Get first element - Main Container
  const mainContainer = document.getElementById(formElementJsonConfig[0]["element-id"]);
  const formElementJsonRep = formElementJsonConfig[0];
  formElementJsonRep.components = getAllChildElementsRecursive(mainContainer);
  editor.setValue(JSON.stringify(formElementJsonRep, null, '\t'));

}

function getAllChildElementsRecursive(parentElement, result = []) {
	const childComponents = parentElement.querySelectorAll(`[data-container="${parentElement.id}"][ref="component"]`);
	
	for (let i = 0; i < childComponents.length; i++) {
		const domComponent = childComponents[i];		
	
		const jsonComponent = getFormElementJsonConfig(domComponent.id);
		
		if (jsonComponent["element-type"]==="Column")
		{
			result.push(jsonComponent);
			const elementId = domComponent.id.split("-")[1];
			const cols = domComponent.querySelectorAll(`[ref="container"][data-parent="Column-${elementId}"]`); 
				
			let colNumber = 0;
				
			cols.forEach((col)=>{                
				jsonComponent["columns"][colNumber]["components"]=[];
				getAllChildElementsRecursive(col, jsonComponent["columns"][colNumber]["components"]);              
				colNumber++;
			})            
		}
		else
		{
			result.push(jsonComponent);
		}
		      
	}
  
  	return result;
}

var show = function (elem) {
  	if (elem){elem.style.display = 'block';}
};

// Hide an element
var hide = function (elem) {
	if (elem){elem.style.display = 'none';}
};
isNullOrEmpty=function (value) {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);
};