package com.pz.salon_serwis.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.pz.salon_serwis.model.Invoice;
import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.User;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.ByteArrayOutputStream;
import java.util.stream.Collectors;

@Service
public class PdfGeneratorService {
    private final SpringTemplateEngine templateEngine;

    public enum TYPE{
        SALES_ORDER,
        SERVICE_ORDER
    }

    public PdfGeneratorService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    private Context createSalesOrderContext(Invoice invoice) {
        Context context = new Context();
        context.setVariable("id", invoice.getId());
        context.setVariable("issueDate", invoice.getIssueDate());
        context.setVariable("dueDate", invoice.getDueDate());
        context.setVariable("totalAmount", invoice.getTotalAmount());
        User user = invoice.getClient();
        context.setVariable("email", user.getEmail());
        context.setVariable("name", user.getFirstName() + " " + user.getLastName());
        context.setVariable("list",
                invoice.getSalesOrder().getItems().stream().collect(Collectors.toMap(
                        salesOrderItem -> salesOrderItem.getVehicle().getModel(),
                        salesOrderItem -> salesOrderItem.getVehicle().getMarginPrice())
                ));
        Location location = invoice.getSalesOrder().getEmployee().getLocation();
        context.setVariable("companyName", location.getName());
        context.setVariable("location", location.getStreet() + " " + location.getZipCode() + " " + location.getCity());

        return context;
    }

    private Context createRepairOrderContext(Invoice invoice) {
        Context context = new Context();
        context.setVariable("id", invoice.getId());
        context.setVariable("issueDate", invoice.getIssueDate());
        context.setVariable("dueDate", invoice.getDueDate());
        context.setVariable("totalAmount", invoice.getTotalAmount());
        User user = invoice.getClient();
        context.setVariable("email", user.getEmail());
        context.setVariable("name", user.getFirstName() + " " + user.getLastName());
        context.setVariable("list",
                invoice.getRepairOrder().getWorkDescription()
                );
        Location location = invoice.getRepairOrder().getMechanic().getLocation();
        context.setVariable("companyName", location.getName());
        context.setVariable("location", location.getStreet() + " " + location.getZipCode() + " " + location.getCity());

        return context;
    }

    public byte[] generateInvoice(Invoice invoice, PdfGeneratorService.TYPE type) throws RuntimeException{
        Context context = switch (type){
            case SALES_ORDER -> createSalesOrderContext(invoice);
            case SERVICE_ORDER -> createRepairOrderContext(invoice);
        };
        String template = switch (type) {
            case SALES_ORDER -> "saleInvoiceTemplate";
            case SERVICE_ORDER -> "serviceInvoiceTemplate";
        };
        String html = templateEngine.process(template, context);

        try(
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ){
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFont(
                    () -> PdfGeneratorService.class.getResourceAsStream("/fonts/DejaVuSans.ttf"),
                    "DejaVu Sans"
            );
            builder.withHtmlContent(html,null);
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        } catch (Exception e){
            throw new RuntimeException("Error generating PDF", e);
        }

    }
}
