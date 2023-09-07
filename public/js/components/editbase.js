class EditBase extends Base
{    
    constructor() {   
        super();     
        
       
    }


    renderEditForm = (formData) =>{
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

                if (component.hasOwnProperty("events"))
                {
                    const events = component.events;
                    events.forEach(ev =>{
                        console.log(ev.type);
                        if (ev.type=="listenToTarget")
                        {
                            const targetElement = document.querySelector(`[data-id=${ev.target}]`);
                            el.handleListenToTarget(targetElement, `${el.name}-${el.elementId}`);
                        }
                    });
                }
            });

            divTabContentContainer.appendChild(tabContainer);
            i++;
        });
        const container = this.createElement("div", {"ref":"tabContainer"});
        container.appendChild(ulTabHeader);
        container.appendChild(divTabContentContainer);

        return container;
    }

    attachEditFormEvent = (formData) =>{
        
        formData.tabs.forEach(tab => {
           
            tab.components.forEach(component => {
                try{
                    if (component.hasOwnProperty("events"))
                    {
                        const events = component.events;
                        events.forEach(ev =>{
                            console.log(ev.type);
                            if (ev.type=="listenToTarget")
                            {
                                const targetElement = document.querySelector(`[data-id=${ev.target}]`);
                                if (targetElement==null) throw `[data-id=${ev.target}] not found! Did renderEditForm execute before attach events?`;
                                const sourceElement = document.querySelector(`[data-id=${component.propertyId}]`);
                                if (sourceElement==null) throw `[data-id=${component.propertyId}] not found! Did renderEditForm execute before attach events?`;
                                eval(`${component.type}.handleListenToTarget(${ev.event}, ${targetElement}, ${sourceElement})`);
                            }
                        });
                    }
                }
                catch(e)
                {
                    console.log(`Error: ${component} - ${e}`);
                }
            });

            
        });
      
    }
    
    renderTabHeader=(tabId, tabLabel, active)=>{
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
  


    
}
