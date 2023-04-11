import aws, { Service } from "aws-sdk";
import nodemailer, { Transporter } from "nodemailer";

import fs from "fs";
import handlebars from "handlebars";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
export class SESMailProvider implements IMailProvider {
  private client: Transporter;
  private ses: Service;

  constructor(){
    this.ses = new aws.SES({
      apiVersion: "2010-12-01",
      region: process.env.AWS_REGION,
    });
    
    this.client = nodemailer.createTransport({
      SES: { ses: this.ses , aws },
    });
  }
  
  async sendMail(
    to: string,
    subject: string,
    variable: string,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variable);

    const message = await this.client.sendMail({
      to,
      from: "Acar <renan@fratoni.com>",
      subject,
      html: templateHTML
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}