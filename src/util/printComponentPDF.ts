import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const printDocument = () => {
    const input = document.getElementById("print");
    const ignore = document.getElementById("ignore");

    if (ignore){
        ignore.style.display = 'none';
    }

    if (input) {
        html2canvas(input, {
            scale: 2,
            logging: false,
            scrollY: -window.scrollY,
            useCORS: true
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg', 0.5);
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                let heightLeft = pdfHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();

                while (heightLeft >= 0) {
                    position = heightLeft - pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= pdf.internal.pageSize.getHeight();
                }

                pdf.save("download.pdf");
            })
            .finally(() => {
                if (ignore) {
                    ignore.style.display = 'block';
                }
            });
    }
}