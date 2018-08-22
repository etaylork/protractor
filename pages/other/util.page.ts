import { by, EFStrFunc, element, Page, waitText, waitVisible } from '../../utils';

export class UtilPage extends Page {

    messageWithText: EFStrFunc = (text: string) =>
        element(by.xpath("//text()[contains(.,'" + text + "')]/ancestor::*[@e2e-id='message']"));

    async containsMessageWithText(message:string) {
        await waitVisible(element.all(by.xpath("//span[@e2e-id='message']")).first());
        let messageList = await element.all(by.xpath("//span[@e2e-id='message']"));
        let messageFound = false;
        for(let ele of messageList) {
            let eleText = await waitText(ele);
            let eleInnerText = await ele.getAttribute("innerText");
            if(this.contains(eleText,message) || this.contains(eleInnerText, message)) {
                messageFound = true;
            }
        }
        return messageFound;
    }

    public contains(first:string, second:string) {
        return first.indexOf(second) !== -1;
    }
}