import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implamentations/EtherealMailProvider";
import { SESMailProvider } from "./implamentations/SESMailProvider";

const MailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider)
}

container.registerInstance<IMailProvider>(
  "MailProvider",
  MailProvider[process.env.MAIL_PROVIDER]
);
