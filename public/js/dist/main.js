var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire48a3"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire48a3"] = parcelRequire;
}
parcelRequire.register("e1kmr", function(module, exports) {
parcelRequire("32rzO");
const modalBox = document.getElementById("myModal");
const modalTitle = document.getElementById("modalLongTitle");
const modalBody = document.querySelector(".modal-body");
const closeModals = document.querySelectorAll('[data-dismiss="modal"]');
const editModalBox = new bootstrap.Modal(modalBox);
const btnRemove = document.getElementById("btnRemove");
const btnCancel = document.getElementById("btnCancel");
const btnSave = document.getElementById("btnSave");
//const nodropElements = document.querySelectorAll(".no-drop");
const draggables = [
    ...document.querySelectorAll(".draggable")
];
const dropzones = [
    ...document.querySelectorAll(".dropzone")
];
var curMirrorElement;
var curZone;
var editor = ace.edit("form-json");
var formElementJsonConfig = [];
const className = "Select";
const h = new (eval(className))();
console.log(h);
document.addEventListener("DOMContentLoaded", function() {
    const mainContainer11 = document.querySelector('[ref="container"]');
    const mainContainerJson11 = {};
    mainContainerJson11["element-id"] = mainContainer11.id;
    mainContainerJson11["element-group"] = "default";
    mainContainerJson11["element-version"] = "v1";
    mainContainerJson11["element-type"] = "container";
    mainContainerJson11["element-parent"] = "";
    mainContainerJson11["components"] = [];
    formElementJsonConfig.push(mainContainerJson11);
    //editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/json");
    editor.session.setUseWrapMode(true);
    editor.setHighlightActiveLine(false);
    modalBox.addEventListener("hidden.bs.modal", function(event11) {
        // do something...
        const _component_edit_mode11 = document.querySelector(".modal-edit-mode");
        if (_component_edit_mode11) _component_edit_mode11.classList.remove("modal-edit-mode");
    });
    closeModals.forEach((close11)=>{
        close11.addEventListener("click", (e11)=>{
            e11.preventDefault();
            const _mirror11 = document.querySelector(".drag-mirror");
            if (_mirror11) {
                const buttonRef11 = e11.target.getAttribute("ref");
                if (_mirror11.getAttribute("ref") === "sidebar-component" || buttonRef11 == "modal-remove") //curZone.removeChild(_mirror);
                _mirror11.remove();
            }
            const _component_edit_mode11 = document.querySelector(".modal-edit-mode");
            //console.log(_component_edit_mode)
            if (_component_edit_mode11) {
                const buttonRef11 = e11.target.getAttribute("ref");
                if (buttonRef11 == "modal-remove") //curZone.removeChild(_component_edit_mode);
                _component_edit_mode11.remove();
            }
            editModalBox.hide();
        });
    });
    btnSave.addEventListener("click", (e11)=>{
        e11.preventDefault();
        let editComponents11 = document.querySelectorAll(".drag-mirror,div.modal-edit-mode");
        if (editComponents11.length > 0) {
            const editComponent11 = editComponents11[0];
            //if (curEl) curZone.removeChild(curEl);
            btnModalSaveEventHandler(editComponent11.dataset.type, editComponent11);
        }
    });
    draggables.forEach((draggable11)=>{
        draggableHandler(draggable11);
    });
    dropzones.forEach((zone11)=>{
        zone11.addEventListener("dragover", (e11)=>{
            dropZoneDragoverEventHandler(zone11, e11);
        });
        zone11.addEventListener("dragenter", (e11)=>{});
        zone11.addEventListener("dragleave", (e11)=>{
            dropZoneDragleaveEventHandler(zone11, e11);
        });
        zone11.addEventListener("drop", (e11)=>{
            console.log("drop");
            //curZone = zone;
            elementDropped(zone11, e11);
        });
    });
});
//=========================================================================
//Event Listener Handler
//=========================================================================
draggableHandler = (draggable11)=>{
    draggable11.setAttribute("draggable", true);
    draggable11.addEventListener("dragstart", (e11)=>{
        console.log("dragstart");
        console.log(e11.target);
        if (e11.target.getAttribute("ref") === "sidebar-component") draggable11.classList.add("drag-transit");
        else {
            const dragComponent11 = e11.target.closest("div.builder-component");
            dragComponent11.classList.add("drag-transit", "drag-highlight");
        }
    });
    draggable11.addEventListener("dragend", (e11)=>{
        console.log("dragend");
        //console.log(e.target);
        draggable11.classList.remove("drag-transit", "drag-highlight");
        elementDropped(e11);
    }); //dragend
};
dragComponentEventListeners = (el11)=>{
    //builderElementDragHandler(document.getElementById(el.id));
    if (el11.getAttribute("ref") === "dragComponent") {
        const becRemove11 = el11.querySelector('[ref="removeComponent"]');
        becRemove11.addEventListener("click", becRemoveEventHandler);
        const becEdit11 = el11.querySelector('[ref="editComponent"]');
        becEdit11.addEventListener("click", becEditEventHandler);
        draggableHandler(el11);
    }
};
becRemoveEventHandler = (e11)=>{
    const thisEl11 = e11.target.closest("div.builder-component");
    thisEl11.remove();
    formElementJsonConfig = removeJsonElement(formElementJsonConfig, "component-" + thisEl11.id);
    //console.log(formElementJsonConfig);
    refreshEditor();
};
becEditEventHandler = (e11)=>{
    const thisEl11 = e11.target.closest("div.builder-component");
    const jsonConfig11 = getFormElementJsonConfig("component-" + thisEl11.id);
    thisEl11.classList.add("modal-edit-mode");
    thisEl11.setAttribute("data-type", jsonConfig11["element-type"]);
    const el11 = CreateInstance(jsonConfig11["element-type"], JSON.stringify(jsonConfig11));
    modalTitle.innerHTML = `${el11.group} - ${el11.name} - ${el11.version}`;
    modalBody.innerHTML = "";
    modalBody.appendChild(el11.renderEditForm());
    el11.attachEditFormEvent();
    editModalBox.show();
};
btnModalSaveEventHandler = async (domElementType, curDomElement)=>{
    const elementsWithRefInput = modalBox.querySelectorAll('[ref="input"]');
    // Now you can work with the selected elements
    let config = {};
    for (const element of elementsWithRefInput){
        const propName = element.dataset.property;
        if (element.type == "checkbox" && !element.checked) continue;
        const propNameBuilder = propName.split("-");
        if (propNameBuilder.length > 1) {
            let currentObj = config;
            for(let i = 0; i < propNameBuilder.length; i++){
                const part = propNameBuilder[i];
                if (!currentObj.hasOwnProperty(part)) currentObj[part] = {};
                if (i < propNameBuilder.length - 1) currentObj = currentObj[part];
            }
            //currentObj = element.value;
            //eval("config." + propNameBuilder.join(".") + "='" + element.value + "'");
            //console.log(`config.${propNameBuilder.join(".")} = '${element.value}'`);
            eval(`config.${propNameBuilder.join(".")} = '${element.value}'`);
        //console.log(config);
        } else //currentObj
        config[propNameBuilder[0]] = element.value;
    //console.log(element.type + ":" + element.value );
    }
    //console.log(config)
    config.formBuilderMode = true;
    const el = CreateInstance(domElementType, JSON.stringify(config));
    config = el.config;

    //Execute element custom button save event before render
    await el.executeButtonSave();
    
    const zone = curDomElement.closest('[ref="container"]');
    //console.log(zone)
    zone.insertBefore(el.renderDomElement(), curDomElement);
    zone.removeChild(curDomElement);
    //el.attachComponentEventListener();
    //assign event to buildereditcomponents
    //Prepare for Json
    config["element-id"] = "component-" + el.elementId;
    config["element-group"] = el.group;
    config["element-version"] = el.version;
    config["element-type"] = el.config.type;
    const newDomEl = document.getElementById(el.elementId);
    config["element-parent"] = newDomEl.closest('[ref="container"]').id;
    formElementJsonConfig.push(config);
    //console.log(formElementJsonConfig)
    dragComponentEventListeners(newDomEl);
    refreshEditor();
    editModalBox.hide();
};
dropZoneDragoverEventHandler = (zone11, e11)=>{
    //console.log(zone)
    e11.preventDefault();
    let _mirror11 = document.querySelector(".drag-mirror");
    // console.log("dragover")
    // console.log(_mirror)
    if (!_mirror11) {
        //e,target is drop container
        const targetEl11 = document.querySelector(".drag-transit");
        _mirror11 = targetEl11.cloneNode(true);
        _mirror11.classList.add("drag-mirror");
        _mirror11.classList.remove("drag-transit");
        // zone.appendChild(draggable);
        const y11 = event.clientY;
        const x11 = event.clientX;
        const item11 = getReference(zone11, _mirror11, x11, y11);
        curMirrorElement = item11;
        zone11.insertBefore(_mirror11, item11);
        curZone = zone11;
    //if (targetEl.getAttribute("ref") ==='dragComponent') {targetEl.remove();}
    }
};
dropZoneDragleaveEventHandler = (zone11, e11)=>{
    e11.preventDefault();
    console.log("dragleave");
    const _mirror11 = document.querySelector(".drag-mirror");
    if (_mirror11) {
        const y11 = event.clientY;
        const x11 = event.clientX;
        const item11 = getReference(zone11, _mirror11, x11, y11);
        if (item11 != curMirrorElement && item11 != _mirror11) {
            curMirrorElement = "";
            _mirror11.remove();
        //zone.removeChild(_mirror);
        }
    }
};
elementDropped = (zone11, e11)=>{
    const _mirror11 = document.querySelector(".drag-mirror");
    hide(document.querySelector(".drag-and-drop-alert"));
    if (_mirror11) {
        const componentType11 = _mirror11.getAttribute("ref");
        if (componentType11 === "sidebar-component") {
            const el11 = CreateInstance(_mirror11.dataset.type, '{"formBuilderMode":true}');
            el11.Test();
            modalTitle.innerHTML = `${el11.group} - ${el11.name} - ${el11.version}`;
            modalBody.innerHTML = "";
            modalBody.appendChild(el11.renderEditForm());
            el11.attachEditFormEvent();
            editModalBox.show();
        } else {
            const element11 = document.querySelector(`#${_mirror11.id}:not(.drag-mirror)`);
            //console.log(element)
            const dropZone11 = _mirror11.closest('[ref="container"]');
            dropZone11.insertBefore(element11, _mirror11);
            _mirror11.remove();
        // //console.log(element)
        // _mirror.classList.remove("drag-mirror");
        // element.remove();
        // dragComponentEventListeners(_mirror)
        }
        refreshEditor();
    }
};
//=========================================================================
//End Event Listener Handler
//=========================================================================
function getReference(dropTarget11, target11, x11, y11) {
    const horizontal11 = false;
    var reference11 = outside11();
    //console.log(reference)
    return reference11;
    function outside11() {
        var len11 = dropTarget11.children.length;
        var i11;
        var el11;
        var rect11;
        for(i11 = 0; i11 < len11; i11++){
            el11 = dropTarget11.children[i11];
            rect11 = el11.getBoundingClientRect();
            //if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
            if (rect11.left + rect11.width / 3 > x11 && rect11.top + rect11.height / 3 > y11) return el11;
        }
        return null;
    }
}
function CreateInstance(classNameString, json) {
    var obj = new (eval(classNameString))(json);
    return obj;
}
function removeJsonElement(jsonComponent11, elementId11) {
    //console.log(elementId)
    if (Array.isArray(jsonComponent11)) for(let i11 = 0; i11 < jsonComponent11.length; i11++){
        const com11 = jsonComponent11[i11];
        if (com11["element-type"] === "Column") com11["columns"].forEach((e11)=>{
            e11["components"] = removeJsonElement(e11["components"], elementId11);
        });
        else if (com11["element-id"] === elementId11) {
            jsonComponent11.splice(i11, 1);
            // console.log("removeJsonElement- remove")
            // console.log(jsonComponent)
            i11--; // Decrement i to account for the removed element
        }
    }
    // console.log("removeJsonElement- final")
    // console.log(jsonComponent)
    return jsonComponent11;
}
function getFormElementJsonConfig(elementId11) {
    const jsonObj11 = formElementJsonConfig;
    if (Array.isArray(jsonObj11)) {
        for(let i11 = 0; i11 < jsonObj11.length; i11++){
            if (jsonObj11[i11]["element-id"] === elementId11) return jsonObj11[i11];
        }
        return null;
    }
    return null;
}
function refreshEditor() {
    //Get first element - Main Container
    const mainContainer11 = document.getElementById(formElementJsonConfig[0]["element-id"]);
    const formElementJsonRep11 = formElementJsonConfig[0];
    formElementJsonRep11.components = getAllChildElementsRecursive(mainContainer11);
    editor.setValue(JSON.stringify(formElementJsonRep11, null, "	"));
//console.log(formElementJsonConfig)
}
function getAllChildElementsRecursive(parentElement11, result11 = []) {
    var children11 = parentElement11.children;
    //var children = parentElement.querySelectorAll(".builder-component,.drag-container");
    for(let i11 = 0; i11 < children11.length; i11++){
        const domComponent11 = children11[i11].querySelector('[ref="component"]');
        if (domComponent11) {
            //console.log(domComponent.id)   
            const jsonComponent11 = getFormElementJsonConfig(domComponent11.id);
            if (jsonComponent11["element-type"] === "Column") {
                result11.push(jsonComponent11);
                const elementId11 = domComponent11.id.split("-")[1];
                const query11 = `[ref="col"][data-parent="Column-${elementId11}"]`;
                //console.log(t)
                const cols11 = domComponent11.querySelectorAll(query11);
                let colNumber11 = 0;
                cols11.forEach((col11)=>{
                    jsonComponent11["columns"][colNumber11]["components"] = [];
                    getAllChildElementsRecursive(col11, jsonComponent11["columns"][colNumber11]["components"]);
                    colNumber11++;
                });
            } else result11.push(jsonComponent11);
        }
    }
    return result11;
}
var show = function(elem11) {
    elem11.style.display = "block";
};
// Hide an element
var hide = function(elem11) {
    elem11.style.display = "none";
};
isNullOrEmpty = function(value11) {
    return value11 === null || value11 === undefined || typeof value11 === "string" && value11.trim() === "" || Array.isArray(value11) && value11.length === 0;
};

});
parcelRequire.register("32rzO", function(module, exports) {
const $2366f31f5f781e77$var$fetchOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
};
const $2366f31f5f781e77$var$fetchGet = (apiUrl, fetchOptions)=>{
    return fetch(apiUrl, fetchOptions).then((response)=>{
        // Check if the response status is OK (200)
        if (!response.ok) {
            console.log(response.status);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse the response JSON		
        return response.json();
    }).catch((error)=>{
        console.error("Fetch error:", error);
        throw error; // Rethrow the error to propagate it to the caller
    });
};
module.exports = $2366f31f5f781e77$var$fetchGet; // Use the Fetch API to make a request with the specified options

});



parcelRequire("e1kmr");

//# sourceMappingURL=main.js.map
