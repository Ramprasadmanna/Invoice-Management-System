import path from "path";
import { invoicePdfGenerator } from "./pdfGenerator.js";
import transporter from "#config/nodemailer.config.js";

const sendSaleMail = async ({ saleData, type }) => {
  if (type === "gstSaleMail") {
    const filePath = path.resolve("server/data/PdfTemplate/gstSaleInvoice.ejs");
    const pdfBuffer = await invoicePdfGenerator(filePath, saleData);
    const { firstName, lastName, businessLegalName, customerType, email } =
      saleData.customer;

    const customerName = `${firstName} ${lastName}`;

    const recipientName =
      customerType === "individual"
        ? customerName.toUpperCase()
        : businessLegalName.toUpperCase();

    const filename =
      customerType === "individual"
        ? `${saleData.invoiceNumber}_${customerName.toUpperCase()}.pdf`
        : `${saleData.invoiceNumber}_${businessLegalName.toUpperCase()}.pdf`;

    const subject =
      saleData.invoiceType === "Tax Invoice"
        ? "GST Invoice"
        : "Proforma Invoice";

    // Email content
    const gstInvoiceHtml = `
        <strong style="text-transform: capitalize;">Dear ${recipientName}</strong>,  
        <p>I hope this email finds you well.</p>  
        <p>Please find attached the <strong>GST Invoice</strong> for your recent purchase. The <strong>PDF</strong> is included below for your convenience and reference.</p> 
        <p>If you need any further assistance or have questions regarding the invoice, please feel free to reach out. I am here to help!</p> 
        <p>Thank you for your attention.</p>
        <strong>Best regards</strong>, 
        <p style='margin:0'>Team Paresh Goshar</p>
        <p style='margin:0'>Center For Energy Sciences</p>
      `;

    const proformaHtml = `
        <strong style="text-transform: capitalize;">Dear ${recipientName}</strong>,  
        <p>I hope this email finds you well.</p>  
        <p>Attached to this email is the <strong>Proforma Invoice</strong> for your reference. Please find the <strong>PDF</strong> document below for your reference. .</p> 
        <p>If you require any additional information or have questions regarding the invoice, please do not hesitate to contact me. I am here to assist you!</p> 
        <p>Thank you for your attention, and I look forward to your response.</p>
        <strong>Best regards</strong>, 
        <p style='margin:0'>Team Paresh Goshar</p>
        <p style='margin:0'>Center For Energy Sciences</p>
      `;

    const html =
      saleData.invoiceType === "Tax Invoice" ? gstInvoiceHtml : proformaHtml;

    const mailDetails = await transporter.sendMail({
      from: '"World On Vastu" <noreply@worldonvaastu.com>',
      to:
        process.env.NODE_ENV === "development"
          ? process.env.MAIL_RECEIVE
          : email,
      subject,
      html,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    return mailDetails;
  } else if (type === "saleMail") {
    const filePath = path.resolve(
      "server/data/PdfTemplate/cashSaleInvoice.ejs"
    );

    const pdfBuffer = await invoicePdfGenerator(filePath, saleData);
    const { firstName, lastName, businessLegalName, customerType, email } =
      saleData.customer;

    const customerName = `${firstName} ${lastName}`;
    const recipientName =
      customerType === "individual"
        ? customerName.toUpperCase()
        : businessLegalName.toUpperCase();

    const filename =
      customerType === "individual"
        ? `${saleData.invoiceNumber}_${customerName.toUpperCase()}.pdf`
        : `${saleData.invoiceNumber}_${businessLegalName.toUpperCase()}.pdf`;

    const subject = "Invoice";

    // Email content
    const html = `
          <strong style="text-transform: capitalize;">Dear ${recipientName}</strong>,  
          <p>I hope this email finds you well.</p>  
          <p>Please find attached the <strong>Invoice</strong> for your recent purchase. The <strong>PDF</strong> is included below for your convenience and reference.</p> 
          <p>If you need any further assistance or have questions regarding the invoice, please feel free to reach out. I am here to help!</p> 
          <p>Thank you for your attention.</p>
          <strong>Best regards</strong>, 
          <p style='margin:0'>Team Paresh Goshar</p>
          <p style='margin:0'>Center For Energy Sciences</p>
        `;

    const mailDetails = await transporter.sendMail({
      from: '"World On Vastu" <noreply@worldonvaastu.com>',
      to:
        process.env.NODE_ENV === "development"
          ? process.env.MAIL_RECEIVE
          : email,
      subject,
      html,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    return mailDetails;
  }
};

export { sendSaleMail };
