import { by, element, logger, Page, utils, waitText } from '../../../utils';
import { TableValidation } from '../'

export class EventPage extends Page {

       //Page elements 
   header = element(by.xpath('//*[@e2e-id="patient-header"]'));
   currentStep = element.all(by.css("[ng-if='step.completed || step.selected']")).last()
       .element(by.xpath(".//../a"));
   resultMessage = element(by.css('div.steps'));
   notifyErrorIcon = element(by.css('i.notif-mess-error.material-icons'));
   submitButton = element(by.buttonText('Submit'));
   backButton = element(by.buttonText('Back'));
   nextButton = element(by.buttonText('Next'));
   cancelButton = element(by.xpath("//a[contains(text(),'Cancel')]"));
   backToPatientsButton = element(by.xpath("//a[contains(text(),'Back to Patients')]"));
   emailField = element(by.model("email"));
   passwordField = element(by.model("password"));

    //low-level functions
    async getEventTitle(): Promise<string> {
        let header: string = await waitText(this.header);
        let eventTitle: string = header.split("-")[0].trim();
        logger.debug("EventPage.getEventTitle(): " + eventTitle);
        return eventTitle;
    }

   async getMedicationType(){
       let medication = await TableValidation.getValue("Kit type",0);
       if(!utils.contains(medication,"red")&&!utils.contains(medication,"blue")){
           throw Error("EventPage.getMedicationType: did not recognize type in '"+medication+"'")
       }
       return utils.contains(medication,"red")?'red':'blue';
    }

   //low-level functions
   async enterCredentials(email:string, password: string): Promise<void> {
       if(!(await utils.status(this.emailField)).displayed ) return;

       await this.emailField.clear();
       await this.emailField.sendKeys(email);
       await this.passwordField.clear();
       await this.passwordField.sendKeys(password);
       return;
   }

    async getMedicationDose(){
        let medication = await TableValidation.getValue("Kit type",0);
        return utils.contains(medication,"red")?medication.split("red")[1]:medication.split("blue")[1];
    }

    async getStepsStatus() {
        let checkA = element(by.xpath("(//span[contains(@class,'step-indicator')]//i)[1]"));
        let checkB = element(by.xpath("(//span[contains(@class,'step-indicator')]//i)[2]"));
        let checkC = element(by.xpath("(//span[contains(@class,'step-indicator')]//i)[3]"));
        return [await waitText(checkA), await waitText(checkB), await waitText(checkC)];
    }


}