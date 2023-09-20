const renderForm = (container, formJson) => {

    if (formJson["element-type"] == 'container') {
        formJson.components.forEach(component => {
           
            component.formBuilderMode = false;
            const el = createInstance(component.type, JSON.stringify(component));
            const domComponent = el.renderDomElement();
            container.appendChild(domComponent);

            if (component["element-type"] === 'Column') {
                //loop Columns array
                for (let i = 0; i < component["columns"].length; i++) {
                    //Loop components array in columns
                    if (component["columns"][i]["components"].length > 0) {
                        let columnId = `col-${el.elementId}-${i}`;
                        let columnContainer = domComponent.querySelector("#" + columnId);
                        renderForm(columnContainer, component["columns"][i]);
                        // component["columns"][i]["components"].forEach(colCom => {
                        //     //getColumnId
                        //     let columnId = `col-${el.elementId}-${i}`;
                           
                        //     let columnContainer = domComponent.querySelector("#" + columnId);
                        //     renderForm(columnContainer, colCom);
                        // });
                    }
                }
                
            }
        });
    }
    
    return container;
}

const createInstance = (classNameString, json) =>{
    var obj = new (eval(classNameString))(json);
    return obj
};

const createElement = (elementType, attrs = {})=>
{
	const el = document.createElement(elementType);
	this.appendAttr(el, attrs);
	return el;
}

const appendAttr = (el, attrs = {})=>
{
	for (const [k, v] of Object.entries(attrs)) {
		el.setAttribute(k, v);
	}
	return el;
}