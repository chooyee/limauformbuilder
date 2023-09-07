
class Mandatory
{
    MandatoryClass = 'mandatory';
    MandatoryElements;
    constructor(classToMonitor) {        
        if (classToMonitor) {
            this.MandatoryClass = classToMonitor
        }
        this.MandatoryElements = document.querySelectorAll(this.MandatoryClass)
        this.ClearInvalid()
    }

    MandatoryValidation = ()=>{
        let submit = true       
        this.MandatoryElements.forEach(element => {
            if (element.value==='')
            {
                console.log(element.id)
                element.parentElement.classList.add('is-invalid')
                submit = false
            }        
        });
        return submit
    }

    ClearInvalid = ()=>{       
        this.MandatoryElements.forEach(element => {
            element.addEventListener('input',(event) => {
            //console.log(element)
            element.parentElement.classList.remove('is-invalid');

            });
        })      
    }
}